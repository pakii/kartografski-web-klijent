export interface WMSCapabilities {
    Service: Service;
    Capability: Capability;
    version: string;
}

export interface Service {
    Abstract: string;
    AccessConstraints: string;
    ContactInformation: ContactInformation;
    Fees: string;
    KeywordList: string[];
    Name: string;
    OnlineResource: string;
    Title: string;
}

export interface ContactInformation {
    ContactPersonPrimary: {
        ContactPerson: string;
        ContactOrganization: string;
    },
    ContactPosition: string;
    ContactAddress: {
        AddressType: string;
        Address: string;
        City: string;
        StateOrProvince: string;
        PostCode: string;
        Country: string;
    },
    ContactVoiceTelephone: string;
    ContactFacsimileTelephone: string;
    ContactElectronicMailAddress: string;
}

export interface Capability {
    Exception: string[];
    Layer: Layer;
    Request: {
        GetCapabilities: CapabilityRequest;
        GetFeatureInfo: CapabilityRequest;
        GetMap: CapabilityRequest;
    }
}

export interface Layer {
    added?: boolean;
    Abstract: string;
    Attribution?: any;
    BoundingBox: BoundingBox[];
    CRS: string[];
    Dimension: any
    EX_GeographicBoundingBox: Extent;
    KeywordList?: string[];
    Layer?: Layer[];
    MaxScaleDenominator?: any;
    MinScaleDenominator?: any;
    Name?: string;
    Style?: LayerStyle[];
    Title: string;
    cascaded?: any;
    fixedHeight?: any;
    fixedWidth?: any;
    noSubsets?: boolean;
    opaque?: boolean;
    queryable?: boolean;
}

export interface LayerStyle {
    Abstract: string;
    LegendURL: {
        Format: string;
        OnlineResource: string;
    }[];
    Name: string;
    Title: string;
}

export interface CapabilityRequest {
    DCPType: {
        HTTP: {
            Get?: {
                OnlineResource: string;
            };
            Post?: {
                OnlineResource: string;
            };
        };
    }[];
    Format: string[];
}

export type Extent = [number, number, number, number];

export interface BoundingBox {
    crs: string;
    extent: Extent;
    res: [any, any];
}