import React from 'react';
import DescriptionTypeA from '../utils/DescriptionTypeA.jsx';
import GuillotineScrollGallery from '../utils/GuillotineScrollGallery.jsx';

import descriptions from '../../data/descriptions.json';

import img4 from '../../assets/images/mouth_04.jpg';
import img5 from '../../assets/images/mouth_05.jpg';
import img6 from '../../assets/images/mouth_06.jpg';
import img7 from '../../assets/images/mouth_07.jpg';


export default function Mouth() {
    const mouthDescription = descriptions.portfolio.mouth
    const imagesB = [img6, img5, img7, img4]

    return (
        <div style={{
            marginTop: "32px"
        }}>
            <DescriptionTypeA
                title={mouthDescription.title}
                description={mouthDescription.descriptionA}
                profit={mouthDescription.descriptionB}

            />
            <GuillotineScrollGallery
                images={imagesB}
                scrollVelocity={2.5}
            />
        </div>
    );
}
