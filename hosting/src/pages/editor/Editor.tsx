import { Radio, RadioGroup } from '@blueprintjs/core';
import { Button, createStyles, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { FormEvent, useState } from 'react';

const styles = ({ palette }: Theme) =>
  createStyles({
    editor: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.secondary.main,
      color: palette.primary.main
    },
    container: {
      display: 'block'
    },
    radioLabel: {
      display: 'block',
      marginBottom: '15px',
      marginTop: 0
    },
    radioButton: {
      display: 'block',
      marginBottom: '10px',
      marginTop: 0,
      alignItems: 'center'
    },
    nextButton: {
      display: 'block',
      marginTop: '15px'
    }
  });

type EditorInput = { classes: ClassNameMap<string> };
export const Editor = withStyles(styles)(
  ({ classes }: EditorInput): JSX.Element => {
    const [selection, setSelectedValue] = useState('');
    const radioButtons = [
      {
        label: 'Brazil',
        value: 'brazil'
      },
      {
        label: 'Colombia',
        value: 'colombia'
      },
      {
        label: 'Ethiopia',
        value: 'ethiopia'
      },
      {
        label: 'Indonesia',
        value: 'indonesia'
      }
    ];

    const label = (
      <div className={classes.radioLabel}>Select coffee origin</div>
    );

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
      setSelectedValue(event.currentTarget.value);
    };

    return (
      <div className={classes.editor}>
        <div className={classes.container}>
          <RadioGroup
            inline={false}
            label={label}
            name="group"
            onChange={handleChange}
            selectedValue={selection}
          >
            {radioButtons.map((radioButton, index) => {
              return (
                <Radio
                  key={index}
                  className={classes.radioButton}
                  label={radioButton.label}
                  value={radioButton.value}
                />
              );
            })}
          </RadioGroup>
          <div>
            <Button className={classes.nextButton}> Next</Button>
          </div>
        </div>
      </div>
    );
  }
);
