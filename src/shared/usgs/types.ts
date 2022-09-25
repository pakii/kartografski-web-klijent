import { MapDrawEvent } from "../../map-facade";
import { GeoJSONFeature, GeoJSONPoint } from "../models";

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
    alert: any;
    cdi: any;
    code: string;
    detail: string;
    dmin: number;
    felt: any
    gap: number;
    ids: string;
    mag: number;
    magType: string;
    mmi: any;
    net: string;
    nst: number;
    place: string;
    rms: number;
    sig: number;
    sources: string;
    status: string;
    time: number;
    title: string;
    tsunami: number;
    type: 'earthquake'
    types: string;
    tz: any;
    updated: number;
    url: string;
    geometry: {
        getCoordinates: () => [number, number, number]
    }
}

export type GetGlobalEarthquaqesResponse = {
    bbox: [number, number, number, number, number, number];
    features: GeoJSONFeature<GeoJSONPoint, EarthquaqeProperties>[];
    metadata: {
        api: string;
        count: number;
        generated: number;
        status: number;
        title: string;
        url: string;
    }
    type: 'FeatureCollection'
}
