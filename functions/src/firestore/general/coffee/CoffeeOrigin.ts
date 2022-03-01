import clone from 'clone';

export interface ICoffeeVariant {
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

export class CoffeeVariant {
  private variant: ICoffeeVariant;

  constructor(variant: ICoffeeVariant) {
    this.variant = clone(variant);
  }

  get id(): string {
    return this.variant.id;
  }

  get price(): number {
    return this.variant.price.amount;
  }

  get currency(): string {
    return this.variant.price.unit;
  }

  getDisplayPrice(): string {
    return `${this.price} ${this.currency}`;
  }

  get weight(): number {
    return this.variant.weight.amount;
  }

  get weightUnit(): string {
    return this.variant.weight.unit.toLowerCase();
  }

  get minQuantity(): number {
    return 30 / this.weight;
  }

  get title(): string {
    return this.variant.label;
  }

  getPriceId(): string {
    return this.variant.price.id;
  }

  isValidQuantity(quantity: number): boolean {
    return quantity >= this.minQuantity;
  }

  toString(): string {
    return `${this.title} (${this.weight} ${this.weightUnit})`;
  }
}
