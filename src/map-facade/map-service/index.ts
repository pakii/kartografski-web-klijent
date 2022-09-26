
import TileLayer from 'ol/layer/Tile';
import { Feature, Map, MapBrowserEvent, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import {
    Select,
    defaults as defaultInteractions
} from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import BaseLayer from 'ol/layer/Base';
import { circular } from 'ol/geom/Polygon';
import { Layer } from '../wms';
import { toast } from 'react-toastify';
import { baseLayersHash, BaseMapId } from '../../shared/constants';
import { baseLayer as baseOlLayer } from '../layer-definitions/base';
import { userLocationOlLayer } from '../layer-definitions/user-location';
import { getSeismographsStyleFn, seismographsOlLayer } from '../layer-definitions/seismographs';
import { SelectEvent } from 'ol/interaction/Select';
import { FeatureLike } from 'ol/Feature';
import { earthquaqesOlLayer, getEarthquaqesStyleFn } from '../layer-definitions/earthquaqes';
import GeoJSON from 'ol/format/GeoJSON';
import { createPointFeatureFromLonLat } from '../utils/create-point-feature';
import { populationDensity, hazardLayersGroup, hazard95, hazard475, hazard975 } from '../layer-definitions';
import LayerGroup from 'ol/layer/Group';
import BaseEvent from 'ol/events/Event';

class MapService {
    private map: Map | null;
    private zIndexCounter = 0;
    private readonly layerChangeSubscriptions: { [key: string]: Function } = {};
    private readonly mapClickSubscriptions: { [key: string]: Function } = {};
    private readonly viewChangeSubscriptions: { [key: string]: Function } = {};
    private readonly vectorFeatureClickSubscriptions: { [key: string]: Function } = {};
    private readonly baseLayer = baseOlLayer;
    private readonly populationDensityLayer = populationDensity;
    private readonly userLocationLayer = userLocationOlLayer;
    private readonly earthquaqesLayer = earthquaqesOlLayer;
    private readonly seismographsLayer = seismographsOlLayer;
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


    constructor() {
        this.map = this.getMap();

        this.map.getView().on('change', (e) => {
            Object.values(this.viewChangeSubscriptions).forEach((sub) => sub(e));
        })
        this.map.on('singleclick', (evt) => {
            Object.values(this.mapClickSubscriptions).forEach((sub) => sub(evt));
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
                    this.earthquaqesLayer,
                    this.populationDensityLayer,
                    this.seismographsLayer,
                    hazardLayersGroup,
                ],
                interactions: defaultInteractions().extend([
                    this.selectInteraction,
                ]),
                view: new View({
                    center: fromLonLat([21, 42]),
                    extent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
                    zoom: 6,
                }),
                controls: []
            });
        }

        return this.map;
    }

    getTopLayerFeatureInfo(evt: MapBrowserEvent<any>): Promise<{ content: string, Title: string } | null> {
        const viewResolution = this.getMap().getView().getResolution();
        let layers = hazardLayersGroup.getLayersArray().filter(l => l.getVisible());
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
                    return { content: text, Title: layers[index].get('Title') } || null
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

    setEarthquaqes(data: any, selectedId: string | null = null): void {
        const vectorSource = this.earthquaqesLayer.getSource();
        if (vectorSource) {
            vectorSource.clear()
            const dataFeatures = new GeoJSON().readFeatures(
                data,
                { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }
            );
            vectorSource.addFeatures(dataFeatures);
            if (selectedId) {
                this.selectEarthquaqeFeatureById({ id: selectedId, multi: false })
            }
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

    subscribeToViewChange(key: string, fn: (evt: BaseEvent) => void): void {
        this.viewChangeSubscriptions[key] = fn;
    }

    setCurrentView(params: { center?: [number, number], zoom?: string | number }): void {
        const view = this.getMap().getView();
        const { center, zoom } = params;
        if (center) {
            view.setCenter(center);
        }
        if (zoom) {
            view.setResolution(+zoom);
        }
    }

    setEarthquaqesVisible(isVisible: boolean) { earthquaqesOlLayer.setVisible(isVisible) }
    setSeismographsVisible(isVisible: boolean) { seismographsOlLayer.setVisible(isVisible) }
    setPopDensityVisible(isVisible: boolean) { populationDensity.setVisible(isVisible) }
    setHazard95Visible(isVisible: boolean) { hazard95.setVisible(isVisible) }
    setHazard475Visible(isVisible: boolean) { hazard475.setVisible(isVisible) }
    setHazard975Visible(isVisible: boolean) { hazard975.setVisible(isVisible) }
}

export const mapService = new MapService();
export type IBaseLayer = BaseLayer;
export type ILayerGroup = LayerGroup;
export * from './types';
