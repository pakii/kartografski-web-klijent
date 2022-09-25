import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box/Box'
import React, { useState } from 'react'
import { SeismographProperties } from '../../../map-facade/layer-definitions/seismographs'
import FormControl from '@mui/material/FormControl/FormControl'
import Select from '@mui/material/Select/Select'
import MenuItem from '@mui/material/MenuItem/MenuItem'
import InputLabel from '@mui/material/InputLabel/InputLabel'
import Skeleton from '@mui/material/Skeleton/Skeleton'

export const SeismogramFeatureInfo = ({ data }: { data: SeismographProperties }) => {
    const [daysAgo, setSeismogramDaysAgo] = useState('active');
    const [loading, setLoading] = useState(true);
    return (
        <Box component='div'>
            <FormControl sx={{ m: 1, minWidth: 120, display: 'block' }} size="small">
                <InputLabel>Seizmogram za</InputLabel>
                <Select
                    value={daysAgo}
                    onChange={(e) => { setSeismogramDaysAgo(e.target.value); setLoading(true) }}
                    inputProps={{ 'aria-label': 'Seizmogram za...' }}
                    label="Seizmogram za"
                    sx={{ display: 'block' }}>
                    <MenuItem aria-label='Danas' value={'active'}>Današnji dan</MenuItem>
                    <MenuItem aria-label='1 dan ranije' value={'1'}>1 dan ranije</MenuItem>
                    <MenuItem aria-label='2 dana ranije' value={'2'}>2 dana ranije</MenuItem>
                    <MenuItem aria-label='3 dana ranije' value={'3'}>3 dana ranije</MenuItem>
                    <MenuItem aria-label='4 dana ranije' value={'4'}>4 dana ranije</MenuItem>
                    <MenuItem aria-label='5 dana ranije' value={'5'}>5 dana ranije</MenuItem>
                    <MenuItem aria-label='6 dana ranije' value={'6'}>6 dana ranije</MenuItem>
                    <MenuItem aria-label='7 dana ranije' value={'7'}>7 dana ranije</MenuItem>
                    <MenuItem aria-label='8 dana ranije' value={'8'}>8 dana ranije</MenuItem>
                    <MenuItem aria-label='9 dana ranije' value={'9'}>9 dana ranije</MenuItem>
                </Select>
            </FormControl>
            <Box sx={{ maxWidth: '25em' }}>
                <img src={`https://www.seismo.gov.rs/seismograms${!!(+daysAgo) ? '1' : ''}/${data.code}.${daysAgo}.gif`}
                    onLoad={() => { setLoading(false) }}
                    style={{ display: loading ? 'none' : 'block' }}
                    alt={`Seizmogram ${data.name}`} />
                <Skeleton variant="rectangular" width={'25em'} height={305} sx={{ display: loading ? 'block' : 'none' }} />
            </Box>

            <Typography component='div' variant='body2'>
                Kod stanice: <b>{data.code}</b>
            </Typography>
            <Typography component='div' variant='body2'>
                Tip uređaja: <b>{data.seismographType}</b>
            </Typography>
            <Typography component='div' variant='body2'>
                Komponente: <b>{data.components}</b>
            </Typography>
            <Typography component='div' variant='body2'>
                Senzori: <b>{data.sensors}</b>
            </Typography>
            <Typography component='div' variant='body2'>
                Akvizicija podataka: <b>{data.dataAcquisition}</b>
            </Typography>
            <Typography component='div' variant='body2'>
                Prenos podataka: <b>{data.realTimeDataTransfer}</b>
            </Typography>
        </Box>
    )
}
