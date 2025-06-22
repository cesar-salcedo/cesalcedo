import React, { useEffect, useRef, useState } from 'react';

export default function ImageZoomProgressive({
    alt = '',
    src,
    maxScale,
    objectPosition = 'center center',
}) {
    const imgRef = useRef(null);
    // arrancamos al tamaño “grande” en los bordes
    const [scale, setScale] = useState(maxScale);

    useEffect(() => {
        const el = imgRef.current;
        if (!el) return;

        const handleScroll = () => {
            const rect = el.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const distance = Math.abs(centerY - viewportCenter);
            const maxDist = viewportCenter;
            const ratio = Math.min(distance / maxDist, 1);
            // escala 1 en el centro, maxScale en el borde
            setScale(1 + ratio * (maxScale - 1));
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [maxScale]);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',         // el wrapper nunca cambia de tamaño
            position: 'relative',
        }}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition,           // para encuadrar
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.1s linear',
                }}
            />
        </div>
    );
}
