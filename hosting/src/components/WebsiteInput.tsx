import { TextField } from '@material-ui/core';
import { ChangeEvent } from 'react';

type WebsiteInputTypes = {
  defaultValue: string;
  onWebsiteChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
