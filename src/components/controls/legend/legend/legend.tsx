
import Typography from '@mui/material/Typography/Typography';
import Box from '@mui/material/Box/Box';

import { mapService } from '../../../../openlayers/map-service/map-service';

export const Legend = () => {
    const hasEarthquaqes = mapService.earthquaqesLayer.getVisible();
    const hasHazards = mapService.hazardLayersGroup.getLayersArray()
        .some(l => l.getVisible());
    const hasSeismographs = mapService.seismographsLayer.getVisible();
    return (
        <Box p={2} sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {hasEarthquaqes && <Box>
                <Typography component='h4' my={1} variant='body1' align='center' fontWeight='bold'>
                    Zemljotresi
                </Typography>
                <Box component='div'
                    sx={{
                        maxWidth: '250px',
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                        gridTemplateRows: '50px 20px',
                        gridGap: '1px'
                    }}>
                    <Box></Box>
                    <Box>
                        <svg viewBox="0 0 100 100" width="100%">
                            <circle cx="50" cy="50" r="12" fill="#ff0000" strokeWidth="3" stroke="#ffffff" />
                        </svg>
                    </Box>
                    <Box>
                        <svg viewBox="0 0 100 100" width="100%">
                            <circle cx="50" cy="50" r="12" fill="#ff0000" strokeWidth="3" stroke="#ffffff" />
                            <circle cx="50" cy="50" r="20" strokeWidth="5" stroke="#ff0000" fill="#00000000" />
                        </svg>
                    </Box>
                    <Box>
                        <svg viewBox="0 0 100 100" width="100%">
                            <circle cx="50" cy="50" r="12" fill="#ff0000" strokeWidth="3" stroke="#ffffff" />
                            <circle cx="50" cy="50" r="30" strokeWidth="5" stroke="#ff0000" fill="#00000000" />
                            <circle cx="50" cy="50" r="20" strokeWidth="5" stroke="#ff0000" fill="#00000000" />
                        </svg>
                    </Box>
                    <Box>
                        <Typography component='span' variant='body2' align='center'>
                            Magnituda
                        </Typography>
                    </Box>
                    <Box>
                        <Typography component='span' variant='body2' align='center'>
                            0 - 2.5
                        </Typography>
                    </Box>
                    <Box>
                        <Typography component='span' variant='body2' align='center'>
                            2.5 - 4.5
                        </Typography>
                    </Box>
                    <Box>
                        <Typography component='span' variant='body2' align='center' ml={1}>
                            &gt; 4.5
                        </Typography>
                    </Box>
                </Box>
            </Box>}
            {
                hasSeismographs && <Box>
                    <Typography component='h4' my={1} variant='body1' fontWeight='bold'>
                        Seizmografske stanice
                    </Typography>
                    <Box component='div' maxWidth='30px' m='0 auto'>
                        <img src="map-icons/sesmograph.png" alt="" />
                    </Box>
                </Box>
            }
            {
                hasHazards && <Box>
                    <Typography component='h4' my={1} variant='body1' align='center' fontWeight='bold'>
                        Seizmički hazardi
                    </Typography>
                    <Box component='div' className='u-flex-center'
                        sx={(t) => ({ justifyContent: 'space-evenly', fontSize: {xs: '0.6rem', sm: '0.875rem'} })}>
                        <Box sx={{ px: '5px', backgroundColor: '#c2cbcd' }}>
                            <Typography component='span' variant='body2' fontSize='inherit' align='center'>
                                V
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px', backgroundColor: '#a6cde3' }}>
                            <Typography component='span' variant='body2' fontSize='inherit' align='center'>
                                VI
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px', backgroundColor: '#74b6ad' }}>
                            <Typography component='span' variant='body2' fontSize='inherit' align='center'>
                                VI-VII
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px', backgroundColor: '#b6e1a7' }}>
                            <Typography component='span' variant='body2' fontSize='inherit' align='center'>
                                VII
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px', backgroundColor: '#e7f5b7' }}>
                            <Typography component='span' variant='body2' fontSize='inherit' align='center'>
                                VII - VIII
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px', backgroundColor: '#fee7a4' }}>
                            <Typography component='span' variant='body2' fontSize='inherit' align='center'>
                                VIII
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px', backgroundColor: '#fdb96e' }}>
                            <Typography component='span' variant='body2' fontSize='inherit' align='center'>
                                VIII - IX
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px', backgroundColor: '#ec6e43' }}>
                            <Typography component='span' variant='body2' fontSize='inherit' align='center'>
                                IX
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px', backgroundColor: '#d7191d' }}>
                            <Typography component='span' variant='body2' fontSize='inherit' align='center'>
                                X
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            }
        </Box >
    )
}
