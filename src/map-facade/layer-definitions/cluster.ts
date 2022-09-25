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
import IconStyle from 'ol/style/Icon';

export type ClusterJSONParams = {
    url: string;
    iconUrl?: string;
    properties?: { [key: string]: any };
    distance?: number;
    minDistance?: number;
    maxShowTextResolution?: number;
    clusterFillColor?: string | ((feature: FeatureLike) => string);
    dataFillColor?: string | ((feature: FeatureLike) => string);
    dataLabelText?: string | ((feature: FeatureLike) => string);
    dataLabelFillColor?: string;
    zIndex?: number;
    useFirstDataLabelForCluster?: boolean;
}
export const makeClusterJSON = ({
    url,
    iconUrl,
    properties = {},
    distance = 30,
    minDistance = 20,
    maxShowTextResolution = 1000,
    clusterFillColor = 'grey',
    dataFillColor,
    dataLabelText,
    dataLabelFillColor,
    zIndex,
    useFirstDataLabelForCluster
}: ClusterJSONParams): VectorLayer<ClusterSource> => {

    const source = new VectorSource({
        format: new GeoJSON(),
        url
    });

    const clusterSource = new ClusterSource({
        distance,
        minDistance,
        source,
    });

    const getText = (feature: FeatureLike, size: number, resolution: number): TextStyle | undefined => {
        if (size === 1 && dataLabelText) {
            return resolution < maxShowTextResolution ? new TextStyle({
                textAlign: 'start',
                textBaseline: 'bottom',
                font: 'bold 16px Arial',
                text: resolveFnValue(dataLabelText, feature),
                fill: new FillStyle({ color: dataLabelFillColor || (dataFillColor && resolveFnValue(dataFillColor, feature)) || 'black' }),
                stroke: new StrokeStyle({ color: '#fff', width: 3 }),
                offsetX: 10,
                offsetY: -10,
                overflow: false,
            }) : undefined
        }
        return new TextStyle({
            text: size.toString(),
            font: 'bold 10px Arial',
            fill: new FillStyle({
                color: '#fff',
            }),
        })
    }

    const resolveFnValue = (
        value: string | ((feature: FeatureLike) => string),
        feature: FeatureLike
    ) => {
        let resolvedValue;
        if (typeof value === 'string') {
            resolvedValue = value;
        } else {
            resolvedValue = value(feature)
        }
        return resolvedValue;
    }

    const getImage = (feature: FeatureLike, size: number) => {
        if (size === 1 && iconUrl) {
            return new IconStyle({
                src: iconUrl,
                ...dataFillColor && { color: resolveFnValue(dataFillColor, feature) }
            })
        }
        return new CircleStyle({
            radius: 12,
            stroke: new StrokeStyle({ color: '#fff', width: 3 }),
            fill: new FillStyle({
                color: resolveFnValue(clusterFillColor, feature),
            }),
        })
    }

    const styleCache: { [key: number]: Style } = {};
    const clusters = new VectorLayer({
        source: clusterSource,
        ...zIndex && { zIndex },
        properties: {
            ...properties
        },
        style: (feature, res) => {
            const size = feature.get('features').length;
            let style = size === 1 ? null : styleCache[size];
            if (!style) {
                style = new Style({
                    image: getImage(feature, size),
                    text: getText(feature, size, res),
                });
                styleCache[size] = style;
            }
            return [style, new Style({
                text: ((feature, size, res): TextStyle | undefined => {
                    return size > 1 && dataLabelText && res < maxShowTextResolution ? new TextStyle({
                        textAlign: 'start',
                        textBaseline: 'bottom',
                        font: 'bold 16px Arial',
                        text: resolveFnValue(dataLabelText, feature),
                        fill: new FillStyle({ color: resolveFnValue(clusterFillColor, feature) }),
                        stroke: new StrokeStyle({ color: '#fff', width: 3 }),
                        offsetX: 10,
                        offsetY: -10,
                        overflow: false,
                    }) : undefined;
                })(feature, size, res)
            })];
        },
    });
    return clusters;
}
