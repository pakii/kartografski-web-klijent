
import { FeatureLike } from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import CircleStyle from 'ol/style/Circle';

import FillStyle from 'ol/style/Fill';
import StrokeStyle from 'ol/style/Stroke';
import Style from 'ol/style/Style';


export const getEarthquaqesStyleFn = (highlighted = false) => {
    return (feature: FeatureLike, resolution: number) => {
        const styles = [new Style({
            image: new CircleStyle({
                radius: 6,
                stroke: new StrokeStyle({ color: '#fff', width: 2 }),
                fill: new FillStyle({
                    color: highlighted ? 'green' : 'red',
                }),
            }),
        })];
        if (feature.get('richterMagnitude') > 2.5) {
            styles.push(new Style({
                image: new CircleStyle({
                    radius: 8,
                    stroke: new StrokeStyle({ color: highlighted ? 'green' : 'red', width: 2 }),
                    fill: new FillStyle({
                        color: 'transparent',
                    }),
                }),
            }))
        }
        if (feature.get('richterMagnitude') > 4.5) {
            styles.push(new Style({
                image: new CircleStyle({
                    radius: 12,
                    stroke: new StrokeStyle({ color: highlighted ? 'green' : 'red', width: 2 }),
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
        InfoLink: 'https://www.seismo.gov.rs/Locirani/Katalog_l.htm'
    },
    source: new VectorSource(),
    style: getEarthquaqesStyleFn()
});

earthquaqesOlLayer.on('change:visible', (e) => {
    const isVisible = e.target.getVisible();
    console.log();
})