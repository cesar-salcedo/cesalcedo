import React from 'react';
import Description from '../utils/DescriptionA.jsx';
//import HorizontalScroll from '../utils/HorizontalScrollCallery.jsx';
//import GuillotineScrollGallery from '../utils/GuillotineScrollGallery.jsx';
import DefocusScrollGallery from '../utils/DefocusScrollGallery.jsx';


import img1 from '../../assets/images/eye_gen_01.jpg';
import img2 from '../../assets/images/eye_gen_02.jpg';
import img3 from '../../assets/images/eye_gen_03.jpg';
//import img4 from '../../assets/images/eye_gen_04.jpg';
import img5 from '../../assets/images/eye_gen_07.jpg';
import img6 from '../../assets/images/eye_gen_06.jpg';




export default function Mouth({

    isDesktop = false
}) {
    const title = "Eye generator";
    const description = "A fully procedural eye generator that creates infinite variations of iris and sclera patterns. Includes node-based materials, UV-ready exports, and a demo file for instant use. ";
    const profit = "Blender Addon. +300 sales.";

    const imagesA = [img1, img2, img3, img5]
    const imagesB = [img1, img2, img3, img6]
    const images = isDesktop ? imagesA : imagesB;

    return (
        <div style={{
            marginTop: "32px"
        }}>
            <Description
                title={title}
                description={description}
                profit={profit}

            />
            <DefocusScrollGallery
                images={images}
                scrollSpeed={1}
                holdRatio={0.2}
            />


        </div>
    );
}
