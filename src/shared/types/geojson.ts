export type GeoJSONPoint = {
    coordinates: [number, number] | [number, number, number];
    type: 'Point';
}

export type GeoJSONFeature<GeometryType = GeoJSONPoint, Properties = { [key: string]: any }> = {
    type: 'Feature';
    id: string;
    geometry: GeometryType;
    properties: Properties;
}
