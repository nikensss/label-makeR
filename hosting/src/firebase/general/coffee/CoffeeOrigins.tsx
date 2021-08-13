import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { CoffeeOrigin } from './Coffee';

export class CoffeeOrigins {
  constructor(private coffeeOrigins: CoffeeOrigin[]) {}

  getTable(
    selection: string,
    handleClick: (event: React.MouseEvent<unknown>, value: string) => void
  ): JSX.Element {
    return (
      <Table>
        <TableHead> {this.getColumns()} </TableHead>
        <TableBody> {this.getRows(selection, handleClick)} </TableBody>
      </Table>
    );
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

  private getRows(
    selection: string,
    handleClick: (event: React.MouseEvent<unknown>, value: string) => void
  ): JSX.Element[] {
    return this.coffeeOrigins.map(({ label, value }, id) => {
      return (
        <TableRow
          hover
          role='checkbox'
          key={id}
          onClick={event => handleClick(event, value)}
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
