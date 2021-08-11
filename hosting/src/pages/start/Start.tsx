import { createStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const styles = createStyles({
  start: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center'
  },
  startButton: {
    height: '40%',
    width: '65%'
  }
});

type StartInput = { classes: ClassNameMap<string> };
export const Start = withStyles(styles)(
  ({ classes }: StartInput): JSX.Element => {
    return (
      <div className={classes.start}>
        <Button
          className={classes.startButton}
          variant="contained"
          color="primary"
          component={Link}
          to={`/coffee`}
        >
          <Typography variant="h1">START</Typography>
        </Button>
      </div>
    );
  }
);
