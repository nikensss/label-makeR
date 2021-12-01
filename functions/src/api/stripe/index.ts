import * as express from 'express';
import { webhooks } from './webhooks';
import { backupWebhook } from './webhooks/backupWebhook';

const stripe = express();
stripe.use('/webhooks', backupWebhook, webhooks);

export { stripe };
