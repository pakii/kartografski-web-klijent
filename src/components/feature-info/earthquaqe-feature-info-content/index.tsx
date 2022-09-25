import { EarthquaqeProperties } from '../../../shared/usgs'
import { toLonLat } from 'ol/proj'
import Launch from '@mui/icons-material/Launch';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box/Box'

export const EarthquaqeFeatureInfo = ({ data }: { data: EarthquaqeProperties }) => {
    const [X, Y, Z] = data.geometry.getCoordinates();
    const [lon, lat] = toLonLat([X, Y]);
    return (
        <Box component='div'>
            <Typography component='div' variant='body2'>
                Vreme: <b>{new Date(data.time).toLocaleString()}</b>
            </Typography>
            <Typography component='div' variant='body2'>
                Dubina: <b>{Z} km</b>
            </Typography>
            <Typography component='div' variant='body2'>
                Lokacija: <b>{lon.toFixed(2)}, {lat.toFixed(2)}</b>
            </Typography>
            <Link href={data.url} target='_blank' >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component='div' variant='body2' mr={1}>
                        Saznaj više
                    </Typography>
                    <Launch fontSize='small' />
                </Box>
            </Link>
        </Box>
    )
}
