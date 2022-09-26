import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';

import LayerGroup from 'ol/layer/Group';
import { Collection } from 'ol';
import { WMS_URL } from '../../shared/constants';

export const wmsLayersGroup = new LayerGroup({
    properties: {
        Title: 'Seizmički hazardi',
        IsGroup: true
    }
});
const wmsLayerDefs = [
    {
        Name: 'povrsina_lokalnosti_95_region',
        Title: 'Povratni period od 95 godina',
        InfoLink: 'http://osgl.grf.bg.ac.rs/geonetwork/srv/eng/catalog.search#/metadata/6c3251a9-ab4e-4d14-9154-8520bdeab5f3',
        LegendUrl: 'http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=povrsina_lokalnosti_95_region'
    },
    {
        Name: 'povrsina_lokalnosti_475_region',
        Title: 'Povratni period od 475 godina',
        InfoLink: 'http://osgl.grf.bg.ac.rs/geonetwork/srv/eng/catalog.search#/metadata/5d0d770b-4416-421f-80e3-2535929462f5',
        LegendUrl: 'http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=povrsina_lokalnosti_475_region'
    },
    {
        Name: 'povrsina_lokalnosti_975_region',
        Title: 'Povratni period od 975 godina',
        InfoLink: 'http://osgl.grf.bg.ac.rs/geonetwork/srv/eng/catalog.search#/metadata/2812a2dd-da8e-48b1-b0d8-d27a05f4fd55',
        LegendUrl: 'http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=povrsina_lokalnosti_975_region'
    },
]
const layers = wmsLayerDefs.map((layer, i) => {
    return new TileLayer({
        properties: {
            ...layer
        },
        zIndex: 1 + i,
        visible: false,
        source: new TileWMS({
            url: WMS_URL,
            params: { LAYERS: layer.Name, VERSION: '1.1.1' }
        })
    });
})

wmsLayersGroup.setLayers(new Collection(layers));
