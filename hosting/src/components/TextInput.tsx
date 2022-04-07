import { TextField } from '@material-ui/core';
import { ChangeEvent } from 'react';

type TextInputTypes = {
  defaultValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
};
export const TextInput = ({ defaultValue, onChange, label }: TextInputTypes) => {
  return (
    <>
      <TextField fullWidth onChange={onChange} label={label} defaultValue={defaultValue} />
    </>
  );
};
