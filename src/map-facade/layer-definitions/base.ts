import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import { baseLayersHash } from '../../shared/constants';

export const baseLayer = new TileLayer({
    zIndex: 0,
    properties: {
        title: baseLayersHash.EWS.name,
        baseId: baseLayersHash.EWS.id,
        readonly: true,
        Type: 'Tile'
    },
    source: new XYZ({
        url: baseLayersHash.EWS.url
    }),
});
