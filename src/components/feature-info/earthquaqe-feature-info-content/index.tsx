import { EarthquaqeProperties } from '../../../shared/seismo';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box/Box';

export const EarthquaqeFeatureInfo = ({ data }: { data: EarthquaqeProperties }) => {
    return (
        <Box component='div'>
            <Typography component='div' variant='body2'>
                Magnituda: <b>{data.richterMagnitude}</b>
            </Typography>
            {
                data.mercalliIntensity && <Typography component='div' variant='body2'>
                    Intenzitet: <b>{data.mercalliIntensity}</b>
                </Typography>
            }
            <Typography component='div' variant='body2'>
                Vreme: <b>{new Date(data.date).toLocaleString()}</b>
            </Typography>
            <Typography component='div' variant='body2'>
                Lokacija: <b>{data.lon}, {data.lat}</b>
            </Typography>
            <Typography component='div' variant='body2'>
                Dubina hipocentra: <b>{data.hypocenterDepthKm} km</b>
            </Typography>
        </Box>
    )
}
