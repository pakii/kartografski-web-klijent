import { mapService } from '../../shared/map-service';

export const Nav = () => {
    const map = mapService.getMap();
    map.getView().setZoom(5);
    return (
        <h1>Test nav</h1>
    )
}
