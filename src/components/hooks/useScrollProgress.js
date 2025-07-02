// hooks/useScrollProgress.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook performante para medir el progreso del scroll de un elemento.
 * Devuelve un valor entre 0 y 1 que representa el scroll completado.
 *
 * @param {React.RefObject<HTMLElement>} containerRef - Ref al contenedor observado.
 * @param {object} options
 * @param {number} options.durationInVh - Duración del "scroll falso" en múltiplos de viewport height.
 */
export const useScrollProgress = (containerRef, { durationInVh = 1 } = {}) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // Refs para evitar dependencias y renders
    const isIntersecting = useRef(false);
    const scrollSpace = useRef(0);
    const rAFId = useRef(null);
    const lastProgress = useRef(0);
    // const resizeScheduled = useRef(false); // Eliminado

    // Calcula scrollSpace y altura. Ahora solo se recalcula si durationInVh cambia.
    const updateScrollSpace = useCallback(() => {
        const vh = window.innerHeight;
        const totalScroll = vh * durationInVh;
        scrollSpace.current = totalScroll;

        const newHeight = totalScroll + vh;
        // La comparación en setContainerHeight ya previene renders innecesarios
        setContainerHeight(prev => (prev !== newHeight ? newHeight : prev));

    }, [durationInVh]);

    // Eliminado el useEffect que escuchaba el evento 'resize'.

    // Este useEffect ahora solo se encarga de calcular el espacio una vez.
    useEffect(() => {
        updateScrollSpace();
    }, [updateScrollSpace]);

    // Handler de scroll: throttle con requestAnimationFrame y sólo setState si cambia
    const handleScroll = useCallback(() => {
        if (!isIntersecting.current || !containerRef.current) return;
        if (rAFId.current) cancelAnimationFrame(rAFId.current);

        rAFId.current = requestAnimationFrame(() => {
            const { top } = containerRef.current.getBoundingClientRect();
            const space = scrollSpace.current;
            const raw = space > 0 ? -top / space : (top < 0 ? 1 : 0);
            const progress = Math.min(Math.max(raw, 0), 1);

            // Umbral pequeño para evitar micro‐renders
            if (Math.abs(progress - lastProgress.current) > 0.001) {
                lastProgress.current = progress;
                setScrollProgress(progress);
            }
        });
    }, [containerRef]); // La dependencia de containerRef es suficiente aquí

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rAFId.current) cancelAnimationFrame(rAFId.current);
        };
    }, [handleScroll]);

    // IntersectionObserver para habilitar/deshabilitar el scroll handler
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersecting.current = entry.isIntersecting;
            },
            { threshold: 0 }
        );
        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, [containerRef]);

    return { scrollProgress, containerHeight };
};