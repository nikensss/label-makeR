import { Request } from 'express';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';

const Timestamp = admin.firestore.Timestamp;

export const updatePaymentIntentInOrder = async (req: Request): Promise<void> => {
  const db = admin.firestore();

  logger.info(`Updating order ${req.body.data.object.id}`);
  await db.runTransaction(async t => {
    const paymentIntent = req.body.data.object;
    const orderDoc = await t.get(db.collection('orders').doc(paymentIntent.id));
    const order = orderDoc.data();
    if (!order) {
      return t.set(orderDoc.ref, { paymentIntent, updatedAt: Timestamp.now() }, { merge: true });
    }

    const orderUpdateTime = order.updatedAt.toMillis();
    const webhookTime = Timestamp.fromMillis(req.body.created * 1000).toMillis();

    // ignore the update if the document was updated with a date after the current webhook time
    if (orderUpdateTime > webhookTime) return;

    return t.set(orderDoc.ref, { paymentIntent, updatedAt: Timestamp.now() }, { merge: true });
  });
};
