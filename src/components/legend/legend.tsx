
import Typography from '@mui/material/Typography/Typography';
import Box from '@mui/material/Box/Box';

import { mapService } from '../../map-facade/map-service';

export const Legend = () => {

    const layers = mapService.getExternalLayers()
        .filter(l => l.getVisible())
        .sort((p, n) => n.getZIndex() - p.getZIndex());
    const hasEarthquaqes = layers.find(l => l.get('Title') === 'Zemljotresi');
    const hasHazards = layers.find(l => l.get('Title') === 'Seizmički hazardi')?.getLayersArray()
        .some(l => l.getVisible());
    const hasSeismographs = layers.find(l => l.get('Title') === 'Seizmografske stanice');
    const hasDensity = layers.find(l => l.get('Title') === 'Gustina naseljenosti');
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
                            <circle cx="50" cy="50" r="10" fill="#ff0000" strokeWidth="0.5" stroke="#ffffff" />
                        </svg>
                    </Box>
                    <Box>
                        <svg viewBox="0 0 100 100" width="100%">
                            <circle cx="50" cy="50" r="20" strokeWidth="5" stroke="#ff0000" fill="#fff" />
                            <circle cx="50" cy="50" r="10" fill="#ff0000" strokeWidth="0.5" stroke="#ffffff" />
                        </svg>
                    </Box>
                    <Box>
                        <svg viewBox="0 0 100 100" width="100%">
                            <circle cx="50" cy="50" r="30" strokeWidth="5" stroke="#ff0000" fill="#fff" />
                            <circle cx="50" cy="50" r="20" strokeWidth="5" stroke="#ff0000" fill="#fff" />
                            <circle cx="50" cy="50" r="10" fill="#ff0000" strokeWidth="0.5" stroke="#ffffff" />
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
                    <Box component='div' className='u-flex-center' sx={{justifyContent: 'space-evenly'}}>
                        <Box sx={{ px: '5px',backgroundColor: '#c2cbcd' }}>
                            <Typography component='span' variant='body2' align='center'>
                                V
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#a6cde3' }}>
                            <Typography component='span' variant='body2' align='center'>
                                VI
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#74b6ad' }}>
                            <Typography component='span' variant='body2' align='center'>
                                VI-VII
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#b6e1a7' }}>
                            <Typography component='span' variant='body2' align='center'>
                                VII
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#e7f5b7' }}>
                            <Typography component='span' variant='body2' align='center'>
                                VII - VIII
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#fee7a4' }}>
                            <Typography component='span' variant='body2' align='center'>
                                VIII
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#fdb96e' }}>
                            <Typography component='span' variant='body2' align='center'>
                                VIII - IX
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#ec6e43' }}>
                            <Typography component='span' variant='body2' align='center'>
                                IX
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#d7191d' }}>
                            <Typography component='span' variant='body2' align='center'>
                                X
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            }
            {
                hasDensity && <Box>
                    <Typography component='h4' my={1} variant='body1' align='center' fontWeight='bold'>
                    Gustina naseljenosti
                    </Typography>
                    <Box component='div' className='u-flex-center' sx={{justifyContent: 'space-evenly', color: '#fff'}}>
                        <Box sx={{ px: '5px',backgroundColor: '#dbdbdb' }}>
                            <Typography component='span' variant='body2' align='center'>
                                5
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#b6b6b6' }}>
                            <Typography component='span' variant='body2' align='center'>
                                50
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#929292' }}>
                            <Typography component='span' variant='body2' align='center'>
                                100
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#6d6d6d' }}>
                            <Typography component='span' variant='body2' align='center'>
                                500
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#494949' }}>
                            <Typography component='span' variant='body2' align='center'>
                                1000
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#242424' }}>
                            <Typography component='span' variant='body2' align='center'>
                                5000
                            </Typography>
                        </Box>
                        <Box sx={{ px: '5px',backgroundColor: '#000' }}>
                            <Typography component='span' variant='body2' align='center'>
                                10.000
                            </Typography>
                        </Box>
                    </Box>

                    <Typography component='p' variant='body2' align='center'>
                        Populacija po km <sup>2</sup>
                    </Typography>
                </Box>
            }
        </Box >
    )
}
