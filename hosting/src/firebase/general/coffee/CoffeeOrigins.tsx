import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { CoffeeOrigin } from './Coffee';

interface GetRowsInput {
  selection: string;
  onSelection: (value: string) => void;
}

export interface GetTableInput extends GetRowsInput {
  tableClass: string;
}

export class CoffeeOrigins {
  constructor(private readonly coffeeOrigins: CoffeeOrigin[]) {}

  getTable({
    selection,
    onSelection,
    tableClass
  }: GetTableInput): JSX.Element | null {
    if (!this.isReady()) return null;

    return (
      <TableContainer className={tableClass} component={Paper}>
        <Table>
          <TableHead> {this.getColumns()} </TableHead>
          <TableBody> {this.getRows({ selection, onSelection })} </TableBody>
        </Table>
      </TableContainer>
    );
  }

  private isReady(): boolean {
    return typeof this.coffeeOrigins[0] !== 'undefined';
  }

  private getColumns(): JSX.Element {
    const coffeeOrigin = this.coffeeOrigins[0];

    return (
      <TableRow>
        {coffeeOrigin && (
          <TableCell padding='checkbox'>
            <Checkbox disabled={true} style={{ opacity: '0' }} />
          </TableCell>
        )}
        {coffeeOrigin &&
          Object.keys(coffeeOrigin)
            .sort()
            .map((c, i) => {
              return (
                <TableCell key={i}>
                  <Typography>{c}</Typography>
                </TableCell>
              );
            })}
      </TableRow>
    );
  }

  private getRows({ selection, onSelection }: GetRowsInput): JSX.Element[] {
    return this.coffeeOrigins.map(({ label, value }, id) => {
      return (
        <TableRow
          hover
          role='checkbox'
          key={id}
          onClick={() => onSelection(value)}
          style={{ cursor: 'pointer' }}>
          <TableCell padding='checkbox'>
            <Checkbox
              color='primary'
              checked={selection === value}
              inputProps={{ 'aria-labelledby': label }}
            />
          </TableCell>
          <TableCell>
            <Typography>{label}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{value}</Typography>
          </TableCell>
        </TableRow>
      );
    });
  }
}
