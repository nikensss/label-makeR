import { Radio, RadioGroup } from '@blueprintjs/core';
import { Button, createStyles, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Radio, RadioGroup } from '@blueprintjs/core';
import React, { useState } from 'react';
import { settings } from 'cluster';

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
    const [selection, setSelectedValue] = useState(0);
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
      <div className={classes.radioLabel}> Select coffee origin</div>
    );

    function handleChange(event: React.ChangeEvent<any>) {
      setSelectedValue(event.target.value);
    }

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
            <Radio
              className={classes.radioButton}
              label="Brazil"
              value="brazil"
            />
            <Radio
              className={classes.radioButton}
              label="Ethiopia"
              value="ethiopia"
            />
            <Radio
              className={classes.radioButton}
              label="Colombia"
              value="colombia"
            />
            <Radio
              className={classes.radioButton}
              label="Indonesia"
              value="indonesia"
            />
          </RadioGroup>
          <div>
            <Button className={classes.nextButton}> Next</Button>
          </div>
        </div>
      </div>
    );
    //return <div className={classes.editor}>EDITOR works!</div>;
  }
);
