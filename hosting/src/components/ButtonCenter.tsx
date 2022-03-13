import { Button, createStyles, Theme, Typography } from '@material-ui/core';
import { ChangeEvent, useRef } from 'react';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';

type ButtonCenterTypes = {
  hasLogo: boolean;
  centerLogo: () => void;
};
export default function ButtonCenter({ hasLogo, centerLogo }: ButtonCenterTypes) {
  const styles = {
    label: {
      fontSize: '0.75rem'
    }
  };

  return (
    <>
      <Button
        startIcon={<FilterCenterFocusIcon />}
        variant='contained'
        color='primary'
        component='span'
        disabled={!hasLogo}
        onClick={centerLogo}
      >
        <span>Center</span>
      </Button>
    </>
  );
}
