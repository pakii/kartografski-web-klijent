import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';

import { Layer } from '../wms';
import LayerGroup from 'ol/layer/Group';
import { Collection } from 'ol';
import { WMS_URL } from '../../shared/constants';

let wmsLayerDefs: any[] = [
    {
        "Name": "osnovna_stena_ubrzanje_475_region",
        "Title": "osnovna_stena_ubrzanje_475_region",
        "Abstract": "Maksimalno horizontalno ubrzanje na tlu tipa A (Vs30=800m/s)\r\nverovatnoća prevazilaženja 10% u 50 godina\r\n(povratni period 475 godina)\r\nizraženo u jedinicama gravitacionog ubrzanja g\r\nRepublički seizmološki zavod\r\nAutor:\r\nmr. sci. Slavica Radovanović\r\nSaradnici:\r\nmr.sci. Svetlana Kovačević\r\nBranko Dragičević\r\nVidosava Knežević",
        "KeywordList": [
            "osnovna_stena_ubrzanje_475_region",
            "features"
        ],
        "CRS": [],
        "EX_GeographicBoundingBox": [
            18.815428,
            41.787862,
            23.005248,
            46.188732
        ],
        "BoundingBox": [
            {
                "crs": "CRS:84",
                "extent": [
                    18.815428,
                    41.787862,
                    23.005248,
                    46.188732
                ],
                "res": [
                    null,
                    null
                ]
            },
            {
                "crs": "EPSG:4326",
                "extent": [
                    41.787862,
                    18.815428,
                    46.188732,
                    23.005248
                ],
                "res": [
                    null,
                    null
                ]
            }
        ],
        "Style": [
            {
                "Name": "osgl_3:stena",
                "LegendURL": [
                    {
                        "Format": "image/png",
                        "OnlineResource": "http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=osnovna_stena_ubrzanje_475_region",
                        "size": [
                            98,
                            280
                        ]
                    }
                ]
            }
        ],
        "queryable": true,
        "opaque": false,
        "noSubsets": false
    },
    {
        "Name": "osnovna_stena_ubrzanje_95_region",
        "Title": "osnovna_stena_ubrzanje_95_region",
        "Abstract": "Maksimalno horizontalno ubrzanje na tlu tipa A (Vs30=800m/s)\r\nverovatnoća prevazilaženja 10% u 10 godina\r\n(povratni period 95 godina)\r\nizraženo u jedinicama gravitacionog ubrzanja g\r\nRepublički seizmološki zavod\r\nAutor:\r\nmr. sci. Slavica Radovanović\r\nSaradnici:\r\nmr.sci. Svetlana Kovačević\r\nBranko Dragičević\r\nVidosava Knežević",
        "KeywordList": [
            "features",
            "osnovna_stena_ubrzanje_95_region"
        ],
        "CRS": [],
        "EX_GeographicBoundingBox": [
            18.815428,
            41.787862,
            23.005248,
            46.188732
        ],
        "BoundingBox": [
            {
                "crs": "CRS:84",
                "extent": [
                    18.815428,
                    41.787862,
                    23.005248,
                    46.188732
                ],
                "res": [
                    null,
                    null
                ]
            },
            {
                "crs": "EPSG:4326",
                "extent": [
                    41.787862,
                    18.815428,
                    46.188732,
                    23.005248
                ],
                "res": [
                    null,
                    null
                ]
            }
        ],
        "Style": [
            {
                "Name": "osgl_3:stena",
                "LegendURL": [
                    {
                        "Format": "image/png",
                        "OnlineResource": "http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=osnovna_stena_ubrzanje_95_region",
                        "size": [
                            98,
                            280
                        ]
                    }
                ]
            }
        ],
        "queryable": true,
        "opaque": false,
        "noSubsets": false
    },
    {
        "Name": "osnovna_stena_ubrzanje_975_region",
        "Title": "osnovna_stena_ubrzanje_975_region",
        "Abstract": "Maksimalno horizontalno ubrzanje na tlu tipa A (Vs30=800m/s)\r\nverovatnoća prevazilaženja 5% u 50 godina\r\n(povratni period 975 godina)\r\nizraženo u jedinicama gravitacionog ubrzanja g\r\nRepublički seizmološki zavod\r\nAutor:\r\nmr. sci. Slavica Radovanović\r\nSaradnici:\r\nmr.sci. Svetlana Kovačević\r\nBranko Dragičević\r\nVidosava Knežević",
        "KeywordList": [
            "osnovna_stena_ubrzanje_975_region",
            "features"
        ],
        "CRS": [],
        "EX_GeographicBoundingBox": [
            18.815428,
            41.787862,
            23.005248,
            46.188732
        ],
        "BoundingBox": [
            {
                "crs": "CRS:84",
                "extent": [
                    18.815428,
                    41.787862,
                    23.005248,
                    46.188732
                ],
                "res": [
                    null,
                    null
                ]
            },
            {
                "crs": "EPSG:4326",
                "extent": [
                    41.787862,
                    18.815428,
                    46.188732,
                    23.005248
                ],
                "res": [
                    null,
                    null
                ]
            }
        ],
        "Style": [
            {
                "Name": "osgl_3:stena",
                "LegendURL": [
                    {
                        "Format": "image/png",
                        "OnlineResource": "http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=osnovna_stena_ubrzanje_975_region",
                        "size": [
                            98,
                            280
                        ]
                    }
                ]
            }
        ],
        "queryable": true,
        "opaque": false,
        "noSubsets": false
    },
    {
        "Name": "povrsina_lokalnosti_475_region",
        "Title": "povrsina_lokalnosti_475_region",
        "Abstract": "Makroseizmički intenzitet na površini lokalnog tla\r\nverovatnoća prevazilaženja 10% u 50 godina\r\n(povratni period 475 godina)\r\nizražen u stepenima po EMЅ-98\r\nRepublički seizmološki zavod\r\nAutor:\r\nmr. sci. Slavica Radovanović\r\nSaradnici:\r\nmr.sci. Svetlana Kovačević\r\nBranko Dragičević",
        "KeywordList": [
            "features",
            "povrsina_lokalnosti_475_region"
        ],
        "CRS": [],
        "EX_GeographicBoundingBox": [
            18.82953,
            41.791443,
            22.980763,
            46.177987
        ],
        "BoundingBox": [
            {
                "crs": "CRS:84",
                "extent": [
                    18.82953,
                    41.791443,
                    22.980763,
                    46.177987
                ],
                "res": [
                    null,
                    null
                ]
            },
            {
                "crs": "EPSG:4326",
                "extent": [
                    41.791443,
                    18.82953,
                    46.177987,
                    22.980763
                ],
                "res": [
                    null,
                    null
                ]
            }
        ],
        "Style": [
            {
                "Name": "osgl_3:lokal",
                "LegendURL": [
                    {
                        "Format": "image/png",
                        "OnlineResource": "http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=povrsina_lokalnosti_475_region",
                        "size": [
                            57,
                            180
                        ]
                    }
                ]
            }
        ],
        "queryable": true,
        "opaque": false,
        "noSubsets": false
    },
    {
        "Name": "povrsina_lokalnosti_95_region",
        "Title": "povrsina_lokalnosti_95_region",
        "Abstract": "Makroseizmički intenzitet na površini lokalnog tla\r\nverovatnoća prevazilaženja 10% u 10 godina\r\n(povratni period 95 godina)\r\nizražen u stepenima po EMЅ-98\r\nRepublički seizmološki zavod\r\nAutor:\r\nmr. sci. Slavica Radovanović\r\nSaradnici:\r\nmr.sci. Svetlana Kovačević\r\nBranko Dragičević",
        "KeywordList": [
            "povrsina_lokalnosti_95_region",
            "features"
        ],
        "CRS": [],
        "EX_GeographicBoundingBox": [
            18.815428,
            41.787862,
            23.005248,
            46.188732
        ],
        "BoundingBox": [
            {
                "crs": "CRS:84",
                "extent": [
                    18.815428,
                    41.787862,
                    23.005248,
                    46.188732
                ],
                "res": [
                    null,
                    null
                ]
            },
            {
                "crs": "EPSG:4326",
                "extent": [
                    41.787862,
                    18.815428,
                    46.188732,
                    23.005248
                ],
                "res": [
                    null,
                    null
                ]
            }
        ],
        "Style": [
            {
                "Name": "osgl_3:lokal",
                "LegendURL": [
                    {
                        "Format": "image/png",
                        "OnlineResource": "http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=povrsina_lokalnosti_95_region",
                        "size": [
                            57,
                            180
                        ]
                    }
                ]
            }
        ],
        "queryable": true,
        "opaque": false,
        "noSubsets": false
    },
    {
        "Name": "povrsina_lokalnosti_975_region",
        "Title": "povrsina_lokalnosti_975_region",
        "Abstract": "Makroseizmički intenzitet na površini lokalnog tla\r\nverovatnoća prevazilaženja 5% u 50 godina\r\n(povratni period 975 godina)\r\nizražen u stepenima po EMЅ-98\r\nRepublički seizmološki zavod\r\nAutor:\r\nmr. sci. Slavica Radovanović\r\nSaradnici:\r\nmr.sci. Svetlana Kovačević\r\nBranko Dragičević\r\nVidosava Knežević",
        "KeywordList": [
            "povrsina_lokalnosti_975_region",
            "features"
        ],
        "CRS": [],
        "EX_GeographicBoundingBox": [
            18.815428,
            41.787862,
            23.005248,
            46.188732
        ],
        "BoundingBox": [
            {
                "crs": "CRS:84",
                "extent": [
                    18.815428,
                    41.787862,
                    23.005248,
                    46.188732
                ],
                "res": [
                    null,
                    null
                ]
            },
            {
                "crs": "EPSG:4326",
                "extent": [
                    41.787862,
                    18.815428,
                    46.188732,
                    23.005248
                ],
                "res": [
                    null,
                    null
                ]
            }
        ],
        "Style": [
            {
                "Name": "osgl_3:lokal",
                "LegendURL": [
                    {
                        "Format": "image/png",
                        "OnlineResource": "http://osgl.grf.bg.ac.rs:80/geoserver/osgl_3/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=povrsina_lokalnosti_975_region",
                        "size": [
                            57,
                            180
                        ]
                    }
                ]
            }
        ],
        "queryable": true,
        "opaque": false,
        "noSubsets": false
    }
]
export const wmsLayersGroup = new LayerGroup({
    properties: {
        Title: 'Seizmički hazardi',
        IsGroup: true
    }
});
wmsLayerDefs = [
    {
        Name: 'povrsina_lokalnosti_95_region',
        Title: 'Povratni period od 95 godina',
        InfoLink: 'http://osgl.grf.bg.ac.rs/geonetwork/srv/eng/catalog.search#/metadata/6c3251a9-ab4e-4d14-9154-8520bdeab5f3'
    },
    {
        Name: 'povrsina_lokalnosti_475_region',
        Title: 'Povratni period od 475 godina',
        InfoLink: 'http://osgl.grf.bg.ac.rs/geonetwork/srv/eng/catalog.search#/metadata/5d0d770b-4416-421f-80e3-2535929462f5'
    },
    {
        Name: 'povrsina_lokalnosti_975_region',
        Title: 'Povratni period od 975 godina',
        InfoLink: 'http://osgl.grf.bg.ac.rs/geonetwork/srv/eng/catalog.search#/metadata/2812a2dd-da8e-48b1-b0d8-d27a05f4fd55'
    },
]
const layers = wmsLayerDefs.map((layer, i) => {
    return new TileLayer({
        properties: {
            ...layer
        },
        zIndex: 1 + i,
        visible: false,
        source: new TileWMS({
            url: WMS_URL,
            params: { LAYERS: layer.Name, VERSION: '1.1.1' }
        })
    });
})

wmsLayersGroup.setLayers(new Collection(layers));
