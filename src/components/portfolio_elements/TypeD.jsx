import React from 'react';
import Description from '../utils/DescriptionA.jsx';



export default function TipoD({
    title,
    description,
    profit,
    src,
    alt = 'GIF',
    isDesktop = false
}) {
    return (
        <div style={{ marginTop: '64px' }}>
            <Description
                title={title}
                description={description}
                profit={profit}
            />

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
