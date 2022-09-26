import { PropsWithChildren } from 'react'

import Drawer from '@mui/material/Drawer/Drawer';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { MapSettingKeys } from '../../../shared/types';
import Box from '@mui/material/Box/Box';
import { useSearchParams } from 'react-router-dom';

export const sideBarWidth = 320;

export const SideBar = (props: PropsWithChildren) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleDrawerClose = (): void => {
        searchParams.set(MapSettingKeys.SIDE_BAR, '0');
        setSearchParams(searchParams);
    }

    const sideBarShown = !searchParams.get(MapSettingKeys.SIDE_BAR);
    return (
        <Drawer
            sx={(theme) => ({
                width: sideBarWidth,
                position: 'fixed',
                zIndex: 1,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: sideBarWidth,
                    boxSizing: 'border-box',
                },
            })}
            variant="persistent"
            anchor="left"
            open={sideBarShown}
        >
            <Box sx={(theme) => ({
                width: '100%',
                marginTop: `${theme.mixins.toolbar.height}px`,
                height: `calc(100vh - ${theme.mixins.toolbar.height}px)`,
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            })}>
                <Box
                    onClick={handleDrawerClose}
                    className='u-pointer'
                    sx={(theme) => ({
                        position: 'absolute',
                        top: theme.mixins.toolbar.height,
                        right: 0
                    })}>
                    <KeyboardArrowLeftIcon />
                </Box>
                {props.children}
            </Box>
        </Drawer>
    );
}
