import React, { useState, useEffect } from 'react';

export default function TypeB({ title, description, profit, imageH, imageW }) {
    // Estado para detectar si estamos en escritorio según el ancho de la ventana
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

    // Seleccionamos la imagen según el tamaño de pantalla
    const src = isDesktop ? imageW : imageH;

    return (
        <div style={{
            marginTop: '32px'
        }}>
            <h2 style={{
                textAlign: 'center',
                color: '#25a9f0'
            }}>{title}</h2>
            <h4 style={{
                marginTop: '8px',
                textAlign: 'center',
                marginBottom: '16px'
            }}>{description}</h4>
            <h4 style={{
                marginTop: '8px',
                textAlign: 'center',
                marginBottom: '16px'
            }}>{profit}</h4>

            {/* Imagen responsiva: cambia según isDesktop */}
            <img
                src={src}
                alt={title}
                style={{
                    display: 'block',
                    margin: '0 auto',
                    width: '100%',
                    height: 'auto'
                }}
            />
        </div>
    );
}
