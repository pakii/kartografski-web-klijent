import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useOutsideClick } from '../../shared/click-outside-hook';

import './feature-info.scss';

export const FeatureInfo = (props: { featureInfo: string, hide: Function }) => {
    const ref = useOutsideClick(() => props.featureInfo && props.hide());
    return (
        <section ref={ref} className='feature-info p-1'>
            <div className='u-d-flex u-justify-between'>
                <h3 className='m-0'>
                    FeatureInfo
                </h3>
                <button
                    title="Close"
                    onClick={() => props.hide()}>
                    <FontAwesomeIcon icon={faXmark} fontSize={'1.5em'} />
                </button>
            </div>
            <div style={{overflowX: 'scroll'}} dangerouslySetInnerHTML={{ __html: props.featureInfo }}></div>
        </section>
    )
}
