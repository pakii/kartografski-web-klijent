import React from 'react';

import Button from '@mui/material/Button/Button';
import Paper, { PaperProps } from '@mui/material/Paper/Paper';
import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography';
import Draggable from 'react-draggable';

import { useEscape } from '../../../shared/hooks/esc-keypress';

const PaperComponent = (props: PaperProps) => {
    const nodeRef = React.useRef(null);
    return (
        <Draggable
            nodeRef={nodeRef}
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

export const InfoWindowContainer = (props: {
    open: boolean,
    hide: Function,
    disableEscClose?: boolean,
    bottom?: number,
    right?: number,
    content: {
        title: string;
        body: JSX.Element;
    } | null
}) => {
    useEscape(props.disableEscClose ? () => { } : props.hide);
    if (!props.content || !props.open) {
        return null;
    }
    return (
        <PaperComponent
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'fixed',
                margin: 2,
                bottom: props.bottom || 0,
                right: props.right || 0,
                zIndex: 3
            }}>
            <Box p={2}>
                <Typography component="h2"
                    id="draggable-dialog-title"
                    sx={{ cursor: 'move' }}>
                    {props.content.title}
                </Typography>
            </Box>
            <Box p={2}>
                {props.content.body}
            </Box>
            <Box p={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => props.hide()}>
                    Zatvori
                </Button>
            </Box>
        </PaperComponent >
    );
}