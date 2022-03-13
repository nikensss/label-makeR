import { Button, createStyles, Theme, Typography } from '@material-ui/core';
import { ChangeEvent, useRef } from 'react';
import ImageIcon from '@material-ui/icons/Image';
import FileUploadIcon from '@mui/icons-material/FileUpload';

type ButtonUploadLogoTypes = {
  addLogo: (event: ChangeEvent<HTMLInputElement>) => void;
};
export default function ButtonUploadLogo({ addLogo }: ButtonUploadLogoTypes) {
  const styles = {
    label: {
      fontSize: '0.75rem'
    }
  };

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
