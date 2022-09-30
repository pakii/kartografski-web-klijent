import React from "react";
import { mapService } from './map-facade/map-service';

import { ControlsMenu } from "./components/controls/controls";
import { ToastContainer } from "react-toastify";
import { BaseSwitcher } from "./components/base-map-switcher/base-map-switcher";
import { SideBar, TopBar } from "./components/layout";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { theme } from "./styles/theme";
import { SeismographProperties } from "./map-facade/layer-definitions/seismographs";
import { SeismogramFeatureInfo } from "./components/feature-info/seismogram-feature-info-content";
import { DraggableModal } from "./widgets/draggable-modal/draggable-modal";
import { EarthquaqesList } from "./components/earthquaqes-list/earthquaqes-list";
import { EarthquaqeProperties } from "./shared/seismo";
import { EarthquaqeFeatureInfo } from "./components/feature-info/earthquaqe-feature-info-content";
import { MapSettingKeys } from "./shared/types";
import { useSearchParams } from "react-router-dom";
import { edgeHeight, SwipeableEdgeDrawer } from "./widgets/swipeble-edge/swipeble-edge";


export const App = () => {
    const wrapperRef = React.useRef(null);
    const [featureInfo, setFeatureInfo] = React.useState<{ title: string; body: any; } | null>(null);
    const [WMSfeatureInfo, setWMSFeatureInfo] = React.useState<{ title: string; body: any; } | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const isBigScreen = useMediaQuery(theme.breakpoints.up('sm'));

    React.useEffect(() => {
        initMap();
        makeMapViewChangeSub();
        makeMapClickSub();
        makeVectorFeatureInfoSub();
    });

    React.useEffect(() => {
    })

    const earthquaqesListContainerOpen = !searchParams.get(MapSettingKeys.SIDE_BAR);
    React.useEffect(() => {
        const map = mapService.getMap()
        map.updateSize();
    }, [earthquaqesListContainerOpen]);

    const initMap = (): void => {
        const map = mapService.getMap();
        map.setTarget(wrapperRef.current as unknown as HTMLDivElement);

        const centerParam = searchParams.get(MapSettingKeys.CENTER);
        const zoomParam = searchParams.get(MapSettingKeys.ZOOM);
        const center = centerParam ? JSON.parse(decodeURIComponent(centerParam)) as [number, number] : undefined;
        mapService.setCurrentView({ center, zoom: zoomParam || undefined });
        handleLayersInitialVisibility();
    }

    const makeMapViewChangeSub = () => {
        mapService.subscribeToViewChange('AppCmp', (evt) => {
            searchParams.set(MapSettingKeys.CENTER, JSON.stringify(evt.target.getCenter()));
            searchParams.set(MapSettingKeys.ZOOM, evt.target.getResolution().toString());
            setSearchParams(searchParams);
        })
    }

    const makeMapClickSub = () => {
        mapService.subscribeToMapClick('AppCmp', (event) => {
            if (!isBigScreen) {
                searchParams.set(MapSettingKeys.SIDE_BAR, '0');
                setSearchParams(searchParams);
            }
            mapService.getTopLayerFeatureInfo(event).then((res) => {
                if (!res) {
                    return;
                }
                if (res.content.indexOf('<table') === -1) {
                    setWMSFeatureInfo(null);
                    return;
                };

                const { content, Title } = res;
                setWMSFeatureInfo({
                    title: Title,
                    body: <div dangerouslySetInnerHTML={{ __html: content }}></div>
                })
            })
        })
    }

    const makeVectorFeatureInfoSub = () => {
        mapService.subscribeToVectorFeatureClick('AppCmp', (evt) => {
            const [selected] = evt?.selected || [];
            if (selected) {
                if (selected.get('type') === 'seismograph') {
                    const data: SeismographProperties = selected.getProperties() as SeismographProperties;
                    setFeatureInfo({
                        title: `Ime stanice: ${selected.get('name')}`,
                        body: < SeismogramFeatureInfo data={data} />
                    })
                }
                else if (selected.get('type') === 'earthquake') {
                    const data: EarthquaqeProperties = selected.getProperties() as EarthquaqeProperties;
                    setFeatureInfo({
                        title: selected.get('regionName'),
                        body: < EarthquaqeFeatureInfo data={data} />
                    })
                }
            }
            else {
                setFeatureInfo(null);
            }
        });
    }

    const hideFeatureInfo = () => {
        setFeatureInfo(null);
        mapService.select.getFeatures().clear();
        searchParams.delete(MapSettingKeys.EARTHQUAQES_SELECTED_ID);
        setSearchParams(searchParams);
    }

    const handleLayersInitialVisibility = () => {
        if (searchParams.get(MapSettingKeys.EARTHQUAQES_LAYER)) {
            mapService.setEarthquaqesVisible(!Boolean(searchParams.get(MapSettingKeys.EARTHQUAQES_LAYER)))
        }
        if (searchParams.get(MapSettingKeys.I_HAZARDS_95)) {
            mapService.setHazard95Visible(Boolean(searchParams.get(MapSettingKeys.I_HAZARDS_95)))
        }
        if (searchParams.get(MapSettingKeys.I_HAZARDS_475)) {
            mapService.setHazard475Visible(Boolean(searchParams.get(MapSettingKeys.I_HAZARDS_475)))
        }
        if (searchParams.get(MapSettingKeys.I_HAZARDS_975)) {
            mapService.setHazard975Visible(Boolean(searchParams.get(MapSettingKeys.I_HAZARDS_975)))
        }
        if (searchParams.get(MapSettingKeys.POP_DENSITY)) {
            mapService.setPopDensityVisible(Boolean(searchParams.get(MapSettingKeys.POP_DENSITY)))
        }
        if (searchParams.get(MapSettingKeys.SEISMOGRAMS)) {
            mapService.setSeismographsVisible(Boolean(searchParams.get(MapSettingKeys.SEISMOGRAMS)))
        }
    }

    const EarthquaqesListContainer = isBigScreen ? SideBar : SwipeableEdgeDrawer;
    let mapHeight = `calc(100vh - ${isBigScreen ? theme.mixins.toolbar.height : edgeHeight}px)`;
    if (!isBigScreen && earthquaqesListContainerOpen) {
        mapHeight = '50vh';
    }
    return (
        <>
            <ThemeProvider theme={theme}>
                <TopBar />
                <EarthquaqesListContainer>
                    < EarthquaqesList />
                </EarthquaqesListContainer>
                <div ref={wrapperRef}
                    id="map" style={{
                        width: '100%',
                        height: mapHeight,
                        marginBottom: isBigScreen ? 0 : edgeHeight,
                        marginTop: isBigScreen ? theme.mixins.toolbar.height : 0,
                        boxSizing: 'border-box'
                    }}>
                    <ControlsMenu />
                </div>
                <DraggableModal
                    open={!!featureInfo}
                    content={featureInfo}
                    hide={hideFeatureInfo} />
                <DraggableModal
                    bottom={10}
                    right={10}
                    open={!!WMSfeatureInfo}
                    content={WMSfeatureInfo}
                    hide={() => setWMSFeatureInfo(null)} />
                <BaseSwitcher />
            </ThemeProvider>
            <ToastContainer />
        </>
    );
}
