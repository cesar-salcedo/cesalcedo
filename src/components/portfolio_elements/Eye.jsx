import React from 'react';
import Description from '../utils/DescriptionA.jsx';
import HorizontalScroll from '../utils/HorizontalScroll.jsx';
//import GuillotineScrollGallery from '../utils/GuillotineScrollGallery.jsx';

import img1 from '../../assets/images/eye_gen_01.jpg';
import img2 from '../../assets/images/eye_gen_02.jpg';
import img3 from '../../assets/images/eye_gen_03.jpg';
import img4 from '../../assets/images/eye_gen_04.jpg';
import img5 from '../../assets/images/eye_gen_07.jpg';
import img6 from '../../assets/images/eye_gen_06.jpg';




export default function Mouth({

    isDesktop = false
}) {
    const title = "Eye generator";
    const description = "A fully procedural eye generator that creates infinite variations of iris and sclera patterns. Includes node-based materials, UV-ready exports, and a demo file for instant use. ";


    const imagesA = [img1, img2, img3, img4, img5]
    const imagesB = [img1, img2, img3, img4, img6]
    const images = isDesktop ? imagesA : imagesB;

    return (
        <div style={{
            marginTop: "32px"
        }}>
            <Description
                title={title}
                description={description}

            />
            <HorizontalScroll
                images={images}
                isDesktop={isDesktop}

            />


        </div>
    );
}
