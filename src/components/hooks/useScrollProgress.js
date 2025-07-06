import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook performante para medir el progreso del scroll de un elemento.
 * Devuelve un valor entre 0 y 1 que representa el scroll completado.
 *
 * @param {React.RefObject<HTMLElement>} containerRef - Ref al contenedor observado.
 * @param {object} options
 * @param {number} options.durationInVh - Duración del "scroll falso" en múltiplos de viewport height.
 * @param {number} options.resizeThreshold - Fracción del viewport height mínima para recálculo en resize (default 0.1).
 */
export const useScrollProgress = (
    containerRef,
    { durationInVh = 1, resizeThreshold = 0.1 } = {}
) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    const isIntersecting = useRef(false);
    const scrollSpace = useRef(0);
    const rAFId = useRef(null);
    const lastProgress = useRef(0);
    const lastVh = useRef(0);

    // Calcula scrollSpace y altura, pero ignora cambios menores en vh (UI chrome hide/show)
    const updateScrollSpace = useCallback(() => {
        const vh = window.innerHeight;
        const thresholdPx = vh * resizeThreshold;
        if (lastVh.current && Math.abs(vh - lastVh.current) < thresholdPx) {
            // cambio menor: ignorar
            return;
        }
        lastVh.current = vh;

        const totalScroll = vh * durationInVh;
        scrollSpace.current = totalScroll;

        const newHeight = totalScroll + vh;
        setContainerHeight(prev => (prev !== newHeight ? newHeight : prev));
    }, [durationInVh, resizeThreshold]);

    // Inicial y al cambiar tamaño estatutariamente
    useEffect(() => {
        updateScrollSpace();
        window.addEventListener('resize', updateScrollSpace);
        return () => window.removeEventListener('resize', updateScrollSpace);
    }, [updateScrollSpace]);

    const handleScroll = useCallback(() => {
        if (!isIntersecting.current || !containerRef.current) return;
        if (rAFId.current) cancelAnimationFrame(rAFId.current);

        rAFId.current = requestAnimationFrame(() => {
            const { top } = containerRef.current.getBoundingClientRect();
            const space = scrollSpace.current;
            const raw = space > 0 ? -top / space : top < 0 ? 1 : 0;
            const progress = Math.min(Math.max(raw, 0), 1);

            const delta = Math.abs(progress - lastProgress.current);
            const isFinalStep = progress >= 1 && lastProgress.current < 1;

            if (isFinalStep || delta > 0.001) {
                lastProgress.current = progress;
                setScrollProgress(progress);
            }
        });
    }, [containerRef]);

    // Listener de scroll
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rAFId.current) cancelAnimationFrame(rAFId.current);
        };
    }, [handleScroll]);

    // IntersectionObserver con flush final condicionado
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersecting.current = entry.isIntersecting;
                if (entry.isIntersecting) {
                    handleScroll();
                } else if (entry.boundingClientRect.top < 0) {
                    lastProgress.current = 1;
                    setScrollProgress(1);
                }
            },
            { threshold: 0 }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [containerRef, handleScroll]);

    return { scrollProgress, containerHeight };
};
