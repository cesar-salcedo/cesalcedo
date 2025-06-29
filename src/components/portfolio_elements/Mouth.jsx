import React from 'react';
import Description from '../utils/DescriptionA.jsx';
//import HorizontalScroll from '../utils/HorizontalScroll.jsx';
import GuillotineScrollGallery from '../utils/GuillotineScrollGallery.jsx';

//import img1 from '../../assets/images/mouth_01.jpg';
//import img2 from '../../assets/images/mouth_02.jpg';
//import img3 from '../../assets/images/mouth_03.jpg';
import img4 from '../../assets/images/mouth_04.jpg';
import img5 from '../../assets/images/mouth_05.jpg';
import img6 from '../../assets/images/mouth_06.jpg';
import img7 from '../../assets/images/mouth_07.jpg';


export default function Mouth({
    isDesktop = false
}) {
    const title = "Human Mouth";
    const description = "Optimized for close-up rendering and facial animation. Features 8K textures, 16-bit displacement maps, and full compatibility with Cycles and V-Ray. Includes original modeling, UV layout, shading and rigging.";
    const profit = " Blender and Autodesk 3dsMax, + 300 sales.";
    //const imagesA = [img1, img2, img3]
    const imagesB = [img6, img5, img7, img4]
    return (
        <div style={{
            marginTop: "32px"
        }}>
            <Description
                title={title}
                description={description}
                profit={profit}

            />{/*
            <HorizontalScroll
                images={imagesA}
                isDesktop={isDesktop}

            /> */}
            <GuillotineScrollGallery
                images={imagesB}
                isDesktop={isDesktop}
                scrollVelocity={3}
            />

        </div>
    );
}
