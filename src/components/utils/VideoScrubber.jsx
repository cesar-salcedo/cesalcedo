// src/utils/GifScrubber.jsx

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Componente que reproduce un video frame a frame basado en el scroll del usuario.
 * Ideal para animaciones tipo "GIF" controladas por scroll.
 *
 * @param {object} props
 * @param {string} props.src - La ruta al archivo de VIDEO (ej. .mp4).
 * @param {number} [props.scrollFactor=2] - Multiplicador de la altura para el área de scroll.
 * Un valor de 2 significa que el usuario debe scrollear 2 veces la altura de la pantalla
 * para ver la animación completa. Aumenta este valor para ralentizar el efecto.
 */
const GifScrubber = ({ src, scrollFactor = 2 }) => {
    // Referencias a los elementos del DOM.
    const containerRef = useRef(null);
    const videoRef = useRef(null);

    // Estado para la altura total del contenedor que permite el scroll.
    const [containerHeight, setContainerHeight] = useState(0);

    // --- CÁLCULO DE DIMENSIONES ---
    // Función para calcular la altura del contenedor. Se basa en la altura de la
    // ventana multiplicada por el factor de scroll.
    const updateHeight = useCallback(() => {
        if (!containerRef.current) return;
        // La distancia total que el usuario necesita scrollear para completar la animación.
        const scrollDistance = window.innerHeight * scrollFactor;
        // La altura total del contenedor es esa distancia más la altura de la ventana,
        // para asegurar que el último frame permanezca visible durante un scroll completo.
        setContainerHeight(scrollDistance + window.innerHeight);
    }, [scrollFactor]);

    // Efecto para actualizar la altura al montar y al redimensionar la ventana.
    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [updateHeight]);


    // --- MANEJO DEL SCROLL Y LA ANIMACIÓN ---
    useEffect(() => {
        const onScroll = () => {
            if (!containerRef.current || !videoRef.current) return;

            // Esperamos a que los metadatos del video (como la duración) estén cargados.
            if (videoRef.current.readyState < 1) {
                return;
            }

            // 1. Calcular la posición del scroll DENTRO del contenedor.
            const containerTop = containerRef.current.offsetTop;
            const scrollTop = window.scrollY - containerTop;

            // 2. Calcular la distancia total de scroll para la animación.
            const scrollDistance = containerHeight - window.innerHeight;

            // 3. Calcular el progreso del scroll (de 0 a 1).
            let progress = scrollTop / scrollDistance;

            // 4. Limitar el progreso entre 0 y 1 para evitar errores.
            progress = Math.max(0, Math.min(1, progress));

            // 5. Mapear el progreso del scroll al tiempo del video.
            const videoDuration = videoRef.current.duration;
            const targetTime = progress * videoDuration;

            // 6. Actualizar el tiempo actual del video.
            // Esto es mucho más performante que actualizar el estado de React.
            videoRef.current.currentTime = targetTime;
        };

        // El video debe estar listo para ser manipulado.
        const videoElement = videoRef.current;
        const onLoadedMetadata = () => {
            // Llama a onScroll una vez que el video está listo para asegurar el frame inicial correcto.
            onScroll();
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        videoElement.addEventListener('loadedmetadata', onLoadedMetadata);

        // Limpieza de los listeners.
        return () => {
            window.removeEventListener('scroll', onScroll);
            videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
    }, [containerHeight]);


    return (
        // Contenedor principal con la altura calculada para generar el área de scroll.
        <div ref={containerRef} style={{ height: `${containerHeight}px`, position: 'relative' }}>
            {/* Contenedor pegajoso (sticky) que mantendrá el video fijo en la pantalla mientras se hace scroll. */}
            <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
                <video
                    ref={videoRef}
                    src={src}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    playsInline // Esencial para que funcione en iOS sin ir a pantalla completa.
                    muted // A menudo necesario para que los navegadores permitan la "reproducción".
                    preload="auto" // Sugiere al navegador que cargue el video.
                />
            </div>
        </div>
    );
};

export default GifScrubber;