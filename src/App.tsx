import React from "react";
import { mapService } from './map-facade/map-service';

import { ControlsMenu } from "./components/controls/controls";
import { ToastContainer } from "react-toastify";
import { WMS_URL } from './shared/constants/index';
import { BaseSwitcher } from "./components/base-map-switcher";
import { SideBar, TopBar } from "./components/layout";
import { ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme";
import { SeismographProperties } from "./map-facade/layer-definitions/seismographs";
import { SeismogramFeatureInfo } from "./components/feature-info/seismogram-feature-info-content";
import { DraggableModal } from "./widgets/draggable-modal/draggable-modal";
import { EarthquaqesList } from "./components/earthquaqes-list/earthquaqes-list";
import { EarthquaqeProperties } from "./shared/seismo";
import { EarthquaqeFeatureInfo } from "./components/feature-info/earthquaqe-feature-info-content";
import { wmsService } from "./map-facade";
import { MapSettingKeys } from "./shared/types";
import { useSearchParams } from "react-router-dom";


export const App = () => {
    const wrapperRef = React.useRef(null);
    const [featureInfo, setFeatureInfo] = React.useState<{ title: string; body: any; } | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    React.useEffect(() => {
        makeExtentChangeSub();
        createMap();
        makeVectorFeatureInfoSub();
    });

    const createMap = (): void => {
        wmsService.getCapabilities(WMS_URL)
        const map = mapService.getMap();
        map.setTarget(wrapperRef.current as unknown as HTMLDivElement);

        const centerParam = searchParams.get(MapSettingKeys.CENTER);
        const zoomParam = searchParams.get(MapSettingKeys.ZOOM);
        const center = centerParam ? JSON.parse(decodeURIComponent(centerParam)) as [number, number] : undefined;
        mapService.setCurrentView({ center, zoom: zoomParam || undefined });
    }

    const makeExtentChangeSub = () => {
        mapService.subscribeToViewChange('AppCmp', (evt) => {
            searchParams.set(MapSettingKeys.CENTER, JSON.stringify(evt.target.getCenter()));
            searchParams.set(MapSettingKeys.ZOOM, evt.target.getResolution().toString());
            setSearchParams(searchParams);
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

    return (
        <>
            <ThemeProvider theme={theme}>
                <TopBar />
                <SideBar>
                    <EarthquaqesList />
                </SideBar>
                <div ref={wrapperRef}
                    id="map" style={{
                        width: '100%',
                        height: `calc(100vh - ${theme.mixins.toolbar.height}px)`,
                        marginTop: theme.mixins.toolbar.height,
                        boxSizing: 'border-box'
                    }}>
                    <ControlsMenu />
                </div>
                <DraggableModal
                    open={!!featureInfo}
                    content={featureInfo}
                    hide={hideFeatureInfo} />
                <BaseSwitcher />
            </ThemeProvider>
            <ToastContainer />
        </>
    );
}
