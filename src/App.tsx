import React from "react";
import { mapService } from './openlayers/map-service/map-service';

import { ControlsMenu } from "./components/controls/controls";
import { ToastContainer } from "react-toastify";
import { BaseSwitcher } from "./components/base-map-switcher/base-map-switcher";
import { SideBar, TopBar } from "./layout";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { theme } from "./styles/theme";
import { SeismographProperties } from "./openlayers/layer-definitions/seismographs-layer";
import { SeismogramFeatureInfo } from "./components/info-windows/seismogram-feature-info-content";
import { InfoWindowContainer } from "./components/info-windows/info-window-container/info-window-container";
import { EarthquaqesList } from "./components/earthquaqes-list/earthquaqes-list";
import { EarthquaqeProperties } from "./shared/data-service";
import { EarthquaqeFeatureInfo } from "./components/info-windows/earthquaqe-feature-info-content";
import { MapSettingKeys } from "./shared/types";
import { useSearchParams } from "react-router-dom";
import { edgeHeight, BottomBar } from "./layout/bottom-bar/swipeble-edge";
import BaseEvent from "ol/events/Event";
import { View } from "ol";
import { SelectEvent } from "ol/interaction/Select";


export const App = () => {
    const wrapperRef = React.useRef(null);
    const [featureInfo, showFeatureInfo] = React.useState<{ title: string; body: any; } | null>(null);
    const [WMSfeatureInfo, showWMSFeatureInfo] = React.useState<{ title: string; body: any; } | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const isBigScreen = useMediaQuery(theme.breakpoints.up('sm'));
    const earthquaqesListContainerOpen = !searchParams.get(MapSettingKeys.SIDE_BAR);

    React.useEffect(() => {
        makeMapClickSub();
        makeVectorFeatureInfoSub();
        initMap();
        makeMapViewChangeSub();
    }, []);


    React.useEffect(() => {
        const map = mapService.getMap()
        map.updateSize();
    }, [earthquaqesListContainerOpen]);

    const initMap = (): void => {
        const map = mapService.getMap();
        map.setTarget(wrapperRef.current as unknown as HTMLDivElement);

        const currentSearchParams = new URLSearchParams(window.location.search);
        const centerParam = currentSearchParams.get(MapSettingKeys.CENTER);
        const zoomParam = currentSearchParams.get(MapSettingKeys.RESOLUTION);
        const center = centerParam ? JSON.parse(decodeURIComponent(centerParam)) as [number, number] : undefined;
        mapService.setCurrentView({ center, zoom: zoomParam || undefined });
        handleLayersInitialVisibility();
    }

    const makeMapViewChangeSub = () => {
        mapService.getMap().getView().on('change', (evt: BaseEvent & {target: View}) => {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set(MapSettingKeys.CENTER, JSON.stringify(evt.target.getCenter()));
            searchParams.set(MapSettingKeys.RESOLUTION, evt.target.getResolution().toString());
            setSearchParams(searchParams);
        })
    }

    const makeMapClickSub = () => {
        mapService.getMap().on('singleclick', (event) => {
            const searchParams = new URLSearchParams(window.location.search);
            if (!isBigScreen) {
                searchParams.set(MapSettingKeys.SIDE_BAR, '0');
                setSearchParams(searchParams);
            }
            mapService.getTopLayerFeatureInfo(event).then((res) => {
                if (!res) {
                    return;
                }
                if (res.content.indexOf('<table') === -1) {
                    showWMSFeatureInfo(null);
                    return;
                };

                const { content, Title } = res;
                showWMSFeatureInfo({
                    title: Title,
                    body: <div dangerouslySetInnerHTML={{ __html: content }}></div>
                })
            })
        })
    }

    const makeVectorFeatureInfoSub = () => {

        mapService.selectInteraction.addEventListener('select', (evt) => {
            const searchParams = new URLSearchParams(window.location.search);
            const [selected] = (evt as SelectEvent).selected;
            if (selected) {
                if (selected.get('type') === 'seismograph') {
                    const data: SeismographProperties = selected.getProperties() as SeismographProperties;
                    showFeatureInfo({
                        title: `Ime stanice: ${selected.get('name')}`,
                        body: < SeismogramFeatureInfo data={data} />
                    })
                }
                else if (selected.get('type') === 'earthquake') {

                    searchParams.set(MapSettingKeys.EARTHQUAQES_SELECTED_ID, (selected.getId() as string).toString());
                    const data: EarthquaqeProperties = selected.getProperties() as EarthquaqeProperties;
                    setSearchParams(searchParams);
                    showFeatureInfo({
                        title: selected.get('regionName'),
                        body: <EarthquaqeFeatureInfo data={data} />
                    })
                }
            }
            else {
                showFeatureInfo(null);
                searchParams.delete(MapSettingKeys.EARTHQUAQES_SELECTED_ID);
                setSearchParams(searchParams);
            }
        });

    }

    const hideFeatureInfo = () => {
        const searchParams = new URLSearchParams(window.location.search);
        showFeatureInfo(null);
        mapService.selectInteraction.getFeatures().clear();
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
        if (searchParams.get(MapSettingKeys.SEISMOGRAPHS)) {
            mapService.setSeismographsVisible(Boolean(searchParams.get(MapSettingKeys.SEISMOGRAPHS)))
        }
    }

    const EarthquaqesListContainer = isBigScreen ? SideBar : BottomBar;
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
                <InfoWindowContainer
                    open={!!featureInfo}
                    content={featureInfo}
                    hide={hideFeatureInfo} />
                <InfoWindowContainer
                    bottom={10}
                    right={10}
                    open={!!WMSfeatureInfo}
                    content={WMSfeatureInfo}
                    hide={() => showWMSFeatureInfo(null)} />
                <BaseSwitcher />
            </ThemeProvider>
            <ToastContainer />
        </>
    );
}
