import Paper from '@mui/material/Paper/Paper';
import Box from '@mui/material/Box/Box';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import OfflineIcon from '@mui/icons-material/SignalWifiConnectedNoInternet4';

import { BaseMapSpec } from '../../../shared/constants';

type BaseItemProps = {
    item: BaseMapSpec,
    selected: boolean,
    clicked: Function,
    disabled?: boolean
}

export const BaseMapOption = (props: BaseItemProps) => {
    return (
        <Tooltip title={props.disabled ? 'Povežite se na internet da biste promenili osnovnu kartu' : ''}>
            <Paper elevation={4}
                onClick={() => !props.disabled && props.clicked()}
                sx={{
                    m: 1,
                    border: props.selected ? '3px solid red' : '3px solid grey',
                    cursor: props.selected || props.disabled ? 'not-allowed' : 'pointer',
                    opacity: props.disabled ? 0.5 : 1
                }}>
                <Box sx={{
                    width: 50,
                    height: 50,
                    position: 'relative'
                }}>
                    <img
                        src={props.item.imageUrl}
                        alt={props.item.name} />
                    {props.disabled &&
                        <OfflineIcon className='mr-1' fontSize='small' sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }} />}
                </Box>
            </Paper>
        </Tooltip>
    )
}
