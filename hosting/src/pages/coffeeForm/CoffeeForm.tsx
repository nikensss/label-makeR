import { Button, createStyles, FormControl, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { useEffect, useRef, useState } from 'react';
import { Order } from '../../classes/Order';
import { LabelDesign, LabelDesigner, Labels } from '../../components/LabelDesigner';
import { OrderSummary } from '../../components/OrderSummary';
import { config } from '../../config/config';
import { CoffeeOrigins, GetRowsProps } from '../../firebase/general/coffee/CoffeeOrigins';
import { CoffeeSelection } from '../../firebase/general/coffee/CoffeeSelection';
import { getCoffee } from '../../firebase/general/General';
import { generateAllLabels } from '../../utils/generateAllLabels';

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
      height: '70%',
      '& > *': {
        maxHeight: '92%'
      }
    },
    nextButton: {
      marginTop: spacing(3)
    },
    buttons: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& > *': {
        margin: spacing(3)
      }
    }
  });
};

export interface CoffeeFormProps {
  classes: ClassNameMap<string>;
}

export const onlyCoffeeSelection = (o: unknown): o is CoffeeSelection => {
  return o instanceof CoffeeSelection;
};

export interface CoffeeSelections {
  [key: string]: CoffeeSelection | undefined;
}

export const CoffeeForm = withStyles(styles)(({ classes }: CoffeeFormProps): JSX.Element => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isLastStep = () => step === LAST_STEP;
  const [selections, setSelections] = useState<CoffeeSelections>({});
  const [coffeeOrigins, setCoffeeOrigins] = useState<CoffeeOrigins>(new CoffeeOrigins([]));
  const [order, setOrder] = useState(new Order());

  const [open, setOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const [labelDesign, setLabelDesign] = useState<LabelDesign>({
    backgroundColor: '#A0A0A0',
    bagColor: 'white',
    font: 'Source Code Pro',
    logo: '',
    scale: 0.1,
    brand: 'Your brand here',
    description: 'Your description here',
    website: 'www.yourwebsite.com',
    x: 0,
    y: 0
  });
  const labelDesignRef = useRef(labelDesign);
  labelDesignRef.current = labelDesign;

  // the labels to be shown to the client
  const [labels, setLabels] = useState<Labels>({ front: '', back: '' });
  const labelRef = useRef(labels);
  labelRef.current = labels;

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
      const origin = coffeeOrigins.find(id);
      if (!origin) throw new Error(`Unknown ${id}`);
      const selection = selections[id] || new CoffeeSelection(origin);
      selection.setQuantity(quantity);

      if (quantity === 0) {
        const copy = { ...selections };
        delete copy[id];
        return setSelections(copy);
      }

      setSelections({ ...selections, [id]: selection });
    };
  };

  useEffect(() => {
    setOrder(order => {
      const update = order.clone();
      update.setCoffeeSelections(selections);
      update.setCoffeeOrigins(coffeeOrigins);
      update.setBagColor(labelDesign.bagColor);

      return update;
    });
  }, [selections, coffeeOrigins, labelDesign]);

  const LAST_STEP = 2;
  const onNext = () => setStep(step >= LAST_STEP ? LAST_STEP : step + 1);
  const onBack = () => setStep(step <= 0 ? 0 : step - 1);
  const onPay = async () => {
    console.log('Requesting payment!', { config });
    try {
      setIsLoading(true);

      // 1) generate all labels and send them to the backend to be saved in GCS
      // 2) a link to those files should be saved in firestore
      // 3) if the payment is successful, those images should be attached in the
      // confirmation email for the client and in the order email for the
      // coffee roaster

      const response = await fetch(config.orderCheck, {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          selections,
          bagColor: order.getBagColor(),
          labels: await generateAllLabels(labelDesign, order)
        })
      });
      const { url } = await response.json();

      if (!url) throw new Error('Can not proceed to checkout!');
      window.location.href = url;
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
                  order={order}
                  labelDesignRef={labelDesignRef}
                  setLabelDesign={setLabelDesign}
                  labels={labels}
                  setLabels={setLabels}
                />
              );
            case 2:
              return <OrderSummary labels={labels} order={order} />;
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
