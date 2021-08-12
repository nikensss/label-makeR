import clone from 'clone';
import firebase from 'firebase';
import { FirestoreDocument } from '../../firebase';

export interface FirestoreCoffee {
  origins: CoffeeOrigin[];
}

interface CoffeeOrigin {
  label: string;
  value: string;
}

const isCoffeeOrigin = (data: unknown): data is CoffeeOrigin => {
  if (data === undefined || typeof data !== 'object' || data === null) {
    return false;
  }

  const d = data as CoffeeOrigin;
  if (!d.label || typeof d.label !== 'string') return false;
  if (!d.value || typeof d.value !== 'string') return false;

  return true;
};

const isFirestoreCoffee = (data: unknown): data is FirestoreCoffee => {
  if (data === undefined || typeof data !== 'object' || data === null) {
    return false;
  }

  const d = data as FirestoreCoffee;
  if (!Array.isArray(d.origins)) return false;
  // make sure at least one has the proper format
  if (!d.origins.some(isCoffeeOrigin)) return false;

  return true;
};

export class Coffee implements FirestoreDocument {
  private data: FirestoreCoffee;

  constructor(snapshot: firebase.firestore.QueryDocumentSnapshot) {
    const data = snapshot.data();
    console.log({ data });
    if (!isFirestoreCoffee(data)) throw new Error('Invalid data provided');
    console.log(`Received snapshot of ${snapshot.id}`);
    this.data = data;
  }

  getOrigins(): FirestoreCoffee['origins'] {
    return clone(this.data.origins.filter(isCoffeeOrigin));
  }

  toFirestore(): FirestoreCoffee {
    return this.data;
  }
}
