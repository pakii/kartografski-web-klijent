import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { MapSettingKeys } from '../../shared/types';

export const populationDensity = new TileLayer({
    zIndex: 0,
    properties: {
        Title: 'Gustina naseljenosti',
        Type: 'Tile',
        Id: MapSettingKeys.POP_DENSITY
    },
    visible: false,
    source: new XYZ({
        url: 'https://earthquake.usgs.gov/arcgis/rest/services/eq/pager_landscan2018bin/MapServer/tile/{z}/{y}/{x}'
    }),
});
