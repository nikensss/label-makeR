import getSymbolFromCurrency from 'currency-symbol-map';

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

export const priceDisplay = ({ amount, unit }: Price): string => {
  return `${amount.toFixed(2)} ${getSymbolFromCurrency(unit)}`;
};

export type DisplayableCoffeeOriginKeys = Parameters<CoffeeOrigin['display']>[0];

export class CoffeeOrigin {
  private coffeeOrigin: ICoffeeOrigin;
  private _quantity = 0;

  constructor(coffeeOrigin: ICoffeeOrigin) {
    this.coffeeOrigin = coffeeOrigin;
  }

  get id(): string {
    return this.coffeeOrigin.id;
  }

  get minQuantity(): number {
    return 30 / this.coffeeOrigin.weight.amount;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(qty: number) {
    if (qty < 0) throw new Error('Negative quantities not allowes!');
    this._quantity = qty;
  }

  isValid(): boolean {
    return this.quantity === 0 || this.quantity >= this.minQuantity;
  }

  display(prop: Exclude<keyof ICoffeeOrigin, 'id'> | 'quantity' | 'totalPrice'): string {
    switch (prop) {
      case 'label':
        return this.coffeeOrigin.label;
      case 'price':
        return priceDisplay(this.coffeeOrigin.price);
      case 'weight':
        return `${this.coffeeOrigin.weight.amount} ${this.coffeeOrigin.weight.unit}`;
      case 'quantity':
        return `${this.quantity}`;
      case 'totalPrice':
        return priceDisplay(this.getTotalPrice());
    }
  }

  style(): Record<string, string> {
    if (this.isValid()) {
      return {
        backgroundColor: 'transparent'
      };
    }

    return {
      backgroundColor: 'rgb(253,237,237)'
    };
  }

  getTotalPrice(): Price {
    return {
      amount: this.coffeeOrigin.price.amount * this.quantity,
      unit: this.coffeeOrigin.price.unit
    };
  }
}
