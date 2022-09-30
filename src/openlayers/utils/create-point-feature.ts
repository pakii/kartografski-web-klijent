import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";

export const createPointFeatureFromLonLat = (
    coords: number[],
    properties?: Record<string, any>
): Feature => {
    return new Feature({
        geometry: new Point(fromLonLat(coords)),
        ...properties
    })
}
