import clone from 'clone';
import admin from 'firebase-admin';
import {
  CoffeeSelections,
  ICoffeeSelections
} from '../../classes/CoffeeSelections/CoffeeSelections';
import { FirestoreDocument } from '../firestore';
import { Label } from './Label';

export interface IOrder {
  bagColor: 'white' | 'black' | 'brown';
  labelLinks: string[];
  selections: ICoffeeSelections;
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

  getSelections(): CoffeeSelections {
    return new CoffeeSelections(this.order.selections);
  }

  getLabelLinks(): string[] {
    return clone(this.order.labelLinks);
  }

  getLabels(): Label[] {
    return this.getLabelLinks().map(l => new Label(l));
  }

  asHtml(): string {
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Thank you for your order!</title>
  </head>
  <body>
    <h1 style="text-align:center; margin: 2rem; font-weight: bold;">Thank you for your order</h1>

    <section id="order-summary">
      <h2>Your order</h2>
      ${this.getSelections().asHtml()}
    </section>

    <p>
      <small>
        The expected delivery date is 21 business days from now.
      </small>
    </p>

    <p>If you have any questions, do not hesitate to get in touch!</p>
  </body>
</html>
    
    `;
  }

  toFirestore(): IOrder {
    return this.order;
  }
}
