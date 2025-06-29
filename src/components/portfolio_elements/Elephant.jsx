import React from 'react';
import Description from '../utils/DescriptionA.jsx';
//import GuillotineScrollGallery from '../utils/GuillotineScrollGallery.jsx';
import ImageZoomProgressive from "../utils/ImageZoomProgressive.jsx";


import gif01 from '../../assets/images/elephant_11.webp';

import gif02 from '../../assets/images/elephant_13.webp';


export default function TipoD({

    alt = 'GIF',
    isDesktop = false
}) {

    const imageH = gif02;
    const imageW = gif01;
    const src = isDesktop ? imageW : imageH;
    const title = "African Elephant";
    const description = "Game-ready 3D model with 8K PBR textures, clean UVs, and a fully rigged skeleton with IK/FK chains. Balanced for real-time performance and visual fidelity across VR, AR, games, and cinematics.";
    const profit = " Blender, 3dsMax and Three.js, + 50 sales.";

    return (
        <div style={{ marginTop: '64px' }}>
            <Description
                title={title}
                description={description}
                profit={profit}

            />

            < ImageZoomProgressive
                src={src}
                maxScale={1.5}


            />
        </div>
    );
}
