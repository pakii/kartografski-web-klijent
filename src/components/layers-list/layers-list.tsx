import React from 'react'

import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Box from '@mui/material/Box/Box';

import { mapService, IBaseLayer, ILayerGroup } from '../../map-facade/map-service';
import { InfoLink } from '../../widgets/info-link/info-link';
import { useSearchParams } from 'react-router-dom';
import { MapSettingKeys } from '../../shared/types';

export const LayersList = () => {

    const [layers, setLayers] = React.useState<(IBaseLayer | ILayerGroup)[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    React.useEffect(() => {
        updateLayersState();
    }, []);

    const updateLayersState = () => {
        setLayers(mapService.getExternalLayers().sort((p, n) => n.getZIndex() - p.getZIndex()));
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
            case MapSettingKeys.HAZARDS_95:
                if (nextValue) {
                    searchParams.set(MapSettingKeys.HAZARDS_95, '1')
                } else {
                    searchParams.delete(MapSettingKeys.HAZARDS_95)
                }
                break;
            case MapSettingKeys.HAZARDS_475:
                if (nextValue) {
                    searchParams.set(MapSettingKeys.HAZARDS_475, '1')
                } else {
                    searchParams.delete(MapSettingKeys.HAZARDS_475)
                }
                break;
            case MapSettingKeys.HAZARDS_975:
                if (nextValue) {
                    searchParams.set(MapSettingKeys.HAZARDS_975, '1')
                } else {
                    searchParams.delete(MapSettingKeys.HAZARDS_975)
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
                    searchParams.set(MapSettingKeys.SEISMOGRAMS, '1')
                    
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
                            layer.get('IsGroup') && layer.getLayersArray().map((layer) => (
                                <ListItem key={`${i}__${layer.get('Title')}`} sx={{ pl: 4, py: 0 }}>
                                    <Checkbox
                                        size='small'
                                        checked={layer.getVisible()}
                                        onChange={() => toggleLayer(layer)}
                                        inputProps={{ 'aria-label': layer.get('Title') }}
                                    />
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
