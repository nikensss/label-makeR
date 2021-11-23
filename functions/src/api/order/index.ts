import { Router } from 'express';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v1';
import { isArrayOfStrings } from '../../utils/types/isArrayOfStrings';

const r = Router();
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

  try {
    const labelsBucket = admin.storage().bucket('coffee-labels');
    const now = Date.now();
    logger.debug('Saving all labels', { labels });
    await Promise.all(
      labels.map((l, i) => {
        const match = l.match(/data:(.+)?;(.+)?,(.+)/);
        if (match === null) throw new Error('Image could not be read');
        const [, contentType, encoding, image] = match;
        if (!contentType) throw new Error('No content type for image!');
        if (!image) throw new Error('No image content available!');
        if (encoding !== 'base64') throw new Error('Image is not base64 encoded!');

        const buffer = Buffer.from(image, encoding);
        return labelsBucket.file(`${now}_${i}.png`).save(buffer, {
          gzip: true,
          metadata: {
            contentType,
            cacheControl: 'public, max-age=31536000'
          }
        });
      })
    );
    logger.debug(`A total of ${labels.length} labels were saved`);
  } catch (ex) {
    logger.error(`Could not save labels: ${ex instanceof Error ? ex.message : ex}`, { ex });
  }

  return res.status(200).send({ status: 'ok' }).end();
});

const isValidQuantity = (quantity: number | undefined, minQuantity: number) => {
  if (typeof quantity === 'undefined') return false;
  if (quantity === 0) return true;
  return quantity >= minQuantity;
};

export const order = r;
