import { Request, Response, NextFunction } from 'express';
import { Stripe } from 'stripe';
import { config } from '../../../config/config';
import { logger } from 'firebase-functions/v1';

export const verifySignature = (req: Request, res: Response, next: NextFunction): void => {
  try {
    logger.info('Verifying stripe webhook');
    if (!config.stripe.api_key) throw new Error('Cannot process stripe payments');

    if (!config.stripe.webhooks_signing_key) throw new Error('Cannot verify webhooks');

    const signature = req.headers['stripe-signature'];
    if (!signature) throw new Error('No signature header provided!');

    const stripe = new Stripe(config.stripe.api_key, { apiVersion: '2020-08-27' });
    stripe.webhooks.constructEvent(req.rawBody, signature, config.stripe.webhooks_signing_key);
    logger.debug('Webhook is valid');
    return next();
  } catch (ex) {
    logger.error('Invalid stripe signature', { ex });
    return res.status(422).send('Invalid request').end();
  }
};
