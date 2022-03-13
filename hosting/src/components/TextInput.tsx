import { TextField } from '@material-ui/core';

type TextInputTypes = {
  defaultValue: string;
  onChange: (event: any) => void;
  label: string;
};
export default function TextInput({ defaultValue, onChange, label }: TextInputTypes) {
  return (
    <>
      <TextField fullWidth onChange={onChange} label={label} defaultValue={defaultValue} />
    </>
  );
}
