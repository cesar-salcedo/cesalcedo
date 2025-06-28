import { useState, useLayoutEffect, useCallback } from 'react';

/**
 * Un hook personalizado que rastrea el progreso del scroll vertical
 * dentro de un elemento contenedor específico.
 *
 * @param {React.RefObject<HTMLElement>} containerRef - Una referencia al elemento contenedor cuyo progreso de scroll se va a medir.
 * @param {object} [options] - Opciones de configuración.
 * @param {boolean} [options.isEnabled=true] - Permite habilitar o deshabilitar el hook.
 * @returns {number} El progreso del scroll como un valor normalizado de 0 a 1.
 */
export function useScrollProgress(containerRef, options = {}) {
    const { isEnabled = true } = options;
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = useCallback(() => {
        if (!containerRef.current || !isEnabled) {
            setScrollProgress(0);
            return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;

        // La altura total del contenedor es su propia altura visible más el scroll "invisible".
        const containerHeight = rect.height;

        // La distancia que se puede scrollear DENTRO del componente.
        const scrollableDistance = containerHeight - vh;

        if (scrollableDistance <= 0) {
            setScrollProgress(1); // Si no hay scroll, se considera completado.
            return;
        }

        // -rect.top nos da el scroll positivo. Lo dividimos por la distancia total
        // y lo acotamos (clamp) entre 0 y 1.
        const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));

        setScrollProgress(progress);

    }, [containerRef, isEnabled]);

    useLayoutEffect(() => {
        // En lugar de usar requestAnimationFrame, podemos simplemente escuchar y dejar
        // que React agrupe los renders. Es más simple y a menudo suficiente.
        // Si se notara lag, se podría reintroducir rAF.
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Llamada inicial para establecer el estado

        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return scrollProgress;
}