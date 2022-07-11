import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPaperPlane, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

import './side-bar.scss'
import { mapService } from '../../shared/map-service';
import { Layer, WMSCapabilities, wmsService } from '../../shared/wms';

interface Props { hide: () => void, changeWMSUrl: (utl: string) => void, wmsUrl: string }
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
            baseMapId: 'OSM'
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
        this.getWMSCapabilities();
    }

    getWMSCapabilities(): void {
        wmsService.getCapabilities(this.props.wmsUrl)
            .then((capa) => {
                this.setState(() => {
                    const newState = {
                        capabilities: capa,
                        baseMapId: mapService.getCurrentBaseId()
                    }

                    return newState;
                });
                this.setLayersState(capa);
            })
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
        mapService.unsubscribeToLayerAddOrRemove('SideBar');
    }

    onAddLayer(layer: Layer, index: number) {
        if (layer.Layer && layer.Layer.length) {
            this.setState((prevState) => {
                return {
                    currentLayers: layer.Layer as Layer[],
                    parentList: [...prevState.currentLayers]
                }
            });
            return;
        }
        if (layer.added) {
            return;
        }
        mapService.addWMSLayer(layer, this.props.wmsUrl);
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
    }

    handleClickOutside = (event: MouseEvent) => {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hide();
        }
    }

    handleWmsUrlChange(url: string): void {
        this.props.changeWMSUrl(url);
    }

    handleWMSCapabilitiesChange(): void {
        this.setState((prevState) => ({
            currentLayers: [],
            parentList: [],
            capabilities: null,
            baseMapId: prevState.baseMapId
        }))
        this.getWMSCapabilities();
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
                    <div className='u-d-flex pt-1'>
                        <input type="text"
                            value={this.props.wmsUrl}
                            className='u-w-100'
                            onChange={(e) => this.handleWmsUrlChange(e.target.value)} />
                        <button
                            title="Change WMS"
                            className='ml-1'
                            onClick={() => this.handleWMSCapabilitiesChange()}>
                            <FontAwesomeIcon icon={faPaperPlane} fontSize={'1.5em'} />
                        </button>
                    </div>

                    {this.state.capabilities &&
                        <div>
                            <h4>{this.state.capabilities?.Capability?.Layer?.Title}</h4>
                            <p>
                                {this.state.capabilities?.Capability?.Layer?.Abstract}
                            </p>
                        </div>
                    }
                </div>
                <ul className='layer-browser u-vertical-scroll'>
                    {this.state.currentLayers && this.state.currentLayers.length && (
                        this.state.currentLayers.map((layer, index) => (
                            <li key={layer.Title} className='u-ellipsis'>
                                {!(layer.Layer && layer.Layer.length) ?
                                    <button disabled={layer.added}
                                        key={layer.Name + '_' + index}
                                        title='Import'
                                        className='mr-1'
                                        onClick={() => this.onAddLayer(layer, index)}>
                                        +
                                    </button>
                                    :
                                    <FontAwesomeIcon icon={faFolderOpen} fontSize={'1.5em'} />
                                    }
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
