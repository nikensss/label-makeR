import getSymbolFromCurrency from 'currency-symbol-map';
import { CoffeeOrigin, ICoffeeOrigin, Price } from './CoffeeOrigin';

export const displayPrice = ({ amount, unit }: Price): string => {
  return `${amount.toFixed(2)} ${getSymbolFromCurrency(unit)}`;
};

export type DisplayableCoffeeOriginKeys = Parameters<CoffeeSelection['display']>[0];

export class CoffeeSelection {
  private coffeeOrigin: CoffeeOrigin;
  private quantity = 0;

  constructor(coffeeOrigin: CoffeeOrigin) {
    this.coffeeOrigin = coffeeOrigin;
  }

  get origin(): CoffeeOrigin {
    return this.coffeeOrigin;
  }

  get id(): string {
    return this.coffeeOrigin.id;
  }

  get minQuantity(): number {
    return this.coffeeOrigin.minQuantity;
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(qty: number): void {
    if (qty < 0) throw new Error('Negative quantities not allowed!');
    this.quantity = qty;
  }

  isValid(): boolean {
    return this.quantity === 0 || this.quantity >= this.minQuantity;
  }

  getTotalPrice(): Price {
    return {
      amount: this.origin.price.amount * this.quantity,
      unit: this.coffeeOrigin.price.unit
    };
  }

  display(prop: Exclude<keyof ICoffeeOrigin, 'id'> | 'quantity' | 'totalPrice'): string {
    switch (prop) {
      case 'label':
        return this.coffeeOrigin.label;
      case 'price':
        return displayPrice(this.coffeeOrigin.price);
      case 'weight':
        return `${this.coffeeOrigin.weight.amount} ${this.coffeeOrigin.weight.unit}`;
      case 'quantity':
        return `${this.quantity}`;
      case 'totalPrice':
        return displayPrice(this.getTotalPrice());
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
}
