
import React, { useState, useEffect } from 'react';

export default function TipoD({ title, description, profit, src, alt = 'GIF' }) {
    // Detectamos si estamos en escritorio (>= 768px)
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= 768 : false
    );

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ marginTop: '128px' }}>
            {/* Título y descripciones */}
            <h2 style={{ textAlign: 'center', color: '#25a9f0', marginBottom: '8px' }}>
                {title}
            </h2>
            <h4 style={{ textAlign: 'center', marginBottom: '8px' }}>
                {description}
            </h4>
            <h4 style={{ textAlign: 'center', marginBottom: '16px' }}>
                {profit}
            </h4>

            {/* GIF recortado en móvil, completo en escritorio */}
            {isDesktop ? (
                <img
                    src={src}
                    alt={alt}
                    style={{ display: 'block', margin: '0 auto', width: '100%', height: 'auto' }}
                />
            ) : (
                <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>

                    <img
                        src={src}
                        alt={alt}
                        style={{


                            left: '50%',
                            height: '100%',
                            transform: 'translateX(-50%)',

                        }}
                    />
                </div>
            )}
        </div>
    );
}
