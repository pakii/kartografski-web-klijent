import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';

import LayerGroup from 'ol/layer/Group';
import { Collection } from 'ol';
import { WMS_URL } from '../../shared/constants';
import { MapSettingKeys } from '../../shared/types';

export const hazardLayersGroup = new LayerGroup({
    properties: {
        Title: 'Seizmički hazardi po parametru inteziteta',
        IsGroup: true
    }
});
const wmsLayerDefs = [
    {
        Id: MapSettingKeys.I_HAZARDS_95,
        isWms: true,
        Name: 'povrsina_lokalnosti_95_region',
        Title: 'Povratni period od 95 godina',
        InfoLink: 'http://osgl.grf.bg.ac.rs/geonetwork/srv/eng/catalog.search#/metadata/6c3251a9-ab4e-4d14-9154-8520bdeab5f3',
        LegendUrl: 'http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=povrsina_lokalnosti_95_region'
    },
    {
        Id: MapSettingKeys.I_HAZARDS_475,
        isWms: true,
        Name: 'povrsina_lokalnosti_475_region',
        Title: 'Povratni period od 475 godina',
        InfoLink: 'http://osgl.grf.bg.ac.rs/geonetwork/srv/eng/catalog.search#/metadata/5d0d770b-4416-421f-80e3-2535929462f5',
        LegendUrl: 'http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=povrsina_lokalnosti_475_region'
    },
    {
        isWms: true,
        Id: MapSettingKeys.I_HAZARDS_975,
        Name: 'povrsina_lokalnosti_975_region',
        Title: 'Povratni period od 975 godina',
        InfoLink: 'http://osgl.grf.bg.ac.rs/geonetwork/srv/eng/catalog.search#/metadata/2812a2dd-da8e-48b1-b0d8-d27a05f4fd55',
        LegendUrl: 'http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=povrsina_lokalnosti_975_region'
    },
]

export const intensityHazard95 = new TileLayer({
    properties: {
        ...wmsLayerDefs[0]
    },
    zIndex: 2,
    visible: false,
    source: new TileWMS({
        url: WMS_URL,
        params: { LAYERS: wmsLayerDefs[0].Name, VERSION: '1.1.1' }
    })
});
export const intensityHazard475 = new TileLayer({
    properties: {
        ...wmsLayerDefs[1]
    },
    zIndex: 3,
    visible: false,
    source: new TileWMS({
        url: WMS_URL,
        params: { LAYERS: wmsLayerDefs[1].Name, VERSION: '1.1.1' }
    })
});
export const intensityHazard975 = new TileLayer({
    properties: {
        ...wmsLayerDefs[2]
    },
    zIndex: 1,
    visible: false,
    source: new TileWMS({
        url: WMS_URL,
        params: { LAYERS: wmsLayerDefs[2].Name, VERSION: '1.1.1' }
    })
});
const layers = [intensityHazard95, intensityHazard475, intensityHazard975];

hazardLayersGroup.setLayers(new Collection(layers));
