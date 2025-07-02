// ScrollReveal.js
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

export default function ScrollReveal({
    children,
    intensity = 1.0,
    className = ''
}) {
    const placeholderRef = useRef(null);
    const contentRef = useRef(null);
    const contentHeightRef = useRef(0);
    const isIntersectingRef = useRef(false);
    const rafIdRef = useRef(null);

    const metricsRef = useRef({
        start: window.innerHeight,
        distance: window.innerHeight * 0.6
    });

    const clampedIntensity = Math.min(1, Math.max(0, intensity));
    const maxTranslateY = useMemo(
        () => 50 + 200 * clampedIntensity,
        [clampedIntensity]
    );

    const updateMetrics = useCallback(() => {
        const vh = window.innerHeight;
        metricsRef.current = {
            start: vh,
            distance: vh * 0.6
        };
    }, []);

    const onResize = useDebouncedCallback(() => {
        updateMetrics();
        onScroll();
    }, 100);

    const onScroll = useCallback(() => {
        if (
            !isIntersectingRef.current ||
            !placeholderRef.current ||
            !contentRef.current
        ) return;

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

    // --- Observers y listeners existentes (sin cambios) ---
    useLayoutEffect(() => {
        if (!contentRef.current) return;
        const ro = new ResizeObserver(entries => {
            const h = entries[0]?.contentRect.height || 0;
            if (contentHeightRef.current !== h) {
                contentHeightRef.current = h;
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

    // ————— Hook para manejar anclas (hash) —————
    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash;
            if (!hash) return;
            const target = document.getElementById(hash.slice(1));
            if (target && placeholderRef.current.contains(target)) {
                // forzamos scroll hasta esa referencia
                target.scrollIntoView({ behavior: 'auto', block: 'start' });
                // aseguramos revelado completo
                isIntersectingRef.current = true;
                updateMetrics();
                // al siguiente tick
                setTimeout(onScroll, 0);
            }
        };

        // initial
        handleHash();
        // en cambios de hash
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, [updateMetrics, onScroll]);

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

ScrollReveal.propTypes = {
    children: PropTypes.node.isRequired,
    intensity: PropTypes.number,
    className: PropTypes.string
};
