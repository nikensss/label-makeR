import { Radio, RadioGroup } from '@blueprintjs/core';
import { Button, createStyles, Theme, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { FormEvent, useEffect, useState } from 'react';
import { FirestoreCoffee } from '../../firebase/general/coffee/Coffee';
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
    const [radioButtons, setRadioButtons] = useState<
      FirestoreCoffee['origins']
    >([]);

    useEffect(() => {
      const getCoffeeOrigins = async (): Promise<void> => {
        const coffee = await getCoffee();
        if (!coffee) return;

        setRadioButtons(coffee.getOrigins());
      };

      getCoffeeOrigins().catch(ex => console.error(ex));
    }, []);

    const label = (
      <Typography variant="h5" className={classes.radioLabel}>
        Select coffee origin
      </Typography>
    );

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
      setSelectedValue(event.currentTarget.value);
    };

    return (
      <div className={classes.main}>
        <RadioGroup
          inline={false}
          label={label}
          name="group"
          onChange={handleChange}
          selectedValue={selection}
        >
          {radioButtons.map((radioButton, index) => {
            return (
              <Radio
                key={index}
                className={classes.radioButton}
                label={radioButton.label}
                value={radioButton.value}
              />
            );
          })}
        </RadioGroup>
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
