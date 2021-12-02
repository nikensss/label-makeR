import clone from 'clone';
import admin from 'firebase-admin';
import { FirestoreDocument } from '../firestore';
import { Label } from './Label';

export interface IOrder {
  bagColor: 'white' | 'black' | 'brown';
  labelLinks: string[];
}

export const isIOrder = (data: unknown): data is IOrder => {
  if (data === null) return false;
  if (typeof data === 'undefined') return false;
  if (typeof data !== 'object') return false;

  const d = data as IOrder;
  if (!d.bagColor) return false;
  if (!d.labelLinks) return false;
  if (!Array.isArray(d.labelLinks)) return false;
  if (d.labelLinks.length > 0 && d.labelLinks.some(l => typeof l !== 'string')) return false;

  return true;
};

export class Order implements FirestoreDocument {
  private order: IOrder;

  constructor(snapshot: admin.firestore.QueryDocumentSnapshot) {
    const data = snapshot.data();
    if (!isIOrder(data)) throw new TypeError('Invalid data type');
    this.order = clone(data);
  }

  getLabelLinks(): string[] {
    return clone(this.order.labelLinks);
  }

  getLabels(): Label[] {
    return this.getLabelLinks().map(l => new Label(l));
  }

  toFirestore(): IOrder {
    return this.order;
  }
}
