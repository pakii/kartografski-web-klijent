import React, { useState } from 'react'
import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';

import { mapService } from '../../shared/map-service';

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
        <button
            title="Locate me"
            className={loading ? 'rotate' : ''}
            onClick={() => locate()}>
            <FontAwesomeIcon icon={faLocationCrosshairs} fontSize={'1.5em'}/>
        </button>
    )
}
