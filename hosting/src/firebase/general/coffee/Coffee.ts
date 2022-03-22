import firebase from 'firebase';
import { FirestoreDocument } from '../../firebase';
import { CoffeeVariant, ICoffeeVariant } from './CoffeeVariant';
import { CoffeeVariants } from './CoffeeVariants';

export interface ICoffee {
  variants: ICoffeeVariant[];
}

const isCoffeeVariant = (data: unknown): data is ICoffeeVariant => {
  if (data === undefined || typeof data !== 'object' || data === null) {
    return false;
  }

  const d = data as ICoffeeVariant;
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
  if (!d.variants.some(isCoffeeVariant)) return false;

  return true;
};

export class Coffee implements FirestoreDocument {
  private data: ICoffee;

  constructor(snapshot: firebase.firestore.QueryDocumentSnapshot) {
    const data = snapshot.data();
    if (!isFirestoreCoffee(data)) throw new Error('Invalid data provided');
    this.data = data;
  }

  getVariants(): CoffeeVariants {
    return new CoffeeVariants(this.data.variants.map(o => new CoffeeVariant(o)));
  }

  toFirestore(): ICoffee {
    return this.data;
  }
}
