
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';


class MapService {
    private map: Map | null;

    constructor() {
        this.map = null;
    }

    getMap(): Map {
        if (!this.map) {
            this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: fromLonLat([0, 0]),
                    zoom: 2,
                }),
            });
        }
        return this.map;
    }
}

export const mapService = new MapService();