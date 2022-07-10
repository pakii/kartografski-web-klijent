import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import './side-bar.scss'
import { mapService } from '../../shared/map-service';
import { Layer, WMSCapabilities, wmsService } from '../../shared/wms';

interface Props { hide: () => void }
interface State {
    currentLayers: Layer[];
    parentList: Layer[];
    capabilities: WMSCapabilities | null;
    baseMapId: string;
}

export class SideBar extends React.Component<Props, State> {
    wrapperRef: React.RefObject<any>;
    constructor(props: Props) {
        super(props);
        this.state = {
            currentLayers: [],
            parentList: [],
            capabilities: null,
            baseMapId: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }
        mapService.subscribeToLayerAddOrRemove('SideBar', () => this.setLayersState(this.state.capabilities as WMSCapabilities));
        this.wrapperRef = React.createRef<any>();
    }

    setLayersState(capabilities: WMSCapabilities): void {
        const mapLayers = mapService.getExternalLayers();
        const wmsLayers = (capabilities?.Capability?.Layer?.Layer as Layer[]);
        if (wmsLayers && wmsLayers.length) {
            const layers = wmsLayers.map((resLayer) => {
                const added = mapLayers.findIndex((l) => resLayer.Name === l.get('Name')) > -1;
                return {
                    ...resLayer,
                    added
                }
            });

            this.setState({
                currentLayers: layers
            })
        }
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        wmsService.getCapabilities()
            .then((capa) => {
                this.setLayersState(capa);
                this.setState({
                    capabilities: capa,
                    baseMapId: mapService.getCurrentBaseId()
                })
            })
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
        mapService.unsubscribeToLayerAddOrRemove('SideBar');
    }

    onAddLayer(layer: Layer, index: number) {
        if (layer.added) {
            return;
        }
        mapService.addWMSLayer(layer);
        this.setState((prevState) => {
            const copy = [...prevState.currentLayers];
            copy[index] = {
                ...layer,
                added: true
            }
            return {
                currentLayers: copy
            }
        });
    }

    onChangeBase(id: string): void {
        mapService.changeBase(id);
        this.setState({ baseMapId: id });
        this.props.hide();
    }

    handleClickOutside = (event: MouseEvent) => {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hide();
        }
    }

    render() {
        return (
            <section className='side-bar p-1 u-d-flex u-flex-column u-justify-between'
                ref={this.wrapperRef}>
                <div>
                    <div className="u-d-flex u-justify-between">
                        <h3 className='m-0'>Import WMS layers into map</h3>
                        <button
                            title="Close"
                            onClick={() => this.props.hide()}>
                            <FontAwesomeIcon icon={faXmark} fontSize={'1.5em'} />
                        </button>
                    </div>

                    {this.state.capabilities &&
                        <div>
                            <h4>{this.state.capabilities.Capability.Layer.Title}</h4>
                            <p>
                                {this.state.capabilities.Capability.Layer.Abstract}
                            </p>
                        </div>
                    }
                </div>
                <ul className='layer-browser u-vertical-scroll'>
                    {this.state.currentLayers && this.state.currentLayers.length && (
                        this.state.currentLayers.map((layer, index) => (
                            <li key={layer.Title} className='u-ellipsis'>
                                {!(layer.Layer && layer.Layer.length) &&
                                    <button disabled={layer.added}
                                        key={layer.Name + '_' + index}
                                        title='Import'
                                        className='mr-1'
                                        onClick={() => this.onAddLayer(layer, index)}>
                                        +
                                    </button>}
                                <span onClick={() => this.onAddLayer(layer, index)} className='u-pointer'>
                                    {layer.Title || layer.Name}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
                <div>
                    <hr />
                    <h4 className='m-0'>Select base map</h4>
                    {
                        Object.entries(mapService.baseLayersHash).map(([baseId, value], i) => (
                            <label htmlFor={baseId}
                                className='u-d-block'
                                style={{ marginTop: '5px' }}
                                key={baseId}>
                                <input
                                    key={baseId}
                                    onChange={(event) => this.onChangeBase(event.target.value)}
                                    checked={this.state.baseMapId === baseId}
                                    type="radio"
                                    name="baseMap"
                                    id={baseId}
                                    value={baseId} />
                                {value.name}
                            </label>
                        ))
                    }
                </div>
            </section>
        )
    }
}
