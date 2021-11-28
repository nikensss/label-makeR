import { Router } from 'express';
import { logger } from 'firebase-functions/v1';
import { verifySignature } from './verifySignature';

const r = Router();

r.post('/', verifySignature, (req, res) => {
  logger.info('Processing stripe webhook');

  res.sendStatus(200).end();
});

export const webhooks = r;
