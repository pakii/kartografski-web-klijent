import { FeatureLike } from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import CircleStyle from 'ol/style/Circle';
import GeoJSON from 'ol/format/GeoJSON';

import FillStyle from 'ol/style/Fill';
import StrokeStyle from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import TextStyle from 'ol/style/Text';

const getColor = (type: string): string => {
    switch (type) {
        case 'ETNA':
            return 'indianred'
        case 'EPI':
            return 'steelblue'
        case 'SSA2':
            return 'mediumseagreen'
        default:
            return 'grey';
    }
}

export type AccelerographProperties = {
    number: string;
    code: string;
    name: string;
    lat: string;
    lon: string;
    altitude: string;
    accelerograph: 'ETNA' | 'EPI' | 'SSA2';
    groundType: string;
    realTimeDataTransfer: string;
    type: 'accelerograph'
}
const source = new VectorSource({
    format: new GeoJSON(),
    url: '/data/acc.json',
});

const clusterSource = new ClusterSource({
    distance: 2,
    minDistance: 100,
    source
});

export const getAccStyleFn = (highlighted = false) => {
    return (feature: FeatureLike, resolution: number) => {
        const clusterFeatures = feature.get('features')

        return clusterFeatures.map((feature: FeatureLike, i: number): Style => {
            let text: TextStyle | undefined = new TextStyle({
                textAlign: 'start',
                textBaseline: 'bottom',
                font: 'bold 16px Arial',
                text: feature.get('name'),
                fill: new FillStyle({ color: '#aa3300' }),
                stroke: new StrokeStyle({ color: '#fff', width: 3 }),
                offsetX: 10,
                offsetY: -10,
                overflow: false,
            });
            if (clusterFeatures.length === 1) {
                text.setFill(new FillStyle({
                    color: getColor(feature.get('accelerograph'))
                }));
                text.setText(feature.get('name') + ' - ' + feature.get('accelerograph'))
            }
            if (resolution > 300) {
                text = undefined;
            }
            return new Style({
                image: new CircleStyle({
                    radius: 8,
                    displacement: [i * 10, 0],
                    stroke: new StrokeStyle(
                        highlighted ? { color: 'green', width: 4 } : { color: '#fff', width: 2 }
                    ),
                    fill: new FillStyle({
                        color: getColor(feature.get('accelerograph')),
                    }),
                }),
                text
            });
        })
    }
}
export const accelerographsOlLayer = new VectorLayer({
    source: clusterSource,
    zIndex: Infinity,
    visible: false,
    properties: {
        Title: 'Akcelerografska mreža Srbije',
        Type: 'json',
        InfoLink: 'https://www.seismo.gov.rs/Akcelerometrijske%20stanice_l.htm'
    },
    style: getAccStyleFn(),
});

