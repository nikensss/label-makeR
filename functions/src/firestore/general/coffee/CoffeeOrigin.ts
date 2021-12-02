import clone from 'clone';

export interface ICoffeeOrigin {
  label: string;
  id: string;
  weight: Weight;
  price: Price;
}

export interface Weight {
  amount: number;
  unit: string;
}

export interface Price {
  amount: number;
  unit: string;
  id: string;
}

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
