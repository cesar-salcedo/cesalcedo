import React, { useRef, useEffect, useState, useCallback } from "react";

const VerticalScrollGallery = ({ images, scrollVelocity = 1, isDesktop = false }) => {
    const containerRef = useRef(null);
    const resScrollVelocity = isDesktop ? scrollVelocity * 3 : scrollVelocity;

    // --- ESTADO MODIFICADO ---
    // Eliminamos 'clampedScrollY' y 'viewportDimensions'.
    // Añadimos 'scrollProgress' que irá de 0 a 1.
    const [scrollProgress, setScrollProgress] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // --- CÁLCULO DE DIMENSIONES (Ligeramente simplificado) ---
    // Ahora solo necesita calcular la altura total del contenedor.
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
        // Envolvemos el manejador en requestAnimationFrame para optimizar.
        let animationFrameId;

        const onScroll = () => {
            if (!containerRef.current) return;

            // 1. Obtenemos la posición actual y precisa relativa al viewport.
            const rect = containerRef.current.getBoundingClientRect();

            // 2. Calculamos la distancia total de scroll para la animación.
            const scrollableDistance = containerHeight - window.innerHeight;

            // 3. Calculamos el progreso normalizado (0 a 1).
            // -rect.top nos da el scroll positivo dentro del componente.
            // Lo dividimos por la distancia total y lo acotamos entre 0 y 1.
            const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));

            // 4. Actualizamos el estado con el nuevo progreso.
            setScrollProgress(progress);
        };

        const onScrollWithRaf = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            animationFrameId = requestAnimationFrame(onScroll);
        };

        window.addEventListener("scroll", onScrollWithRaf, { passive: true });
        onScroll(); // Llamada inicial

        return () => {
            window.removeEventListener("scroll", onScrollWithRaf);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [containerHeight]); // La dependencia ahora es solo la altura del contenedor.


    // --- RENDERIZADO (Adaptado para usar 'scrollProgress') ---
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

                    // --- LÓGICA DE ANIMACIÓN REVISADA ---
                    // El progreso total de la animación (0 a 1) se divide entre las imágenes.
                    const animCount = images.length - 1;
                    const progressPerSlide = 1 / animCount;

                    // Rango de progreso para esta imagen específica.
                    const startProgress = (idx - 1) * progressPerSlide;
                    const endProgress = idx * progressPerSlide;

                    let y;
                    const vh = window.innerHeight; // Obtenemos la altura del viewport aquí.

                    if (scrollProgress <= startProgress) {
                        // Antes de que empiece su animación, está abajo.
                        y = vh;
                    } else if (scrollProgress >= endProgress) {
                        // Después de terminar, está en su posición final.
                        y = 0;
                    } else {
                        // Durante la animación, calculamos su progreso local (de 0 a 1).
                        const localProgress = (scrollProgress - startProgress) / progressPerSlide;
                        y = vh - (localProgress * vh);
                    }

                    return (
                        <div
                            key={idx}
                            style={{
                                position: "absolute",
                                top: 0, left: 0,
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