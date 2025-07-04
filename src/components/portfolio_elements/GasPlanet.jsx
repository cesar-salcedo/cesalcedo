import React from 'react';
import DescriptionTypeA from '../utils/DescriptionTypeA.jsx';


import VerticalScrollGallery from '../utils/VerticalScrollGallery.jsx';

import descriptions from '../../data/descriptions.json'

import useIsDesktop from '../hooks/useIsDesktop.js';

import img1 from '../../assets/images/gas_planet_01.jpg';
import img2 from '../../assets/images/gas_planet_02.jpg';
import img3 from '../../assets/images/gas_planet_03.jpg';
import img4 from '../../assets/images/gas_planet_04.jpg';
import img5 from '../../assets/images/gas_planet_05.jpg';
import img6 from '../../assets/images/gas_planet_06.jpg';




export default function GasPlanet() {

    const planetDescription = descriptions.portfolio.gasPlanets
    const imagesA = [img1, img2, img3, img4, img5, img6]


    return (
        <div style={{
            marginTop: "32px"
        }}>
            <DescriptionTypeA
                title={planetDescription.title}
                description={planetDescription.descriptionA}
                profit={planetDescription.descriptionB}

            />
            <VerticalScrollGallery
                scrollVelocity={1.0}
                isDesktop={useIsDesktop()}
                images={imagesA}
            />


        </div>
    );
}
