import React from 'react'

import ShareIcon from '@mui/icons-material/Share';

import Fab from '@mui/material/Fab';
import Popover from '@mui/material/Popover/Popover';
import Box from '@mui/material/Box/Box';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, ViberShareButton, ViberIcon, EmailShareButton, EmailIcon } from "react-share";

export const ShareControl = (props: {
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (props.open) {
      setAnchorEl(ref.current);
    }
    else {
      setAnchorEl(null);
    }
  }, [props.open]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onOpen()
  };

  const handleClose = () => {
    props.onClose()
  };

  const open = Boolean(anchorEl);
  const id = open ? 'legenda' : undefined;
  const shareUrl = window.location.href;
  const title = 'Seizmološka karta';
  return (
    <div className='layers'>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box p={1}>
          <FacebookShareButton
            url={shareUrl}
            quote={title}
            hashtag="#earthqueaqes">
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <WhatsappShareButton
            url={shareUrl}
            title={title}
            separator=":: "
            className="Demo__some-network__share-button"
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <ViberShareButton
            url={shareUrl}
            title={title}
            className="Demo__some-network__share-button"
          >
            <ViberIcon size={32} round />
          </ViberShareButton>
          <EmailShareButton
            url={shareUrl}
            title={title}
            className="Demo__some-network__share-button"
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </Box>
      </Popover>
      <Fab
        ref={ref}
        variant='extended'
        size='small'
        color='primary'
        aria-describedby={id}
        onClick={handleClick}
        sx={{ mt: 1 }}>
        <ShareIcon />
      </Fab>
    </div>
  )
}

export default ShareControl;
