import * as admin from 'firebase-admin';
import { Coffee } from './coffee/Coffee';

export const getCoffee = async (): Promise<Coffee | undefined> => {
  const coffeeDoc = await admin
    .firestore()
    .collection('general')
    .doc('coffee')
    .withConverter<Coffee>({
      fromFirestore: snapshot => {
        return new Coffee(snapshot);
      },
      toFirestore: (coffee: unknown) => {
        if (coffee instanceof Coffee) return coffee.toFirestore();
        throw new Error('Use the Coffee class to write to this document!');
      }
    })
    .get();

  return coffeeDoc.data();
};
