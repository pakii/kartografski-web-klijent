export const WMS_URL = 'http://osgl.grf.bg.ac.rs/geoserver/osgl_3/wms';

export type BaseMapId = 'OSM' | 'EWS' | 'EWI' | 'SWC' | 'CDM';
export type BaseMapSpec = { id: BaseMapId, url: string; name: string, imageUrl: string };
export const baseLayersHash: Record<BaseMapId, BaseMapSpec> = {
    OSM: {
        id: 'OSM',
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        name: 'Open Street Map',
        imageUrl: 'base-maps/osm.png'
    },
    EWS: {
        id: 'EWS',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        name: 'Esri Worls Street',
        imageUrl: 'base-maps/esri-world-street.png'
    },
    EWI: {
        id: 'EWI',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        name: 'Esri World Imagery',
        imageUrl: 'base-maps/imagery.png'
    },
    SWC: {
        id: 'SWC',
        url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
        name: 'Stamen Watercolor Map',
        imageUrl: 'base-maps/watercolor.png'
    },
    CDM: {
        id: 'CDM',
        url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        name: 'CartoDB Dark Map',
        imageUrl: 'base-maps/dark.png'
    }
}

export type EarthquaqeSourceId = 'USGS' | 'RSZ';
export const earthquaqeSourcesHash: Record<EarthquaqeSourceId, { id: EarthquaqeSourceId; link: string }> = {
    USGS: { id: 'USGS', link: 'https://earthquake.usgs.gov' },
    RSZ: { id: 'RSZ', link: 'https://www.seismo.gov.rs' }
}
