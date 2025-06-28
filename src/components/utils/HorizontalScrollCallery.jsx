import React, { useRef, useEffect, useState, useCallback } from "react";

const HorizontalScrollGallery = ({ images, scrollVelocity = 1, isDesktop = false }) => {
    const containerRef = useRef(null);
    const resScrollVelocity = isDesktop ? scrollVelocity * 3 : scrollVelocity;

    // --- ESTADO MODIFICADO ---
    // Reemplazamos 'scrollX' y 'viewportWidth' por un único estado de progreso.
    const [scrollProgress, setScrollProgress] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // --- CÁLCULO DE DIMENSIONES (Sin cambios funcionales, solo limpieza) ---
    const updateDims = useCallback(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const perSlide = vw / resScrollVelocity;
        const animCount = Math.max(images.length - 1, 0);
        const totalScrollDistance = animCount * perSlide;

        setContainerHeight(totalScrollDistance + vh);
    }, [images.length, resScrollVelocity]);

    useEffect(() => {
        updateDims();
        window.addEventListener("resize", updateDims);
        return () => window.removeEventListener("resize", updateDims);
    }, [updateDims]);


    // --- MANEJO DEL SCROLL (LÓGICA COMPLETAMENTE REFACTORIZADA) ---
    useEffect(() => {
        let animationFrameId;

        const onScroll = () => {
            if (!containerRef.current) return;

            // 1. Obtenemos la posición precisa relativa al viewport.
            const rect = containerRef.current.getBoundingClientRect();

            // 2. Calculamos la distancia total que se puede scrollear.
            const scrollableDistance = containerHeight - window.innerHeight;
            if (scrollableDistance <= 0) return; // Evitar división por cero si no hay scroll.

            // 3. Calculamos el progreso normalizado (0 a 1).
            const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));

            // 4. Actualizamos el estado.
            setScrollProgress(progress);
        };

        const onScrollWithRaf = () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(onScroll);
        };

        window.addEventListener("scroll", onScrollWithRaf, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScrollWithRaf);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [containerHeight]); // La dependencia es solo la altura total.


    // --- RENDERIZADO (Adaptado para usar 'scrollProgress') ---
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

                    // --- LÓGICA DE ANIMACIÓN REVISADA ---
                    const animCount = images.length - 1;
                    const progressPerSlide = 1 / animCount;

                    const startProgress = (idx - 1) * progressPerSlide;
                    const endProgress = idx * progressPerSlide;

                    let x;
                    const vw = window.innerWidth;

                    if (scrollProgress <= startProgress) {
                        // Antes, la imagen está a la derecha.
                        x = vw;
                    } else if (scrollProgress >= endProgress) {
                        // Después, la imagen está en su sitio.
                        x = 0;
                    } else {
                        // Durante la animación, se interpola su posición.
                        const localProgress = (scrollProgress - startProgress) / progressPerSlide;
                        x = vw - (localProgress * vw);
                    }

                    return (
                        <div
                            key={idx}
                            style={{
                                position: "absolute",
                                top: 0, left: 0,
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