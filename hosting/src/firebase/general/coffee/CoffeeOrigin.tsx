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
}

export class CoffeeVariant {
  private coffeeVariant: ICoffeeVariant;

  constructor(coffeeVariant: ICoffeeVariant) {
    this.coffeeVariant = coffeeVariant;
  }

  get id(): string {
    return this.coffeeVariant.id;
  }

  get label(): string {
    return this.coffeeVariant.label;
  }

  get price(): Price {
    return this.coffeeVariant.price;
  }

  get weight(): Weight {
    return this.coffeeVariant.weight;
  }

  get minQuantity(): number {
    return 30 / this.weight.amount;
  }
}
