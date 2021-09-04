import { Theme } from '@material-ui/core/styles/createTheme';
import withStyles, { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/styles/createStyles';
import {
  CoffeeOrigin,
  coffeeOriginAsCard
} from '../firebase/general/coffee/CoffeeOrigin';

type CoffeeSelectionSummaryProps = {
  coffeeOrigin: CoffeeOrigin | null;
  label: string;
  classes: ClassNameMap<string>;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
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

export const CoffeeSelectionSummary = withStyles(styles)(
  ({
    coffeeOrigin,
    label,
    classes
  }: CoffeeSelectionSummaryProps): JSX.Element => {
    if (!coffeeOrigin) throw new Error('We should not be here');

    return (
      <div className={classes.root}>
        <Typography variant='h3'>Your order</Typography>
        <div className={classes.selectionAndLabel}>
          <div>{coffeeOriginAsCard(coffeeOrigin)}</div>
          <img style={{ width: '380px', height: '532px' }} src={label} />
        </div>
      </div>
    );
  }
);
