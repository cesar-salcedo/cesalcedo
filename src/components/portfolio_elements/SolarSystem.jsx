import React from "react";
import Description from '../utils/DescriptionA.jsx';
import ImageZoomProgressive from "../utils/ImageZoomProgressive.jsx";

import imgH from '../../assets/images/solar_system_02.jpg';
import imgW from '../../assets/images/solar_system_03.jpg';


export default function TypeB({

    maxScale = 1.5,
    objectPosition = "center center",
    isDesktop = false,
}) {
    const imageH = imgH;
    const imageW = imgW;
    const src = isDesktop ? imageW : imageH;
    const title = "Solar System";
    const description = "Highly accurate planetary models. Venus, Uranus, Neptune, and part of Saturn are hand-painted. The Sun is fully procedural. All planets include 16K to 23K PBR textures in equirectangular format. Used by Ubisoft.";
    const profit = "Unity, Blender, 3dsMax. Used by Ubisoft. +300 sales.";



    return (
        <div style={{ marginTop: "64px" }}>
            <Description
                title={title}
                description={description}
                profit={profit}

            />


            <ImageZoomProgressive
                alt={title}
                src={src}
                maxScale={maxScale}
                objectPosition={objectPosition}
            />

        </div>
    );
}
