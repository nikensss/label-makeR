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
            {coffees.map(([id, amount], key) => {
              const coffeeOrigin = this.coffeeOrigins.find(id);
              if (!coffeeOrigin || !amount) return;

              const renderer = new CoffeeOriginRenderer(coffeeOrigin);

              return (
                <TableRow key={key}>
                  <TableCell component='th' scope='row'>
                    {renderer.label}
                  </TableCell>
                  <TableCell align='right'>{renderer.weight}</TableCell>
                  <TableCell align='right'>{renderer.price}</TableCell>
                  <TableCell align='right'>{amount}</TableCell>
                  <TableCell align='right'>
                    {renderer.getTotalPrice(amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
