import { toast } from 'react-toastify';
import { get0000DateString, getMonthBefore, getWeekBefore, getYesterday } from '../../util';
import { GetGlobalEarthquaqesParams, GetGlobalEarthquaqesResponse } from './types';

class GlobalEarthquaqes {

    get(): Promise<GetGlobalEarthquaqesResponse | null> {
        return fetch(
            '/data/month.json'
        )
            .then((response) => response.json())
            .then((response) => {
                return {
                    ...response,
                    features: response.features
                        .sort((p: any, n: any) => new Date(n.properties.date).getTime() - new Date(p.properties.date).getTime())
                        .map((f: any, i: number) => ({
                            ...f,
                            id: `${i}_${f.properties.date}`,
                            properties: {
                                ...f.properties,
                                type: 'earthquake'
                            }
                        }))
                }
            })
            .catch((err: any) => {
                console.log(err);

                toast.error('Greška pri učitavanju lokacija zemljotresa.');
                return null;
            });
    }
}

export const globalEarthquaqesService = new GlobalEarthquaqes();
export * from './types';
