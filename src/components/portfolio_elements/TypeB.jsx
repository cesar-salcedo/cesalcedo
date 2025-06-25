import React from "react";
import Description from './Description.jsx';
import ImageZoomProgressive from "./ImageZoomProgressive";


export default function TypeB({
    title,
    description,
    profit,
    imageH,
    imageW,
    maxScale = 1.5,
    objectPosition = "center center",
    isDesktop = false,
}) {
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
