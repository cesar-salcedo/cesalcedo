// AcceleratedEntry.js
import React, {
    useRef,
    useLayoutEffect,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import PropTypes from 'prop-types';

// Hook de debounce reutilizable
function useDebouncedCallback(fn, delay) {
    const timeoutRef = useRef(null);
    const callback = useCallback((...args) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => fn(...args), delay);
    }, [fn, delay]);
    useEffect(() => () => clearTimeout(timeoutRef.current), []);
    return callback;
}

export default function AcceleratedEntry({
    children,
    intensity = 1.0,
    className = ''
}) {
    const placeholderRef = useRef(null);
    const contentRef = useRef(null);
    const contentHeightRef = useRef(0);
    const isIntersectingRef = useRef(false);
    const rafIdRef = useRef(null);

    // Métricas de viewport y animación
    const metricsRef = useRef({
        start: window.innerHeight,
        distance: window.innerHeight * 0.6
    });

    // Intensidad y desplazamiento máximo (memoizado)
    const clampedIntensity = Math.min(1, Math.max(0, intensity));
    const maxTranslateY = useMemo(
        () => 50 + 200 * clampedIntensity,
        [clampedIntensity]
    );

    // Actualiza las métricas al cambiar tamaño de ventana
    const updateMetrics = useCallback(() => {
        const vh = window.innerHeight;
        metricsRef.current = {
            start: vh,
            distance: vh * 0.6
        };
    }, []);

    // Debounce para resize
    const onResize = useDebouncedCallback(() => {
        updateMetrics();
        onScroll();
    }, 100);

    // Función de scroll con rAF
    const onScroll = useCallback(() => {
        if (
            !isIntersectingRef.current ||
            !placeholderRef.current ||
            !contentRef.current
        ) {
            return;
        }
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

        rafIdRef.current = requestAnimationFrame(() => {
            const top = placeholderRef.current.getBoundingClientRect().top;
            const { start, distance } = metricsRef.current;
            const progress = Math.min(1, Math.max(0, (start - top) / distance));

            const node = contentRef.current;
            node.style.opacity = progress;
            node.style.transform = `translateY(${maxTranslateY * (1 - progress)}px)`;
        });
    }, [maxTranslateY]);

    // Observador de tamaño: actualiza placeholder height dentro de rAF para romper el ciclo
    useLayoutEffect(() => {
        if (!contentRef.current) return;

        const ro = new ResizeObserver(entries => {
            const h = entries[0]?.contentRect.height || 0;
            if (contentHeightRef.current !== h) {
                contentHeightRef.current = h;
                // Actualiza el estilo en el siguiente frame
                window.requestAnimationFrame(() => {
                    if (placeholderRef.current) {
                        placeholderRef.current.style.height = `${h}px`;
                    }
                });
            }
        });

        ro.observe(contentRef.current);
        return () => ro.disconnect();
    }, []);

    // Observador de visibilidad
    useEffect(() => {
        if (!placeholderRef.current) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                isIntersectingRef.current = entry.isIntersecting;
            },
            { threshold: 0 }
        );
        io.observe(placeholderRef.current);
        return () => io.disconnect();
    }, []);

    // Listeners de scroll y resize
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.willChange = 'opacity, transform';
        }
        updateMetrics();
        onScroll();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [onScroll, onResize, updateMetrics]);

    return (
        <div
            ref={placeholderRef}
            className={className}
            style={{ position: 'relative', height: `${contentHeightRef.current}px` }}
        >
            <div
                ref={contentRef}
                style={{
                    position: 'sticky',
                    top: 0,
                    opacity: 0,
                    transform: `translateY(${maxTranslateY}px)`
                }}
            >
                {children}
            </div>
        </div>
    );
}

AcceleratedEntry.propTypes = {
    children: PropTypes.node.isRequired,
    intensity: PropTypes.number,
    className: PropTypes.string
};
