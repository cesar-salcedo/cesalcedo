import React, { useRef } from "react"; // Ya no necesitamos useState, useEffect, useCallback
import { useScrollProgress } from "../hooks/useScrollProgress"; // Importamos nuestro hook

const VerticalScrollGallery = ({ images, scrollVelocity = 1, isDesktop = false }) => {
    const containerRef = useRef(null);

    // 1. Calculamos la duración para el hook basándonos en las props del componente.
    const resScrollVelocity = isDesktop ? scrollVelocity * 3 : scrollVelocity;
    const animCount = Math.max(images.length - 1, 0);
    // Asumimos que la duración es el número de animaciones dividido por el factor de velocidad.
    const durationInVh = animCount / resScrollVelocity;

    // 2. Usamos el hook y obtenemos todo lo que necesitamos.
    const { scrollProgress, containerHeight } = useScrollProgress(containerRef, {
        durationInVh: durationInVh,
    });

    // --- ¡Toda la lógica de useEffects y useCallbacks ha desaparecido! ---


    // --- RENDERIZADO (Sin cambios en la lógica de animación) ---
    // Esta parte ya estaba preparada para consumir una variable 'scrollProgress'.
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
                        return (
                            <div key={idx} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
                                <img src={src} alt="slide-static" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                        );
                    }

                    const progressPerSlide = 1 / animCount;
                    const startProgress = (idx - 1) * progressPerSlide;
                    const endProgress = idx * progressPerSlide;

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