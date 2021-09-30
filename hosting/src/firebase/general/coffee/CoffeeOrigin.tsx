import getSymbolFromCurrency from 'currency-symbol-map';

export interface CoffeeOrigin {
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

export const priceDisplay = ({ amount, unit }: Price): string => {
  return `${amount.toFixed(2)} ${getSymbolFromCurrency(unit)}`;
};

export type DisplayableCoffeeOriginKeys = Exclude<keyof CoffeeOrigin, 'id'>;

export class CoffeeOriginView {
  constructor(private coffeeOrigin: CoffeeOrigin) {}

  get label(): string {
    return this.coffeeOrigin.label;
  }

  get weight(): string {
    const { weight } = this.coffeeOrigin;
    return `${weight.amount} ${weight.unit}`;
  }

  get price(): string {
    const { price } = this.coffeeOrigin;
    return `${price.amount} ${getSymbolFromCurrency(price.unit)}`;
  }

  getTotalPrice(quantity: number): string {
    const { price } = this.coffeeOrigin;
    const totalPrice = this.calculateTotalPrice(quantity);

    return `${totalPrice.amount} ${getSymbolFromCurrency(price.unit)}`;
  }

  calculateTotalPrice(quantity: number): Price {
    return {
      amount: this.coffeeOrigin.price.amount * quantity,
      unit: this.coffeeOrigin.price.unit
    };
  }
}
