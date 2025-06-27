import React from 'react';
import Description from '../utils/DescriptionA.jsx';

import DefocusScrollGallery from '../utils/DefocusScrollGallery.jsx';


import img1 from '../../assets/images/gas_planet_01.jpg';
import img2 from '../../assets/images/gas_planet_02.jpg';
import img3 from '../../assets/images/gas_planet_03.jpg';
import img4 from '../../assets/images/gas_planet_04.jpg';
import img5 from '../../assets/images/gas_planet_05.jpg';
import img6 from '../../assets/images/gas_planet_06.jpg';




export default function Mouth({

    isDesktop = false
}) {
    const title = "Planet Generator";
    const description = "A fully procedural eye generator that creates infinite variations of iris and sclera patterns. Includes node-based materials, UV-ready exports, and a demo file for instant use. ";


    const imagesA = [img1, img2, img3, img4, img5, img6]


    return (
        <div style={{
            marginTop: "32px"
        }}>
            <Description
                title={title}
                description={description}

            />
            <DefocusScrollGallery
                images={imagesA}
                isDesktop={isDesktop}
                scrollSpeed={3}
                holdRatio={0.2}


            />


        </div>
    );
}
