import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPaperPlane, faFolderOpen, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import './side-bar.scss'
import { mapService } from '../../shared/map-service';
import { Layer, WMSCapabilities, wmsService } from '../../shared/wms';

interface Props { hide: () => void, changeWMSUrl: (utl: string) => void, wmsUrl: string }
interface State {
    layersLinkedList: LinkedList<Layer[]>;
    parentList: Layer[];
    capabilities: WMSCapabilities | null;
    baseMapId: string;
}
type LinkedList<T> = {
    current: T;
    prev: LinkedList<T> | null
}
export class SideBar extends React.Component<Props, State> {
    wrapperRef: React.RefObject<any>;
    constructor(props: Props) {
        super(props);
        this.state = {
            layersLinkedList: {
                current: [],
                prev: null
            },
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
                layersLinkedList: {
                    prev: null,
                    current: layers
                }
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
                    layersLinkedList: {
                        prev: { ...prevState.layersLinkedList },
                        current: layer.Layer
                    } as LinkedList<Layer[]>
                }
            });
            return;
        }
        if (layer.added) {
            return;
        }
        mapService.addWMSLayer(layer, this.props.wmsUrl);
        this.setState((prevState) => {
            const copy = [...prevState.layersLinkedList.current];
            copy[index] = {
                ...layer,
                added: true
            }
            return {
                layersLinkedList: {
                    ...prevState.layersLinkedList,
                    current: copy
                }
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
            layersLinkedList: { current: [], prev: null },
            parentList: [],
            capabilities: null,
            baseMapId: prevState.baseMapId
        }))
        this.getWMSCapabilities();
    }

    goBack(): void {
        if (this.state.layersLinkedList.prev) {
            this.setState((prevState) => {
                return {
                    layersLinkedList: {
                        current: prevState.layersLinkedList.prev?.current || [],
                        prev: prevState.layersLinkedList.prev?.prev || null
                    }
                }
            })
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
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        style={{ visibility: this.state.layersLinkedList.prev ? 'visible' : 'hidden', width: '2em' }}
                        className='u-pointer'
                        fontSize={'1em'}
                        onClick={() => this.goBack()} />
                </div>
                <ul className='layer-browser u-vertical-scroll'>
                    {this.state.layersLinkedList && this.state.layersLinkedList.current && this.state.layersLinkedList.current.length && (
                        this.state.layersLinkedList.current.map((layer, index) => (
                            <li key={layer.Title} className='u-ellipsis'>
                                {!(layer.Layer && layer.Layer.length) ?
                                    <button disabled={layer.added}
                                        key={layer.Name + '_' + index}
                                        title='Import'
                                        onClick={() => this.onAddLayer(layer, index)}>
                                        +
                                    </button>
                                    :
                                    <FontAwesomeIcon icon={faFolderOpen} className='u-pointer' fontSize={'1.5em'} onClick={() => this.onAddLayer(layer, index)}/>
                                }
                                <span onClick={() => this.onAddLayer(layer, index)} className='u-pointer ml-1'>
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
