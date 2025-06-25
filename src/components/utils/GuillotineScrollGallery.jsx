import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * Un componente de galería que revela imágenes mediante un efecto de "guillotina" diagonal
 * sincronizado con el scroll vertical del usuario. Versión corregida para que la última imagen permanezca fija.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string[]} props.images - Un array de URLs de las imágenes a mostrar.
 * @param {number} [props.scrollVelocity=1.5] - Factor que controla la cantidad de scroll necesario para una transición.
 * @param {number} [props.diagonalAngle=25] - Define la inclinación del barrido en porcentaje.
 */
const GuillotineScrollGallery = ({
    images,
    scrollVelocity = 1.5,
    diagonalAngle = 25,
}) => {
    const containerRef = useRef(null);
    const scrollSpaceRef = useRef(0); // <-- 1. Añadimos un Ref para la distancia de scroll
    const [containerHeight, setContainerHeight] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    // --- CÁLCULO DE DIMENSIONES ---
    const updateDimensions = useCallback(() => {
        if (!containerRef.current) return;

        const animCount = Math.max(images.length - 1, 0);
        const totalScrollSpace = window.innerHeight * animCount * (1 / scrollVelocity);

        // Guardamos la distancia de scroll de la animación en el ref
        scrollSpaceRef.current = totalScrollSpace;

        // La altura total incluye el espacio para la animación MÁS un viewport entero de "pausa"
        setContainerHeight(totalScrollSpace + window.innerHeight);

    }, [images.length, scrollVelocity]);

    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [updateDimensions]);

    // --- MANEJO DEL SCROLL ---
    useEffect(() => {
        const onScroll = () => {
            if (!containerRef.current) return;

            const { top } = containerRef.current.getBoundingClientRect();

            // <-- 2. La corrección clave está aquí
            // Calculamos el progreso basándonos en la distancia de animación guardada en el ref.
            // Ya no depende de la altura total del contenedor.
            const scrollableDist = scrollSpaceRef.current;
            if (scrollableDist <= 0) return;

            const progress = -top / scrollableDist;

            const clampedProgress = Math.min(Math.max(progress, 0), 1);

            setScrollProgress(clampedProgress);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // --- RENDERIZADO ---
    if (!images?.length) return null;

    const animCount = Math.max(images.length - 1, 0);

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                height: `${containerHeight}px`,
                backgroundColor: "#000",
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
                    const progressForThisSlide = (scrollProgress * animCount) - (idx - 1);
                    const clampedProgress = Math.min(Math.max(progressForThisSlide, 0), 1);

                    let clipPathValue = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"; // Oculto desde la derecha

                    if (clampedProgress > 0 && clampedProgress < 1) {
                        const revealWidth = 100 + diagonalAngle;
                        const topRevealPosition = clampedProgress * revealWidth;
                        const bottomRevealPosition = topRevealPosition - diagonalAngle;
                        const leftTopX = 100 - topRevealPosition;
                        const leftBottomX = 100 - bottomRevealPosition;
                        clipPathValue = `polygon(${leftTopX}% 0%, 100% 0%, 100% 100%, ${leftBottomX}% 100%)`;
                    } else if (clampedProgress >= 1) {
                        clipPathValue = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"; // Completamente visible
                    }

                    // La primera imagen es la base, siempre visible por debajo.
                    if (idx === 0) {
                        clipPathValue = "none";
                    }

                    return (
                        <div
                            key={idx}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                zIndex: idx,
                                clipPath: clipPathValue,
                                willChange: "clip-path",
                            }}
                        >
                            <img
                                src={src}
                                alt={`slide-${idx}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GuillotineScrollGallery;