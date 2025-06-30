import React from 'react';
import Description from '../utils/DescriptionA.jsx';

//import DefocusScrollGallery from '../utils/DefocusScrollGallery.jsx';
import VerticalScrollGallery from '../utils/VerticalScrollGallery.jsx';
//import HorizontalScrollGalley from '../utils/HorizontalScrollCallery.jsx';


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
    const description = "A fluid dynamics-based simulation system designed to generate realistic gas planets. Especially useful where procedural methods fall short, this generator creates high-fidelity visuals limited only by computing power. ";


    const imagesA = [img1, img2, img3, img4, img5, img6]


    return (
        <div style={{
            marginTop: "32px"
        }}>
            <Description
                title={title}
                description={description}

            />
            <VerticalScrollGallery
                scrollVelocity={2}
                isDesktop={isDesktop}
                images={imagesA}




            />


        </div>
    );
}
