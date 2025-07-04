import React from "react";
import DescriptionTypeA from '../utils/DescriptionTypeA.jsx';
import ImageZoomProgressive from "../utils/ImageZoomProgressive.jsx";
import useIsDesktop from "../hooks/useIsDesktop.js";

import descriptions from '../../data/descriptions.json'

import imgH from '../../assets/images/solar_system_02.jpg';
import imgW from '../../assets/images/solar_system_03.jpg';


export default function SolarSystem({
    maxScale = 1.5,
    objectPosition = "center center",
}) {
    const imageH = imgH;
    const imageW = imgW;
    const src = useIsDesktop() ? imageW : imageH;

    const solarSystemDescription = descriptions.portfolio.solarSystem;

    return (
        <div style={{ marginTop: "64px" }}>
            <DescriptionTypeA
                title={solarSystemDescription.title}
                description={solarSystemDescription.descriptionA}
                profit={solarSystemDescription.descriptionB}
            />


            <ImageZoomProgressive
                alt={solarSystemDescription.alt}
                src={src}
                maxScale={maxScale}
                objectPosition={objectPosition}
            />

        </div>
    );
}
