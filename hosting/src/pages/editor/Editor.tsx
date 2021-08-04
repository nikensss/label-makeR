import { Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap, Styles } from '@material-ui/core/styles/withStyles';

// eslint-disable-next-line @typescript-eslint/ban-types
const styles: Styles<Theme, {}, string> = () => ({
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
