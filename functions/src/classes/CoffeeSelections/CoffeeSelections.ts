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

  *[Symbol.iterator](): IterableIterator<CoffeeSelection> {
    for (const selection of this.selections) {
      yield selection;
    }
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
