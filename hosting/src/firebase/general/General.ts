import { db } from '../firebase';
import { Coffee } from './coffee/Coffee';

export const getCoffee = async (): Promise<Coffee | undefined> => {
  const coffeeDoc = await db
    .collection('general')
    .doc('coffee')
    .withConverter<Coffee>({
      fromFirestore: snapshot => {
        return new Coffee(snapshot);
      },
      toFirestore: coffee => {
        if (coffee instanceof Coffee) return coffee.toFirestore();
        throw new Error('Use the Coffee class to read from this document!');
      }
    })
    .get();

  return coffeeDoc.data();
};
