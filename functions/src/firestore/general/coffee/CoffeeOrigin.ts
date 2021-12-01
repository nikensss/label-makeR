import { ICoffeeOrigin } from './ICoffeeOrigin.interface';
import clone from 'clone';

export class CoffeeOrigin {
  private origin: ICoffeeOrigin;

  constructor(origin: ICoffeeOrigin) {
    this.origin = clone(origin);
  }

  get id(): string {
    return this.origin.id;
  }

  get price(): number {
    return this.origin.price.amount;
  }

  get weight(): number {
    return this.origin.weight.amount;
  }

  get minQuantity(): number {
    return 30 / this.weight;
  }

  getPriceId(): string {
    return this.origin.price.id;
  }

  isValidQuantity(quantity: number): boolean {
    return quantity > this.minQuantity;
  }
}
