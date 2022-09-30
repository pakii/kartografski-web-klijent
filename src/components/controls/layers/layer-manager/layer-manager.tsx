import React from 'react'

import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Box from '@mui/material/Box/Box';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpacityIcon from '@mui/icons-material/Opacity';

import { mapService, IBaseLayer, ILayerGroup } from '../../../../openlayers/map-service/map-service';
import { InfoLink } from '../../../../widgets/info-link/info-link';
import { useSearchParams } from 'react-router-dom';
import { MapSettingKeys } from '../../../../shared/types';
import { Popover, Slider } from '@mui/material';
import { hazardLayersGroup } from '../../../../openlayers';

export default function Opacity(props: { layer: IBaseLayer, setOpacity: Function }) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [opacity, setLocalOpacity] = React.useState(props.layer.getOpacity());
    const ref = React.useRef(null);

    const handleClose = () => {
        setAnchorEl(null);
        props.setOpacity(opacity);
    };

    const open = Boolean(anchorEl);
    const id = open ? props.layer.get('Id') : undefined;

    return (
        <div>
            <OpacityIcon ref={ref} className='u-pointer' onClick={() => setAnchorEl(ref.current)} />

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ width: 150, py: 1, px: 2 }}>
                    <Slider
                        aria-label="layer opacity"
                        value={opacity}
                        step={0.1}
                        onChange={(e, val) => setLocalOpacity(val as number)}
                        min={0}
                        max={1}
                        marks
                    />
                </Box>
            </Popover>
        </div>
    );
}

export const LayerManager = () => {

    const [layers, setLayers] = React.useState<(IBaseLayer | ILayerGroup)[]>([]);
    const [hazardsLayers, setHazardsLayers] = React.useState<IBaseLayer[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    React.useEffect(() => {
        updateLayersState();
        updateHazardsLayersState();
    }, []);

    const updateLayersState = () => {
        setLayers(mapService.getExternalLayers().sort((p, n) => n.getZIndex() - p.getZIndex()));
    }

    const updateHazardsLayersState = () => {
        setHazardsLayers(
            hazardLayersGroup.getLayersArray()
                .sort((p, n) => n.getZIndex() - p.getZIndex())
        );
    }

    const toggleLayer = (layer: IBaseLayer): void => {
        const nextValue = !layer.getVisible();
        layer.setVisible(nextValue);
        switch (layer.get('Id')) {
            case MapSettingKeys.EARTHQUAQES_LAYER:
                if (!nextValue) {
                    searchParams.set(MapSettingKeys.EARTHQUAQES_LAYER, '0')
                    searchParams.delete(MapSettingKeys.EARTHQUAQES_SELECTED_ID)
                } else {
                    searchParams.delete(MapSettingKeys.EARTHQUAQES_LAYER)
                }
                break;
            case MapSettingKeys.I_HAZARDS_95:
                if (nextValue) {
                    searchParams.set(MapSettingKeys.I_HAZARDS_95, '1')
                } else {
                    searchParams.delete(MapSettingKeys.I_HAZARDS_95)
                }
                break;
            case MapSettingKeys.I_HAZARDS_475:
                if (nextValue) {
                    searchParams.set(MapSettingKeys.I_HAZARDS_475, '1')
                } else {
                    searchParams.delete(MapSettingKeys.I_HAZARDS_475)
                }
                break;
            case MapSettingKeys.I_HAZARDS_975:
                if (nextValue) {
                    searchParams.set(MapSettingKeys.I_HAZARDS_975, '1')
                } else {
                    searchParams.delete(MapSettingKeys.I_HAZARDS_975)
                }
                break;
            case MapSettingKeys.POP_DENSITY:
                if (nextValue) {
                    searchParams.set(MapSettingKeys.POP_DENSITY, '1')
                } else {
                    searchParams.delete(MapSettingKeys.POP_DENSITY)
                }
                break;
            case MapSettingKeys.SEISMOGRAMS:
                if (nextValue) {
                    searchParams.set(MapSettingKeys.SEISMOGRAMS, '1');
                    searchParams.set(MapSettingKeys.CENTER, JSON.stringify([2309877.637116859, 5227657.470871826]));
                } else {
                    searchParams.delete(MapSettingKeys.SEISMOGRAMS)
                }
                break;
            default:
                break;
        }
        setSearchParams(searchParams);
        updateLayersState();
    }

    const moveLayerUp = (index: number): void => {
        if (index === 0) {
            return;
        }

        const currentZIndex = hazardsLayers[index].getZIndex();
        hazardsLayers[index - 1].setZIndex(currentZIndex);
        hazardsLayers[index].setZIndex(currentZIndex + 1);
        updateHazardsLayersState();
    }

    const moveLayerDown = (index: number): void => {
        if (index === hazardsLayers.length - 1) {
            return;
        }

        const currentZIndex = hazardsLayers[index].getZIndex();
        hazardsLayers[index + 1]?.setZIndex(currentZIndex);
        hazardsLayers[index].setZIndex(currentZIndex - 1);
        updateHazardsLayersState();
    }
    return (
        <List>
            {
                layers.map((layer: IBaseLayer | ILayerGroup, i) => (
                    <Box key={`${i}__${layer.get('Title')}`}>
                        <ListItem key={`${i}__${layer.get('Title')}`} sx={{ py: 0 }}>
                            <Checkbox
                                size='small'
                                disabled={layer.get('IsGroup')}
                                className={layer.get('IsGroup') ? 'u-invisible' : ''}
                                checked={layer.getVisible()}
                                onChange={() => toggleLayer(layer)}
                                inputProps={{ 'aria-label': layer.get('Title') }}
                            />
                            <ListItemText>
                                {layer.get('Title')}
                            </ListItemText>
                            {layer.get('InfoLink') && <InfoLink link={layer.get('InfoLink')} />}
                        </ListItem>
                        {
                            layer.get('IsGroup') && hazardsLayers.map((layer, hi) => (
                                <ListItem key={`${i}__${layer.get('Title')}`} sx={{ pl: 4, py: 0 }}>
                                    <Checkbox
                                        size='small'
                                        checked={layer.getVisible()}
                                        onChange={() => toggleLayer(layer)}
                                        inputProps={{ 'aria-label': layer.get('Title') }}
                                    />

                                    <Opacity layer={layer} setOpacity={(o: number) => { layer.setOpacity(o); updateHazardsLayersState() }} />
                                    <Box className='u-flex-column'>
                                        <KeyboardArrowUpIcon
                                            className={`u-pointer ${hi === 0 ? 'u-fade' : ''}`}
                                            fontSize='small'
                                            onClick={() => moveLayerUp(hi)} />
                                        <KeyboardArrowDownIcon
                                            className={`u-pointer ${hi === hazardsLayers.length - 1 ? 'u-fade' : ''}`}
                                            fontSize='small'
                                            onClick={() => moveLayerDown(hi)} />
                                    </Box>
                                    <ListItemText>
                                        {layer.get('Title')}
                                    </ListItemText>
                                    {layer.get('InfoLink') && <InfoLink link={layer.get('InfoLink')} />}
                                </ListItem>
                            ))
                        }
                    </Box>
                ))
            }
        </List>
    )
}
