import React from 'react'

import KeyIcon from '@mui/icons-material/Key';

import Fab from '@mui/material/Fab';
import Popper from '@mui/material/Popper/Popper';
import Paper from '@mui/material/Paper/Paper';
import { Legend } from '../../legend/legend';

export const LegendControl = (props: {
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const ref = React.useRef<HTMLButtonElement>(null);

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
    <div className='layers'>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement='left-start'
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
  )
}

export default LegendControl;
