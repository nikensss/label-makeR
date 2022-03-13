import { FormControl, FormLabel, Radio, Typography } from '@material-ui/core';
import { StylesContext } from '@material-ui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ChangeEvent } from 'react';
import InputLabel from './InputLabel';
import RadioButton from './RadioButton';

type BagColourSelectorTypes = {
  onChange: (event: any) => void;
};

export default function BagColourSelector({ onChange }: BagColourSelectorTypes) {
  return (
    <FormControl fullWidth component='fieldset'>
      <InputLabel value='Bag Colour' />
      <div onChange={onChange}>
        <RadioButton value='white' label='White' groupName='bag-colour' />
        <RadioButton value='black' label='Black' groupName='grind' />
        <RadioButton value='brown' label='Brown' groupName='grind' />
      </div>
    </FormControl>
  );
}
