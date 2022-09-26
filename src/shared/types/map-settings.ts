import { BaseMapId } from "../constants"

export enum MapSettingKeys {
    BASE_MAP = 'bm',
    SIDE_BAR = 'sb',
    EARTHQUAQES_SOURCE = 'eqs',
    EARTHQUAQES_START_DATE = 'eqsd',
    EARTHQUAQES_END_DATE = 'eqed',
    EARTHQUAQES_MIN_MAGNITUDE = 'eqmm',
    EARTHQUAQES_TIME_RANGE = 'eqtr',
    EARTHQUAQES_SPATIAL_SEARCH = 'eqss',
    EARTHQUAQES_SELECTED_ID = 'selectedId',
}

export type MapSettings = {
    [MapSettingKeys.BASE_MAP]: BaseMapId;
    [MapSettingKeys.SIDE_BAR]: '1' | undefined;
    [MapSettingKeys.EARTHQUAQES_SOURCE]: '' | 'serbia' | [number, number, number, number] | undefined;
    [MapSettingKeys.EARTHQUAQES_START_DATE]: Date | string | undefined;
    [MapSettingKeys.EARTHQUAQES_END_DATE]: Date | string | undefined;
    [MapSettingKeys.EARTHQUAQES_MIN_MAGNITUDE]: number | undefined;
    [MapSettingKeys.EARTHQUAQES_TIME_RANGE]: 'day' | 'week' | 'month' | Date | undefined;
    [MapSettingKeys.EARTHQUAQES_SELECTED_ID]: string;
}
