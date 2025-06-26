import React from 'react';
import Description from '../utils/DescriptionA.jsx';
//import GuillotineScrollGallery from '../utils/GuillotineScrollGallery.jsx';
import ImageZoomProgressive from "../utils/ImageZoomProgressive.jsx";


import gif01 from '../../assets/images/elephant_11.webp';

import gif02 from '../../assets/images/elephant_13.webp';


export default function TipoD({
    title,
    description,
    profit,
    alt = 'GIF',
    isDesktop = false
}) {

    const imageH = gif02;
    const imageW = gif01;
    const src = isDesktop ? imageW : imageH;

    return (
        <div style={{ marginTop: '64px' }}>
            <Description
                title={title}
                description={description}
                profit={profit}
            />

            < ImageZoomProgressive
                src={src}
                maxScale={1.5}


            />
        </div>
    );
}
