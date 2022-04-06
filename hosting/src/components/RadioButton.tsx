import { createStyles, Theme, withStyles } from '@material-ui/core';
import { useState } from 'react';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: 10
    },
    label: {
      fontFamily: theme.typography.fontFamily
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
    const [isHover, setIsHover] = useState(false);

    const toggleHover = () => {
      setIsHover(!isHover);
    };

    return (
      <div className={classes.container}>
        <label
          className={classes.container}
          onMouseEnter={toggleHover}
          onMouseLeave={toggleHover}
          style={{ cursor: isHover ? 'pointer' : 'auto' }}
        >
          <input type='radio' value={value} name={groupName} />
          <span className={classes.label}>{label}</span>
        </label>
      </div>
    );
  }
);
