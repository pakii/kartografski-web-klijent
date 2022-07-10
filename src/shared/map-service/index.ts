
import TileLayer from 'ol/layer/Tile';
import { Feature, Map, MapBrowserEvent, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import BaseLayer from 'ol/layer/Base';
import { circular } from 'ol/geom/Polygon';
import { Point } from 'ol/geom';
import { Layer } from '../wms';
import { toast } from 'react-toastify';
import { WMS_URL } from '../../constants';


class MapService {
    private map: Map | null;
    private zIndexCounter = 0;
    private readonly layerChangeSubscriptions: { [key: string]: Function } = {};
    private mapClickSubscription: Function | null = null;
    private readonly baseLayer = new TileLayer({
        zIndex: 0,
        properties: {
            title: 'Open Street Map',
            baseId: 'OSM',
            readonly: true
        },
        source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }),
    });
    private readonly userLocationLayer = new VectorLayer({
        zIndex: Infinity,
        properties: {
            title: 'User Location',
            readonly: true
        },
        source: new VectorSource()
    })

    readonly baseLayersHash: { [key: string]: { url: string; name: string } } = {
        OSM: {
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            name: 'Open Street Map'
        },
        ESRI: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            name: 'Esri Worls Street'
        },
        IMAGERY: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            name: 'Esri World Imagery'
        },
        WATERCOLOR: {
            url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
            name: 'Stamen Watercolor Map'
        },
        DARK: {
            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            name: 'CartoDB Dark Map'
        }
    }

    constructor() {
        this.map = this.getMap();

        this.map.on('singleclick', (evt) => {
            this.mapClickSubscription && this.mapClickSubscription(evt);
        });

        this.map.getLayers().on('change:length', () => {
            Object.values(this.layerChangeSubscriptions).forEach((sub) => sub());
        })
    }

    getMap(): Map {
        if (!this.map) {
            this.map = new Map({
                layers: [
                    this.baseLayer,
                    this.userLocationLayer
                ],
                view: new View({
                    center: fromLonLat([21, 42]),
                    zoom: 6,
                }),
                controls: []
            });
        }

        return this.map;
    }

    getTopLayerFeatureInfo(evt: MapBrowserEvent<any>): Promise<string | null> {
        const viewResolution = this.getMap().getView().getResolution();
        const layers = this.getExternalLayers();
        if (!(layers && layers.length)) {
            return Promise.resolve(null)
        }
        let maxZIndex = -Infinity;
        let index = -1;

        layers.forEach((l, i) => {
            if (l.getZIndex() > maxZIndex) {
                maxZIndex = l.getZIndex();
                index = i;
            }
        });
        const url = layers[index].get('source').getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            'EPSG:3857',
            { 'INFO_FORMAT': 'text/html' }
        );
        if (url) {
            return fetch(url)
                .then((response) => response.text())
                .then((text) => {
                    return text || null
                })
                .catch((err) => {
                    toast.error('ERROR: ' + err.message || 'GetFeatureInfo request failed');
                    return null;
                });
        }
        else {
            return Promise.resolve(null);
        }
    }

    getExternalLayers(): BaseLayer[] {
        return this.getMap()
            .getLayers()
            .getArray()
            .filter((l) => !l.get('readonly'));
    }

    getUserLocateSource(): VectorSource {
        return this.getMap().getLayers().getArray().find((l) => l.get('title') === 'User Location')?.get('source');
    }

    showUserLocation(pos: GeolocationPosition) {
        const { longitude, latitude, accuracy } = pos.coords;

        const coords = [longitude, latitude];
        const accuracyCircle = circular(coords, accuracy);

        const map = this.getMap();
        const source = this.getUserLocateSource();
        source.clear(true);
        source.addFeatures([
            new Feature(
                accuracyCircle.transform('EPSG:4326', map.getView().getProjection())
            ),
            new Feature(new Point(fromLonLat(coords))),
        ]);

        map.getView().fit(source.getExtent(), {
            maxZoom: 18,
            duration: 500,
        });
    }

    addWMSLayer(layer: Layer): void {
        const source = new TileWMS({
            url: WMS_URL,
            params: { LAYERS: layer.Name, VERSION: '1.1.1' }
        });
        const olLayer = new TileLayer({
            zIndex: this.zIndexCounter + 1,
            properties: {
                ...layer
            },
            source
        });

        const map = this.getMap();
        map.addLayer(olLayer);
        this.zoomToLayer(olLayer);

        this.zIndexCounter++;
    }

    subscribeToLayerAddOrRemove(key: string, fn: Function): void {
        this.layerChangeSubscriptions[key] = fn;
    }

    unsubscribeToLayerAddOrRemove(key: string): void {
        delete this.layerChangeSubscriptions[key];
    }

    subscribeToMapClick(fn: (event: MapBrowserEvent<any>) => void): void {
        this.mapClickSubscription = fn;
    }

    clearMapClickSubscriptions(): void {
        this.mapClickSubscription = null;
    }

    zoomToLayer(layer: BaseLayer): void {
        const [ax, ay, bx, by] = layer.get('EX_GeographicBoundingBox');

        this.getMap().getView().fit([...fromLonLat([ax, ay]), ...fromLonLat([bx, by])], {
            duration: 500,
        });
    }

    changeBase(id: string): void {
        this.baseLayer.setSource(
            new XYZ({ url: this.baseLayersHash[id].url })
        );
        this.baseLayer.set('title', this.baseLayersHash[id].name);
        this.baseLayer.set('baseId', id);
    }

    getCurrentBaseId(): string {
        return this.baseLayer.get('baseId');
    }
}

export const mapService = new MapService();
export type IBaseLayer = BaseLayer;