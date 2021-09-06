import Checkbox from '@material-ui/core/Checkbox';
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
import { CoffeeOrigin } from './CoffeeOrigin';

interface GetRowsInput {
  onSelection: (id: string, amount: number) => void;
}

export interface GetTableInput extends GetRowsInput {
  tableClass: string;
}
export class CoffeeOrigins {
  constructor(private readonly coffeeOrigins: CoffeeOrigin[]) {}

  find(value: string): CoffeeOrigin | null {
    return this.coffeeOrigins.find(co => co.value === value) || null;
  }

  getTable({ onSelection, tableClass }: GetTableInput): JSX.Element | null {
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

  private getKeys(): (keyof CoffeeOrigin)[] {
    if (!this.isReady()) return [];

    const [coffeeOrigin] = this.coffeeOrigins;
    return Object.keys(coffeeOrigin)
      .sort()
      .filter(l => l !== 'value') as (keyof CoffeeOrigin)[];
  }

  private getColumns(): JSX.Element {
    const isReady = this.isReady();
    return (
      <TableRow>
        {isReady && (
          <TableCell padding='checkbox'>
            <Checkbox disabled={true} style={{ opacity: '0' }} />
          </TableCell>
        )}
        {isReady &&
          this.getKeys().map((c, i) => {
            return (
              <TableCell key={i}>
                <Typography>{capitalize(c)}</Typography>
              </TableCell>
            );
          })}
      </TableRow>
    );
  }

  private getRows({ onSelection }: GetRowsInput): JSX.Element[] {
    const keys = this.getKeys();
    const isReady = this.isReady();

    return this.coffeeOrigins.map((coffeeOrigin, id) => {
      const { value } = coffeeOrigin;

      return (
        <TableRow hover role='checkbox' key={id} style={{ cursor: 'pointer' }}>
          <TableCell padding='checkbox'>
            <CoffeeCounter onCoffeeAmountChange={onSelection} id={value} />
          </TableCell>
          {isReady &&
            keys.map((k, i) => {
              const value = coffeeOrigin[k as keyof CoffeeOrigin];
              if (typeof value === 'string') {
                return (
                  <TableCell key={i}>
                    <Typography>{value}</Typography>
                  </TableCell>
                );
              }

              return (
                <TableCell key={i}>
                  <Typography>
                    {value.amount}&nbsp;{value.unit}
                  </Typography>
                </TableCell>
              );
            })}
        </TableRow>
      );
    });
  }
}
