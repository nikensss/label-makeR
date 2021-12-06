import clone from 'clone';
import { CoffeeOrigin, ICoffeeOrigin } from './CoffeeOrigin';
import { CoffeeSelections } from '../../../classes/CoffeeSelections/CoffeeSelections';

export class CoffeeOrigins {
  private origins: CoffeeOrigin[];

  constructor(origins: ICoffeeOrigin[]) {
    this.origins = clone(origins).map(o => new CoffeeOrigin(o));
  }

  static fromOrigins(origins: CoffeeOrigin[]): CoffeeOrigins {
    const coffeeOrigins = new CoffeeOrigins([]);
    coffeeOrigins.origins = origins;
    return coffeeOrigins;
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
    for (const { id, quantity } of selections) {
      const origin = this.find(id);
      if (!origin) throw new Error(`Could not find coffee ${id}`);
      lineItems.push({ price: origin.getPriceId(), quantity });
    }

    return lineItems;
  }
}
