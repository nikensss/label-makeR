import { Theme } from '@material-ui/core/styles/createTheme';
import withStyles, { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/styles/createStyles';
import Alert from '@mui/material/Alert';
import { Order } from '../classes/Order';
import { Labels } from './LabelDesigner';

type OrderSummaryProps = {
  order: Order;
  labels: Labels;
  classes: ClassNameMap<string>;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '70%'
    },
    selectionAndLabel: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: theme.spacing(1),
      '& > *': {
        margin: theme.spacing(1)
      }
    },
    label: {
      borderRadius: '10px',
      width: '380px',
      height: '532px',
      boxShadow: '0 0 10px 6px #303030A0'
    }
  });

export const OrderSummary = withStyles(styles)(
  ({ order, labels, classes }: OrderSummaryProps): JSX.Element => {
    if (!order) throw new Error('We should not be here');

    return (
      <div className={classes.root}>
        <Typography variant='h3'>Your order</Typography>
        <div className={classes.selectionAndLabel}>
          <div>{order.toTable()}</div>
          <img alt={'Designed label'} className={classes.label} src={labels.front} />
          <img alt={'Designed label'} className={classes.label} src={labels.back} />
        </div>
        <Alert severity='info'>Products will arrive in about 21 working days.</Alert>
      </div>
    );
  }
);
