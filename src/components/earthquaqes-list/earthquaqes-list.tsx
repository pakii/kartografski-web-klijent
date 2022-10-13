import React from 'react';
import Box from '@mui/material/Box/Box';
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import Typography from '@mui/material/Typography/Typography';
import FormControl from '@mui/material/FormControl/FormControl';
import Select from '@mui/material/Select/Select';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import InputLabel from '@mui/material/InputLabel/InputLabel'

import { withRouter, WithRouterProps } from '../../shared/hoc/with-router';
import { EarthquaqeProperties, GetEarthquaqesResponse, globalEarthquaqesService, Sort } from '../../shared/data-service';
import { mapService } from '../../openlayers';
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
    private readonly selectMinWidth = 200;
    constructor(props: GlobalEarthquaqesDataProps) {
        super(props);
        this.state = {
            loading: false,
            data: null,
            sort: 'time'
        }
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

    selectFeature = (feature: GeoJSONFeature<GeoJSONPoint, EarthquaqeProperties>): void => {
        const { searchParams, setSearchParams } = this.props.router;
        searchParams.set(MapSettingKeys.EARTHQUAQES_SELECTED_ID, feature.id.toString());
        setSearchParams(searchParams);
        mapService.selectEarthquaqeFeatureById(feature.id);
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

        const index = this.state.data?.features.findIndex((f) => f.id === selectedId);
        if (index && index > -1) {
            this.listRef?.current?.scrollTo(0, index * 60);
        }
        return (
            <>
                <Box p={1} color="secondary">
                    <Box className='u-flex-center'>
                        <Typography component='h2'
                            sx={{
                                fontSize: { xs: '16px', md: '20px' },
                                fontWeight: 'bold'
                            }}>
                            Katalog lociranih zemljotresa - tekući mesec
                        </Typography>
                        <InfoLink link='https://www.seismo.gov.rs/Locirani/Katalog_l.htm' />
                    </Box>
                    <Box p={1} className='u-flex-center'>
                        {this.state.data && (
                            <Typography component='p' variant='caption'>
                                Ukupno {this.state.data?.features?.length} zemljotresa
                            </Typography>
                        )}

                        <FormControl sx={{ m: 1, minWidth: this.selectMinWidth, fontSize: '12px' }} size="small">
                            <InputLabel id="poredjaj-po">Poređaj po</InputLabel>
                            <Select
                                fullWidth
                                labelId="poredjaj-po"
                                id="poredjaj-po"
                                value={this.state.sort}
                                label="poredjaj-po"
                                onChange={(e) => this.changeSort(e.target.value as Sort)}>
                                <MenuItem aria-label='time' value='time'>Vremenu (novi prvo)</MenuItem>
                                <MenuItem aria-label='time-asc' value='time-asc'>Vremenu (stari prvo)</MenuItem>
                                <MenuItem aria-label='magnitude-asc' value='magnitude-asc'>Magnitudi rastuće</MenuItem>
                                <MenuItem aria-label='magnitude' value='magnitude'>Magnitudi opadajuće</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                {
                    this.state.data ?
                        <List sx={{ overflowY: 'scroll', flexGrow: 1 }} ref={this.listRef}>
                            {this.state.data.features.map((item) => (

                                <ListItem
                                    key={item.id}
                                    component="div"
                                    disablePadding
                                    sx={(t) => ({
                                        borderTop: '1px solid',
                                        borderTopColor: t.palette.primary.light,
                                        ...selectedId === item.id && { background: 'gainsboro' }
                                    })}>
                                    <ListItemButton
                                        onClick={() => this.selectFeature(item)}
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
                            ))}
                        </List>
                        :
                        <Typography noWrap fontWeight='bold'>
                            Nema podataka
                        </Typography>
                }
            </>
        );
    }
}

export const EarthquaqesList = withRouter(GlobalEarthquaqesCmp);