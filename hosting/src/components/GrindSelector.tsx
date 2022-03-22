import { FormControl, FormLabel, Typography } from '@material-ui/core';
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
  setSelectedGrind: (selection: string) => void;
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
