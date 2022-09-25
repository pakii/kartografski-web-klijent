import React from 'react';
import AutoSizer from "react-virtualized-auto-sizer";
import Box from '@mui/material/Box/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select/Select';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import InputLabel from '@mui/material/InputLabel/InputLabel'
import Link from '@mui/material/Link/Link';
import IconButton from '@mui/material/IconButton/IconButton';

import LaunchIcon from '@mui/icons-material/Launch';
import ClearIcon from '@mui/icons-material/Clear';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { EarthquaqeProperties, GetGlobalEarthquaqesParams, GetGlobalEarthquaqesResponse, globalEarthquaqesService, Sort } from '../../shared/usgs';
import { withRouter, WithRouterProps } from '../../shared/router';
import { MapDrawEvent, mapService } from '../../map-facade';
import { GeoJSONFeature, GeoJSONPoint, MapSettingKeys } from '../../shared/models';
import { EarthquaqeSourceId, earthquaqeSourcesHash } from '../../shared/constants';
import { DateRange } from '../../widgets/date-range/date-range';


enum SpatialSearchOptions {
    OFF = 'off',
    CIRCLE = 'Circle',
    RECTANGLE = 'Rectangle',
    DRAW_CIRCLE = 'draw-circle',
    DRAW_RECTANGLE = 'draw-rectangle'
}

export interface GlobalEarthquaqesDataState {
    loading: boolean;
    data: GetGlobalEarthquaqesResponse | null;
    area: string;
    selectedId: string;
    customTimeRange: { [key: string]: { starttime: Date, endtime: Date } };
    spatialSearch: string;
    sort: Sort;
}
interface GlobalEarthquaqesDataProps {
    router: WithRouterProps
}

class GlobalEarthquaqesCmp extends React.Component<GlobalEarthquaqesDataProps, GlobalEarthquaqesDataState> {
    listRef = React.createRef<any>();
    private readonly selectMinWidth = 190;
    constructor(props: GlobalEarthquaqesDataProps) {
        super(props);
        this.state = {
            loading: false,
            data: null,
            area: '',
            selectedId: '',
            customTimeRange: {},
            spatialSearch: SpatialSearchOptions.OFF,
            sort: 'time'
        }

        mapService.subscribeToVectorFeatureClick('GlobalEarthquaqesCmp', (e) => {
            if (e.selected.length) {
                const id = e.selected[0].getId();
                if (id) {
                    this.setState({ selectedId: id.toString() });
                    const index = this.state.data?.features.findIndex((f) => f.id === id);
                    if (index && index > -1) {
                        this.listRef.current.scrollToItem(index);
                    }
                }
            }
            else {
                this.setState({ selectedId: '' })
            }
        });

        mapService.subscribeToDraw('GlobalEarthquaqesCmp', (drawEvent: MapDrawEvent) => {

            const { searchParams, setSearchParams } = this.props.router;
            searchParams.set(MapSettingKeys.EARTHQUAQES_SPATIAL_SEARCH, JSON.stringify(drawEvent));
            setSearchParams(searchParams);
            this.fetchEarthquaqes();
        });
    }

    fetchEarthquaqes(override: GetGlobalEarthquaqesParams & { skipMapUpdate?: boolean } = {}) {
        this.setState({ loading: true });
        const { searchParams } = this.props.router;
        const area = searchParams.get(MapSettingKeys.EARTHQUAQES_SPATIAL_SEARCH);
        const timeRange = override.dateRange || searchParams.get(MapSettingKeys.EARTHQUAQES_TIME_RANGE) || 'day';
        const minmagintude = searchParams.get(MapSettingKeys.EARTHQUAQES_MIN_MAGNITUDE) || 2.5;
        const getParams: GetGlobalEarthquaqesParams = {};
        if (area) {
            const params = JSON.parse(decodeURIComponent(area));
            delete params.type;
            getParams.area = params;
        }
        if (timeRange && !override.dateRange) {
            const tr = this.calcDateRangeFromSearchParams(timeRange as string);
            if (tr) {
                this.setCustomTimeRange(tr.starttime, tr.endtime);
                getParams.dateRange = tr;
            }
            else {
                getParams.dateRange = timeRange;
            }
        }
        if (minmagintude) {
            if (minmagintude === 'all') {
                getParams.minmagnitude = 0;
            }
            else {
                getParams.minmagnitude = +(minmagintude || 2.5)
            }
        }
        getParams.orderby = override.orderby || this.state.sort;
        globalEarthquaqesService.get(getParams).then((data) => {
            this.setState({
                loading: false,
                data
            });
            if (override.skipMapUpdate) {
                return;
            }
            mapService.setEarthquaqes(data);
        })
    }

