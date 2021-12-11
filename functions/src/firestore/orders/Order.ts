import clone from 'clone';
import admin from 'firebase-admin';
import {
  CoffeeSelections,
  ICoffeeSelections
} from '../../classes/CoffeeSelections/CoffeeSelections';
import { FirestoreDocument } from '../firestore';
import { Label } from './Label';
import Stripe from 'stripe';
import { config } from '../../config/config';

export interface IOrder {
  bagColor: 'white' | 'black' | 'brown';
  labelLinks: string[];
  selections: ICoffeeSelections;
  paymentIntent: Stripe.PaymentIntent;
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

  getShippingDetails(): Stripe.Charge.Shipping {
    if (this.order.paymentIntent.charges.data.length === 0) {
      throw new Error('No charges in payment intent');
    }

    const { shipping } = this.order.paymentIntent.charges.data[0];
    if (!shipping) throw new Error('No address available!');

    return shipping;
  }

  getCustomerId(): string {
    const { customer } = this.order.paymentIntent;
    if (!customer) throw new Error('No customer in payment intent');
    if (typeof customer === 'string') return customer;
    return customer.id;
  }

  async getCustomer(): Promise<Stripe.Response<Stripe.Customer>> {
    const stripe = new Stripe(config.stripe.api_key, { apiVersion: '2020-08-27' });
    const response = await stripe.customers.retrieve(this.getCustomerId());
    if (response.deleted) throw new Error('Deleted customer');
    return response;
  }

  async asHtml(): Promise<string> {
    const shipping = this.getShippingDetails();
    const customer = await this.getCustomer();

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
      <p>Bag color: ${this.order.bagColor}</p>
      ${this.getSelections().asHtml()}
    </section>

    <section id="customer-details">
      <h2>Contact information</h2>
      <p>${shipping.name} (${customer.phone || 'no phone number provided'})</p>
      <p>${shipping.address?.line1 || ''}, ${shipping.address?.line2 || ''}</p>
      <p>${shipping.address?.city} ${shipping.address?.postal_code}, ${
      shipping.address?.state || ''
    }</p>
      <p>${shipping.address?.country || ''}</p>
    </section>

    <p>
      <small>
        The expected delivery date is 21 business days from now.
      </small>
    </p>

    <p>If you have any questions, do not hesitate to get in touch!</p>
  </body>
</html>`;
  }

  toFirestore(): IOrder {
    return this.order;
  }
}
