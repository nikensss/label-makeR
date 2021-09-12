import { Button, createStyles, TextField, Theme } from '@material-ui/core';
import withStyles, { ClassNameMap } from '@material-ui/styles/withStyles';
import { ChangeEvent, useEffect, useState } from 'react';

const styles = ({ spacing }: Theme) => {
  return createStyles({
    numberInput: {
      'width': '4ch',
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
  onCoffeeAmountChange: (amount: number) => void;
};

export const CoffeeCounter = withStyles(styles)(
  ({ classes, onCoffeeAmountChange }: CoffeeCounterProps) => {
    const [units, setUnits] = useState(0);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      const isNumber = /^[0-9\b]+$/;
      const { value } = event.currentTarget;
      if (value === '' || !isNumber.test(value)) return;

      const amount = parseInt(value, 10);
      setUnits(amount < 0 ? 0 : amount);
    };

    const onSubtractUnit = () => setUnits(units <= 0 ? 0 : units - 1);
    const onAddUnit = () => setUnits(units + 1);

    useEffect(() => onCoffeeAmountChange(units), [units]);

    return (
      <div className={classes.container}>
        <Button className={classes.button} onClick={onSubtractUnit}>
          -
        </Button>
        <TextField
          type='tel'
          className={classes.numberInput}
          value={units}
          onChange={onChange}
        />
        <Button className={classes.button} onClick={onAddUnit}>
          +
        </Button>
      </div>
    );
  }
);
