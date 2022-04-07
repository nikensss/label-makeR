import { Button } from '@material-ui/core';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';

type ButtonCenterTypes = {
  hasLogo: boolean;
  centerLogo: () => void;
};
export const ButtonCenter = ({ hasLogo, centerLogo }: ButtonCenterTypes) => {
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
};
