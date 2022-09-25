import { Component, PropsWithChildren } from 'react'

import Drawer from '@mui/material/Drawer/Drawer';

import { withRouter, WithRouterProps } from '../../../shared/router';
import { MapSettingKeys } from '../../../shared/models';
import Box from '@mui/material/Box/Box';

export const sideBarWidth = 320;


type SideBarProps = PropsWithChildren & {
    router: WithRouterProps;
    close: Function;
};
type State = {}

class SideBarComponent extends Component<SideBarProps, State> {
    handleDrawerClose(): void {
        const { searchParams, setSearchParams } = this.props.router;
        searchParams.delete(MapSettingKeys.SIDE_BAR);
        setSearchParams(searchParams);
    }

    render() {
        const sideBarShown = !!this.props.router.searchParams.get(MapSettingKeys.SIDE_BAR);
        return (
            <Drawer
                sx={(theme) => ({
                    width: sideBarWidth,
                    position: 'fixed',
                    zIndex: 1,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: sideBarWidth,
                        boxSizing: 'border-box',
                    },
                })}
                variant="persistent"
                anchor="left"
                open={sideBarShown}
            >
                <Box sx={(theme) => ({
                    width: '100%',
                    marginTop: `${theme.mixins.toolbar.height}px`,
                    height: `calc(100vh - ${theme.mixins.toolbar.height}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box'
                })}>
                    {this.props.children}
                </Box>
            </Drawer>
        )
    }
}

export const SideBar = withRouter(SideBarComponent);
