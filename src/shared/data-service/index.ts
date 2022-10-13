import { toast } from 'react-toastify';
import { GetEarthquaqesResponse } from './types';

class EarthquaqesService {

    get(): Promise<GetEarthquaqesResponse | null> {
        return fetch(
            'data/current-month-earthquaqes.json'
        )
            .then((response) => response.json())
            .then((response) => {
                return {
                    ...response,
                    features: response.features
                        .sort((p: any, n: any) => new Date(n.properties.date).getTime() - new Date(p.properties.date).getTime())
                }
            })
            .catch((err: any) => {
                console.log(err);

                toast.error('Greška pri učitavanju lokacija zemljotresa.');
                return null;
            });
    }
}

export const globalEarthquaqesService = new EarthquaqesService();
export * from './types';
