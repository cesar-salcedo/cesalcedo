import React from 'react';
// importabas <img> directamente; ahora sustitúyelo:
import ImageZoomProgressive from './ImageZoomProgressive.jsx';
import img1 from "../assets/images/finn_01.jpg";
import img2 from "../assets/images/mouth_01.jpg";

export default function Portfolio() {
    const items = [
        { title: 'Finn-Stormtrooper', src: img1 },
        { title: 'Human Mouth', src: img2 },
        // …
    ];

    return (
        <section>
            {items.map(({ title, src }) => (
                <ImageZoomProgressive
                    key={title}
                    title={title}
                    src={src}
                />
            ))}
        </section>
    );
}
