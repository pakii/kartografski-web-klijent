import React from 'react'

import { Box, ClickAwayListener, Slide } from '@mui/material';

import { BaseMapOption } from './base-item';
import { mapService } from '../../map-facade/map-service';
import { baseLayersHash, BaseMapId, BaseMapSpec } from '../../shared/constants';
import { WithRouterProps, withRouter } from '../../shared/router';
import { MapSettingKeys } from '../../shared/types';
import { sideBarWidth } from '../layout';

type Props = {
    router: WithRouterProps
};
type State = {
    currentBaseMap: BaseMapSpec;
    expanded: boolean;
}

class BaseSwitcherComponent extends React.Component<Props, State> {
    containerRef: React.RefObject<any>;
    private baseMapOptions: BaseMapSpec[];

    constructor(props: Props) {
        super(props);
        this.containerRef = React.createRef<any>();
        this.baseMapOptions = Object.values(baseLayersHash);
        const currentBaseMapId = (this.props.router.searchParams.get(MapSettingKeys.BASE_MAP) || mapService.getCurrentBaseMapId()) as BaseMapId;
        this.state = {
            currentBaseMap: baseLayersHash[currentBaseMapId],
            expanded: false
        }
    }

    componentDidMount() {
        const currentBaseMapId = (this.props.router.searchParams.get(MapSettingKeys.BASE_MAP) || mapService.getCurrentBaseMapId()) as BaseMapId;
        this.changeBaseMap(baseLayersHash[currentBaseMapId]);
    }

    changeBaseMap(mapSpec: BaseMapSpec): void {
        const { searchParams, setSearchParams } = this.props.router;
        if (mapSpec.id === 'EWS') {
            searchParams.delete(MapSettingKeys.BASE_MAP)
        }
        else {
            searchParams.set(MapSettingKeys.BASE_MAP, mapSpec.id)
        }
        setSearchParams(searchParams)
        const currentBaseMapId = mapService.getCurrentBaseMapId();
        if (mapSpec.id === currentBaseMapId) {
            return;
        }
        this.setState({ currentBaseMap: mapSpec });
        mapService.changeBaseMap(mapSpec.id);
    }

    toggleExpanded(): void {
        this.setState((prev) => ({ expanded: !prev.expanded }));
    }

    render() {
        return (
            <ClickAwayListener onClickAway={() => this.setState({ expanded: false })}>
                <Box
                    ref={this.containerRef}
                    sx={{
                        position: 'fixed',
                        zIndex: 2,
                        bottom: 0,
                        ...this.props.router.searchParams.get(MapSettingKeys.SIDE_BAR) && { left: sideBarWidth},
                        display: 'flex',
                        maxWidth: '100vw'
                    }}>
                    {!this.state.expanded &&
                        <BaseMapOption item={this.state.currentBaseMap}
                            selected={false}
                            clicked={() => this.toggleExpanded()} />}
                    <Slide direction='right' in={this.state.expanded} container={this.containerRef.current}>
                        <Box sx={{
                            display: 'flex',
                            maxWidth: '100vw',
                            overflowX: 'auto'
                        }}>
                            {this.baseMapOptions.map((item) => (
                                <BaseMapOption item={item}
                                    key={item.id}
                                    selected={item.id === this.state.currentBaseMap.id}
                                    clicked={() => this.changeBaseMap(item)} />
                            ))}
                        </Box>
                    </Slide>
                </Box>
            </ClickAwayListener>
        )
    }
}

export const BaseSwitcher = withRouter(BaseSwitcherComponent);
