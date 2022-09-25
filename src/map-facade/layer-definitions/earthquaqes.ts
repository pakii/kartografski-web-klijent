
import { FeatureLike } from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import CircleStyle from 'ol/style/Circle';

import FillStyle from 'ol/style/Fill';
import StrokeStyle from 'ol/style/Stroke';
import Style from 'ol/style/Style';


export const getEarthquaqesStyleFn = (highlighted = false) => {
    return (feature: FeatureLike, resolution: number) => {
        const baseStyle = new Style({
            image: new CircleStyle({
                radius: 8,
                stroke: new StrokeStyle({ color: '#fff', width: 2 }),
                fill: new FillStyle({
                    color: highlighted ? 'red' : 'blue',
                }),
            }),
        });
        const styles = [baseStyle]
        if (highlighted) {
            styles.push(new Style({
                image: new CircleStyle({
                    radius: 12,
                    stroke: new StrokeStyle({ color: 'red', width: 2 }),
                    fill: new FillStyle({
                        color: 'transparent',
                    }),
                }),
            }))
        }
        return styles;
    }
}
export const earthquaqesOlLayer = new VectorLayer({
    zIndex: Infinity,
    properties: {
        Title: 'Zemljotresi',
        selectable: true,
        Type: 'json'
    },
    source: new VectorSource(),
    style: getEarthquaqesStyleFn()
});
