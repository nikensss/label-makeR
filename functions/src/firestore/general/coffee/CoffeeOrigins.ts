import clone from 'clone';
import { CoffeeVariant, ICoffeeVariant } from './CoffeeOrigin';
import { CoffeeSelections } from '../../../classes/CoffeeSelections/CoffeeSelections';

export class CoffeeVariants {
  private variants: CoffeeVariant[];

  constructor(variants: ICoffeeVariant[]) {
    this.variants = clone(variants).map(o => new CoffeeVariant(o));
  }

  static fromVariants(variants: CoffeeVariant[]): CoffeeVariants {
    const coffeeVariants = new CoffeeVariants([]);
    coffeeVariants.variants = variants;
    return coffeeVariants;
  }

  *[Symbol.iterator](): IterableIterator<CoffeeVariant> {
    for (const variant of this.variants) {
      yield variant;
    }
  }

  find(id: string): CoffeeVariant | undefined {
    return this.variants.find(c => c.id === id);
  }

  asLineItems(selections: CoffeeSelections): { price: string; quantity: number }[] {
    const lineItems: { price: string; quantity: number }[] = [];
    for (const { id, quantity } of selections) {
      const variant = this.find(id);
      if (!variant) throw new Error(`Could not find coffee ${id}`);
      lineItems.push({ price: variant.getPriceId(), quantity });
    }

    return lineItems;
  }
}
