import React from 'react';
import DescriptionTypeA from '../utils/DescriptionTypeA.jsx';
import ImageZoomProgressive from "../utils/ImageZoomProgressive.jsx";

import useIsDesktop from '../hooks/useIsDesktop.js';

import descriptions from '../../data/descriptions.json';

import gif01 from '../../assets/images/elephant_11.webp';
import gif02 from '../../assets/images/elephant_13.webp';


export default function Elephant() {

    const imageH = gif02;
    const imageW = gif01;
    const src = useIsDesktop() ? imageW : imageH;

    const elephantDescription = descriptions.portfolio.elephant

    return (
        <div style={{ marginTop: '64px' }}>
            <DescriptionTypeA
                title={elephantDescription.title}
                description={elephantDescription.descriptionA}
                profit={elephantDescription.descriptionB}

            />

            < ImageZoomProgressive
                src={src}
                maxScale={1.5}
                alt={elephantDescription.alt}


            />
        </div>
    );
}
