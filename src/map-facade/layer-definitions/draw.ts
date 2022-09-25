
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export const drawOlSource = new VectorSource();
export const drawOlLayer = new VectorLayer({
    zIndex: Infinity,
    properties: {
        Title: 'Temporary draw',
        readonly: true,
        Type: 'draw'
    },
    source: drawOlSource
});
