import { Router } from 'express';
import { logger } from 'firebase-functions/v1';
import { verifySignature } from './middleware/verify_signature';
import { updatePaymentIntentInOrder } from './payment_intent';
import { onPaymentIntentSucceeded } from './payment_intent/succeeded';

const r = Router();

r.post('/', verifySignature, async (req, res) => {
  logger.info('Processing stripe webhook');

  try {
    const { type } = req.body;
    const [topic, event] = type.split('.');
    logger.info(`Received ${type} webhook`, { type, topic, event });

    if (topic !== 'payment_intent') return res.sendStatus(200).end();
    await updatePaymentIntentInOrder(req);

    switch (event) {
      case 'succeeded':
        await onPaymentIntentSucceeded(req);
    }

    return res.sendStatus(200).end();
  } catch (ex) {
    logger.error('Could not process webhook', { type: req.body.type });
    return res.sendStatus(500).end();
  }
});

export const webhooks = r;
