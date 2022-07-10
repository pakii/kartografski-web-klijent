import React from "react";
import { mapService } from './services/map';

import "./App.css";

class App extends React.Component {
    componentDidMount() {
        const map = mapService.getMap();
        map.setTarget('map');
    }

    render() {
        return (
            <>
                <div id="map"></div>
            </>
        );
    }
}

export default App;
