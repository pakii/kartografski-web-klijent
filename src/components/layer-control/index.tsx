import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faXmark } from '@fortawesome/free-solid-svg-icons';

import './layer-control.scss';
import LayersList from './containers/layers-list';
import { useOutsideClick } from '../../shared/click-outside-hook';

export const LayerControl = () => {
  const [showLayers, setShowLayers] = useState(false);
  const ref = useOutsideClick((event: MouseEvent) => {
    setShowLayers(false);
    event.stopPropagation();
  });
  return (
    <div className='layers'>
      {
        showLayers && (
          <div ref={ref} className="layers-box p-1">
            <div className="u-d-flex u-justify-between">
              <h5 className='m-0'>Layers</h5>
              <button
                title="Close"
                onClick={() => setShowLayers(false)}>
                <FontAwesomeIcon icon={faXmark} fontSize={'1.5em'}/>
              </button>
            </div>
            <LayersList />
          </div>
        )
      }
      <button
        className='mt-1'
        title="Layers"
        onClick={() => setShowLayers(true)}>
        <FontAwesomeIcon icon={faLayerGroup} fontSize={'1.5em'} />
      </button>
    </div>
  )
}

export default LayerControl;
