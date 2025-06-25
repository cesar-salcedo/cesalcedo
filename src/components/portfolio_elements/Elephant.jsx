import React from 'react';
import Description from '../utils/DescriptionA.jsx';
//import GuillotineScrollGallery from '../utils/GuillotineScrollGallery.jsx';
import ImageZoomProgressive from "../utils/ImageZoomProgressive.jsx";




import gif02 from '../../assets/images/elephant_11.webp';


export default function TipoD({
    title,
    description,
    profit,
    alt = 'GIF',
    isDesktop = false
}) {

    const image = gif02
    return (
        <div style={{ marginTop: '64px' }}>
            <Description
                title={title}
                description={description}
                profit={profit}
            />

            < ImageZoomProgressive
                src={image}
                maxScale={1.5}


            />
        </div>
    );
}
