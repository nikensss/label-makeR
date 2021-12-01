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
}

export class CoffeeOrigin {
  private coffeeOrigin: ICoffeeOrigin;

  constructor(coffeeOrigin: ICoffeeOrigin) {
    this.coffeeOrigin = coffeeOrigin;
  }

  get id(): string {
    return this.coffeeOrigin.id;
  }

  get label(): string {
    return this.coffeeOrigin.label;
  }

  get price(): Price {
    return this.coffeeOrigin.price;
  }

  get weight(): Weight {
    return this.coffeeOrigin.weight;
  }

  get minQuantity(): number {
    return 30 / this.weight.amount;
  }
}
