import WMS from 'ol/format/WMSCapabilities';
import { toast } from 'react-toastify';
import { WMS_URL } from '../../constants';
import { WMSCapabilities } from './types';

const wmsc = new WMS();

class WMSService {
    capabilitiesCache: WMSCapabilities | null;
    constructor() {
        this.capabilitiesCache = null;
    }

    getCapabilities(wmsEndpoint?: string): Promise<WMSCapabilities> {
        const url = `${wmsEndpoint || WMS_URL}?service=wms&version=1.3.0&REQUEST=getcapabilities`
        if (this.capabilitiesCache) {
            return Promise.resolve(this.capabilitiesCache);
        }
        return fetch(url)
            .then((res) => res.text())
            .then((text) => wmsc.read(text))
            .then((json) => {
                this.capabilitiesCache = json;
                return json;
            })
            .catch((err) => {
                toast.error('Error: GetCapabilities request failed.')
            })
    }
}

export const wmsService = new WMSService();
export * from './types';
