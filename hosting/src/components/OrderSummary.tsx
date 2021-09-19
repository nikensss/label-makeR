import { Paper } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createTheme';
import withStyles, { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/styles/createStyles';
import { Order } from '../classes/Order';

type OrderSummaryProps = {
  order: Order;
  label: string;
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
      'display': 'flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      '& > *': {
        margin: theme.spacing(1)
      }
    }
  });

export const OrderSummary = withStyles(styles)(
  ({ order, label, classes }: OrderSummaryProps): JSX.Element => {
    if (!order) throw new Error('We should not be here');

    return (
      <div className={classes.root}>
        <Typography variant='h3'>Your order</Typography>
        <div className={classes.selectionAndLabel}>
          <div>{order.toTable()}</div>
          <Paper elevation={13}>
            <img alt={'Designed label'} style={{ width: '380px', height: '532px' }} src={label} />
          </Paper>
        </div>
      </div>
    );
  }
);
