import { Button, createStyles, TextField, Theme } from '@material-ui/core';
import withStyles, { ClassNameMap } from '@material-ui/styles/withStyles';
import { ChangeEvent, useEffect, useState } from 'react';
import { CoffeeSelections } from '../../../pages/coffeeForm/CoffeeForm';
import { GetRowsProps } from './CoffeeOrigins';

const styles = ({ spacing }: Theme) => {
  return createStyles({
    numberInput: {
      'width': '7ch',
      '& *': {
        textAlign: 'center'
      }
    },
    button: {
      padding: spacing(1),
      minWidth: spacing(2)
    },
    container: {
      display: 'flex',
      flex: '1 auto'
    }
  });
};

type CoffeeCounterProps = {
  classes: ClassNameMap<string>;
  onCoffeeQuantityChange: ReturnType<GetRowsProps['onSelection']>;
  coffeeSelection: Exclude<CoffeeSelections[string], undefined>;
};

export const CoffeeCounter = withStyles(styles)(
  ({ classes, onCoffeeQuantityChange, coffeeSelection }: CoffeeCounterProps) => {
    const [qty, setQty] = useState(coffeeSelection.quantity);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      const isNumber = /^[0-9\b]+$/;
      const { value } = event.currentTarget;
      if (value === '' || !isNumber.test(value)) return;

      const amount = parseInt(value, 10);
      setQty(amount < 0 ? 0 : amount);
      setQty(amount > 999 ? 999 : amount);
    };

    const onSubtractUnit = () => setQty(qty <= 0 ? 0 : qty - 1);
    const onAddUnit = () => setQty(qty + 1);

    useEffect(() => onCoffeeQuantityChange(qty), [qty]);

    return (
      <div className={classes.container}>
        <Button className={classes.button} onClick={onSubtractUnit}>
          -
        </Button>
        <TextField
          type='tel'
          className={classes.numberInput}
          value={qty}
          onChange={onChange}
          variant='outlined'
          size='small'
        />
        <Button className={classes.button} onClick={onAddUnit}>
          +
        </Button>
      </div>
    );
  }
);
