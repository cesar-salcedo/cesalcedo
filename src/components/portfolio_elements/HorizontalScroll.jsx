import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * Un componente de galería que transforma el scroll vertical en un desplazamiento horizontal
 * de imágenes dentro de un contenedor "pegajoso" (sticky).
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string[]} props.images - Un array de URLs de las imágenes a mostrar.
 * @param {number} [props.scrollVelocity=3] - Un factor que controla la velocidad de la animación.
 * Un valor más alto hace que el scroll horizontal sea más rápido en relación al scroll vertical.
 * Se recomienda un valor entre 2.5 y 4 para una experiencia óptima.
 */
const HorizontalScrollGallery = ({ images, scrollVelocity = 1, isDesktop = false }) => {
    // Referencia al contenedor principal para medir su posición y altura.
    const resScrollVelocity = isDesktop ? scrollVelocity * 3 : scrollVelocity;
    const containerRef = useRef(null);

    // Estados para almacenar las dimensiones necesarias para los cálculos.
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [scrollX, setScrollX] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // --- CÁLCULO DE DIMENSIONES ---
    // Esta función se encarga de calcular la altura total que debe tener el contenedor
    // para que el efecto de scroll funcione correctamente.
    const updateDims = useCallback(() => {
        const vw = window.innerWidth;
        setViewportWidth(vw);

        // 'perSlide' es la cantidad de píxeles de scroll vertical que se necesitan
        // para completar la transición de una sola imagen.
        const perSlide = vw / resScrollVelocity;

        // Número de animaciones (una menos que el total de imágenes, ya que la primera es estática).
        const animCount = Math.max(images.length - 1, 0);

        // La altura total es la distancia de scroll necesaria para todas las animaciones,
        // más la altura de la ventana para asegurar que el último frame permanezca visible.
        const totalScrollDistance = animCount * perSlide;
        setContainerHeight(totalScrollDistance + window.innerHeight);
    }, [images.length, resScrollVelocity]);

    // Efecto para actualizar las dimensiones al montar el componente y al redimensionar la ventana.
    useEffect(() => {
        updateDims();
        window.addEventListener("resize", updateDims);
        return () => window.removeEventListener("resize", updateDims);
    }, [updateDims]);


    // --- MANEJO DEL SCROLL ---
    // Este efecto escucha el evento de scroll de la página y calcula la posición
    // de la animación horizontal.
    useEffect(() => {
        const onScroll = () => {
            if (!containerRef.current) return;

            // Calcula cuánto se ha scrolleado dentro del contenedor principal.
            const containerTop = containerRef.current.offsetTop;
            const rawScroll = window.scrollY - containerTop;

            // Define los límites de la animación.
            const perSlide = viewportWidth / resScrollVelocity;
            const animCount = Math.max(images.length - 1, 0);
            const maxScroll = animCount * perSlide;

            // Limita el valor de scrollX entre 0 y el máximo posible para evitar cálculos erróneos.
            const clampedScroll = Math.min(Math.max(rawScroll, 0), maxScroll);
            setScrollX(clampedScroll);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // Llama una vez al inicio para la posición inicial.
        return () => window.removeEventListener("scroll", onScroll);
    }, [images.length, viewportWidth, resScrollVelocity]);


    // --- RENDERIZADO ---
    if (!images?.length) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                height: `${containerHeight}px`,
                backgroundColor: "#efefef", // Un fondo para visualizar el área total.
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
                    // La primera imagen (idx === 0) es estática y sirve de fondo inicial.
                    if (idx === 0) {
                        return (
                            <div
                                key={idx}
                                style={{
                                    position: "absolute",
                                    top: 0, left: 0,
                                    width: "100vw", height: "100vh",
                                    zIndex: 0,
                                }}
                            >
                                <img src={src} alt="slide-static" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                        );
                    }

                    // --- LÓGICA DE ANIMACIÓN POR IMAGEN ---
                    const perSlide = viewportWidth / resScrollVelocity;
                    const animIndex = idx - 1; // El índice de animación empieza desde 0 para la segunda imagen.

                    // Define el rango de scroll en el que esta imagen específica debe animarse.
                    const startAt = animIndex * perSlide;
                    const endAt = (animIndex + 1) * perSlide;

                    let x; // La posición translateX de la imagen.
                    if (scrollX <= startAt) {
                        // Antes de que empiece su animación, la imagen está fuera de la pantalla a la derecha.
                        x = viewportWidth;
                    } else if (scrollX >= endAt) {
                        // Después de que termine su animación, la imagen está completamente visible.
                        x = 0;
                    } else {
                        // Durante la animación, calcula el progreso (de 0 a 1).
                        const progress = (scrollX - startAt) / perSlide;
                        // Mueve la imagen desde la derecha (viewportWidth) hacia la izquierda (0).
                        x = viewportWidth - (progress * viewportWidth);
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
                                willChange: "transform", // Optimización para el navegador.
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