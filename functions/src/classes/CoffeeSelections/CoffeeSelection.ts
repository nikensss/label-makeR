import clone from 'clone';
import { CoffeeOrigin, ICoffeeOrigin } from '../../firestore/general/coffee/CoffeeOrigin';

export class CoffeeSelection {
  private selection: ICoffeeSelection;
  private _origin: CoffeeOrigin;

  constructor(selection: ICoffeeSelection) {
    this.selection = clone(selection);
    this._origin = new CoffeeOrigin(this.selection.coffeeOrigin.coffeeOrigin);
  }

  get id(): string {
    return this.selection.coffeeOrigin.coffeeOrigin.id;
  }

  get quantity(): number {
    return this.selection.quantity;
  }

  get currency(): string {
    return this._origin.currency;
  }

  get title(): string {
    return this._origin.title;
  }

  get origin(): CoffeeOrigin {
    return new CoffeeOrigin(clone(this.selection.coffeeOrigin.coffeeOrigin));
  }

  asHtml(): string {
    const title = this._origin.toString();
    const qty = this.quantity;
    const unitPrice = this._origin.getDisplayPrice();
    const subtotal = `${qty * this._origin.price} ${this._origin.currency}`;
    return `${title}: ${qty} &times; ${unitPrice} = ${subtotal}`;
  }

  serialize(): ICoffeeSelection {
    return clone(this.selection);
  }
}

/** In the frontend, the `CoffeeSelection` class wraps a `CoffeeOrigin` object,
 * hence the double 'coffeeOrigin' property
 */
export interface ICoffeeSelection {
  coffeeOrigin: { coffeeOrigin: ICoffeeOrigin };
  quantity: number;
}

export const isICoffeeSelection = (e: ICoffeeSelection | undefined): e is ICoffeeSelection => {
  return typeof e !== undefined;
};
