import { FormControl } from '@material-ui/core';
import InputLabel from './InputLabel';
import RadioButton from './RadioButton';

type BagColourSelectorTypes = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function BagColourSelector({ onChange }: BagColourSelectorTypes) {
  return (
    <FormControl fullWidth component='fieldset'>
      <InputLabel value='Bag Colour' />
      <div onChange={onChange}>
        <RadioButton value='white' label='White' groupName='bag-colour' />
        <RadioButton value='black' label='Black' groupName='bag-colour' />
        <RadioButton value='brown' label='Brown' groupName='bag-colour' />
      </div>
    </FormControl>
  );
}
