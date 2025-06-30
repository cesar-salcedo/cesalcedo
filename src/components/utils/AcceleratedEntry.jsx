// AcceleratedEntry.jsx
import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'; // Añadimos useEffect
import PropTypes from 'prop-types';

export default function AcceleratedEntry({ children, intensity = 1.0, className = '' }) {
    const placeholderRef = useRef(null);
    const contentRef = useRef(null);

    const [contentHeight, setContentHeight] = useState('auto');
    const [animatedStyle, setAnimatedStyle] = useState({ opacity: 0, transform: 'translateY(100px)' });

    // --- NUEVO: Ref para controlar la visibilidad ---
    // Usamos un ref para saber si el componente está en pantalla, sin causar re-renders.
    const isIntersectingRef = useRef(false);
    const animationFrameId = useRef(null);

    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    const maxTranslateY = 50 + 200 * clampedIntensity;

    // --- EFECTO 1: Observador de tamaño (SIN CAMBIOS) ---
    // Esta lógica es excelente y la conservamos tal cual.
    useLayoutEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                const height = entries[0].contentRect.height;
                setContentHeight(height);
            }
        });
        const node = contentRef.current;
        if (node) observer.observe(node);
        return () => {
            if (node) observer.unobserve(node);
            observer.disconnect();
        };
    }, []);

    // --- EFECTO 2: Observador de visibilidad (NUEVO) ---
    // Este es nuestro "interruptor". Activa y desactiva la lógica de scroll.
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersectingRef.current = entry.isIntersecting;
            },
            // Se activa en cuanto el elemento empieza a entrar o a salir
            { threshold: 0 }
        );
        const node = placeholderRef.current;
        if (node) observer.observe(node);
        return () => {
            if (node) observer.unobserve(node);
        };
    }, []);

    // --- EFECTO 3: Lógica de Animación por Scroll (REFACTORIZADO) ---
    // Este efecto ahora es mucho más performante.
    useEffect(() => {
        const handleScroll = () => {
            // No hacemos NADA si el elemento no está en pantalla.
            if (!isIntersectingRef.current || !placeholderRef.current) {
                return;
            }

            // Cancelamos cualquier frame anterior y pedimos uno nuevo.
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            animationFrameId.current = requestAnimationFrame(() => {
                // La lógica de cálculo de la animación es la misma que antes.
                const { top } = placeholderRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                const animationStartPoint = viewportHeight;
                const animationEndPoint = viewportHeight * 0.4;
                const animationDistance = animationStartPoint - animationEndPoint;

                const rawProgress = (animationStartPoint - top) / animationDistance;
                const progress = Math.max(0, Math.min(1, rawProgress));

                setAnimatedStyle({
                    opacity: progress,
                    transform: `translateY(${maxTranslateY * (1 - progress)}px)`,
                });
            });
        };

        // La llamada inicial es importante para establecer el estado correcto al cargar.
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [clampedIntensity, maxTranslateY]); // Mantenemos las dependencias originales

    return (
        <div
            ref={placeholderRef}
            style={{ height: `${contentHeight}px`, position: 'relative' }}
            className={className}
        >
            <div
                ref={contentRef}
                style={{ ...animatedStyle, position: 'sticky', top: 0 }}
            >
                {children}
            </div>
        </div>
    );
}

AcceleratedEntry.propTypes = {
    children: PropTypes.node.isRequired,
    intensity: PropTypes.number,
    className: PropTypes.string,
};