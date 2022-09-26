import { BaseMapId } from "../constants"

export enum MapSettingKeys {
    BASE_MAP = 'bm',
    SIDE_BAR = 'sb',
    EARTHQUAQES_SELECTED_ID = 'selectedId',
    CENTER = 'c',
    ZOOM = 'z',
    EARTHQUAQES_LAYER = 'eq',
    HAZARDS_95 = 'h-95',
    HAZARDS_475 = 'h-475',
    HAZARDS_975 = 'h-975',
    POP_DENSITY = 'pd',
    SEISMOGRAMS = 'seismo',
}

export type MapSettings = {
    [MapSettingKeys.BASE_MAP]: BaseMapId;
    [MapSettingKeys.SIDE_BAR]: '0' | undefined;
    [MapSettingKeys.EARTHQUAQES_SELECTED_ID]: string;
    [MapSettingKeys.CENTER]: string;
    [MapSettingKeys.ZOOM]: string;
    [MapSettingKeys.EARTHQUAQES_LAYER]: '0' | undefined;
    [MapSettingKeys.HAZARDS_95]: '1' | undefined;
    [MapSettingKeys.HAZARDS_475]: '1' | undefined;
    [MapSettingKeys.HAZARDS_975]: '1' | undefined;
    [MapSettingKeys.POP_DENSITY]: '1' | undefined;
    [MapSettingKeys.SEISMOGRAMS]: '1' | undefined;
}