    componentDidMount() {
        this.fetchEarthquaqes()
    }

    private calcDateRangeFromSearchParams(timeRange: string): { starttime: Date, endtime: Date } | null {
        if (!timeRange) {
            return null;
        }
        const tr = decodeURIComponent(timeRange).split(' - ');
        if (tr.length !== 2) {
            return null;
        }
        const [starttime, endtime] = tr;
        return { starttime: new Date(starttime), endtime: new Date(endtime) };
    }

    selectFeature = (opts: { feature: GeoJSONFeature<GeoJSONPoint, EarthquaqeProperties>, multi?: boolean }): void => {
        this.setState({ selectedId: opts.feature.id });
        mapService.selectEarthquaqeFeatureById({
            id: opts.feature.id,
            multi: opts.multi || false
        });
    }

    setDataSource(val: string): void {
        const { searchParams, setSearchParams } = this.props.router;
        searchParams.set(MapSettingKeys.EARTHQUAQES_SOURCE, val);
        setSearchParams(searchParams);
    }

    setMinMagnitude(val: string): void {
        const { searchParams, setSearchParams } = this.props.router;
        searchParams.set(MapSettingKeys.EARTHQUAQES_MIN_MAGNITUDE, val);
        setSearchParams(searchParams);
        this.fetchEarthquaqes();
    }

    setTimeRange(val: string): void {
        const { searchParams, setSearchParams } = this.props.router;
        searchParams.set(MapSettingKeys.EARTHQUAQES_TIME_RANGE, val);
        setSearchParams(searchParams);
        this.fetchEarthquaqes();
    }

    setCustomTimeRange(starttime: Date, endtime: Date): void {
        const tr = `${starttime.toLocaleString()} - ${endtime.toLocaleString()}`;
        this.setState((prev) => {
            if (prev.customTimeRange[tr]) {
                return { ...prev }
            }
            const newCustomTr = { ...prev.customTimeRange };
            newCustomTr[tr] = { starttime, endtime };
            return {
                customTimeRange: newCustomTr
            }
        }, () => {
            const { searchParams, setSearchParams } = this.props.router;
            searchParams.set(MapSettingKeys.EARTHQUAQES_TIME_RANGE, tr);
            setSearchParams(searchParams);
        });
        this.fetchEarthquaqes({
            dateRange: tr
        });
    }

    setSpatialSearch(val: string): void {
        if (val !== SpatialSearchOptions.OFF) {
            mapService.enableDraw();
        }
        else {
            mapService.clearAndDisableDraw();
            const { searchParams, setSearchParams } = this.props.router;
            searchParams.delete(MapSettingKeys.EARTHQUAQES_SPATIAL_SEARCH);
            setSearchParams(searchParams);
            this.fetchEarthquaqes();
        }
        this.setState({ spatialSearch: val });
    }

    enableEditSpatialSearch(): void {
        mapService.editDrawing();
    }

    changeSort(value: string): void {
        console.log(value);

        const orderby = value as Sort;
        this.setState({ sort: orderby });
        this.fetchEarthquaqes({ skipMapUpdate: true, orderby });
    }

