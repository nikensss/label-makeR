import { CoffeeSelection, ICoffeeSelection, isICoffeeSelection } from './CoffeeSelection';
import { CoffeeVariants } from '../../firestore/general/coffee/CoffeeVariants';

export class CoffeeSelections {
  private selections: CoffeeSelection[];

  constructor(selections: ICoffeeSelections) {
    this.selections = Object.values(selections)
      .filter(isICoffeeSelection)
      .map(s => new CoffeeSelection(s));
  }

  getTotalPrice(coffeeVariants: CoffeeVariants): number {
    let totalPrice = 0;
    for (const { id, quantity } of this) {
      const variant = coffeeVariants.findById(id);
      if (!variant) throw new Error(`Could not find variant ${id}`);
      totalPrice += variant.price * 100 * quantity;
    }

    return totalPrice;
  }

  getDisplayTotalPrice(coffeeVariants: CoffeeVariants): string {
    const totalPrice = this.getTotalPrice(coffeeVariants) / 100;
    const currency = this.selections[0]?.currency;

    return `${totalPrice} ${currency}`;
  }

  *[Symbol.iterator](): IterableIterator<CoffeeSelection> {
    for (const selection of this.selections) {
      yield selection;
    }
  }

  asHtml(): string {
    const itemsList = this.selections.map(s => `<li>${s.asHtml()}</li>`);
    const variants = this.selections.map(s => s.variant);
    return `<ul>
      ${itemsList.join('')}
      <li>
        Total: ${this.getDisplayTotalPrice(CoffeeVariants.fromVariants(variants))}
      </li>
      </ul>`;
  }

  serialize(): Record<string, unknown> {
    return this.selections.reduce((a, s) => {
      a[s.id] = s.serialize();
      return a;
    }, {} as Record<string, unknown>);
  }
}

export interface ICoffeeSelections {
  [key: string]: ICoffeeSelection | undefined;
}
