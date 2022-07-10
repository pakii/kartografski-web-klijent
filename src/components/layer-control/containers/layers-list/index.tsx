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

        mapService.subscribeToLayerAddOrRemove(() => this.updateLayersState());
    }

    componentDidMount() {
        this.updateLayersState();
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
                        <li key={`${i}__${layer.get('title')}`}>
                            <input type="checkbox"
                                id={layer.get('title')}
                                name={layer.get('title')}
                                checked={layer.getVisible()}
                                onChange={() => this.toggleLayer(layer)} />
                            <input
                                type="number"
                                step={0.1}
                                max={1}
                                min={0}
                                value={layer.getOpacity()}
                                onChange={(event) => this.setLayerOpacity(layer, +event.target.value)} />
                            {i === 0 && <button  onClick={() => this.zoomToLayer(layer)}>
                                <FontAwesomeIcon icon={faMagnifyingGlassLocation} fontSize={'1.5em'} />
                            </button>}
                            <button disabled={i === 0} onClick={() => this.moveLayerUp(i)}>
                                <FontAwesomeIcon icon={faSortUp} fontSize={'1.5em'}/>
                            </button>
                            <button disabled={i === this.state.layers.length - 1} onClick={() => this.moveLayerDown(i)}>
                                <FontAwesomeIcon icon={faSortDown} fontSize={'1.5em'}/>
                            </button>
                            <span>
                                {layer.get('title')}
                            </span>
                            <button onClick={() => this.removeLayer(layer)}>
                                <FontAwesomeIcon icon={faEraser} fontSize={'1.5em'}/>
                            </button>
                        </li>
                    ))
                }
                {
                    !this.state.layers.length && (
                        <div>No layers</div>
                    )
                }
            </ul>
        )
    }
}

export default LayersList