import { Button, createStyles, Theme, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { FormEvent, useEffect, useState } from 'react';
import { getCoffee } from '../../firebase/general/General';
import { CoffeeOrigins } from '../../firebase/general/coffee/CoffeeOrigins';

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
      display: 'flex',
      flexGrow: 1,
      height: '400px',
      width: '65%'
    },
    radioLabel: {
      marginBottom: '15px',
      marginTop: 0
    },
    radioButton: {
      display: 'block',
      margin: '10px 0',
      cursor: 'pointer',
      border: '1px transparent solid',
      borderRadius: '9999px',
      transition: 'all 0.15s ease-in',
      '&:hover': { borderColor: palette.primary.main }
    }
  });

type CoffeeFormInput = { classes: ClassNameMap<string> };
export const CoffeeForm = withStyles(styles)(
  ({ classes }: CoffeeFormInput): JSX.Element => {
    const [selection, setSelectedValue] = useState('');
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

    // const label = (
    //   <Typography variant="h5" className={classes.radioLabel}>
    //     Select coffee origin
    //   </Typography>
    // );

    // const handleChange = (event: FormEvent<HTMLInputElement>) => {
    //   setSelectedValue(event.currentTarget.value);
    // };

    return (
      <div className={classes.main}>
        <DataGrid
          className={classes.table}
          rows={coffeeOrigins.getRows()}
          columns={coffeeOrigins.getColumns()}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
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
