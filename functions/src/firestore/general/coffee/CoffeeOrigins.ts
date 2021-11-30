import { ICoffeeOrigin } from './ICoffeeOrigin.interface';
import * as clone from 'clone';
import { CoffeeOrigin } from './CoffeeOrigin';
import { CoffeeSelections } from '../../../classes/CoffeeSelections/CoffeeSelections';

export class CoffeeOrigins {
  private origins: CoffeeOrigin[];

  constructor(origins: ICoffeeOrigin[]) {
    this.origins = clone(origins).map(o => new CoffeeOrigin(o));
  }

  *[Symbol.iterator](): IterableIterator<CoffeeOrigin> {
    for (const origin of this.origins) {
      yield origin;
    }
  }

  find(id: string): CoffeeOrigin | undefined {
    return this.origins.find(c => c.id === id);
  }

  asLineItems(selections: CoffeeSelections): { price: string; quantity: number }[] {
    const lineItems: { price: string; quantity: number }[] = [];
    for (const selection of selections) {
      const origin = this.find(selection.id);
      if (!origin) throw new Error(`Could not find coffee ${selection.id}`);
      lineItems.push({ price: origin.getPriceId(), quantity: selection.quantity });
    }

    return lineItems;
  }
}
