import React, { useRef } from "react"; // De nuevo, reducimos las importaciones
import { useScrollProgress } from "../hooks/useScrollProgress";

const HorizontalScrollGallery = ({ images, scrollVelocity = 1, isDesktop = false }) => {
    const containerRef = useRef(null);

    // 1. La misma lógica para calcular la duración para el hook.
    const resScrollVelocity = isDesktop ? scrollVelocity * 3 : scrollVelocity;
    const animCount = Math.max(images.length - 1, 0);
    const durationInVh = animCount / resScrollVelocity;

    // 2. Usamos el hook.
    const { scrollProgress, containerHeight } = useScrollProgress(containerRef, {
        durationInVh: durationInVh,
    });


    // --- RENDERIZADO (Sin cambios en la lógica de animación) ---
    if (!images?.length) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                height: `${containerHeight}px`,
                backgroundColor: "#efefef",
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
                            <div key={idx} style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0 }}>
                                <img src={src} alt="slide-static" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                        );
                    }

                    const progressPerSlide = 1 / animCount;
                    const startProgress = (idx - 1) * progressPerSlide;
                    const endProgress = idx * progressPerSlide;

                    let x;
                    const vw = typeof window !== 'undefined' ? window.innerWidth : 0;

                    if (scrollProgress <= startProgress) {
                        x = vw;
                    } else if (scrollProgress >= endProgress) {
                        x = 0;
                    } else {
                        const localProgress = (scrollProgress - startProgress) / progressPerSlide;
                        x = vw - (localProgress * vw);
                    }

                    return (
                        <div
                            key={idx}
                            style={{
                                position: "absolute", top: 0, left: 0,
                                width: "100vw", height: "100vh",
                                zIndex: idx,
                                transform: `translateX(${x}px)`,
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

export default HorizontalScrollGallery;