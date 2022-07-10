import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';

import './layer-explorer.scss';

export default function LayerExplorer(props: { show: () => void }) {
    return (
        <button
            title="Add layers"
            className='layer-explorer m-1'
            onClick={() => props.show()}>
            +WMS
        </button>
    )
}
