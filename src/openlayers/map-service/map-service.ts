import { Map, MapBrowserEvent, View } from 'ol';
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
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
import { hazardLayersGroup, intensityHazard95, intensityHazard475, intensityHazard975 } from '../layer-definitions';
import LayerGroup from 'ol/layer/Group';

class MapService {
    private map: Map | null;
    private readonly baseLayer = baseOlLayer;
    private readonly userLocationLayer = userLocationOlLayer;

    public readonly earthquaqesLayer = earthquaqesOlLayer;
    public readonly seismographsLayer = seismographsOlLayer;
    public readonly hazardLayersGroup = hazardLayersGroup;
    public readonly selectInteraction = new Select({
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
        this.map.on('pointermove', (e) => {
            if (e.dragging) {
                return;
            }

            const vectorHit = this.getMap().hasFeatureAtPixel(e.pixel, {
                layerFilter: (l) => [
                    this.seismographsLayer,
                    this.earthquaqesLayer
                ].some((sl) => l.get('Title') === sl.get('Title'))
            });
            (this.getMap().getTarget() as HTMLElement).style.cursor = vectorHit ? 'pointer' : ''
        });
    }

    getMap(): Map {
        if (!this.map) {
            this.map = new Map({
                layers: [
                    this.baseLayer,
                    this.userLocationLayer,
                    this.earthquaqesLayer,
                    this.seismographsLayer,
                    this.hazardLayersGroup,
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
            this.getMap().getView().getProjection(),
            { 'INFO_FORMAT': 'text/html' }
        );


        if (getFeatureInfoUrl) {
            return fetch(getFeatureInfoUrl)
                .then((response) => response.text())
                .then((text) => {
                    return { content: text, Title: layers[index].get('Title') }
                })
                .catch((err) => {
                    toast.error(`Greška pri učitavanju informacija o sloju ${topWMSLayer.get('Name')}.`);
                    return null;
                });
        }
        else {
            return Promise.resolve(null);
        }
    }

    getManageableLayers(): BaseLayer[] {
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
            new Feature({
                geometry: new Point(fromLonLat(coords))
            }),
        ]);

        map.getView().fit(source.getExtent(), {
            maxZoom: 16,
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
            this.selectEarthquaqeFeatureById(selectedId);
        }
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

    selectEarthquaqeFeatureById(id: string): void {
        const selectedFeatures = this.selectInteraction.getFeatures();
        selectedFeatures.clear();
        const earthquaqesSource = this.earthquaqesLayer.getSource();
        const selectedEarthquaqe = earthquaqesSource?.getFeatureById(id);
        if (selectedEarthquaqe) {
            this.setEarthquaqesVisible(true);
            const featureClone = selectedEarthquaqe.clone();
            featureClone.setId(id);
            earthquaqesSource?.removeFeature(selectedEarthquaqe);
            earthquaqesSource?.addFeature(featureClone);
            selectedFeatures.push(featureClone);
            const event = new SelectEvent(
                'select',
                selectedFeatures.getArray(),
                [],
                new MapBrowserEvent('singleclick', this.getMap(), new UIEvent("pointerdown"))
            );
            this.selectInteraction.dispatchEvent(event);

            //@ts-ignore
            const coords = selectedEarthquaqe.getGeometry()?.getCoordinates()
            const view = this.getMap().getView() as View;
            
            view.animate({zoom: view.getZoom()}, {center: coords});
        }
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
