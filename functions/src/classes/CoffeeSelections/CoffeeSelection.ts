import * as clone from 'clone';
import { ICoffeeOrigin } from '../../firestore/general/coffee/ICoffeeOrigin.interface';

export class CoffeeSelection {
  private selection: ICoffeeSelection;

  constructor(selection: ICoffeeSelection) {
    this.selection = clone(selection);
  }

  get id(): string {
    return this.selection.coffeeOrigin.coffeeOrigin.id;
  }

  get quantity(): number {
    return this.selection.quantity;
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
