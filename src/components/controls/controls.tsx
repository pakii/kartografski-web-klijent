import React from 'react';
import Box from '@mui/material/Box';

import LayersControl from './layers';
import LocateControl from './locate';
import LegendControl from './legend';
import ShareControl from './share/share-control';

export const ControlsMenu = () => {
    const [currentlyOpen, setCurrentlyOpen] = React.useState<'layers' | 'legend' | 'share' | null>(null);
    return (
        <Box
            component='section'
            sx={{
                position: 'absolute',
                right: 0,
                bottom: 'top',
                zIndex: 2,
                m: 1
            }}>
            <LayersControl open={currentlyOpen === 'layers'} onOpen={() => setCurrentlyOpen('layers')} onClose={() => setCurrentlyOpen(null)}/>
            <LegendControl open={currentlyOpen === 'legend'} onOpen={() => setCurrentlyOpen('legend')} onClose={() => setCurrentlyOpen(null)}/>
            <ShareControl open={currentlyOpen === 'share'} onOpen={() => setCurrentlyOpen('share')} onClose={() => setCurrentlyOpen(null)}/>
            <LocateControl />
        </Box >
    )
}
