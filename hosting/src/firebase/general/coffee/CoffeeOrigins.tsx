import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import capitalize from '@material-ui/core/utils/capitalize';
import { CoffeeCounter } from './CoffeeCounter';
import {
  CoffeeOrigin,
  CoffeeOriginRenderer,
  DisplayableCoffeeOriginKeys
} from './CoffeeOrigin';

interface GetRowsInput {
  onSelection: (id: string) => (amount: number) => void;
}

export interface GetTableInput extends GetRowsInput {
  tableClass: string;
}
export class CoffeeOrigins {
  constructor(private readonly coffeeOrigins: CoffeeOrigin[]) {}

  find(id: string): CoffeeOrigin | null {
    return this.coffeeOrigins.find(co => co.id === id) || null;
  }

  getTable({ onSelection, tableClass }: GetTableInput): JSX.Element | null {
    if (!this.isReady()) return null;

    return (
      <TableContainer className={tableClass} component={Paper}>
        <Table stickyHeader>
          <TableHead>{this.getColumns()}</TableHead>
          <TableBody>{this.getRows({ onSelection })}</TableBody>
        </Table>
      </TableContainer>
    );
  }

  private isReady(): boolean {
    return typeof this.coffeeOrigins[0] !== 'undefined';
  }

  private getKeys(): DisplayableCoffeeOriginKeys[] {
    if (!this.isReady()) return [];

    const [coffeeOrigin] = this.coffeeOrigins;
    return Object.keys(coffeeOrigin)
      .sort()
      .filter(
        l => !['value', 'id'].includes(l)
      ) as DisplayableCoffeeOriginKeys[];
  }

  private getColumns(): JSX.Element | null {
    if (!this.isReady()) return null;

    return (
      <TableRow>
        <TableCell padding='checkbox'></TableCell>
        {this.getKeys().map((c, i) => {
          return (
            <TableCell key={i}>
              <Typography style={{ fontWeight: 'bold' }}>
                {capitalize(c)}
              </Typography>
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  private getRows({ onSelection }: GetRowsInput): JSX.Element[] | null {
    if (!this.isReady()) return null;

    const keys = this.getKeys();

    return this.coffeeOrigins.map((coffeeOrigin, i) => {
      const { id } = coffeeOrigin;
      const renderer = new CoffeeOriginRenderer(coffeeOrigin);

      return (
        <TableRow hover key={i} style={{ cursor: 'pointer' }}>
          <TableCell padding='checkbox'>
            <CoffeeCounter onCoffeeAmountChange={onSelection(id)} />
          </TableCell>
          {keys.map((k, i) => {
            return (
              <TableCell key={i}>
                <Typography>{renderer[k] ?? ''}</Typography>
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  }
}
