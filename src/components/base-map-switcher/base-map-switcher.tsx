import React, { useEffect } from 'react'

import { Box, ClickAwayListener, Slide, useMediaQuery } from '@mui/material';

import { BaseMapOption } from './base-map-option/base-map-option';
import { mapService } from '../../openlayers/map-service/map-service';
import { baseLayersHash, BaseMapId, BaseMapSpec } from '../../shared/constants';
import { MapSettingKeys } from '../../shared/types';
import { sideBarWidth } from '../../layout';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { edgeHeight } from '../../layout/bottom-bar/swipeble-edge';


export const BaseSwitcher = () => {
    const containerRef = React.useRef(null);
    const baseMapOptions = Object.values(baseLayersHash);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentBaseMapId = (searchParams.get(MapSettingKeys.BASE_MAP) || mapService.getCurrentBaseMapId()) as BaseMapId;
    const [currentBaseMap, setCurrentBaseMap] = React.useState(baseLayersHash[currentBaseMapId]);
    const [expanded, setExpanded] = React.useState(false);

    const theme = useTheme();
    //@ts-ignore
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));


    useEffect(() => {
        const currentBaseMapId = (searchParams.get(MapSettingKeys.BASE_MAP) || mapService.getCurrentBaseMapId()) as BaseMapId;
        changeBaseMap(baseLayersHash[currentBaseMapId]);
    }, [])

    const changeBaseMap = (mapSpec: BaseMapSpec): void => {
        if (mapSpec.id === 'EWS') {
            searchParams.delete(MapSettingKeys.BASE_MAP)
        }
        else {
            searchParams.set(MapSettingKeys.BASE_MAP, mapSpec.id)
        }
        setSearchParams(searchParams)
        const currentBaseMapId = mapService.getCurrentBaseMapId();
        if (mapSpec.id === currentBaseMapId) {
            return;
        }
        setCurrentBaseMap(mapSpec);
        mapService.changeBaseMap(mapSpec.id);
    }

    const shouldMoveLeft = !isSmall && !searchParams.get(MapSettingKeys.SIDE_BAR);
    return (
        <ClickAwayListener onClickAway={() => setExpanded(false)}>
            <Box
                ref={containerRef}
                sx={(theme) => ({
                    position: 'absolute',
                    zIndex: 0,
                    bottom: {
                        xs: edgeHeight,
                        sm: 0
                    },
                    ...shouldMoveLeft && { left: sideBarWidth },
                    display: 'flex',
                    maxWidth: '100vw'
                })}>
                {!expanded &&
                    <BaseMapOption item={currentBaseMap}
                        selected={false}
                        clicked={() => setExpanded(!expanded)} />}
                <Slide direction='right'
                    in={expanded}
                    container={containerRef.current}>
                    <Box sx={{
                        display: 'flex',
                        maxWidth: '100vw',
                        overflowX: 'auto'
                    }}>
                        {baseMapOptions.map((item) => (
                            <BaseMapOption item={item}
                                key={item.id}
                                selected={item.id === currentBaseMap.id}
                                clicked={() => changeBaseMap(item)} />
                        ))}
                    </Box>
                </Slide>
            </Box>
        </ClickAwayListener >
    )
}
