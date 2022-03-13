import { TextField } from '@material-ui/core';

type WebsiteInputTypes = {
  defaultValue: string;
  onWebsiteChange: (event: any) => void;
};
export default function WebsiteInput({ defaultValue, onWebsiteChange }: WebsiteInputTypes) {
  return (
    <>
      <TextField
        fullWidth
        onChange={onWebsiteChange}
        label='Your Website'
        defaultValue={defaultValue}
      />
    </>
  );
}
