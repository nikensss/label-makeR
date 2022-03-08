import clone from 'clone';
import { CoffeeVariant, ICoffeeVariant } from '../../firestore/general/coffee/CoffeeVariant';

export class CoffeeSelection {
  private selection: ICoffeeSelection;
  private _variant: CoffeeVariant;

  constructor(selection: ICoffeeSelection) {
    this.selection = clone(selection);
    this._variant = new CoffeeVariant(this.selection.coffeeVariant.coffeeVariant);
  }

  get id(): string {
    return this.selection.coffeeVariant.coffeeVariant.id;
  }

  get quantity(): number {
    return this.selection.quantity;
  }

  get currency(): string {
    return this._variant.currency;
  }

  get title(): string {
    return this._variant.title;
  }

  get variant(): CoffeeVariant {
    return new CoffeeVariant(clone(this.selection.coffeeVariant.coffeeVariant));
  }

  asHtml(): string {
    const title = this._variant.toString();
    const qty = this.quantity;
    const unitPrice = this._variant.getDisplayPrice();
    const subtotal = `${qty * this._variant.price} ${this._variant.currency}`;
    return `${title}: ${qty} &times; ${unitPrice} = ${subtotal}`;
  }

  serialize(): ICoffeeSelection {
    return clone(this.selection);
  }
}

/** In the frontend, the `CoffeeSelection` class wraps a `CoffeeVariant` object,
 * hence the double 'coffeeVariant' property
 */
export interface ICoffeeSelection {
  coffeeVariant: { coffeeVariant: ICoffeeVariant };
  quantity: number;
}

export const isICoffeeSelection = (e: ICoffeeSelection | undefined): e is ICoffeeSelection => {
  return typeof e !== undefined;
};
