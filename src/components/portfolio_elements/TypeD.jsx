import React, { useState, useEffect } from 'react';

export default function TipoD({ title, description, profit, src, alt = 'GIF' }) {
    // Detectamos si estamos en escritorio (>= 768px)
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= 768 : false
    );

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ marginTop: '64px' }}>
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

            {isDesktop ? (
                // En escritorio: ancho 100%, altura automática
                <img
                    src={src}
                    alt={alt}
                    style={{ display: 'block', margin: '0 auto', width: '100%', height: 'auto' }}
                />
            ) : (
                // En móvil: altura = 100vh, centrado horizontal, recortamos en caso de exceso de ancho
                <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '25%',
                            height: '100vh',
                            transform: 'translateX(-50%)',
                        }}
                    />
                </div>
            )}
        </div>
    );
}
