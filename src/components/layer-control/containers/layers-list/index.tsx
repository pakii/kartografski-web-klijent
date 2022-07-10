import React, { Component } from 'react'
import { mapService, IBaseLayer } from '../../../../shared/map-service';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faSortUp, faSortDown, faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';

import './layers-list.scss';

export class LayersList extends Component<{}, { layers: IBaseLayer[] }> {

    constructor(props: {}) {
        super(props);
        this.state = {
            layers: []
        }

        mapService.subscribeToLayerAddOrRemove('LayersList', () => this.updateLayersState());
    }

    componentDidMount() {
        this.updateLayersState();
    }

    componentWillUnmount() {
        mapService.unsubscribeToLayerAddOrRemove('LayersList');
    }

    updateLayersState() {
        this.setState(() => ({
            layers: mapService.getExternalLayers().sort((p, n) => n.getZIndex() - p.getZIndex())
        }))
    }

    toggleLayer(layer: IBaseLayer): void {
        layer.setVisible(!layer.getVisible());
        this.updateLayersState();
    }

    moveLayerUp(index: number): void {
        if (index === 0) {
            return;
        }

        const currentZIndex = this.state.layers[index].getZIndex();
        this.state.layers[index - 1]?.setZIndex(currentZIndex);
        this.state.layers[index].setZIndex(currentZIndex + 1);
        this.updateLayersState();

    }
    moveLayerDown(index: number): void {
        if (index === this.state.layers.length - 1) {
            return;
        }

        const currentZIndex = this.state.layers[index].getZIndex();
        this.state.layers[index + 1]?.setZIndex(currentZIndex);
        this.state.layers[index].setZIndex(currentZIndex - 1);
        this.updateLayersState();

    }

    setLayerOpacity(layer: IBaseLayer, value: number): void {
        layer.setOpacity(value);
        this.updateLayersState();
    }

    removeLayer(layer: IBaseLayer): void {
        mapService.getMap().removeLayer(layer);
        this.updateLayersState();
    }

    zoomToLayer(layer: IBaseLayer): void {
        mapService.zoomToLayer(layer);
    }

    render() {
        return (
            <ul className='list'>
                {
                    this.state.layers.map((layer: IBaseLayer, i) => (
                        <li key={`${i}__${layer.get('Title')}`}>
                            <div className='u-ellipsis'>
                                <input type="checkbox"
                                    id={layer.get('Title')}
                                    name={layer.get('Title')}
                                    checked={layer.getVisible()}
                                    onChange={() => this.toggleLayer(layer)} />
                                <span className='m-0 ml-1'>
                                    <b>
                                        {layer.get('Title')}
                                    </b>
                                </span>
                            </div>
                            <div className='pl-1'>
                                <button disabled={i === 0} onClick={() => this.moveLayerUp(i)}>
                                    <FontAwesomeIcon icon={faSortUp} fontSize={'1em'} />
                                </button>
                                <button className='mr-1' disabled={i === this.state.layers.length - 1} onClick={() => this.moveLayerDown(i)}>
                                    <FontAwesomeIcon icon={faSortDown} fontSize={'1em'} />
                                </button>
                                <input
                                    type="number"
                                    step={0.1}
                                    max={1}
                                    min={0}
                                    value={layer.getOpacity()}
                                    onChange={(event) => this.setLayerOpacity(layer, +event.target.value)} />
                                <button className='ml-1' onClick={() => this.zoomToLayer(layer)}>
                                        <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
                                </button>
                                <button className='ml-1' onClick={() => this.removeLayer(layer)}>
                                        <FontAwesomeIcon icon={faEraser} />
                                </button>
                            </div>
                            <hr />
                        </li>
                    ))
                }
                {
                    !this.state.layers.length && (
                        <div>Oops! No layers. You can import some from WMS.</div>
                    )
                }
            </ul>
        )
    }
}

export default LayersList