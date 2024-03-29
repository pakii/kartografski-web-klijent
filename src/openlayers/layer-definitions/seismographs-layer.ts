
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { FeatureLike } from 'ol/Feature';
import FillStyle from 'ol/style/Fill';
import StrokeStyle from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import IconStyle from 'ol/style/Icon';
import TextStyle from 'ol/style/Text';
import { MapSettingKeys } from '../../shared/types';

export type SeismographProperties = {
    number: string;
    code: string;
    name: string;
    latLonAlt: string;
    seismographType: string;
    components: string;
    sensors: string;
    dataAcquisition: string;
    realTimeDataTransfer: string;
    lat: string;
    lon: string;
    altitude: string;
    type: 'seismograph';
}

export const getSeismographsStyleFunction = ({ highlighted = false }: { highlighted?: boolean }): ((feature: FeatureLike, resolution: number) => Style) => {
    return (feature: FeatureLike, resolution: number): Style => {

        return new Style({
            image: new IconStyle({
                src: 'map-icons/sesmograph.png',
                ...highlighted && { color: 'green' }
            }),
            text: resolution < 1000 ? new TextStyle({
                textAlign: 'start',
                textBaseline: 'bottom',
                font: 'bold 16px Arial',
                text: feature.get('name'),
                fill: new FillStyle({ color: '#aa3300' }),
                stroke: new StrokeStyle({ color: '#fff', width: 3 }),
                offsetX: 10,
                offsetY: -10,
                overflow: false,
            }) : undefined
        });
    }
}

export const seismographsOlLayer = new VectorLayer({
    source: new VectorSource({
        format: new GeoJSON(),
        url: 'data/seismo-stations.json'
    }),
    zIndex: 4,
    visible: false,
    properties: {
        Id: MapSettingKeys.SEISMOGRAPHS,
        Title: 'Seizmološke stanice',
        selectable: true,
        Type: 'json',
        InfoLink: 'https://www.seismo.gov.rs/Seizmoloske%20stanice_l.htm',
        LegendUrl: 'map-icons/sesmograph.png'
    },
    style: getSeismographsStyleFunction({})
})
