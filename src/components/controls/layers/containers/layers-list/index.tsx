import React from 'react'

import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Box from '@mui/material/Box/Box';

import { mapService, IBaseLayer, ILayerGroup } from '../../../../../map-facade/map';

export const LayersList = () => {

    const [layers, setLayers] = React.useState<(IBaseLayer | ILayerGroup)[]>([]);
    React.useEffect(() => {
        updateLayersState();
    }, []);

    const updateLayersState = () => {
        setLayers(mapService.getExternalLayers().sort((p, n) => n.getZIndex() - p.getZIndex()));
    }

    const toggleLayer = (layer: IBaseLayer): void => {
        layer.setVisible(!layer.getVisible());
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
                                </ListItem>
                            ))
                        }
                    </Box>
                ))
            }
        </List>
    )
}
