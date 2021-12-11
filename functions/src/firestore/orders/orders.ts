import * as admin from 'firebase-admin';
import { Order } from './Order';

export const getOrderCollectionReferece = () => admin.firestore().collection('orders');

export const getOrder = async (orderId: string): Promise<Order | undefined> => {
  const order = await getOrderCollectionReferece()
    .doc(orderId)
    .withConverter<Order>({
      fromFirestore: snapshot => {
        return new Order(snapshot);
      },
      toFirestore: (order: unknown) => {
        if (order instanceof Order) return order.toFirestore();
        throw new Error('Use the Coffee class to write to this document!');
      }
    })
    .get();

  return order.data();
};
