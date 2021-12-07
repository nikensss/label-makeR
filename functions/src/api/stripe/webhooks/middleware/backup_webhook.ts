import { Request, Response, NextFunction } from 'express';
import { logger } from 'firebase-functions';
import { storage } from 'firebase-admin';
import { format } from 'date-fns';
import { config } from '../../../../config/config';

export const backupWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info('Backing up stripe webhook');

    const webhook = req.body;
    const [topic, event] = webhook.type.split('.');
    const date = format(new Date(), 'yyyy-MM-dd_HH:mm:ss_xxx');
    const path = `stripe/webhooks/${topic}/${event}/${date}.json`;

    const f = storage().bucket(config.storage.bucket).file(path);
    await f.save(JSON.stringify(webhook, null, 2), {
      metadata: { contentType: 'application/json' }
    });
    logger.info(`Webhook backed up at: '${path}'`);
    return next();
  } catch (ex) {
    logger.error('Could not back up stripe webhook', { ex });
    return res.status(500).send('Please, try again later').end();
  }
};
