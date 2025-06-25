import React from "react";
import Description from '../utils/DescriptionA.jsx';
import ImageZoomProgressive from "../utils/ImageZoomProgressive.jsx";

import imgH from '../../assets/images/solar_system_02.jpg';
import imgW from '../../assets/images/solar_system_03.jpg';


export default function TypeB({
    title,
    description,
    profit,
    maxScale = 1.5,
    objectPosition = "center center",
    isDesktop = false,
}) {
    const imageH = imgH;
    const imageW = imgW;
    const src = isDesktop ? imageW : imageH;




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
