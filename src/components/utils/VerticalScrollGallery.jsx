import React, { useRef } from "react"; // Ya no necesitamos useState, useEffect, useCallback
import { useScrollProgress } from "../hooks/useScrollProgress"; // Importamos nuestro hook

const VerticalScrollGallery = ({ images, scrollVelocity = 1, isDesktop = false }) => {
    const containerRef = useRef(null);

    // 1. La velocidad de scroll.
    const resScrollVelocity = isDesktop ? scrollVelocity * 3 : scrollVelocity;

    // 2. La duración TOTAL del scroll se basa en el número de imágenes.
    // Esto da la longitud correcta a la "pista" de scroll.
    const durationInVh = images.length / resScrollVelocity;

    // 3. El número de ANIMACIONES es una menos que el total de imágenes.
    const animationCount = Math.max(images.length - 1, 0);

    // 4. Usamos el hook con la duración correcta.
    const { scrollProgress, containerHeight } = useScrollProgress(containerRef, {
        durationInVh: durationInVh,
    });

    // Renderizado
    if (!images?.length) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                height: `${containerHeight}px`,
            }}
        >
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                {images.map((src, idx) => {
                    if (idx === 0) {
                        // ... el resto del código para la imagen estática ...
                        return (
                            <div key={idx} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
                                <img src={src} alt="slide-static" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                        );
                    }

                    // 5. IMPORTANTE: El progreso por slide se divide entre el número de ANIMACIONES.
                    // Esto estira las animaciones para que ocupen todo el recorrido del scroll sin dejar pausas.
                    const progressPerSlide = animationCount > 0 ? 1 / animationCount : 0;
                    const startProgress = (idx - 1) * progressPerSlide;
                    const endProgress = idx * progressPerSlide;

                    // ... el resto de tu lógica de cálculo de 'y' y renderizado es correcta y no necesita cambios ...
                    let y;
                    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

                    if (scrollProgress <= startProgress) {
                        y = vh;
                    } else if (scrollProgress >= endProgress) {
                        y = 0;
                    } else {
                        const localProgress = (scrollProgress - startProgress) / progressPerSlide;
                        y = vh - (localProgress * vh);
                    }

                    return (
                        <div
                            key={idx}
                            style={{
                                position: "absolute", top: 0, left: 0,
                                width: "100%", height: "100%",
                                zIndex: idx,
                                transform: `translateY(${y}px)`,
                                willChange: "transform",
                            }}
                        >
                            <img src={src} alt={`slide-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VerticalScrollGallery;