    render() {
        if (!this.state.data) {
            return null;
        }
        const { searchParams } = this.props.router;
        const currSource = (searchParams.get(MapSettingKeys.EARTHQUAQES_SOURCE) || earthquaqeSourcesHash.USGS.id) as EarthquaqeSourceId;
        const currMinMagnitude = searchParams.get(MapSettingKeys.EARTHQUAQES_MIN_MAGNITUDE) || '2.5';
        const currTimeRange = searchParams.get(MapSettingKeys.EARTHQUAQES_TIME_RANGE) || 'day';
        const currSpSearch = this.state.spatialSearch;
        return (
            <>
                <Box p={1} color="secondary">
                    <Typography component='h2' variant='h6' mb={1}>Zemljotresi</Typography>
                    <Box className='u-flex-center'>
                        <FormControl sx={{ m: 1, minWidth: this.selectMinWidth, flexGrow: 1 }} size="small">
                            <InputLabel id="za vremenski raspon">Za vremenski raspon</InputLabel>
                            <Select
                                labelId="za vremenski raspon"
                                id="za vremenski raspon"
                                value={currTimeRange}
                                label="Za vremenski raspon"
                                onChange={(e) => this.setTimeRange(e.target.value)}>
                                <MenuItem aria-label='dan' value='day'>od juče</MenuItem>
                                <MenuItem aria-label='mesec' value='week'>od prošle nedelje</MenuItem>
                                <MenuItem aria-label='godina' value='month'>od prošlog meseca</MenuItem>
                                {
                                    Object.keys(this.state.customTimeRange).map((k) => (
                                        <MenuItem key={k} aria-label={k} value={k}>{k}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <DateRange apply={(s, e) => this.setCustomTimeRange(s, e)} />
                    </Box>
                    <Box className='u-flex-center'>
                        <FormControl sx={{ m: 1, minWidth: this.selectMinWidth, flexGrow: 1 }} size="small">
                            <InputLabel id="izvor">Izvor</InputLabel>
                            <Select
                                labelId="izvor"
                                id="izvor"
                                value={currSource}
                                label="Izvor"
                                onChange={(e) => this.setDataSource(e.target.value)}>
                                <MenuItem
                                    aria-label={earthquaqeSourcesHash.USGS.id}
                                    value={earthquaqeSourcesHash.USGS.id}>
                                    {earthquaqeSourcesHash.USGS.id} - Američki seizmološki zavod
                                </MenuItem>
                                <MenuItem
                                    aria-label={earthquaqeSourcesHash.RSZ.id}
                                    value={earthquaqeSourcesHash.RSZ.id}>
                                    {earthquaqeSourcesHash.RSZ.id} - Republički seizmološki zavod
                                </MenuItem>
                            </Select>

                        </FormControl>
                        <Link m={1} href={earthquaqeSourcesHash[currSource].link} target='_blank'>
                            <LaunchIcon fontSize='small' />
                        </Link>
                    </Box>
                    <Box className='u-flex-center'>
                        <FormControl sx={{ m: 1, minWidth: this.selectMinWidth, flexGrow: 1 }} size="small">
                            <InputLabel id="prostorna-pretraga">Prostorna pretraga</InputLabel>
                            <Select
                                labelId="prostorna-pretraga"
                                id="prostorna-pretraga"
                                value={currSpSearch}
                                label="Prostorna pretraga"
                                onChange={(e) => this.setSpatialSearch(e.target.value)}>
                                <MenuItem
                                    aria-label='Podesi'
                                    value={SpatialSearchOptions.OFF}
                                    className='u-flex-center'>
                                    Isključena
                                </MenuItem>
                                <MenuItem
                                    aria-label='Unutar nacrtanog pravougaonika'
                                    value={SpatialSearchOptions.RECTANGLE}
                                    className='u-flex-center'>
                                    Nacrtaj pravougaonik
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <IconButton aria-label="edituj"
                            sx={{ visibility: currSpSearch !== SpatialSearchOptions.OFF ? 'visible' : 'hidden' }}
                            onClick={() => this.enableEditSpatialSearch()}>
                            <ModeEditIcon fontSize='small' />
                        </IconButton>
                        <IconButton aria-label="ukloni"
                            sx={{ visibility: currSpSearch !== SpatialSearchOptions.OFF ? 'visible' : 'hidden' }}
                            onClick={() => this.setSpatialSearch(SpatialSearchOptions.OFF)}>
                            <ClearIcon fontSize='small' />
                        </IconButton>
                    </Box>
                    <FormControl sx={{ m: 1, minWidth: this.selectMinWidth }} size="small">
                        <InputLabel id="magnitude">Magnitude</InputLabel>
                        <Select
                            fullWidth
                            labelId="magnitude"
                            id="magnitude"
                            value={currMinMagnitude}
                            label="Magnitude"
                            onChange={(e) => this.setMinMagnitude(e.target.value)}>
                            <MenuItem aria-label='2.5+' value='2.5'>od 2.5 pa naviše</MenuItem>
                            <MenuItem aria-label='4.5+' value='4.5'>od 4.5 pa naviše</MenuItem>
                            <MenuItem aria-label='sve' value='all'>sve</MenuItem>
                        </Select>
                    </FormControl>
                    <Box p={1} className='u-flex-center'>
                        {this.state.data && (
                            <Typography component='p' variant='caption'>
                                Ukupno {this.state.data?.features?.length} zemljotresa
                            </Typography>
                        )}

                        <FormControl sx={{ m: 1, minWidth: this.selectMinWidth }} size="small">
                            <InputLabel id="poredjaj-po">Poređaj po</InputLabel>
                            <Select
                                fullWidth
                                labelId="poredjaj-po"
                                id="poredjaj-po"
                                value={this.state.sort}
                                label="poredjaj-po"
                                onChange={(e) => this.changeSort(e.target.value)}>
                                <MenuItem aria-label='time' value='time'>novi ka starim</MenuItem>
                                <MenuItem aria-label='time-asc' value='time-asc'>stari ka novim</MenuItem>
                                <MenuItem aria-label='magnitude' value='magnitude'>jači ka slabijim</MenuItem>
                                <MenuItem aria-label='magnitude-asc' value='magnitude-asc'>slabiji ka jačim</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                height={height}
                                itemCount={this.state.data?.features.length as number}
                                itemSize={60}
                                itemData={{
                                    features: this.state.data?.features,
                                    selectedId: this.state.selectedId,
                                    selectFeature: this.selectFeature
                                }}
                                width={width}
                                ref={this.listRef}>
                                {this._rowRenderer}
                            </List>
                        )}
                    </AutoSizer>
                </Box>
            </>
        );
    }

    _rowRenderer = ({ index, data, style }: ListChildComponentProps) => {
        const item = data.features[index];

        return (
            <ListItem
                style={{ ...style }}
                key={item.id}
                component="div"
                disablePadding
                sx={(t) => ({
                    borderTop: '1px solid',
                    borderTopColor: t.palette.primary.light,
                    ...data.selectedId === item.id && { background: 'gainsboro' }
                })}>
                <ListItemButton
                    onClick={() => data.selectFeature({ feature: item })}
                    sx={{ padding: 1 }}>
                    <Box
                        component='div'
                        sx={{ minWidth: '2.5em', position: 'absolute' }}>
                        <Typography
                            noWrap
                            component='p'
                            variant='subtitle1'
                            mr={1}
                            fontWeight={item?.properties.mag > 4.5 ? 'bold' : 'normal'}
                            textAlign='center'>
                            {item?.properties.mag.toFixed(1)}
                        </Typography>
                    </Box>
                    <Box
                        component='div'
                        sx={{ paddingLeft: '2.5em', width: '100%' }}>
                        <Typography noWrap fontWeight={item?.properties.mag > 4.5 ? 'bold' : 'normal'}>
                            {item?.properties.place}
                        </Typography>
                        <Typography component='p' variant='caption'>
                            {new Date(item?.properties.time as number).toLocaleString()}
                        </Typography>
                    </Box>
                </ListItemButton>
            </ListItem>
        );
    };
}

export const EarthquaqesList = withRouter(GlobalEarthquaqesCmp);