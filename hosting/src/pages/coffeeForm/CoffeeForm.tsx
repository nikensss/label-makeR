import { Button, createStyles, FormControl, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Order } from '../../classes/Order';
import { LabelDesign, LabelDesigner } from '../../components/LabelDesigner';
import { OrderSummary } from '../../components/OrderSummary';
import { config } from '../../config/config';
import { CoffeeOrigin } from '../../firebase/general/coffee/CoffeeOrigin';
import { CoffeeOrigins, GetRowsProps } from '../../firebase/general/coffee/CoffeeOrigins';
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
      'width': '65%',
      'height': '70%',
      '& > *': {
        maxHeight: '92%'
      }
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

export interface CoffeeFormProps {
  classes: ClassNameMap<string>;
}

export interface CoffeeSelection {
  quantity: number;
  valid: boolean;
}

export const onlyCoffeeOrigin = (o: unknown): o is CoffeeOrigin => {
  return o instanceof CoffeeOrigin;
};

export interface CoffeeSelections {
  [key: string]: CoffeeOrigin | undefined;
}

export const CoffeeForm = withStyles(styles)(({ classes }: CoffeeFormProps): JSX.Element => {
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isLastStep = () => step === LAST_STEP;
  const [selections, setSelections] = useState<CoffeeSelections>({});
  const [coffeeOrigins, setCoffeeOrigins] = useState<CoffeeOrigins>(new CoffeeOrigins([]));
  const [order, setOrder] = useState(new Order());

  const [open, setOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const [labelDesign, setLabelDesign] = useState<LabelDesign>({
    backgroundColor: '#787878',
    bagColor: 'white',
    font: 'Source Code Pro',
    logo: '',
    scale: 0.1,
    text: 'Your brand here',
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

  // TODO: create CoffeeOrigin class and use it as input type to this func
  const onSelection: GetRowsProps['onSelection'] = (id: string) => {
    return (quantity: number) => {
      const c = selections[id] || coffeeOrigins.find(id);
      if (!c) throw new Error(`Unknown ${id}`);
      c.quantity = quantity;
      setSelections({
        ...selections,
        [id]: c
      });
    };
  };

  // update order when either selections or coffeeOrigins change
  useEffect(() => {
    order.setCoffeeSelections(selections);
    order.setCoffeeOrigins(coffeeOrigins);
    setOrder(Order.fromOrder(order));
  }, [selections, coffeeOrigins]);

  const LAST_STEP = 2;
  const onNext = () => setStep(step >= LAST_STEP ? LAST_STEP : step + 1);
  const onBack = () => setStep(step <= 0 ? 0 : step - 1);
  const onPay = async () => {
    console.log('Paid!', { config });
    try {
      setIsLoading(true);
      const response = await fetch(config.orderCheck, {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(selections)
      });
      const { status, message } = await response.json();

      if (status === 'ok') return history.push('/thankyou');
      throw new Error(message || 'Something went wrong');
    } catch (ex) {
      console.error('Exception caught!', { ex });
      setApiErrorMessage(ex.message || 'Something went wrong');
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextClick = () => (isLastStep() ? onPay() : onNext());

  const nextButtonMarkUp = () => {
    if (isLoading) return <CircularProgress size={25} />;
    return isLastStep() ? 'Pay' : 'Next';
  };

  return (
    <>
      <FormControl className={classes.main} component='fieldset'>
        {(() => {
          switch (step) {
            case 0:
              return coffeeOrigins.getTable({
                selections,
                onSelection,
                tableClass: classes.table
              });
            case 1:
              return (
                <LabelDesigner
                  labelDesignRef={labelDesignRef}
                  setLabelDesign={setLabelDesign}
                  label={label}
                  setLabel={setLabel}
                />
              );
            case 2:
              return <OrderSummary label={label} order={order} />;
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
            disabled={step === 0 || isLoading}
          >
            Back
          </Button>
          <Button
            color='primary'
            variant='contained'
            className={classes.nextButton}
            onClick={handleNextClick}
            disabled={!order.isValid() || isLoading}
          >
            {nextButtonMarkUp()}
          </Button>
        </div>
      </FormControl>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {apiErrorMessage}
        </Alert>
      </Snackbar>
    </>
  );
});
