import getSymbolFromCurrency from 'currency-symbol-map';
import { CoffeeVariant, ICoffeeVariant, Price } from './CoffeeVariant';

export const displayPrice = ({ amount, unit }: Price): string => {
  return `${amount.toFixed(2)} ${getSymbolFromCurrency(unit)}`;
};

export type DisplayableCoffeeVariantKeys = Parameters<CoffeeSelection['display']>[0];

export class CoffeeSelection {
  private coffeeVariant: CoffeeVariant;
  private quantity = 0;

  constructor(coffeeVariant: CoffeeVariant) {
    this.coffeeVariant = coffeeVariant;
  }

  get variant(): CoffeeVariant {
    return this.coffeeVariant;
  }

  get id(): string {
    return this.coffeeVariant.id;
  }

  get minQuantity(): number {
    return this.coffeeVariant.minQuantity;
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
      amount: this.variant.price.amount * this.quantity,
      unit: this.coffeeVariant.price.unit
    };
  }

  display(prop: Exclude<keyof ICoffeeVariant, 'id'> | 'quantity' | 'totalPrice'): string {
    switch (prop) {
      case 'label':
        return this.coffeeVariant.label;
      case 'price':
        return displayPrice(this.coffeeVariant.price);
      case 'weight':
        return `${this.coffeeVariant.weight.amount} ${this.coffeeVariant.weight.unit}`;
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
