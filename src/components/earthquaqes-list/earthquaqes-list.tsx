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

import { withRouter, WithRouterProps } from '../../shared/router';
import { EarthquaqeProperties, GetEarthquaqesResponse, globalEarthquaqesService, Sort } from '../../shared/seismo';
import { mapService } from '../../map-facade';
import { GeoJSONFeature, GeoJSONPoint, MapSettingKeys } from '../../shared/types';
import { InfoLink } from '../../widgets/info-link/info-link';

export interface GlobalEarthquaqesDataState {
    loading: boolean;
    data: GetEarthquaqesResponse | null;
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
            sort: 'time'
        }

        mapService.subscribeToVectorFeatureClick('GlobalEarthquaqesCmp', (e) => {
            if (e.selected.length) {
                const id = e.selected[0].getId();
                if (id) {
                    const { searchParams, setSearchParams } = this.props.router;
                    searchParams.set(MapSettingKeys.EARTHQUAQES_SELECTED_ID, id.toString());
                    setSearchParams(searchParams);
                    const index = this.state.data?.features.findIndex((f) => f.id === id);
                    if (index && index > -1) {
                        this.listRef.current.scrollToItem(index);
                    }
                }
            }
            else {
                const { searchParams, setSearchParams } = this.props.router;
                searchParams.delete(MapSettingKeys.EARTHQUAQES_SELECTED_ID);
                setSearchParams(searchParams);
            }
        });
    }

    fetchEarthquaqes() {
        this.setState({ loading: true });
        const { searchParams } = this.props.router;
        const selectedId = searchParams.get(MapSettingKeys.EARTHQUAQES_SELECTED_ID);
        globalEarthquaqesService.get().then((data) => {
            this.setState({
                loading: false,
                data
            });
            mapService.setEarthquaqes(data, selectedId);
        })
    }

    componentDidMount() {
        this.fetchEarthquaqes()
    }

    selectFeature = (opts: { feature: GeoJSONFeature<GeoJSONPoint, EarthquaqeProperties>, multi?: boolean }): void => {
        const { searchParams, setSearchParams } = this.props.router;
        searchParams.set(MapSettingKeys.EARTHQUAQES_SELECTED_ID, opts.feature.id.toString());
        setSearchParams(searchParams);
        mapService.selectEarthquaqeFeatureById({
            id: opts.feature.id,
            multi: opts.multi || false
        });
    }

    changeSort(value: Sort): void {
        let compareFn: (a: GeoJSONFeature<GeoJSONPoint, EarthquaqeProperties>, b: GeoJSONFeature<GeoJSONPoint, EarthquaqeProperties>) => number;
        switch (value) {
            case 'time':
                compareFn = (p: any, n: any) => new Date(n.properties.date).getTime() - new Date(p.properties.date).getTime()
                break;
            case 'time-asc':
                compareFn = (p: any, n: any) => new Date(p.properties.date).getTime() - new Date(n.properties.date).getTime()
                break;
            case 'magnitude':
                compareFn = (p: any, n: any) => n.properties.richterMagnitude - p.properties.richterMagnitude
                break;
            case 'magnitude-asc':
                compareFn = (p: any, n: any) => p.properties.richterMagnitude - n.properties.richterMagnitude
                break;
            default:
                break;
        }

        this.setState((prev) => {
            return {
                data: {
                    ...prev.data as GetEarthquaqesResponse,
                    ...prev.data?.features && { features: [...prev.data?.features].sort(compareFn) }
                },
                sort: value
            }
        });
    }

    render() {
        const selectedId = this.props.router.searchParams.get(MapSettingKeys.EARTHQUAQES_SELECTED_ID);
        return (
            <>
                <Box p={1} color="secondary">
                    <Typography component='h2' variant='h6' mb={1}>
                        Katalog lociranih zemljotresa - tekući mesec
                        <InfoLink link='https://www.seismo.gov.rs/Locirani/Katalog_l.htm'/>
                    </Typography>
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
                                onChange={(e) => this.changeSort(e.target.value as Sort)}>
                                <MenuItem aria-label='time' value='time'>novi ka starim</MenuItem>
                                <MenuItem aria-label='time-asc' value='time-asc'>stari ka novim</MenuItem>
                                <MenuItem aria-label='magnitude' value='magnitude'>jači ka slabijim</MenuItem>
                                <MenuItem aria-label='magnitude-asc' value='magnitude-asc'>slabiji ka jačim</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                {
                    this.state.data ?
                        <Box sx={{ flexGrow: 1 }}>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <List
                                        height={height}
                                        itemCount={this.state.data?.features.length as number}
                                        itemSize={60}
                                        itemData={{
                                            features: this.state.data?.features,
                                            selectedId,
                                            selectFeature: this.selectFeature
                                        }}
                                        width={width}
                                        ref={this.listRef}>
                                        {this._rowRenderer}
                                    </List>
                                )}
                            </AutoSizer>
                        </Box>
                        :
                        <Typography noWrap fontWeight='bold'>
                            Nema podataka
                        </Typography>
                }
            </>
        );
    }

    _rowRenderer = ({ index, data, style }: ListChildComponentProps) => {
        const item = data.features[index] as GeoJSONFeature<GeoJSONPoint, EarthquaqeProperties>;

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
                            fontWeight={item?.properties.richterMagnitude > 4.5 ? 'bold' : 'normal'}
                            textAlign='center'>
                            {item?.properties.richterMagnitude.toFixed(1)}
                        </Typography>
                    </Box>
                    <Box
                        component='div'
                        sx={{ paddingLeft: '2.5em', width: '100%' }}>
                        <Typography noWrap fontWeight={item?.properties.richterMagnitude > 4.5 ? 'bold' : 'normal'}>
                            {item?.properties.regionName}
                        </Typography>
                        <Typography component='p' variant='caption'>
                            {new Date(item?.properties.date).toLocaleString()}
                        </Typography>
                    </Box>
                </ListItemButton>
            </ListItem>
        );
    };
}

export const EarthquaqesList = withRouter(GlobalEarthquaqesCmp);