import { Button, createStyles, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
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
        setCoffeeOrigins(coffee?.getOrigins() || coffeeOrigins);
      };

      getCoffeeOrigins().catch(ex => console.error(ex));
    }, []);

    const handleClick = (event: React.MouseEvent<unknown>, value: string) => {
      console.log({ event, value });
      setSelection(selection === value ? '' : value);
    };

    return (
      <div className={classes.main}>
        {coffeeOrigins.getTable({
          selection,
          handleClick,
          tableClass: classes.table
        })}
        <Button
          color='primary'
          variant='contained'
          className={classes.nextButton}
          disabled={!selection}>
          Next
        </Button>
      </div>
    );
  }
);
