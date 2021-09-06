import { Button, createStyles, FormControl, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CoffeeSelectionSummary } from '../../components/CoffeeSelectionSummary';
import { LabelDesign, LabelDesigner } from '../../components/LabelDesigner';
import { CoffeeOrigin } from '../../firebase/general/coffee/CoffeeOrigin';
import { CoffeeOrigins } from '../../firebase/general/coffee/CoffeeOrigins';
import { getCoffee } from '../../firebase/general/General';

const styles = ({ palette, spacing }: Theme) => {
  return createStyles({
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
      width: '65%',
      height: '70%'
    },
    nextButton: {
      marginTop: spacing(3)
    },
    buttons: {
      'display': 'flex',
      'justifyContent': 'space-between',
      'alignItems': 'center',
      '& > *': {
        margin: spacing(3)
      }
    }
  });
};

type CoffeeFormInput = { classes: ClassNameMap<string> };

export const CoffeeForm = withStyles(styles)(
  ({ classes }: CoffeeFormInput): JSX.Element => {
    const history = useHistory();
    const [step, setStep] = useState(0);
    // TODO: we should probably use a 'Order' class to keep track of the
    // selected coffees and the amounts. This class could also easily create
    // the markup for the summary, return the total amount to be paid, keep the
    // label the use designed (maybe, not sure about this one, though...)
    const [selection, setSelection] = useState<CoffeeOrigin | null>(null);
    const [coffeeOrigins, setCoffeeOrigins] = useState<CoffeeOrigins>(
      new CoffeeOrigins([])
    );

    const [labelDesign, setLabelDesign] = useState<LabelDesign>({
      backgroundColor: '#473D54',
      logo: '',
      scale: 0.25,
      text: 'Freshly roasted coffee',
      x: 0,
      y: 0
    });
    const labelDesignRef = useRef(labelDesign);
    labelDesignRef.current = labelDesign;

    const [label, setLabel] = useState('');
    const labelRef = useRef(label);
    labelRef.current = label;

    useEffect(() => {
      const getCoffeeOrigins = async (): Promise<void> => {
        const coffee = await getCoffee();
        setCoffeeOrigins(coffee?.getOrigins() || coffeeOrigins);
      };

      getCoffeeOrigins().catch(ex => console.error(ex));
    }, []);

    const onSelection = (value: string) => {
      // if there is no selection, select the clicked one
      if (!selection) return setSelection(coffeeOrigins.find(value));

      // if a differen coffe is select, change selection
      if (selection.value !== value) {
        return setSelection(coffeeOrigins.find(value));
      }

      // if the same coffee is clicked, deselect it
      if (selection.value === value) return setSelection(null);
    };

    const LAST_STEP = 2;
    const onNext = () => setStep(step >= LAST_STEP ? LAST_STEP : step + 1);
    const onBack = () => setStep(step <= 0 ? 0 : step - 1);
    const onPay = () => {
      console.log('Paid!');
      history.push('/thankyou');
    };
    const handleNextClick = () => (step === LAST_STEP ? onPay() : onNext());

    return (
      <FormControl className={classes.main} component='fieldset'>
        {(() => {
          switch (step) {
            case 0:
              return coffeeOrigins.getTable({
                selection,
                onSelection,
                tableClass: classes.table
              });
            case 1:
              return (
                <LabelDesigner
                  labelDesignRef={labelDesignRef}
                  labelDesign={labelDesign}
                  setLabelDesign={setLabelDesign}
                  setLabel={setLabel}
                />
              );
            case 2:
              return (
                <CoffeeSelectionSummary
                  label={label}
                  coffeeOrigin={selection}
                />
              );
            default:
              return setStep(0);
          }
        })()}
        <div className={classes.buttons}>
          <Button
            color='primary'
            variant='contained'
            className={classes.nextButton}
            onClick={onBack}
            disabled={step === 0}>
            Back
          </Button>
          <Button
            color='primary'
            variant='contained'
            className={classes.nextButton}
            onClick={handleNextClick}
            disabled={!selection}>
            {step >= LAST_STEP ? 'Pay' : 'Next'}
          </Button>
        </div>
      </FormControl>
    );
  }
);
