import React, { useEffect, useRef, useState } from 'react';

/**
 * ImageZoomProgressive
 * --------------------
 * • Zoom dinámico: escala 1 en el centro, y crece uniformemente
 *   hasta maxScale solo cuando la imagen esté casi fuera
 *   de la vista — evitando “paradas” prematuras cerca de los bordes.
 *
 * Props:
 *   • alt             → texto alternativo
 *   • src             → URL de la imagen
 *   • maxScale        → factor máximo de zoom
 *   • objectPosition  → posicionamiento CSS de la imagen
 */
export default function ImageZoomProgressive({
    alt = '',
    src,
    maxScale,
    objectPosition = 'center center',
}) {
    const imgRef = useRef(null);
    const [scale, setScale] = useState(maxScale);

    useEffect(() => {
        const el = imgRef.current;
        if (!el) return;

        const updateScale = () => {
            const rect = el.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;

            // Calculamos la distancia al centro de viewport
            const distance = Math.abs(centerY - viewportCenter);
            // Extendemos el rango hasta que la imagen salga totalmente:
            // desde el centro hasta el límite + media altura
            const maxDist = viewportCenter + rect.height / 2;

            // Normalizamos y limitamos [0,1]
            const ratio = Math.min(distance / maxDist, 1);

            // Escala lineal: 1 en el centro, maxScale al final del recorrido extendido
            setScale(1 + ratio * (maxScale - 1));
        };

        updateScale();
        window.addEventListener('scroll', updateScale, { passive: true });
        window.addEventListener('resize', updateScale);
        return () => {
            window.removeEventListener('scroll', updateScale);
            window.removeEventListener('resize', updateScale);
        };
    }, [maxScale]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.0s linear',
                }}
            />
        </div>
    );
}
