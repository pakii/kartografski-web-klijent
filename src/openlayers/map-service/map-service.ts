import { Feature, Map, MapBrowserEvent, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import {
    Select,
    defaults as defaultInteractions
} from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import BaseLayer from 'ol/layer/Base';
import { circular } from 'ol/geom/Polygon';
import { toast } from 'react-toastify';
import { baseLayersHash, BaseMapId } from '../../shared/constants';
import { baseLayer as baseOlLayer } from '../layer-definitions/base-map-layer';
import { userLocationOlLayer } from '../layer-definitions/user-location';
import { getSeismographsStyleFunction, seismographsOlLayer } from '../layer-definitions/seismographs-layer';
import { SelectEvent } from 'ol/interaction/Select';
import { FeatureLike } from 'ol/Feature';
import { earthquaqesOlLayer, getEarthquaqesStyleFunction } from '../layer-definitions/earthquaqes-layer';
import GeoJSON from 'ol/format/GeoJSON';
import { createPointFeatureFromLonLat } from '../utils/create-point-feature';
import { hazardLayersGroup, intensityHazard95, intensityHazard475, intensityHazard975 } from '../layer-definitions';
import LayerGroup from 'ol/layer/Group';
import BaseEvent from 'ol/events/Event';

class MapService {
    private map: Map | null;
    private readonly mapClickSubscriptions: { [key: string]: Function } = {};
    private readonly viewChangeSubscriptions: { [key: string]: Function } = {};
    private readonly vectorFeatureClickSubscriptions: { [key: string]: Function } = {};
    private readonly baseLayer = baseOlLayer;
    private readonly userLocationLayer = userLocationOlLayer;
    private readonly earthquaqesLayer = earthquaqesOlLayer;
    private readonly seismographsLayer = seismographsOlLayer;
    public readonly selectInteraction =

        new Select({
            condition: (evt) => evt.type === 'singleclick',
            layers: [this.seismographsLayer, this.earthquaqesLayer],
            style: (feature: FeatureLike, resolution: number) => {
                if (feature.get('type') === 'seismograph') {
                    return getSeismographsStyleFunction({ highlighted: true })(feature, resolution);
                }
                if (feature.get('type') === 'earthquake') {
                    return getEarthquaqesStyleFunction({ highlighted: true })(feature, resolution);
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
                const hit = this.map.hasFeatureAtPixel(pixel, { layerFilter: (l) => !![this.seismographsLayer, this.earthquaqesLayer].find((sl) => l.get('Title') === sl.get('Title')) });
                (this.map.getTarget() as HTMLElement).style.cursor = hit ? 'pointer' : '';
            }
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

    getTopLayerFeatureInfo(event: MapBrowserEvent<any>): Promise<{ content: string, Title: string } | null> {
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
        const topWMSLayer = layers[index];

        const viewResolution = this.getMap().getView().getResolution();
        const getFeatureInfoUrl = topWMSLayer.get('source').getFeatureInfoUrl(
            event.coordinate,
            viewResolution,
            'EPSG:3857',
            { 'INFO_FORMAT': 'text/html' }
        );


        if (getFeatureInfoUrl) {
            return fetch(getFeatureInfoUrl)
                .then((response) => response.text())
                .then((text) => {
                    return { content: text, Title: layers[index].get('Title') }
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
        const dataFeatures = new GeoJSON().readFeatures(
            data,
            { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }
        );
        vectorSource?.addFeatures(dataFeatures);
        if (selectedId) {
            this.selectEarthquaqeFeatureById({ id: selectedId, multi: false })
        }
    }

    // addWMSLayer(layer: Layer, wmsUrl: string): void {
    //     const source = new TileWMS({
    //         url: wmsUrl,
    //         params: { LAYERS: layer.Name, VERSION: '1.1.1' }
    //     });
    //     const olLayer = new TileLayer({
    //         zIndex: this.zIndexCounter + 1,
    //         properties: {
    //             ...layer
    //         },
    //         source
    //     });

    //     const map = this.getMap();
    //     map.addLayer(olLayer);
    //     this.zoomToLayer(olLayer);

    //     this.zIndexCounter++;
    // }

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
            const featureClone = selectedEarthquaqe.clone();
            featureClone.setId(opts.id);
            earthquaqesSource?.removeFeature(selectedEarthquaqe);
            earthquaqesSource?.addFeature(featureClone);
            selectedFeatures.push(featureClone);
            const event = new SelectEvent(
                'select',
                selectedFeatures.getArray(),
                [],
                new MapBrowserEvent('singleclick', this.getMap(), new UIEvent("pointerdown"))
            );
            this.select.dispatchEvent(event);
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
    setHazard95Visible(isVisible: boolean) { intensityHazard95.setVisible(isVisible) }
    setHazard475Visible(isVisible: boolean) { intensityHazard475.setVisible(isVisible) }
    setHazard975Visible(isVisible: boolean) { intensityHazard975.setVisible(isVisible) }
}

export const mapService = new MapService();
export type IBaseLayer = BaseLayer;
export type ILayerGroup = LayerGroup;
export * from './types';