import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import './layer-explorer.scss';

export default function FeatureInfoControl(props: { on: boolean, toggle: Function }) {
    return (
        <button
            title="Allow feature info"
            className={props.on ? 'mt-1 u-b-success' : 'mt-1 u-b-disabled'}
            onClick={() => props.toggle()}>
            <FontAwesomeIcon icon={faCircleInfo} fontSize={'1.5em'} />
        </button>
    )
}
