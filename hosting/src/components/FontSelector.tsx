import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { ReactNode } from 'react';

type FontSelectorTypes = {
  onFontSelectionChange: (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => void;
  selectedFont: string;
};
export default function FontSelector({ onFontSelectionChange, selectedFont }: FontSelectorTypes) {
  const onChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
    child: ReactNode
  ) => {
    onFontSelectionChange(event);
  };
  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Font</InputLabel>
        <Select
          labelId='font-select-label'
          id='font-select'
          value={selectedFont}
          label='Font'
          onChange={onChange}
          style={{ fontFamily: selectedFont }}
        >
          <MenuItem value={'Source Code Pro'} style={{ fontFamily: 'Source Code Pro' }}>
            Source Code Pro
          </MenuItem>
          <MenuItem value={'Montserrat'} style={{ fontFamily: 'Montserrat' }}>
            Montserrat
          </MenuItem>
          <MenuItem value={'Oswald'} style={{ fontFamily: 'Oswald' }}>
            Oswald
          </MenuItem>
          <MenuItem value={'Roboto Slab'} style={{ fontFamily: 'Roboto Slab' }}>
            Roboto Slab
          </MenuItem>
          <MenuItem value={'Zen Old Mincho'} style={{ fontFamily: 'Zen Old Mincho' }}>
            Zen Old Mincho
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
