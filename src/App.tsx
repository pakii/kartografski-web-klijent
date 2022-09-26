import React from "react";
import { mapService } from './map-facade/map';

import { ControlsMenu } from "./components/controls";
import { ToastContainer } from "react-toastify";
import { WMS_URL } from './shared/constants/index';
import { BaseSwitcher } from "./components/base-map-switcher";
import { SideBar, TopBar } from "./components/layout";
import { ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme";
import { withRouter, WithRouterProps } from "./shared/router";
import { SeismographProperties } from "./map-facade/layer-definitions/seismographs";
import { SeismogramFeatureInfo } from "./components/feature-info/seismogram-feature-info-content";
import { DraggableModal } from "./widgets/draggable-modal/draggable-modal";
import { EarthquaqesList } from "./components/earthquaqes-list";
import { EarthquaqeProperties } from "./shared/usgs";
import { EarthquaqeFeatureInfo } from "./components/feature-info/earthquaqe-feature-info-content";
import { wmsService } from "./map-facade";
import { MapSettingKeys } from "./shared/types";

export interface AppState {
    showSidebar: boolean;
    featureInfoOn: boolean;
    featureInfo: {
        title: string;
        body: any;
    } | null;
    mapClickSubscriptions: number;
    wmsUrl: string;
}
interface AppProps {
    router: WithRouterProps
}
class AppComponent extends React.Component<AppProps, AppState> {
    wrapperRef: React.RefObject<any>;
    constructor(props: AppProps) {
        super(props);
        this.wrapperRef = React.createRef<any>();
        this.state = {
            showSidebar: false,
            featureInfoOn: true,
            featureInfo: null,
            mapClickSubscriptions: 0,
            wmsUrl: WMS_URL
        }

        mapService.subscribeToLayerAddOrRemove('AppCmp', () => {
            if (this.state.featureInfoOn) {
                this.makeFeatureInfoSub();
            }
        });
        this.makeVectorFeatureInfoSub();
    }

    componentDidMount() {
        this.createMap();
        if (this.state.featureInfoOn) {
            this.makeFeatureInfoSub();
        }
    }

    createMap(): void {
        wmsService.getCapabilities(WMS_URL)
        const map = mapService.getMap();
        map.setTarget(this.wrapperRef.current);
        const { searchParams } = this.props.router;
        const center = searchParams.get('center');
        const zoom = searchParams.get('zoom');
        console.log(map.getView());

        if (center) {
            map.getView().setCenter(JSON.parse(decodeURIComponent(center)));
        }
        if (zoom) {
            map.getView().setZoom(+zoom);
        }
    }

    makeFeatureInfoSub = () => {
        mapService.subscribeToMapClick('feature-info', (event) => {
            const wmsLayers = mapService.getExternalLayers();
            if (!wmsLayers.length) {
                return
            }
            mapService.getTopLayerFeatureInfo(event).then((featureInfo) => {
                if (featureInfo) {
                    this.setState({
                        featureInfo: {
                            title: 'WMS Feature Info',
                            body: featureInfo
                        }
                    });
                }
            })
        })
    }

    makeVectorFeatureInfoSub = () => {
        mapService.subscribeToVectorFeatureClick('AppCmp', (evt) => {
            const [selected] = evt?.selected || [];
            if (selected) {
                if (selected.get('type') === 'seismograph') {
                    const data: SeismographProperties = selected.getProperties() as SeismographProperties;
                    this.setState({
                        featureInfo: {
                            title: `Ime stanice: ${selected.get('name')}`,
                            body: < SeismogramFeatureInfo data={data} />
                        }
                    })
                }
                else if (selected.get('type') === 'earthquake') {
                    const data: EarthquaqeProperties = selected.getProperties() as EarthquaqeProperties;
                    
                    this.setState({
                        featureInfo: {
                            title: selected.get('regionName'),
                            body: < EarthquaqeFeatureInfo data={data} />
                        }
                    })
                }
            }
            else {
                this.setState({ featureInfo: null })
            }
        });
    }

    hideFeatureInfo() {
        this.setState({ featureInfo: null });
        mapService.select.getFeatures().clear();

        const { searchParams, setSearchParams } = this.props.router;
        searchParams.delete(MapSettingKeys.EARTHQUAQES_SELECTED_ID);
        setSearchParams(searchParams);
    }

    toggleFeatureInfo() {
        this.setState((prevState) => {
            if (prevState.featureInfoOn) {
                mapService.unsubscribeToMapClick('feature-info');
            }
            else {
                this.makeFeatureInfoSub();
            }
            return { featureInfoOn: !prevState.featureInfoOn }
        })
    }

    onWMSUrlChange = (url: string) => {
        this.setState({ wmsUrl: url });
    }

    render() {
        return (
            <>
                <ThemeProvider theme={theme}>
                    <TopBar />
                    <SideBar close={() => this.createMap()}>
                        <EarthquaqesList />
                    </SideBar>
                    <div ref={this.wrapperRef}
                        id="map" style={{
                            width: '100%',
                            height: `calc(100vh - ${theme.mixins.toolbar.height}px)`,
                            marginTop: theme.mixins.toolbar.height,
                            boxSizing: 'border-box'
                        }}>
                        <ControlsMenu />
                        {/* <LayerExplorer show={() => this.toggleSideBar()} /> */}
                        {/* {this.state.showSidebar && <SideBar hide={() => this.toggleSideBar()} changeWMSUrl={(e) => this.onWMSUrlChange(e)} wmsUrl={this.state.wmsUrl} />}
                        {this.state.featureInfoOn && this.state.featureInfo && (
                            <FeatureInfo featureInfo={this.state.featureInfo} hide={() => this.setState({ featureInfo: '' })} />
                        )} */}
                    </div>
                    <DraggableModal
                        open={!!this.state.featureInfo}
                        content={this.state.featureInfo}
                        hide={() => this.hideFeatureInfo()} />
                    <BaseSwitcher />
                </ThemeProvider>
                <ToastContainer />
            </>
        );
    }
}

export default withRouter(AppComponent);
