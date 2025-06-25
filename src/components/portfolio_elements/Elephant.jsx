import React from 'react';
import Description from '../utils/DescriptionA.jsx';
import GuillotineScrollGallery from '../utils/GuillotineScrollGallery.jsx';

import gif01 from '../../assets/images/elephant_07.webp';


import gif02 from '../../assets/images/elephant_10.webp';


export default function TipoD({
    title,
    description,
    profit,
    alt = 'GIF',
    isDesktop = false
}) {

    const images = [gif01, gif02]
    return (
        <div style={{ marginTop: '64px' }}>
            <Description
                title={title}
                description={description}
                profit={profit}
            />

            <GuillotineScrollGallery
                images={images}

            />
        </div>
    );
}
