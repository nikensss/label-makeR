import { Radio, RadioGroup } from '@blueprintjs/core';
import { Button, createStyles, Theme, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { FormEvent, useState } from 'react';

const styles = ({ palette }: Theme) =>
  createStyles({
    editor: {
      backgroundColor: palette.secondary.main,
      color: palette.primary.main,
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    radioLabel: {
      marginBottom: '15px',
      marginTop: 0
    },
    radioButton: {
      display: 'block',
      margin: '10px 0',
      cursor: 'pointer',
      border: '1px transparent solid',
      borderRadius: '9999px',
      transition: 'all 0.15s ease-in',
      '&:hover': { borderColor: palette.primary.main }
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
      <Typography variant="h5" className={classes.radioLabel}>
        Select coffee origin
      </Typography>
    );

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
      setSelectedValue(event.currentTarget.value);
    };

    return (
      <div className={classes.editor}>
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
        <Button
          color="primary"
          variant="contained"
          className={classes.nextButton}
          disabled={!selection}
        >
          Next
        </Button>
      </div>
    );
  }
);
