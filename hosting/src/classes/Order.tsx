import { CoffeeOrigins } from '../firebase/general/coffee/CoffeeOrigins';
import { CoffeeSelections } from '../pages/coffeeForm/CoffeeForm';
import { onlyNumbers } from '../utils/onlyNumbers';
import {
  CoffeeOriginRenderer,
  Price,
  priceDisplay
} from '../firebase/general/coffee/CoffeeOrigin';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';

export class Order {
  private coffeeSelections: CoffeeSelections = {};
  private coffeeOrigins: CoffeeOrigins = new CoffeeOrigins([]);
  private static TAX_RATE = 0.21;

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

  get coffees(): [id: string, amount: number | undefined][] {
    return Object.entries(this.coffeeSelections).filter(([, value]) => {
      if (!value) return false;
      return value > 0;
    });
  }

  get price(): Price {
    return this.coffees.reduce(
      (t, [id, quantity]) => {
        const coffeeOrigin = this.coffeeOrigins.find(id);
        if (!coffeeOrigin || !quantity) return t;

        const { price } = coffeeOrigin;
        if (price.unit !== t.unit) {
          const { unit } = price;
          throw new Error(`Currency mismatch: ${t.unit} !== ${unit}`);
        }

        return {
          amount: t.amount + quantity * price.amount,
          unit: t.unit
        };
      },
      { amount: 0, unit: 'GBP' }
    );
  }

  get taxes(): Price {
    return {
      amount: this.price.amount * Order.TAX_RATE,
      unit: this.price.unit
    };
  }

  get priceWithTaxes(): Price {
    return {
      amount: this.price.amount + this.taxes.amount,
      unit: this.price.unit
    };
  }

  toTable(): JSX.Element {
    return (
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label='Order summary'>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography style={{ fontWeight: 'bold' }}>Origin</Typography>
              </TableCell>
              <TableCell align='right'>
                <Typography style={{ fontWeight: 'bold' }}>Weight</Typography>
              </TableCell>
              <TableCell align='right'>
                <Typography style={{ fontWeight: 'bold' }}>Price</Typography>
              </TableCell>
              <TableCell align='right'>
                <Typography style={{ fontWeight: 'bold' }}>Quantity</Typography>
              </TableCell>
              <TableCell align='right'>
                <Typography style={{ fontWeight: 'bold' }}>Total</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.coffees.map(([id, quantity], key) => {
              const coffeeOrigin = this.coffeeOrigins.find(id);
              if (!coffeeOrigin || !quantity) return <></>;

              const renderer = new CoffeeOriginRenderer(coffeeOrigin);

              return (
                <TableRow key={key}>
                  <TableCell component='th' scope='row'>
                    {renderer.label}
                  </TableCell>
                  <TableCell align='right'>{renderer.weight}</TableCell>
                  <TableCell align='right'>{renderer.price}</TableCell>
                  <TableCell align='right'>{quantity}</TableCell>
                  <TableCell align='right'>
                    {renderer.getTotalPrice(quantity)}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={3}>Subtotal</TableCell>
              <TableCell align='right'>{priceDisplay(this.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Tax</TableCell>
              <TableCell align='right'>{`${(Order.TAX_RATE * 100).toFixed(
                0
              )} %`}</TableCell>
              <TableCell align='right'>{priceDisplay(this.taxes)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell align='right'>
                {priceDisplay(this.priceWithTaxes)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
