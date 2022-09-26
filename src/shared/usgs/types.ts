import { MapDrawEvent } from "../../map-facade";
import { GeoJSONFeature, GeoJSONPoint } from "../types";

export type Sort = 'time' | 'time-asc' | 'magnitude' | 'magnitude-asc';

export type GetGlobalEarthquaqesParams = {
    dateRange?: {
        starttime?: Date;
        endtime?: Date;
    } | string;
    area?: MapDrawEvent;
    minmagnitude?: number;
    orderby?: Sort;
}

export type EarthquaqeProperties = {
    date: string,
    tErrorS: number,
    lat: string,
    latErrorKm: string,
    lon: string,
    lonErrorKm: string,
    hypocenterDepthKm: number,
    richterMagnitude: number,
    mercalliIntensity: string,
    regionName: string
}

export type GetGlobalEarthquaqesResponse = {
    name: string;
    features: GeoJSONFeature<GeoJSONPoint, EarthquaqeProperties>[];
    type: 'FeatureCollection'
}
