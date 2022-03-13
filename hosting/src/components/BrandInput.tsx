import { TextField } from '@material-ui/core';

type BrandInputTypes = {
  defaultValue: string;
  onBrandChange: (event: any) => void;
};
export default function BrandInput({ defaultValue, onBrandChange }: BrandInputTypes) {
  return (
    <>
      <TextField
        fullWidth
        onChange={onBrandChange}
        label='Your Brand'
        defaultValue={defaultValue}
      />
    </>
  );
}
