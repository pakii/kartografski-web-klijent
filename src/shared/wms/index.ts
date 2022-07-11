import WMS from 'ol/format/WMSCapabilities';
import { toast } from 'react-toastify';
import { WMSCapabilities } from './types';

const wmsc = new WMS();

class WMSService {
    capabilitiesCache: { [key: string]: WMSCapabilities };
    constructor() {
        this.capabilitiesCache = {};
    }

    getCapabilities(wmsEndpoint: string): Promise<WMSCapabilities> {
        const url = `${wmsEndpoint}?service=wms&version=1.3.0&REQUEST=getcapabilities`
        if (this.capabilitiesCache[wmsEndpoint]) {
            return Promise.resolve(this.capabilitiesCache[wmsEndpoint]);
        }
        return fetch(url)
            .then((res) => res.text())
            .then((text) => wmsc.read(text))
            .then((json) => {
                this.capabilitiesCache[wmsEndpoint] = json;
                return json;
            })
            .catch((err) => {
                console.error(err)
                toast.error('Error: GetCapabilities request failed.')
            })
    }
}

export const wmsService = new WMSService();
export * from './types';
