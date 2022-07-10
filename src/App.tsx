import React from "react";
import { mapService } from './shared/map-service';

import { ControlsMenu } from "./components/controls-menu";
import { ToastContainer } from "react-toastify";
import { SideBar } from "./components/side-bar";
import LayerExplorer from "./components/layer-explorer";
import { FeatureInfo } from "./components/feature-info";

class App extends React.Component<{}, {
    showSidebar: boolean,
    featureInfoOn: boolean,
    featureInfo: string,
    mapClickSubscriptions: number
}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            showSidebar: true,
            featureInfoOn: true,
            featureInfo: '',
            mapClickSubscriptions: 0
        }

        mapService.subscribeToLayerAddOrRemove('AppCmp', () => {
            if (this.state.featureInfoOn) {
                this.makeFeatureInfoSub();
            }
        });
    }

    componentDidMount() {
        const map = mapService.getMap();
        map.setTarget('map');
        if (this.state.featureInfoOn) {
            this.makeFeatureInfoSub();
        }
    }

    makeFeatureInfoSub = () => {
        mapService.subscribeToMapClick((event) => {
            const wmsLayers = mapService.getExternalLayers();
            if (!wmsLayers.length) {
                return
            }
            mapService.getTopLayerFeatureInfo(event).then((featureInfo) => {
                if (featureInfo) {
                    this.setState({ featureInfo });
                }
            })
        })
    }

    toggleSideBar() {
        this.setState((prevState) => ({
            showSidebar: !prevState.showSidebar
        }))
    }

    toggleFeatureInfo() {
        this.setState((prevState) => {
            if (prevState.featureInfoOn) {
                mapService.clearMapClickSubscriptions();
            }
            return { featureInfoOn: !prevState.featureInfoOn }
        })
    }

    render() {
        return (
            <>
                <div id="map" style={{ width: window.innerWidth, height: window.innerHeight }}>
                    <ControlsMenu featureInfoOn={this.state.featureInfoOn} toggleFeatureInfo={() => this.toggleFeatureInfo()}></ControlsMenu>
                    <LayerExplorer show={() => this.toggleSideBar()} />
                    {this.state.showSidebar && <SideBar hide={() => this.toggleSideBar()} />}
                    {this.state.featureInfoOn && this.state.featureInfo && (
                        <FeatureInfo featureInfo={this.state.featureInfo} hide={() => this.setState({ featureInfo: '' })} />
                    )}
                </div>
                <ToastContainer />
            </>
        );
    }
}

export default App;
