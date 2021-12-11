import { CoffeeSelection, ICoffeeSelection, isICoffeeSelection } from './CoffeeSelection';
import { CoffeeOrigins } from '../../firestore/general/coffee/CoffeeOrigins';

export class CoffeeSelections {
  private selections: CoffeeSelection[];

  constructor(selections: ICoffeeSelections) {
    this.selections = Object.values(selections)
      .filter(isICoffeeSelection)
      .map(s => new CoffeeSelection(s));
  }

  getTotalPrice(coffeeOrigins: CoffeeOrigins): number {
    let totalPrice = 0;
    for (const { id, quantity } of this) {
      const origin = coffeeOrigins.find(id);
      if (!origin) throw new Error(`Could not find origin ${id}`);
      totalPrice += origin.price * 100 * quantity;
    }

    return totalPrice;
  }

  getDisplayTotalPrice(coffeeOrigins: CoffeeOrigins): string {
    const totalPrice = this.getTotalPrice(coffeeOrigins) / 100;
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
    const origins = this.selections.map(s => s.origin);
    return `<ul>
      ${itemsList.join('')}
      <li>
        Total: ${this.getDisplayTotalPrice(CoffeeOrigins.fromOrigins(origins))}
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
