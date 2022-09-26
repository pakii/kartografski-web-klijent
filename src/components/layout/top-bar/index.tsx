import React from 'react';

import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box/Box';

import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import OfflineIcon from '@mui/icons-material/SignalWifiConnectedNoInternet4';
import OnlineIcon from '@mui/icons-material/SignalWifi4Bar';
import { useSearchParams } from 'react-router-dom';
import { MapSettingKeys } from '../../../shared/types';


export const TopBar = (props: { searchChange?: Function }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sideBarShown = searchParams.get(MapSettingKeys.SIDE_BAR);
    const [isOffline, setIsOffline] = React.useState<boolean | null>(!window.navigator.onLine || null);

    const handleSideBarState = () => {
        if (!sideBarShown) {
            searchParams.set(MapSettingKeys.SIDE_BAR, '1');
        }
        else {
            searchParams.delete(MapSettingKeys.SIDE_BAR);
        }
        setSearchParams(searchParams)
    }

    React.useEffect(() => {
        window.addEventListener('online', () => setIsOffline(false));
        window.addEventListener('offline', () => setIsOffline(true));

        return () => {
            window.removeEventListener('online', () => { });
            window.removeEventListener('offline', () => { });
        }
    }, []);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (isOffline === false) {
                setIsOffline(null);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [isOffline]);

    return (
        <AppBar position="fixed"
            sx={(theme) => ({
                zIndex: theme.zIndex.drawer + 1
            })}>
            <Toolbar className='u-flex-center u-jc-between'>
                <Box className="u-flex-center">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleSideBarState}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        <ManageSearchIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Seizmološka karta
                    </Typography>
                </Box>
                {isOffline && (
                    <Box sx={{ color: 'red', maxWidth: '300px' }}
                        className="u-flex-center">
                        <OfflineIcon className='mr-1' />
                        <Typography variant="body2" component="div">
                            Radite u oflajn režimu.<br /> Neke funkcije možda neće raditi.
                        </Typography>
                    </Box>
                )}
                {isOffline === false && (
                    <Box sx={{ color: 'green', maxWidth: '300px' }}
                        className="u-flex-center">
                        <OnlineIcon className='mr-1' />
                        <Typography variant="body2" component="div">
                            Ponovo na mreži!
                        </Typography>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}
