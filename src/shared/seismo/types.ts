import { GeoJSONFeature, GeoJSONPoint } from "../types";

export type Sort = 'time' | 'time-asc' | 'magnitude' | 'magnitude-asc';

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

export type GetEarthquaqesResponse = {
    name: string;
    features: GeoJSONFeature<GeoJSONPoint, EarthquaqeProperties>[];
    type: 'FeatureCollection'
}
