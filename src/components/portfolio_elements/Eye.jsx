import React from 'react';
import DescriptionTypeA from '../utils/DescriptionTypeA.jsx';
import DefocusScrollGallery from '../utils/DefocusScrollGallery.jsx';

import useIsDesktop from "../hooks/useIsDesktop.js";

import descriptions from '../../data/descriptions.json'

import img1 from '../../assets/images/eye_gen_01.jpg';
import img2 from '../../assets/images/eye_gen_02.jpg';
import img3 from '../../assets/images/eye_gen_03.jpg';
import img5 from '../../assets/images/eye_gen_07.jpg';
import img6 from '../../assets/images/eye_gen_06.jpg';

export default function Eye() {

    const eyeDescription = descriptions.portfolio.eye;
    const resposiveImg = useIsDesktop() ? img5 : img6;
    const images = [img1, img2, img3, resposiveImg]

    return (
        <div style={{
            marginTop: "32px"
        }}>
            <DescriptionTypeA
                title={eyeDescription.title}
                description={eyeDescription.descriptionA}
                profit={eyeDescription.descriptionB}

            />
            <DefocusScrollGallery
                images={images}
                scrollSpeed={1}
                holdRatio={0.2}
            />


        </div>
    );
}
