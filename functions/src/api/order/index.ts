import { Router } from 'express';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { isArrayOfStrings } from '../../utils/types/isArrayOfStrings';
import Stripe from 'stripe';
import { config } from '../../config/config';
import { ICoffeeOrigin } from '../../firestore/general/coffee/ICoffeeOrigin.interface';

export interface ICoffeeSelections {
  [key: string]: CoffeeOrigin | undefined;
}

/** In the frontend, the `CoffeeOrigin` class wraps a `ICoffeeOrigin` interface
 * and adds a `_quantity` property to represent the data set.
 * The `ICoffeeOrigin`  is the interface that represents the data structure
 * in the database.
 * Until we find a better way to share types between fe and be, we will do it
 * like this.
 */
export interface CoffeeOrigin {
  coffeeOrigin: ICoffeeOrigin;
  _quantity: number;
}

const stripe = new Stripe(config.stripe.api_key, {
  apiVersion: '2020-08-27'
});
const r = Router();

r.post('/create-checkout-session', async (req, res) => {
  const PRICE_ID = 'price_1JygePLo3VoIXnrPDMlKiwI8';
  try {
    logger.info('Creating stripe checkout session', { body: req.body });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1
        }
      ],
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: config.stripe.success_url,
      cancel_url: config.stripe.cancel_url
    });

    if (session.url === null) throw new Error('Stripe session URL is null!');
    logger.info('Stripe checkout session created', { session });
    return res.status(200).send({ url: session.url }).end();
  } catch (ex) {
    logger.error('Could not create stripe session', { ex });
    return res.status(500).send({ error: 'internal server error' }).end();
  }
});

r.post('/check', async (req, res) => {
  logger.debug('body', { body: req.body });
  const { selections, labels } = req.body;
  if (selections === null || typeof selections !== 'object') {
    logger.info('Invalid selections! Cannot continue', { selections });
    return res.status(403).send({ status: 'error', message: 'invalid selections' }).end();
  }

  if (!labels || !Array.isArray(labels) || !isArrayOfStrings(labels)) {
    logger.info('Invalid labels! Cannot continue', { labels });
    return res.status(403).send({ status: 'error', message: 'invalid labels' }).end();
  }

  try {
    const orderErrors = await getOrderErrors(selections);
    if (orderErrors) {
      return res.status(403).send({ status: 'error', message: orderErrors.message }).end();
    }

    const labelLinks = await saveLabels(labels);
    logger.debug(`A total of ${labelLinks.length} labels were saved`, { labelLinks });
  } catch (ex) {
    logger.error(`Could not save labels: ${ex instanceof Error ? ex.message : ex}`, { ex });
    return res.status(500).send({ status: 'error', message: 'Please, try again later' }).end();
  }

  return res.status(200).send({ status: 'ok' }).end();
});

const getOrderErrors = async (selections: ICoffeeSelections) => {
  const db = admin.firestore();
  const coffeeDoc = db.collection('general').doc('coffee');
  const coffeeOrigins = (await coffeeDoc.get()).get('origins') as ICoffeeOrigin[];

  for (const [key, selection] of Object.entries(selections)) {
    if (!selection) continue;
    const origin = coffeeOrigins.find(({ id }) => id === key);
    if (!origin) return new Error(`unknown coffee origin: ${key}`);

    if (!isValidQuantity(selection, origin)) {
      const minQty = getMinQuantity(origin);
      const qty = selection._quantity;
      return new Error(`Quantity ordered (${qty}) below threshold (${minQty}) for ${key}`);
    }
  }

  return null;
};

// 'selection' is the data the frontend sends us
// 'origin' is the data we read from the database
const getMinQuantity = (origin: ICoffeeOrigin): number => 30 / origin.weight.amount;
const isValidQuantity = (selection: CoffeeOrigin, origin: ICoffeeOrigin) => {
  const quantity = selection._quantity;
  if (typeof quantity === 'undefined') return false;
  return quantity === 0 || quantity >= getMinQuantity(origin);
};

const saveLabels = async (labels: string[]): Promise<string[]> => {
  const labelsBucket = admin.storage().bucket('coffee-labels');
  const now = Date.now();
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
      const file = labelsBucket.file(`${now}_${i}.png`);
      await file.save(buffer, {
        gzip: true,
        metadata: {
          contentType,
          cacheControl: 'public, max-age=31536000'
        }
      });

      return file.publicUrl();
    })
  );
};

export const order = r;
