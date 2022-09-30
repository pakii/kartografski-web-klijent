
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export const userLocationOlLayer = new VectorLayer({
    zIndex: Infinity,
    properties: {
        Title: 'User Location',
        readonly: true,
        Type: 'user-loaction'
    },
    source: new VectorSource()
});
