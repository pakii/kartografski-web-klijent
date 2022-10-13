import React from 'react'

import { Box, Paper, Slide } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { MapSettingKeys } from '../../shared/types';
import { useSearchParams } from 'react-router-dom';

export const edgeHeight = 30;
export const BottomBar = (props: React.PropsWithChildren) => {
    const containerRef = React.useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const expanded = !searchParams.get(MapSettingKeys.SIDE_BAR);

    const collapse = () => {
        searchParams.set(MapSettingKeys.SIDE_BAR, '0');
        setSearchParams(searchParams);
    }
    const expand = () => {
        searchParams.delete(MapSettingKeys.SIDE_BAR);
        setSearchParams(searchParams);
    }
    return (
        <Box
            ref={containerRef}
            sx={(theme) => ({
                position: 'fixed',
                zIndex: 1,
                bottom: 0,
                width: '100vw',
                height: expanded ? '50vh' : `${edgeHeight}px`
            })}>
            {!expanded &&
                <Paper onClick={expand}
                    sx={(theme) => ({
                        height: `${edgeHeight}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    })}>
                    <KeyboardArrowUpIcon />
                </Paper>}
            <Slide direction='up'
                in={expanded}
                container={containerRef.current}>
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '100vw',
                    height: '50vh',
                    boxSizing: 'border-box'
                }}>
                <Paper onClick={collapse}
                    sx={(theme) => ({
                        height: `${edgeHeight}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    })}>
                    <KeyboardArrowDownIcon />
                </Paper>
                    {props.children}
                </Paper>
            </Slide>
        </Box>
    );
}
