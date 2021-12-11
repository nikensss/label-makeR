import express from 'express';
import { webhooks } from './webhooks';
import { backupWebhook } from './webhooks/middleware/backup_webhook';

const stripe = express();
stripe.use('/webhooks', backupWebhook, webhooks);

export { stripe };
