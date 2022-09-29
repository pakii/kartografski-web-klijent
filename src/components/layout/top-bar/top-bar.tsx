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
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';


export const TopBar = (props: { searchChange?: Function }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sideBarShown = !searchParams.get(MapSettingKeys.SIDE_BAR);
    const [isOffline, setIsOffline] = React.useState<boolean | null>(!window.navigator.onLine || null);

    const theme = useTheme();
    //@ts-ignore
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSideBarState = () => {
        if (!sideBarShown) {
            searchParams.delete(MapSettingKeys.SIDE_BAR);
        }
        else {
            searchParams.set(MapSettingKeys.SIDE_BAR, '0');
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

    const offlineNotice = isOffline === false ?
        (<Box className="u-flex-center"
            p={0.5}
            sx={(t) => ({
                backgroundColor: t.palette.primary.main,
                color: 'green'
            })}>
            <OnlineIcon className='mr-1' fontSize='small' />
            <Typography variant="body2" component="div" fontSize='0.8rem'>
                Ponovo na mreži!
            </Typography>
        </Box>
        ) : isOffline === true ? (
            <Box className="u-flex-center"
                p={0.5}
                sx={(t) => ({
                    backgroundColor: t.palette.primary.main,
                    color: 'red'
                })}>
                <OfflineIcon className='mr-1' fontSize='small' />
                <Typography variant="body2" component="div" fontSize='0.8rem'>
                    Radite u oflajn režimu.{!isSmall && <br />}Neke funkcije možda neće raditi.
                </Typography>
            </Box>) : null;

    return (
        !isSmall ?
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
                    {offlineNotice}
                </Toolbar>
            </AppBar>
            :
            offlineNotice
    )
}
