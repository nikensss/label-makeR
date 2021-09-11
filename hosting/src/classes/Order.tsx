import { CoffeeOrigins } from '../firebase/general/coffee/CoffeeOrigins';
import { CoffeeSelections } from '../pages/coffeeForm/CoffeeForm';
import { onlyNumbers } from '../utils/onlyNumbers';

export class Order {
  private coffeeSelections: CoffeeSelections = {};
  private coffeeOrigins: CoffeeOrigins = new CoffeeOrigins([]);

  static fromOrder(order: Order): Order {
    const clone = new Order();
    clone.coffeeOrigins = order.coffeeOrigins;
    clone.coffeeSelections = order.coffeeSelections;

    return clone;
  }

  setCoffeeSelections(coffeeSelections: CoffeeSelections): void {
    this.coffeeSelections = coffeeSelections;
  }

  setCoffeeOrigins(coffeeOrigins: CoffeeOrigins): void {
    this.coffeeOrigins = coffeeOrigins;
  }

  setAmount(id: string, amount: number): void {
    this.coffeeSelections[id] = amount;
  }

  hasItems(): boolean {
    const value = Object.values(this.coffeeSelections)
      .filter(onlyNumbers)
      .find(v => v > 0);

    return typeof value === 'number';
  }

  toReactComponent(): JSX.Element {
    return <div>{JSON.stringify(this.coffeeSelections, null, 2)}</div>;
  }
}
