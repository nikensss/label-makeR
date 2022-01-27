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

  get currency(): string {
    return this.origin.price.unit;
  }

  getDisplayPrice(): string {
    return `${this.price} ${this.currency}`;
  }

  get weight(): number {
    return this.origin.weight.amount;
  }

  get weightUnit(): string {
    return this.origin.weight.unit.toLowerCase();
  }

  get minQuantity(): number {
    return 30 / this.weight;
  }

  get title(): string {
    return this.origin.label;
  }

  getPriceId(): string {
    return this.origin.price.id;
  }

  isValidQuantity(quantity: number): boolean {
    return quantity >= this.minQuantity;
  }

  toString(): string {
    return `${this.title} (${this.weight} ${this.weightUnit})`;
  }
}
