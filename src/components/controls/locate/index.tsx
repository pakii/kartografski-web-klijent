import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Fab from '@mui/material/Fab';
import MyLocationIcon from '@mui/icons-material/MyLocation';

import { mapService } from '../../../map-facade/map';

import './locate-control.scss';


export default function LocateControl() {
    const [loading, setLoading] = useState(false);
    const locate = (): void => {
        if (loading) {
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLoading(false);
                mapService.showUserLocation(pos);
            },
            (error) => {
                setLoading(false);
                toast.error(`ERROR: ${error.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    return (
        <Fab
            size='small'
            color='primary'
            title="Lociraj me"
            variant='extended'
            className={loading ? 'rotate' : ''}
            onClick={() => locate()}
            sx={{ mt: 1 }}>
            <MyLocationIcon />
        </Fab>
    )
}
