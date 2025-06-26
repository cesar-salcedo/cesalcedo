import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * Un componente de galería que transiciona entre imágenes mediante un efecto de desenfoque
 * y fundido, con pausas configurables donde la imagen permanece enfocada.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string[]} props.images - Un array de URLs de las imágenes a mostrar.
 * @param {number} [props.scrollSpeed=1.5] - Controla la velocidad de la TRANSICIÓN. Un valor más alto significa que la animación de fundido/desenfoque ocurrirá en una menor distancia de scroll. He aumentado el valor por defecto a 1.5 para una transición más ágil.
 * @param {number} [props.holdRatio=0.5] - Controla la duración de la PAUSA. Es un ratio respecto a la duración de la transición. `0` = sin pausa. `0.5` = la pausa dura un 50% de lo que dura la transición. `1` = la pausa dura lo mismo que la transición.
 * @param {number} [props.maxBlur=30] - El nivel máximo de desenfoque en píxeles.
 */
const BlurFadeScrollGallery = ({
    images,
    scrollSpeed = 2.5,
    holdRatio = 0.7,
    maxBlur = 60,
}) => {
    const containerRef = useRef(null);
    const scrollSpaceRef = useRef(null);
    // Guardamos las props en un ref para que el listener de scroll siempre tenga los valores más actuales
    // sin necesidad de redeclarar el listener.
    const propsRef = useRef({ scrollSpeed, holdRatio });
    propsRef.current = { scrollSpeed, holdRatio };

    const [containerHeight, setContainerHeight] = useState(0);
    // Este estado ahora guardará el progreso "visual", que ya tiene en cuenta las pausas.
    const [visualProgress, setVisualProgress] = useState(0);

    const animCount = Math.max(images.length - 1, 0);

    // --- CÁLCULO DE DIMENSIONES (Lógica modificada) ---
    const updateDimensions = useCallback(() => {
        if (!containerRef.current || animCount === 0) return;

        const { scrollSpeed, holdRatio } = propsRef.current;

        // 1. Calculamos la altura necesaria para una transición.
        const transitionHeight = window.innerHeight * (1 / scrollSpeed);
        // 2. Calculamos la altura de la pausa en base al ratio.
        const holdHeight = transitionHeight * holdRatio;
        // 3. La altura de un "capítulo" completo (pausa + transición).
        const chapterHeight = holdHeight + transitionHeight;

        // 4. El espacio total de scroll es el número de transiciones por la altura de cada capítulo.
        const totalScrollSpace = animCount * chapterHeight;

        scrollSpaceRef.current = { totalScrollSpace, chapterHeight, transitionHeight, holdHeight };
        setContainerHeight(totalScrollSpace + window.innerHeight);

    }, [animCount]);

    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [updateDimensions]);

    // --- MANEJO DEL SCROLL (Lógica modificada) ---
    useEffect(() => {
        const onScroll = () => {
            if (!containerRef.current || !scrollSpaceRef.current) return;

            const { top } = containerRef.current.getBoundingClientRect();
            const { totalScrollSpace, chapterHeight, holdHeight, transitionHeight } = scrollSpaceRef.current;
            if (totalScrollSpace <= 0) return;

            // Progreso total del scroll, de 0 a 1.
            const totalProgress = Math.min(Math.max(-top / totalScrollSpace, 0), 1);

            // --- Lógica de Pausa y Transición ---
            const overallChapterProgress = totalProgress * animCount;
            const chapterIndex = Math.floor(overallChapterProgress);
            const progressWithinChapter = overallChapterProgress - chapterIndex;

            const holdRatioInChapter = holdHeight / chapterHeight;
            const transitionRatioInChapter = transitionHeight / chapterHeight;

            let animationProgress = 0;
            // Si hemos pasado la fase de pausa, calculamos el progreso dentro de la fase de transición.
            if (progressWithinChapter > holdRatioInChapter && transitionRatioInChapter > 0) {
                animationProgress = (progressWithinChapter - holdRatioInChapter) / transitionRatioInChapter;
            }

            // El progreso visual final que se pasa al renderizado.
            // Es la suma de las animaciones completadas más el progreso de la actual.
            const newVisualProgress = chapterIndex + animationProgress;

            setVisualProgress(newVisualProgress);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // Llamada inicial
        return () => window.removeEventListener("scroll", onScroll);
    }, [animCount]);

    // --- RENDERIZADO (Sin cambios) ---
    // La belleza de este enfoque es que la lógica de renderizado no cambia.
    // Simplemente recibe un `visualProgress` que ya ha sido "corregido" para incluir las pausas.
    if (!images?.length) return null;

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
                    // La lógica aquí es idéntica a la versión anterior.
                    const slideProgress = visualProgress - idx;
                    const opacity = Math.max(0, 1 - Math.abs(slideProgress));
                    const blur = Math.min(maxBlur, Math.abs(slideProgress) * maxBlur);
                    const isVisible = opacity > 0;

                    return (
                        <div
                            key={idx}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                zIndex: idx,
                                opacity: opacity,
                                filter: `blur(${blur}px)`,
                                visibility: isVisible ? "visible" : "hidden",
                                willChange: "opacity, filter",
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

export default BlurFadeScrollGallery;