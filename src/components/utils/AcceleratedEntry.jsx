// AcceleratedEntry.js
import React, {
    useState,
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
        timeoutRef.current = setTimeout(() => fn(...args), delay);
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
    const [contentHeight, setContentHeight] = useState('auto');

    const isIntersectingRef = useRef(false);
    const rafIdRef = useRef(null);

    // Métricas de viewport y puntos de animación
    const metricsRef = useRef({
        viewportHeight: window.innerHeight,
        start: window.innerHeight,
        end: window.innerHeight * 0.4,
        distance: window.innerHeight * 0.6
    });

    // Intensidad y desplazamiento máximo (memoizado)
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    const maxTranslateY = useMemo(
        () => 50 + 200 * clampedIntensity,
        [clampedIntensity]
    );

    // Actualiza las métricas en bloque
    const updateMetrics = useCallback(() => {
        const vh = window.innerHeight;
        metricsRef.current = {
            viewportHeight: vh,
            start: vh,
            end: vh * 0.4,
            distance: vh * 0.6
        };
    }, []);

    // Debounce para resize
    const onResize = useDebouncedCallback(() => {
        updateMetrics();
        onScroll();
    }, 100);

    // Handler de scroll, con rAF
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
            const { top } = placeholderRef.current.getBoundingClientRect();
            const { start, distance } = metricsRef.current;
            const progress = Math.min(1, Math.max(0, (start - top) / distance));

            const node = contentRef.current;
            node.style.opacity = progress;
            node.style.transform = `translateY(${maxTranslateY * (1 - progress)}px)`;
        });
    }, [maxTranslateY]);

    // Observador de tamaño (ResizeObserver)
    useLayoutEffect(() => {
        const ro = new ResizeObserver(entries => {
            const h = entries[0]?.contentRect.height ?? 0;
            setContentHeight(prev => (prev === h ? prev : h));
        });
        contentRef.current && ro.observe(contentRef.current);
        return () => ro.disconnect();
    }, []);

    // Observador de visibilidad (IntersectionObserver)
    useEffect(() => {
        const io = new IntersectionObserver(
            ([entry]) => {
                isIntersectingRef.current = entry.isIntersecting;
            },
            { threshold: 0 }
        );
        placeholderRef.current && io.observe(placeholderRef.current);
        return () => io.disconnect();
    }, []);

    // Scroll & resize listeners
    useEffect(() => {
        const node = contentRef.current;
        if (node) node.style.willChange = 'opacity, transform';

        // disparo inicial para setear estado
        onScroll();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [onScroll, onResize]);

    return (
        <div
            ref={placeholderRef}
            style={{ height: contentHeight, position: 'relative' }}
            className={className}
        >
            <div ref={contentRef} style={{ position: 'sticky', top: 0 }}>
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
