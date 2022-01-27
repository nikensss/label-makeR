import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = ({ spacing }: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh'
    },
    thankYou: {
      marghin: spacing(1)
    }
  });
};

type ThankYouProps = { classes: ClassNameMap<string> };

export const ThankYou = withStyles(styles)(({ classes }: ThankYouProps): JSX.Element => {
  return (
    <div className={classes.root}>
      <Typography variant='h3' className={classes.thankYou}>
        Thank you for your order!
      </Typography>
      <Typography variant='h5'>Check your email for more information!</Typography>
    </div>
  );
});
