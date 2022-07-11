import React from 'react'

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
