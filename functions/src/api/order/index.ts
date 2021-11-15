import { Router } from 'express';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import Stripe from 'stripe';
import { config } from '../../config/config';

const stripe = new Stripe(config.stripe.api_key, {
  apiVersion: '2020-08-27'
});
const r = Router();

r.post('/create-checkout-session', async (req, res) => {
  const PRICE_ID = 'price_1Jw7jcGcy7B7ncxe5K2VkYzm';
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
  const selections = req.body;
  if (selections === null || typeof selections !== 'object') {
    return res.status(403).send({ status: 'error', message: 'invalid selections' }).end();
  }

  const db = admin.firestore();
  const coffeeOrigins = (await db.collection('general').doc('coffee').get()).get('origins');

  for (const [key, value] of Object.entries(selections)) {
    const selection = value as { _quantity: number | undefined };
    const origin = coffeeOrigins.find((o: { id: string }) => o.id === key);
    if (!origin) {
      return res
        .status(403)
        .send({ status: 'error', message: `unknown coffee origin ${key}` })
        .end();
    }

    const minQuantity = 30 / origin.weight.amount + 10;
    if (!isValidQuantity(selection._quantity, minQuantity)) {
      return res
        .status(403)
        .send({
          status: 'error',
          message: `quantity ${selection._quantity} smaller than min quantity of ${minQuantity} for coffee origin ${key}`
        })
        .end();
    }
  }
  return res.status(200).send({ status: 'ok' }).end();
});

const isValidQuantity = (quantity: number | undefined, minQuantity: number) => {
  if (typeof quantity === 'undefined') return false;
  if (quantity === 0) return true;
  return quantity >= minQuantity;
};

export const order = r;
