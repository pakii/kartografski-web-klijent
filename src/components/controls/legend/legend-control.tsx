import React from 'react'

import KeyIcon from '@mui/icons-material/Key';

import Fab from '@mui/material/Fab';
import Popper from '@mui/material/Popper/Popper';
import Paper from '@mui/material/Paper/Paper';
import { Legend } from './legend/legend';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useMediaQuery } from '@mui/material';
import { theme } from '../../../styles/theme';

export const LegendControl = (props: {
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const ref = React.useRef<HTMLButtonElement>(null);
  const isBigScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!anchorEl) {
      props.onOpen();
    }
    else {
      props.onClose();
    }
  };

  React.useEffect(() => {
    if (props.open) {
      setAnchorEl(ref.current);
    }
    else {
      setAnchorEl(null);
    }
  }, [props.open]);

  return (
    <ClickAwayListener onClickAway={() => !isBigScreen && Boolean(anchorEl) && setAnchorEl(null)}>
      <div className='layers'>
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement='left-start'
          sx={{
            maxWidth: 'calc(100vw - 48px)'
          }}
        >
          <Paper>
            <Legend />
          </Paper>
        </Popper>
        <Fab
          ref={ref}
          size='small'
          color='primary'
          variant='extended'
          onClick={handleClick}
          sx={{ mt: 1 }}>
          <KeyIcon />
        </Fab>
      </div>
    </ClickAwayListener >
  )
}

export default LegendControl;
