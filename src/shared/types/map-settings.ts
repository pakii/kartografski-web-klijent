import { BaseMapId } from "../constants"

export enum MapSettingKeys {
    BASE_MAP = 'bm',
    SIDE_BAR = 'sb',
    EARTHQUAQES_SELECTED_ID = 'selectedId',
    CENTER = 'c',
    RESOLUTION = 'res',
    EARTHQUAQES_LAYER = 'eq',
    I_HAZARDS_95 = 'ih-95',
    I_HAZARDS_475 = 'ih-475',
    I_HAZARDS_975 = 'ih-975',
    SEISMOGRAPHS = 'seismo',
}

export type MapSettings = {
    [MapSettingKeys.BASE_MAP]: BaseMapId;
    [MapSettingKeys.SIDE_BAR]: '0' | undefined;
    [MapSettingKeys.EARTHQUAQES_SELECTED_ID]: string;
    [MapSettingKeys.CENTER]: string;
    [MapSettingKeys.RESOLUTION]: string;
    [MapSettingKeys.EARTHQUAQES_LAYER]: '0' | undefined;
    [MapSettingKeys.I_HAZARDS_95]: '1' | undefined;
    [MapSettingKeys.I_HAZARDS_475]: '1' | undefined;
    [MapSettingKeys.I_HAZARDS_975]: '1' | undefined;
    [MapSettingKeys.SEISMOGRAPHS]: '1' | undefined;
}
