import React, { useState, useEffect } from 'react';
import ImageZoomProgressive from './ImageZoomProgressive.jsx';
import img1 from "../assets/images/finn_01.jpg";
import img2 from "../assets/images/mouth_01.jpg";
import img3 from "../assets/images/gas_planet_01.jpg";
import img4 from "../assets/images/elephant_01.jpg";
import img5 from "../assets/images/eye_gen_01.jpg";
import img6 from "../assets/images/finn_04.jpg";
import img7 from "../assets/images/rocks_10.jpg";

export default function Portfolio() {
    const items = [
        { alt: 'Stormtrooper', src: img1, pos: 'center center' },
        { alt: 'Human Mouth', src: img2, pos: '61% center' },
        { alt: 'Gas Planet', src: img3, pos: '77% center' },
        { alt: 'Elephant', src: img4, pos: '62% 50%' },
        { alt: 'Finn', src: img5, pos: '30% center' },
        { alt: 'Eye Gen', src: img6, pos: 'center center' },
        { alt: 'Rock', src: img7, pos: 'center center' },
    ];
    // Estado para el ancho de viewport
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Decide el gap según el ancho (puedes ajustar el umbral)
    const gridGap = width < 600 ? '4px' : '16px';

    return (
        <section style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${items.length}, 1fr)`, // tantas columnas como imágenes
            gap: gridGap,            // margen entre columnas
            padding: '16px',        // margen interno al contenedor
            width: '100%',
            maxHeight: '100vh',     // ya no fuerza 100vh, sólo como tope
            overflowX: 'auto',      // scroll horizontal si cabe más ancho
            overflowY: 'hidden',    // nada de scroll vertical
        }}>
            {items.map(({ alt, src, pos }, idx) => (
                <div
                    key={idx}
                    style={{
                        width: '100%',
                        aspectRatio: '1 / 3.5', // fija relación ancho/alto para responsividad
                        overflow: 'hidden',
                    }}
                >
                    <ImageZoomProgressive
                        src={src}
                        alt={alt}
                        maxScale={1.4}
                        objectPosition={pos}
                    />
                </div>
            ))}
        </section>
    );
}
