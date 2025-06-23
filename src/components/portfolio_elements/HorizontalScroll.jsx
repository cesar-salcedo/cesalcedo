// HorizontalScrollGallery.jsx
import React, { useRef, useEffect, useState } from 'react';

const HorizontalScrollGallery = ({ images }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    // Estado para almacenar la altura del contenedor wrapper
    const [containerHeight, setContainerHeight] = useState(0);
    // Estado para almacenar el máximo desplazamiento horizontal (scrollWidth)
    const [maxScrollX, setMaxScrollX] = useState(0);

    useEffect(() => {
        const updateDimensions = () => {
            if (!trackRef.current) return;

            // Ancho total de la pista menos la anchura de la ventana
            const scrollWidth = trackRef.current.scrollWidth - window.innerWidth;
            setMaxScrollX(scrollWidth);

            // Altura del contenedor = desplazamiento horizontal + alto de viewport
            setContainerHeight(scrollWidth + window.innerHeight);
        };

        // Inicial y en resize
        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        const handleScroll = () => {
            if (!containerRef.current || !trackRef.current) return;

            const scrollY = window.scrollY;
            const containerTop = containerRef.current.offsetTop;

            // Calculamos cuánto hemos scrollado dentro de este contenedor
            const scrollInSection = Math.min(
                Math.max(scrollY - containerTop, 0),
                maxScrollX
            );

            // Aplicamos la traslación horizontal inversa
            trackRef.current.style.transform = `translateX(-${scrollInSection}px)`;
        };

        // Usamos scroll normal (compatible con móvil)
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('resize', updateDimensions);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [maxScrollX]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            style={{
                height: `${containerHeight}px`,
                position: 'relative',
                backgroundColor: '#efefef'
            }}
        >

            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <div
                    ref={trackRef}
                    style={{
                        display: 'flex',
                        height: '100%',
                        willChange: 'transform',
                    }}
                >
                    {images.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`slide-${idx}`}
                            style={{
                                flexShrink: 0,
                                width: '100vw',
                                height: '100vh',
                                objectFit: 'cover',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HorizontalScrollGallery;
