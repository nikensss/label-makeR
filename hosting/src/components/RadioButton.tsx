import { createStyles, Theme, withStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      '&:hover': {
        cursor: 'pointer'
      }
    },
    label: {
      fontFamily: theme.typography.fontFamily
    },
    input: {
      '&:hover': {
        cursor: 'pointer'
      }
    }
  });

type RadioButtonType = {
  value: string;
  groupName: string;
  label: string;
  classes: ClassNameMap<string>;
};

export const RadioButton = withStyles(styles)(
  ({ value, groupName, label, classes }: RadioButtonType) => {
    return (
      <div className={classes.container}>
        <label className={classes.container}>
          <input className={classes.input} type='radio' value={value} name={groupName} />
          <Typography>{label}</Typography>
        </label>
      </div>
    );
  }
);
