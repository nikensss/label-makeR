import { Button } from '@material-ui/core';
import { ChangeEvent } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';

type ButtonUploadLogoTypes = {
  addLogo: (event: ChangeEvent<HTMLInputElement>) => void;
};
export default function ButtonUploadLogo({ addLogo }: ButtonUploadLogoTypes) {
  return (
    <>
      <input
        accept='image/*'
        style={{ display: 'none' }}
        id='contained-button-file'
        multiple
        type='file'
        onChange={addLogo}
      />
      <label htmlFor='contained-button-file'>
        <Button startIcon={<FileUploadIcon />} variant='contained' color='primary' component='span'>
          <span>Logo</span>
        </Button>
      </label>
    </>
  );
}
