import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const populationDensity = new TileLayer({
    zIndex: 0,
    properties: {
        Title: 'Gustina naseljenosti',
        Type: 'Tile'
    },
    visible: false,
    source: new XYZ({
        url: 'https://earthquake.usgs.gov/arcgis/rest/services/eq/pager_landscan2018bin/MapServer/tile/{z}/{y}/{x}'
    }),
});
