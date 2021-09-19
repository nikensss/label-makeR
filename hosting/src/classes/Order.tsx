import { CoffeeOrigins } from '../firebase/general/coffee/CoffeeOrigins';
import { CoffeeSelections } from '../pages/coffeeForm/CoffeeForm';
import { onlyNumbers } from '../utils/onlyNumbers';
import { CoffeeOriginRenderer } from '../firebase/general/coffee/CoffeeOrigin';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import getSymbolFromCurrency from 'currency-symbol-map';

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
    const coffees = Object.entries(this.coffeeSelections).filter(
      ([, value]) => {
        if (!value) return false;
        return value > 0;
      }
    );

    return (
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
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
            {coffees.map(([id, quantity], key) => {
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
              <TableCell rowSpan={4} />
              <TableCell colSpan={3}>Subtotal</TableCell>
              <TableCell align='right'>
                {(() => {
                  const { amount, unit } = coffees.reduce(
                    (t, [id, quantity]) => {
                      const coffeeOrigin = this.coffeeOrigins.find(id);
                      if (!coffeeOrigin || !quantity) return t;

                      const { price } = coffeeOrigin;
                      if (price.unit !== t.unit) {
                        const { unit } = price;
                        throw new Error(
                          `Currency mismatch: ${t.unit} !== ${unit}`
                        );
                      }

                      return {
                        amount: t.amount + quantity * price.amount,
                        unit: t.unit
                      };
                    },
                    { amount: 0, unit: 'GBP' }
                  );

                  return `${amount} ${getSymbolFromCurrency(unit)}`;
                })()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
