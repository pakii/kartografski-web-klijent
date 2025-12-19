import React from 'react';
import { styled } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton/IconButton';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { resetTimeToMidnight } from '../../util';
import Button from '@mui/material/Button/Button';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import isEqual from 'date-fns/isEqual';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import srLocale from 'date-fns/locale/sr-Latn';

type CustomPickerDayProps = PickersDayProps<Date> & {
    dayIsBetween: boolean;
    isFirstDay: boolean;
    isLastDay: boolean;
};

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
    ...(dayIsBetween && {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
    ...(isFirstDay && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    }),
    ...(isLastDay && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
    }),
})) as React.ComponentType<CustomPickerDayProps>;

export type DateRangeProps = {
    apply: (s: Date, e: Date) => any,
    initial?: {
        starttime: Date,
        endtime: Date
    }
}

export const DateRange = (props: DateRangeProps) => {
    const [starttime, setStartTime] = React.useState<Date | null>(props.initial?.starttime || null);
    const [endtime, setEndTime] = React.useState<Date | null>(props.initial?.endtime || null);
    const [open, setOpen] = React.useState(false);

    const setDefaults = () => {
        setStartTime(null);
        setEndTime(null);
    }
    const renderWeekPickerDay = (
        date: Date,
        selectedDates: Array<Date | null>,
        pickersDayProps: PickersDayProps<Date>,
    ) => {
        if (!(starttime && endtime)) {
            return <PickersDay {...pickersDayProps} />;
        }

        const dayIsBetween = isWithinInterval(date, { start: starttime, end: endtime });
        const isFirstDay = isSameDay(date, starttime);
        const isLastDay = isSameDay(date, endtime);

        return (
            <CustomPickersDay
                {...pickersDayProps}
                disableMargin
                dayIsBetween={dayIsBetween}
                isFirstDay={isFirstDay}
                isLastDay={isLastDay}
            />
        );
    };
    
    return (
        <>
            <IconButton aria-label="kalendar"
                onClick={() => setOpen(true)}>
                <CalendarIcon fontSize='small' />
            </IconButton>
            <Modal
                open={open}
                onClose={() => { setDefaults(); setOpen(false); }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Izaberite vremenski raspon
                        </Typography>
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={srLocale}>
                        <Box sx={{ display: 'flex' }}>
                            <StaticDatePicker<Date>
                                inputFormat="dd-MM-yyyy"
                                renderDay={renderWeekPickerDay}
                                showToolbar={true}
                                toolbarTitle='Početak'
                                displayStaticWrapperAs="desktop"
                                disableFuture={true}
                                openTo="day"
                                shouldDisableDate={(d) => isSameDay(d, new Date()) || (!!endtime && (isAfter(d, endtime) || isEqual(d, endtime)))}
                                value={starttime}
                                onChange={(newValue) => {
                                    setStartTime(resetTimeToMidnight(newValue as Date));
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <StaticDatePicker<Date>
                                inputFormat="dd-MM-yyyy"
                                renderDay={renderWeekPickerDay}
                                showToolbar={true}
                                toolbarTitle='Kraj'
                                displayStaticWrapperAs="desktop"
                                openTo="day"
                                value={endtime}
                                disableFuture={true}
                                shouldDisableDate={(d) => !!starttime && (isBefore(d, starttime) || isEqual(d, starttime))}
                                onChange={(newValue) => {
                                    setEndTime(resetTimeToMidnight(newValue as Date));
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Box>
                    </LocalizationProvider>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => { setDefaults(); setOpen(false) }}>
                            Odustani
                        </Button>
                        <Button
                            disabled={!starttime || !endtime}
                            onClick={() => { props.apply(starttime as Date, endtime as Date); setDefaults(); setOpen(false) }}>
                            Primeni
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
