import React, { useRef, Fragment, useState, useEffect } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress"; // Importamos el hook genérico

const GuillotineScrollGallery = ({
    images,
    scrollVelocity = 1.5,
    diagonalAngle = 25,
    separatorWidth = 4,
    separatorColor = "white",
}) => {
    const containerRef = useRef(null);
    const animCount = Math.max(images.length - 1, 0);

    // 1. Usamos el hook genérico, traduciendo nuestras props a 'durationInVh'
    const { scrollProgress, containerHeight } = useScrollProgress(containerRef, {
        durationInVh: animCount / scrollVelocity,
    });

    // 2. El componente ahora es responsable de su propia lógica de presentación
    const [separatorGeometry, setSeparatorGeometry] = useState({ angle: 0, height: 0 });

    useEffect(() => {
        const calculateGeometry = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const horiz = (diagonalAngle / 100) * vw;
            const angleRad = Math.atan(horiz / vh);

            setSeparatorGeometry({
                angle: angleRad * 180 / Math.PI,
                height: Math.hypot(vh, horiz),
            });
        };

        calculateGeometry(); // Cálculo inicial
        window.addEventListener('resize', calculateGeometry);
        return () => window.removeEventListener('resize', calculateGeometry);
    }, [diagonalAngle]); // Recalcular si el ángulo cambia

    if (!images?.length) return null;

    return (
        <div
            ref={containerRef}
            style={{ height: `${containerHeight}px`, position: "relative", backgroundColor: "#000" }}
        >
            <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
                {images.map((src, idx) => {
                    const slideProg = scrollProgress * animCount - (idx - 1);
                    const p = Math.min(Math.max(slideProg, 0), 1);

                    // Lógica de clip-path y opacidad (sin cambios)
                    let clip = "polygon(100% 0%,100% 0%,100% 100%,100% 100%)";
                    let sepX = 0;
                    let sepOp = 0;

                    if (p > 0 && p < 1) {
                        const revealW = 100 + diagonalAngle;
                        const topPos = p * revealW;
                        const botPos = topPos - diagonalAngle;
                        const leftTop = 100 - topPos;
                        const leftBot = 100 - botPos;

                        clip = `polygon(${leftTop}% 0%,100% 0%,100% 100%,${leftBot}% 100%)`;
                        sepX = (leftTop / 100) * window.innerWidth;
                        sepOp = 1;
                    } else if (p >= 1) {
                        clip = "polygon(0% 0%,100% 0%,100% 100%,0% 100%)";
                    }
                    if (idx === 0) clip = "none";

                    return (
                        <Fragment key={idx}>
                            <div style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: idx, clipPath: clip, willChange: "clip-path" }}>
                                <img src={src} alt={`slide-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>

                            {idx > 0 && separatorWidth > 0 && sepOp > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: `${sepX}px`,
                                        width: `${separatorWidth}px`,
                                        // Usamos los valores de nuestro estado local
                                        height: `${separatorGeometry.height}px`,
                                        backgroundColor: separatorColor,
                                        zIndex: idx,
                                        opacity: sepOp,
                                        willChange: "left, opacity, transform",
                                        transformOrigin: "top left",
                                        transform: `rotate(-${separatorGeometry.angle}deg)`,
                                    }}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default GuillotineScrollGallery;