import React, { Component } from 'react'
import FeatureInfoControl from '../feature-info-control';
import LayerControl from '../layer-control';
import LocateControl from '../locate-control';

import './controls-menu.scss';

export class ControlsMenu extends Component<{ featureInfoOn: boolean, toggleFeatureInfo: Function }, { locationLoading: boolean }> {

    constructor(props: { featureInfoOn: boolean, toggleFeatureInfo: Function }) {
        super(props);
        this.state = {
            locationLoading: false
        }
    }


    render() {
        return (
            <section className="controls m-1">
                <LocateControl />
                <LayerControl />
                <FeatureInfoControl on={this.props.featureInfoOn} toggle={this.props.toggleFeatureInfo}/>
            </section>
        )
    }
}
