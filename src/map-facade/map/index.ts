
import TileLayer from 'ol/layer/Tile';
import { Feature, Map, MapBrowserEvent, View } from 'ol';
import { fromLonLat, toLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import ScaleLine from 'ol/control/ScaleLine';
import {
    Select,
    defaults as defaultInteractions,
    Draw,
} from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import BaseLayer from 'ol/layer/Base';
import { circular } from 'ol/geom/Polygon';
import { Circle, Point } from 'ol/geom';
import { Layer } from '../wms';
import { toast } from 'react-toastify';
import { baseLayersHash, BaseMapId } from '../../shared/constants';
import { baseLayer as baseOlLayer } from '../layer-definitions/base';
import { userLocationOlLayer } from '../layer-definitions/user-location';
import { getSeismographsStyleFn, seismographsOlLayer } from '../layer-definitions/seismographs';
import { accelerographsOlLayer } from '../layer-definitions/accelerographs';
import { SelectEvent } from 'ol/interaction/Select';
import { FeatureLike } from 'ol/Feature';
import { earthquaqesOlLayer, getEarthquaqesStyleFn } from '../layer-definitions/earthquaqes';
import GeoJSON from 'ol/format/GeoJSON';
import { createPointFeatureFromLonLat } from '../utils/create-point-feature';
import { GeoJSONPoint } from '../../shared/models';
import { drawOlLayer, drawOlSource, populationDensity, wmsLayersGroup } from '../layer-definitions';
import { createBox, DrawEvent } from 'ol/interaction/Draw';
import { MapDrawEvent, RectangleDrawEvent } from './types';
import Polygon from 'ol/geom/Polygon';
import LayerGroup from 'ol/layer/Group';

class MapService {
    private map: Map | null;
    private zIndexCounter = 0;
    private readonly layerChangeSubscriptions: { [key: string]: Function } = {};
    private readonly mapClickSubscriptions: { [key: string]: Function } = {};
    private readonly mapDrawSubscriptions: { [key: string]: (event: MapDrawEvent) => void } = {};
    private readonly vectorFeatureClickSubscriptions: { [key: string]: Function } = {};
    private readonly baseLayer = baseOlLayer;
    private readonly populationDensityLayer = populationDensity;
    private readonly userLocationLayer = userLocationOlLayer;
    private readonly earthquaqesLayer = earthquaqesOlLayer;
    private readonly seismographsLayer = seismographsOlLayer;
    private readonly accelerographsLayer = accelerographsOlLayer;
    private readonly drawLayer = drawOlLayer;
    private readonly selectableLayers = [this.seismographsLayer, this.earthquaqesLayer];
    private readonly selectInteraction = new Select({
        condition: (evt) => evt.type === 'singleclick',
        layers: this.selectableLayers,
        style: (feature: FeatureLike, resolution: number) => {
            if (feature.get('type') === 'seismograph') {
                return getSeismographsStyleFn(true)(feature, resolution);
            }
            if (feature.get('type') === 'earthquake') {
                return getEarthquaqesStyleFn(true)(feature, resolution);
            }
            return undefined
        }
    });
    private readonly drawInteraction = new Draw({
        source: drawOlSource,
        type: 'Circle',
        geometryFunction: createBox()
    });


    constructor() {
        this.map = this.getMap();

        this.map.on('singleclick', (evt) => {
            Object.values(this.mapClickSubscriptions).forEach((sub) => sub());
        });
        this.map.on('pointermove', (e) => {
            if (this.map) {
                const pixel = this.map.getEventPixel(e.originalEvent);
                const hit = this.map.hasFeatureAtPixel(pixel, { layerFilter: (l) => !!this.selectableLayers.find((sl) => l.get('Title') === sl.get('Title')) });
                (this.map.getTarget() as HTMLElement).style.cursor = hit ? 'pointer' : '';
            }
        });
        this.map.getLayers().on('change:length', () => {
            Object.values(this.layerChangeSubscriptions).forEach((sub) => sub());
        });
        this.selectInteraction.addEventListener('select', (evt) => {
            console.log('select event: ', evt as SelectEvent);
            Object.values(this.vectorFeatureClickSubscriptions).forEach((sub) => sub(evt));
        });
        this.drawInteraction.addEventListener('drawend', (evt) => {
            drawOlSource.clear()
            const drawEvent = evt as DrawEvent;
            if (drawEvent.feature) {
                const coords = (drawEvent.feature.getGeometry() as Polygon).getCoordinates()[0];
                let lonArr: number[] = [];
                let latArr: number[] = [];
                coords.forEach((coordsPair) => {
                    const [lon, lat] = toLonLat(coordsPair);
                    lonArr.push(lon);
                    latArr.push(lat);
                });


                Object.values(this.mapDrawSubscriptions).forEach((s) => s({
                    type: 'Rectangle',
                    maxlatitude: Math.max(...latArr),
                    minlatitude: Math.min(...latArr),
                    maxlongitude: Math.max(...lonArr),
                    minlongitude: Math.min(...lonArr)
                }));
                this.drawInteraction.setActive(false);
            }
        })
    }

    get select(): Select {
        return this.selectInteraction;
    }

    getMap(): Map {

        if (!this.map) {
            this.map = new Map({
                layers: [
                    this.baseLayer,
                    this.userLocationLayer,
                    this.drawLayer,
                    this.earthquaqesLayer,
                    this.seismographsLayer,
                    this.accelerographsLayer,
                    wmsLayersGroup,
                    this.populationDensityLayer,
                ],
                interactions: defaultInteractions().extend([
                    this.selectInteraction,
                    this.drawInteraction
                ]),
                view: new View({
                    center: fromLonLat([21, 42]),
                    extent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
                    zoom: 6,
                }),
                controls: []
            });
            this.drawInteraction.setActive(false);
        }

        return this.map;
    }

    getTopLayerFeatureInfo(evt: MapBrowserEvent<any>): Promise<string | null> {
        const viewResolution = this.getMap().getView().getResolution();
        const layers = this.getExternalLayers().filter((l) => l.get('isWMS'));
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


    showUserLocation(pos: GeolocationPosition) {
        const { longitude, latitude, accuracy } = pos.coords;

        const coords = [longitude, latitude];
        const accuracyCircle = circular(coords, accuracy);

        const map = this.getMap();
        const source = this.userLocationLayer.getSource() as VectorSource;
        source.clear(true);
        source.addFeatures([
            new Feature(
                accuracyCircle.transform('EPSG:4326', map.getView().getProjection())
            ),
            createPointFeatureFromLonLat(coords),
        ]);

        map.getView().fit(source.getExtent(), {
            maxZoom: 18,
            duration: 500,
        });
    }

    setEarthquaqes(data: any): void {
        const vectorSource = this.earthquaqesLayer.getSource();
        if (vectorSource) {
            vectorSource.clear()
            const dataFeatures = new GeoJSON().readFeatures(
                data,
                { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }
            );
            vectorSource.addFeatures(dataFeatures);
        }
    }

    addWMSLayer(layer: Layer, wmsUrl: string): void {
        const source = new TileWMS({
            url: wmsUrl,
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

    subscribeToDraw(key: string, fn: (event: MapDrawEvent) => void): void {
        this.mapDrawSubscriptions[key] = fn;
    }

    unsubscribeToDraw(key: string): void {
        delete this.mapDrawSubscriptions[key];
    }

    subscribeToMapClick(key: string, fn: (event: MapBrowserEvent<any>) => void): void {
        this.mapClickSubscriptions[key] = fn;
    }

    unsubscribeToMapClick(key: string): void {
        delete this.mapClickSubscriptions[key];
    }

    subscribeToVectorFeatureClick(key: string, fn: (event: SelectEvent) => void): void {
        this.vectorFeatureClickSubscriptions[key] = fn;
    }

    unsubscribeToVectorFeatureClick(key: string): void {
        delete this.vectorFeatureClickSubscriptions[key];
    }

    zoomToLayer(layer: BaseLayer): void {
        const [ax, ay, bx, by] = layer.get('EX_GeographicBoundingBox');

        this.getMap().getView().fit([...fromLonLat([ax, ay]), ...fromLonLat([bx, by])], {
            duration: 500,
        });
    }

    changeBaseMap(id: BaseMapId): void {
        this.baseLayer.setSource(
            new XYZ({ url: baseLayersHash[id].url })
        );
        this.baseLayer.set('title', baseLayersHash[id].name);
        this.baseLayer.set('baseId', id);
    }

    getCurrentBaseMapId(): BaseMapId {
        return this.baseLayer.get('baseId');
    }

    selectEarthquaqeFeatureById(opts: { id: string, multi: boolean }): void {
        const selectedFeatures = this.select.getFeatures();
        if (!opts.multi) {
            selectedFeatures.clear();
        }
        const earthquaqesSource = this.earthquaqesLayer.getSource();
        const selectedEarthquaqe = earthquaqesSource?.getFeatureById(opts.id);
        if (selectedEarthquaqe) {
            const clone = selectedEarthquaqe.clone();
            clone.setId(opts.id);
            earthquaqesSource?.removeFeature(selectedEarthquaqe);
            earthquaqesSource?.addFeature(clone);
            selectedFeatures.push(clone);
            Object.values(this.vectorFeatureClickSubscriptions).forEach((s) => s({
                selected: [clone]
            }));
            this.getMap().getView().setCenter(clone.getGeometry()?.getExtent())
        }
    }

    enableDraw(): void {
        this.drawInteraction.setActive(true);
    }

    editDrawing(): void {
        this.drawInteraction?.setActive(true);
    }

    clearAndDisableDraw(): void {
        this.drawInteraction.setActive(false);
        drawOlSource.clear();
    }
}

export const mapService = new MapService();
export type IBaseLayer = BaseLayer;
export type ILayerGroup = LayerGroup;
export * from './types';
