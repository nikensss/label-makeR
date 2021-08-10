import { createStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

const styles = createStyles({
  editor: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'steelblue'
  }
});

type EditorInput = { classes: ClassNameMap<string> };
export const Editor = withStyles(styles)(
  ({ classes }: EditorInput): JSX.Element => {
    return <div className={classes.editor}>EDITOR works!</div>;
  }
);
