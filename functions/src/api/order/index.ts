import { Router } from 'express';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { isArrayOfStrings } from '../../utils/types/isArrayOfStrings';
import Stripe from 'stripe';
import { config } from '../../config/config';
import { format } from 'date-fns';
import { CoffeeSelections } from '../../classes/CoffeeSelections/CoffeeSelections';
import { getCoffee } from '../../firestore/general/general';

const r = Router();

r.post('/check', async (req, res) => {
  logger.debug('Received request to check an order', { body: req.body });
  const { selections, labels, bagColor } = req.body;
  if (selections === null || typeof selections !== 'object') {
    logger.info('Invalid selections! Cannot continue', { selections });
    return res.status(403).send({ status: 'error', message: 'invalid selections' }).end();
  }

  if (!bagColor || !['white', 'brown', 'black'].includes(bagColor)) {
    logger.info(`Invalid bag color (${bagColor})`, { bagColor });
    return res.status(403).send({ status: 'error', message: 'invalid bag color' }).end();
  }

  if (!labels || !Array.isArray(labels) || !isArrayOfStrings(labels)) {
    logger.info('Invalid labels! Cannot continue', { labels });
    return res.status(403).send({ status: 'error', message: 'invalid labels' }).end();
  }

  try {
    const coffeeSelections = new CoffeeSelections(selections);
    const orderErrors = await getOrderErrors(coffeeSelections);
    if (orderErrors !== null) {
      return res.status(403).send({ status: 'error', message: orderErrors.message }).end();
    }

    const labelLinks = await saveLabels(labels);
    logger.debug(`A total of ${labelLinks.length} labels were saved`, { labelLinks });

    const session = await createStripeSession(coffeeSelections);
    if (session.url === null) throw new Error('Stripe session URL is null!');

    await saveOrder(session, coffeeSelections, bagColor, labelLinks);
    logger.info('Stripe checkout session created', { session });
    return res.status(200).send({ url: session.url }).end();
  } catch (ex) {
    logger.error(`Could not process request: ${ex instanceof Error ? ex.message : ex}`, { ex });
    return res.status(500).send({ status: 'error', message: 'Please, try again later' }).end();
  }
});

const getOrderErrors = async (selections: CoffeeSelections) => {
  const coffee = await getCoffee();
  if (!coffee) throw new Error('Cannot retrieve coffee');
  const coffeeOrigins = coffee.getOrigins();

  for (const { id, quantity } of selections) {
    const origin = coffeeOrigins.find(id);
    if (!origin) return new Error(`unknown coffee origin: ${id}`);

    if (!origin.isValidQuantity(quantity)) {
      const minQty = origin.minQuantity;
      const qty = quantity;
      return new Error(`Quantity ordered (${qty}) below threshold (${minQty}) for ${id}`);
    }
  }

  return null;
};

const saveLabels = async (labels: string[]): Promise<string[]> => {
  const labelsBucket = admin.storage().bucket(config.storage.bucket);
  const now = format(new Date(), 'yyyy-MM-dd_HH:mm:ss_xxx');
  logger.debug('Saving all labels', { labels });
  return await Promise.all(
    labels.map(async (l, i) => {
      const match = l.match(/data:(.+)?;(.+)?,(.+)/);
      if (match === null) throw new Error('Image could not be read');
      const [, contentType, encoding, image] = match;
      if (!contentType) throw new Error('No content type for image!');
      if (!image) throw new Error('No image content available!');
      if (encoding !== 'base64') throw new Error('Image is not base64 encoded!');

      const buffer = Buffer.from(image, encoding);
      const path = `coffee-labels/${now}__${i}.png`;
      const file = labelsBucket.file(path);
      await file.save(buffer, {
        gzip: true,
        metadata: {
          contentType,
          cacheControl: 'public, max-age=31536000'
        }
      });

      return path;
    })
  );
};

const saveOrder = async (
  session: Stripe.Response<Stripe.Checkout.Session>,
  selections: CoffeeSelections,
  bagColor: string,
  labelLinks: string[]
) => {
  const db = admin.firestore();
  const { payment_intent } = session;
  if (payment_intent === null) throw new Error('Payment intent is null! Cannot continue');

  const id = typeof payment_intent === 'string' ? payment_intent : payment_intent.id;
  const orderDoc = db.collection('orders').doc(id);
  const now = admin.firestore.FieldValue.serverTimestamp();

  await orderDoc.set({
    createdAt: now,
    bagColor,
    id,
    labelLinks,
    session,
    selections: selections.serialize(),
    updatedAt: now
  });
};

const createStripeSession = async (
  selections: CoffeeSelections
): Promise<Stripe.Response<Stripe.Checkout.Session>> => {
  logger.info('Creating stripe checkout session');

  const coffee = await getCoffee();
  if (!coffee) throw new Error('Cannot retrieve coffee doc');
  const coffeeOrigins = coffee.getOrigins();

  const stripe = new Stripe(config.stripe.api_key, { apiVersion: '2020-08-27' });
  const session = await stripe.checkout.sessions.create({
    line_items: coffeeOrigins.asLineItems(selections),
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: config.stripe.success_url,
    cancel_url: config.stripe.cancel_url,
    shipping_address_collection: {
      allowed_countries: ['US', 'GB']
    },
    phone_number_collection: { enabled: true }
  });

  const totalPrice = selections.getTotalPrice(coffeeOrigins);
  if (totalPrice !== session.amount_subtotal) {
    throw new Error(`Total price mismatch: ${totalPrice} !== ${session.amount_subtotal}`);
  }

  return session;
};

export const order = r;
