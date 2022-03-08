import { FormControl, FormLabel, Radio, Typography } from '@material-ui/core';
import { StylesContext } from '@material-ui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import { ChangeEvent } from 'react';

type RadioButtonType = {
  value: string;
  groupName: string;
  label: string;
};
const RadioButton = ({ value, groupName, label }: RadioButtonType) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: 10
    }
  };
  return (
    <div style={styles.container}>
      <input type='radio' value={value} name={groupName} />
      <Typography>{label}</Typography>
    </div>
  );
};

type GrindSelectorTypes = {
  setSelectedGrind: Function;
};

export default function GrindSelector({ setSelectedGrind }: GrindSelectorTypes) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selection = event.target.value;
    setSelectedGrind(selection);
  };
  return (
    <FormControl fullWidth component='fieldset'>
      <FormLabel component='legend'>
        <Typography>Grind Type</Typography>
      </FormLabel>
      <div onChange={onChange}>
        <RadioButton value='whole' label='Whole Beans' groupName='grind' />
        <RadioButton value='filter' label='Filter Grind' groupName='grind' />
        <RadioButton value='espresso' label='Espresso Grind' groupName='grind' />
      </div>
    </FormControl>
  );
}
