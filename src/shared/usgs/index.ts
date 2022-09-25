import { toast } from 'react-toastify';
import { get0000DateString, getMonthBefore, getWeekBefore, getYesterday } from '../../util';
import { GetGlobalEarthquaqesParams, GetGlobalEarthquaqesResponse } from './types';

class GlobalEarthquaqes {

    private readonly baseUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson'

    get(params: GetGlobalEarthquaqesParams): Promise<GetGlobalEarthquaqesResponse | null> {
        const qParams = new URLSearchParams();
        const { area, dateRange, minmagnitude, orderby } = params;
        if (area) {
            Object.keys(area).forEach((key) => {
                const value: number = area[key as keyof GetGlobalEarthquaqesParams['area']];
                qParams.set(key, value.toString())
            });
        }
        let starttime = getYesterday();
        let endtime = new Date();
        if (dateRange && typeof dateRange !== 'string') {
            starttime = dateRange.starttime || starttime;
            endtime = dateRange.endtime || endtime;
        }
        else if (dateRange && typeof dateRange === 'string') {
            if (dateRange === 'week') {
                starttime = getWeekBefore();
            }
            else if (dateRange === 'month') {
                starttime = getMonthBefore();
            }
        }

        qParams.set('starttime', get0000DateString(starttime));
        qParams.set('endtime', get0000DateString(endtime, true));
        if (minmagnitude || minmagnitude === 0) {
            qParams.set('minmagnitude', minmagnitude.toString());
        }
        qParams.set('orderby', orderby || 'time');

        return fetch(
            `${this.baseUrl}&${qParams.toString()}`
        )
            .then((response) => response.json())
            .catch((err) => {
                console.log(err);
                
                toast.error('Greška pri učitavanju lokacija zemljotresa.');
                return null;
            });
    }
}

export const globalEarthquaqesService = new GlobalEarthquaqes();
export * from './types';
