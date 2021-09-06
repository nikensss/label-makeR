import firebase from 'firebase';
import { FirestoreDocument } from '../../firebase';
import { CoffeeOrigin } from './CoffeeOrigin';
import { CoffeeOrigins } from './CoffeeOrigins';

export interface FirestoreCoffee {
  origins: CoffeeOrigin[];
}

const isCoffeeOrigin = (data: unknown): data is CoffeeOrigin => {
  if (data === undefined || typeof data !== 'object' || data === null) {
    return false;
  }

  const d = data as CoffeeOrigin;
  if (!d.label || typeof d.label !== 'string') return false;
  if (!d.value || typeof d.value !== 'string') return false;

  if (
    !d.weight ||
    typeof d.weight.amount !== 'number' ||
    typeof d.weight.unit !== 'string'
  ) {
    return false;
  }

  if (
    !d.price ||
    typeof d.price.amount !== 'number' ||
    typeof d.price.unit !== 'string'
  ) {
    return false;
  }

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
    if (!isFirestoreCoffee(data)) throw new Error('Invalid data provided');
    this.data = data;
  }

  getOrigins(): CoffeeOrigins {
    return new CoffeeOrigins(this.data.origins);
  }

  toFirestore(): FirestoreCoffee {
    return this.data;
  }
}
