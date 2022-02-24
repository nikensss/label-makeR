import firebase from 'firebase';
import { FirestoreDocument } from '../../firebase';
import { CoffeeOrigin, ICoffeeOrigin } from './CoffeeOrigin';
import { CoffeeOrigins } from './CoffeeOrigins';

export interface ICoffee {
  origins: ICoffeeOrigin[];
  variants: ICoffeeOrigin[];
}

const isCoffeeOrigin = (data: unknown): data is ICoffeeOrigin => {
  if (data === undefined || typeof data !== 'object' || data === null) {
    return false;
  }

  const d = data as ICoffeeOrigin;
  if (!d.label || typeof d.label !== 'string') return false;
  if (!d.id || typeof d.id !== 'string') return false;

  if (!d.weight || typeof d.weight.amount !== 'number' || typeof d.weight.unit !== 'string') {
    return false;
  }

  if (!d.price || typeof d.price.amount !== 'number' || typeof d.price.unit !== 'string') {
    return false;
  }

  return true;
};

const isFirestoreCoffee = (data: unknown): data is ICoffee => {
  if (data === undefined || typeof data !== 'object' || data === null) {
    return false;
  }

  const d = data as ICoffee;
  if (!Array.isArray(d.variants)) return false;
  // make sure at least one has the proper format
  if (!d.variants.some(isCoffeeOrigin)) return false;

  return true;
};

export class Coffee implements FirestoreDocument {
  private data: ICoffee;

  constructor(snapshot: firebase.firestore.QueryDocumentSnapshot) {
    const data = snapshot.data();
    if (!isFirestoreCoffee(data)) throw new Error('Invalid data provided');
    this.data = data;
  }

  getOrigins(): CoffeeOrigins {
    return new CoffeeOrigins(this.data.variants.map(o => new CoffeeOrigin(o)));
  }

  toFirestore(): ICoffee {
    return this.data;
  }
}
