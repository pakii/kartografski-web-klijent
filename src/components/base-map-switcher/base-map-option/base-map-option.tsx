import React from 'react'
import { Paper, Box } from '@mui/material';
import { BaseMapSpec } from '../../../shared/constants';

type BaseItemProps = {
    item: BaseMapSpec,
    selected: boolean,
    clicked: Function
}

export const BaseMapOption = (props: BaseItemProps) => {
    return (
        <Paper elevation={4}
            onClick={() => props.clicked()}
            sx={{
                m: 1,
                border: props.selected ? '3px solid red' : '3px solid grey',
                cursor: props.selected ? 'not-allowed' : 'pointer'
            }}>
            <Box sx={{
                width: 50,
                height: 50
            }}>
                <img
                    src={props.item.imageUrl}
                    alt={props.item.name} />
            </Box>
        </Paper>
    )
}
