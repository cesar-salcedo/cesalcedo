// hooks/useScrollProgress.js

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook genérico y performante para medir el progreso del scroll de un elemento.
 * Devuelve un valor entre 0 y 1 que representa el scroll completado.
 *
 * @param {React.RefObject<HTMLElement>} containerRef - Ref al contenedor que se va a observar.
 * @param {object} options - Opciones de configuración.
 * @param {number} options.durationInVh - La duración del "scroll falso" en múltiplos de la altura del viewport.
 * Por ejemplo, un valor de 2 significa que la animación durará lo que se tarda en hacer scroll de 2 pantallas.
 * @returns {{scrollProgress: number, containerHeight: number}} - El progreso del scroll y la altura calculada para el contenedor.
 */
export const useScrollProgress = (containerRef, { durationInVh = 1 }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    const isIntersectingRef = useRef(false);
    const scrollSpaceRef = useRef(0);
    const animationFrameId = useRef(null);

    // Esta función ahora es más simple. Solo calcula la altura del contenedor.
    const updateScrollSpace = useCallback(() => {
        const vh = window.innerHeight;
        const totalScroll = vh * durationInVh;

        scrollSpaceRef.current = totalScroll;
        setContainerHeight(totalScroll + vh);
    }, [durationInVh]);

    // Efecto para manejar el scroll y actualizar el progreso
    useEffect(() => {
        const handleScroll = () => {
            if (!isIntersectingRef.current || !containerRef.current) return;

            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            animationFrameId.current = requestAnimationFrame(() => {
                const { top } = containerRef.current.getBoundingClientRect();
                const scrollSpace = scrollSpaceRef.current;

                if (scrollSpace > 0) {
                    const progress = Math.min(Math.max(-top / scrollSpace, 0), 1);
                    setScrollProgress(progress);
                } else {
                    // Si no hay espacio de scroll, el progreso es 0 o 1 si ya pasó.
                    setScrollProgress(top < 0 ? 1 : 0);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateScrollSpace);
        updateScrollSpace(); // Llamada inicial

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateScrollSpace);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [updateScrollSpace, containerRef]);


    // Este efecto no cambia. Sigue siendo nuestro interruptor de performance.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersectingRef.current = entry.isIntersecting;
            },
            { threshold: 0 }
        );

        observer.observe(container);

        return () => {
            if (container) observer.unobserve(container);
        };
    }, [containerRef]);

    // Devolvemos solo los valores genéricos
    return {
        scrollProgress,
        containerHeight
    };
};