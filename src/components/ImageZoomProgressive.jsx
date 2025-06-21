import React, { useEffect, useRef, useState } from 'react';

export default function ImageZoomProgressive({ title, src, alt = '' }) {
    const imgRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const el = imgRef.current;
        if (!el) return;

        const handleScroll = () => {
            const rect = el.getBoundingClientRect();
            const elementCenterY = rect.top + rect.height / 2;
            const viewportCenterY = window.innerHeight / 2;
            const distance = Math.abs(elementCenterY - viewportCenterY);

            // A partir de esta distancia máxima (la mitad de la altura de la ventana),
            // ratio irá de 0 (en el centro) a 1 (fuera del rango)
            const maxDistance = window.innerHeight / 2;
            const ratio = Math.min(distance / maxDistance, 1);

            // Define cuánto quieres ampliar en el centro (p.ej. +5%)
            const maxScale = 1.1;
            const newScale = 1 + (1 - ratio) * (maxScale - 1);

            setScale(newScale);
        };

        handleScroll(); // escala inicial
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return (
        <div style={{ textAlign: 'center', margin: '60px 0' }}>
            <h2>{title}</h2>
            <div
                style={{
                    width: '80%',
                    overflow: 'hidden',
                    margin: '0 auto',
                }}
            >
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    style={{
                        display: 'block',
                        width: '100%',
                        transform: `scale(${scale})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.1s linear', // opcional para suavizar pequeños saltos
                    }}
                />
            </div>
        </div>
    );
}
