import { Button, createStyles, FormControl, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { useEffect, useRef, useState } from 'react';
import { LabelDesign, LabelDesigner } from '../../components/LabelDesigner';
import { CoffeeOrigins } from '../../firebase/general/coffee/CoffeeOrigins';
import { getCoffee } from '../../firebase/general/General';

const styles = ({ palette, spacing }: Theme) =>
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
      marginTop: spacing(3)
    },
    buttons: {
      'display': 'flex',
      'justifyContent': 'space-between',
      'alignItems': 'center',
      '& > *': {
        marginRight: spacing(3)
      }
    }
  });

type CoffeeFormInput = { classes: ClassNameMap<string> };

export const CoffeeForm = withStyles(styles)(
  ({ classes }: CoffeeFormInput): JSX.Element => {
    const [step, setStep] = useState(0);
    const [selection, setSelection] = useState('');
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

    useEffect(() => {
      const getCoffeeOrigins = async (): Promise<void> => {
        const coffee = await getCoffee();
        setCoffeeOrigins(coffee?.getOrigins() || coffeeOrigins);
      };

      getCoffeeOrigins().catch(ex => console.error(ex));
    }, []);

    const onSelection = (value: string) => {
      setSelection(selection === value ? '' : value);
    };

    const onNext = () => setStep(step + 1);
    const onBack = () => setStep(step === 0 ? step : step - 1);

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
                />
              );
            // TODO: show summary
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
            onClick={onNext}
            disabled={!selection}>
            Next
          </Button>
        </div>
      </FormControl>
    );
  }
);
