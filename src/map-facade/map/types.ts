
export type MapDrawEvent = CircleDrawEvent | RectangleDrawEvent;

export type CircleDrawEvent = {
    type: 'Circle';
    latitude: number;
    longitude: number;
    maxradiuskm: number;
}

export type RectangleDrawEvent = {
    type: 'Rectangle';
    maxlatitude: number;
    minlatitude: number;
    maxlongitude: number;
    minlongitude: number;
}

export const isCircleDrawEvent = (object: MapDrawEvent): object is CircleDrawEvent => {
    return object.type === 'Circle';
};

export const isRectangleDrawEvent = (object: MapDrawEvent): object is CircleDrawEvent => {
    return object.type === 'Rectangle';
};
