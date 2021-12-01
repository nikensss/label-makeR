import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import capitalize from '@material-ui/core/utils/capitalize';
import Alert from '@mui/material/Alert';
import { CoffeeSelections } from '../../../pages/coffeeForm/CoffeeForm';
import { CoffeeCounter } from './CoffeeCounter';
import { CoffeeOrigin } from './CoffeeOrigin';
import { CoffeeSelection, DisplayableCoffeeOriginKeys } from './CoffeeSelection';

export interface GetRowsProps {
  selections: CoffeeSelections;
  onSelection: (id: string) => (amount: number) => void;
}

export interface GetTableProps extends GetRowsProps {
  tableClass: string;
}

export class CoffeeOrigins {
  constructor(private readonly coffeeOrigins: CoffeeOrigin[]) {}

  find(id: string): CoffeeOrigin | null {
    return this.coffeeOrigins.find(co => co.id === id) || null;
  }

  getTable({ selections, onSelection, tableClass }: GetTableProps): JSX.Element | null {
    if (!this.isReady()) return null;

    return (
      <div className={tableClass}>
        <Alert severity='info'>
          Minimum order per product is 30 kg, ie: 30 bags of 1 kg, 60 bags of 0.5 kg, 120 bags of
          0.25 kg.
        </Alert>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>{this.getColumns()}</TableHead>
            <TableBody>{this.getRows({ selections, onSelection })}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

  private isReady(): boolean {
    return typeof this.coffeeOrigins[0] !== 'undefined';
  }

  private getKeys(): DisplayableCoffeeOriginKeys[] {
    if (!this.isReady()) return [];
    return ['label', 'price', 'weight'];
  }

  private getColumns(): JSX.Element | null {
    if (!this.isReady()) return null;

    return (
      <TableRow>
        <TableCell padding='checkbox'></TableCell>
        {this.getKeys().map((c, i) => {
          return (
            <TableCell key={i}>
              <Typography style={{ fontWeight: 'bold' }}>{capitalize(c)}</Typography>
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  private getRows({ selections, onSelection }: GetRowsProps): JSX.Element[] | null {
    if (!this.isReady()) return null;

    const keys = this.getKeys();

    return this.coffeeOrigins.map((coffeeOrigin, i) => {
      const { id } = coffeeOrigin;

      return (
        <CoffeeRow
          keys={keys}
          key={i}
          coffeeSelection={selections[id] || new CoffeeSelection(coffeeOrigin)}
          onCoffeeQuantityChange={onSelection(id)}
        />
      );
    });
  }
}

interface CoffeeRowProps {
  keys: DisplayableCoffeeOriginKeys[];
  coffeeSelection: Exclude<CoffeeSelections[string], undefined>;
  onCoffeeQuantityChange: ReturnType<GetRowsProps['onSelection']>;
}

const CoffeeRow = ({ keys, coffeeSelection, onCoffeeQuantityChange }: CoffeeRowProps) => {
  return (
    <TableRow hover style={coffeeSelection.style()}>
      <TableCell padding='checkbox'>
        <CoffeeCounter
          coffeeSelection={coffeeSelection}
          onCoffeeQuantityChange={onCoffeeQuantityChange}
        />
      </TableCell>
      {keys.map((k, i) => {
        return (
          <TableCell key={i}>
            <Typography>{coffeeSelection?.display(k) ?? ''}</Typography>
          </TableCell>
        );
      })}
    </TableRow>
  );
};
