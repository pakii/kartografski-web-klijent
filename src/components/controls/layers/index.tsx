import React from 'react'

import Fab from '@mui/material/Fab';
import Popper from '@mui/material/Popper/Popper';
import Paper from '@mui/material/Paper/Paper';
import LayersIcon from '@mui/icons-material/Layers';

import { LayersList } from '../../layers-list/layers-list';

export const LayersControl = (props: {
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const ref = React.useRef<HTMLButtonElement>(null);

  const handleClick = () => {
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
          <LayersList />
        </Paper>
      </Popper>
      <Fab
        ref={ref}
        size='small'
        color='primary'
        variant='extended'
        onClick={handleClick}>
        <LayersIcon />
      </Fab>
    </div>
  )
}

export default LayersControl;
