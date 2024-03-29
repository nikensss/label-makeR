import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { LabelDesign } from '../components/LabelDesigner';
import { Price } from '../firebase/general/coffee/CoffeeVariant';
import { CoffeeVariants } from '../firebase/general/coffee/CoffeeVariants';
import { CoffeeSelection, displayPrice } from '../firebase/general/coffee/CoffeeSelection';
import { CoffeeSelections, onlyCoffeeSelection } from '../pages/coffeeForm/CoffeeForm';

export class Order {
  private coffeeSelections: CoffeeSelections = {};
  private coffeeVariants: CoffeeVariants = new CoffeeVariants([]);
  private static TAX_RATE = 0.21;
  private bagColor: LabelDesign['bagColor'] = 'white';

  static fromOrder(order: Order): Order {
    const clone = new Order();
    clone.coffeeVariants = order.coffeeVariants;
    clone.coffeeSelections = order.coffeeSelections;
    clone.bagColor = order.bagColor || 'white';

    return clone;
  }

  clone(): Order {
    return Order.fromOrder(this);
  }

  setCoffeeSelections(coffeeSelections: CoffeeSelections): void {
    this.coffeeSelections = coffeeSelections;
  }

  setCoffeeVariants(coffeeVariants: CoffeeVariants): void {
    this.coffeeVariants = coffeeVariants;
  }

  setBagColor(color: LabelDesign['bagColor']): void {
    this.bagColor = color;
  }

  getBagColor(): typeof this.bagColor {
    return this.bagColor;
  }

  setQuantity(id: string, quantity: number): void {
    const selection = this.coffeeSelections[id];
    if (selection) selection.setQuantity(quantity);
  }

  isValid(): boolean {
    const coffeeSelections = Object.values(this.coffeeSelections).filter(onlyCoffeeSelection);
    const allValid = coffeeSelections.every(c => c.isValid());
    const totalAmount = coffeeSelections.map(c => c.getQuantity()).reduce((t, q) => t + q, 0);

    return allValid && totalAmount !== 0;
  }

  get selections(): CoffeeSelection[] {
    const selections = Object.values(this.coffeeSelections)
      .filter(onlyCoffeeSelection)
      .filter(c => c.isValid() && c.getQuantity() > 0);

    return selections || [];
  }

  get price(): Price {
    return this.selections.reduce(
      (t, coffee) => {
        return {
          amount: t.amount + coffee.getTotalPrice().amount,
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
                <Typography style={{ fontWeight: 'bold' }}>Variant</Typography>
              </TableCell>
              <TableCell align='right'>
                <Typography style={{ fontWeight: 'bold' }}>Grind</Typography>
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
            {this.selections.map((coffee, key) => {
              return (
                <TableRow key={key}>
                  <TableCell component='th' scope='row'>
                    {coffee.display('label')}
                  </TableCell>
                  <TableCell align='right'>{coffee.display('grind')}</TableCell>
                  <TableCell align='right'>{coffee.display('price')}</TableCell>
                  <TableCell align='right'>{coffee.getQuantity()}</TableCell>
                  <TableCell align='right'>{coffee.display('totalPrice')}</TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={3}>Subtotal</TableCell>
              <TableCell align='right'>{displayPrice(this.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Tax</TableCell>
              <TableCell align='right'>{`${(Order.TAX_RATE * 100).toFixed(0)} %`}</TableCell>
              <TableCell align='right'>{displayPrice(this.taxes)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell align='right'>{displayPrice(this.priceWithTaxes)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
