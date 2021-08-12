import { Button, createStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import { useEffect, useState } from 'react';
import { CoffeeOrigins } from '../../firebase/general/coffee/CoffeeOrigins';
import { getCoffee } from '../../firebase/general/General';

const styles = ({ palette }: Theme) =>
  createStyles({
    main: {
      backgroundColor: palette.secondary.main,
      color: palette.primary.main,
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    table: {
      width: '65%'
    },
    nextButton: {
      marginTop: '1rem'
    }
  });

type CoffeeFormInput = { classes: ClassNameMap<string> };

export const CoffeeForm = withStyles(styles)(
  ({ classes }: CoffeeFormInput): JSX.Element => {
    const [selection, setSelection] = useState('');
    const [coffeeOrigins, setCoffeeOrigins] = useState<CoffeeOrigins>(
      new CoffeeOrigins([])
    );

    useEffect(() => {
      const getCoffeeOrigins = async (): Promise<void> => {
        const coffee = await getCoffee();
        if (!coffee) return;

        setCoffeeOrigins(coffee.getOrigins());
      };

      getCoffeeOrigins().catch(ex => console.error(ex));
    }, []);

    const handleClick = (event: React.MouseEvent<unknown>, value: string) => {
      console.log({ event, value });
      setSelection(selection === value ? '' : value);
    };

    return (
      <div className={classes.main}>
        <TableContainer className={classes.table} component={Paper}>
          <Table>
            <TableHead> {coffeeOrigins.getColumns()} </TableHead>
            <TableBody>
              {coffeeOrigins.getRows(selection, handleClick)}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          color="primary"
          variant="contained"
          className={classes.nextButton}
          disabled={!selection}
        >
          Next
        </Button>
      </div>
    );
  }
);
