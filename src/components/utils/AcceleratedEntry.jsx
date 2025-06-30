// AcceleratedEntry.jsx
import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function AcceleratedEntry({ children, intensity = 1.0, className = '' }) {
    const placeholderRef = useRef(null);
    const contentRef = useRef(null);

    // State para mantener la altura del contenido
    const [contentHeight, setContentHeight] = useState('auto');

    // Refs para control de visibilidad y animación
    const isIntersectingRef = useRef(false);
    const animationFrameId = useRef(null);

    // Intensidad ajustada
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    const maxTranslateY = 50 + 200 * clampedIntensity;

    // --- EFECTO 1: Observador de tamaño ---
    useLayoutEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                setContentHeight(entries[0].contentRect.height);
            }
        });

        const node = contentRef.current;
        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
            observer.disconnect();
        };
    }, []);

    // --- EFECTO 2: Observador de visibilidad ---
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersectingRef.current = entry.isIntersecting;
            },
            { threshold: 0 }
        );

        const node = placeholderRef.current;
        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
        };
    }, []);

    // --- EFECTO 3: Animación por scroll con manipulación directa del DOM ---
    useEffect(() => {
        const node = contentRef.current;
        if (node) {
            // Promocionar la capa de composición para suavizar la animación
            node.style.willChange = 'opacity, transform';
        }

        // Variables de cálculo (se recalculan en resize)
        let viewportHeight = window.innerHeight;
        let animationStartPoint = viewportHeight;
        let animationEndPoint = viewportHeight * 0.4;
        let animationDistance = animationStartPoint - animationEndPoint;

        const updateMetrics = () => {
            viewportHeight = window.innerHeight;
            animationStartPoint = viewportHeight;
            animationEndPoint = viewportHeight * 0.4;
            animationDistance = animationStartPoint - animationEndPoint;
        };

        const handleScroll = () => {
            if (!isIntersectingRef.current || !placeholderRef.current) return;

            // Cancelar frame existente
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            animationFrameId.current = requestAnimationFrame(() => {
                const { top } = placeholderRef.current.getBoundingClientRect();
                const rawProgress = (animationStartPoint - top) / animationDistance;
                const progress = Math.max(0, Math.min(1, rawProgress));

                if (node) {
                    node.style.opacity = progress;
                    node.style.transform = `translateY(${maxTranslateY * (1 - progress)}px`;
                }
            });
        };

        // Inicializa estado y listeners
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', () => {
            updateMetrics();
            handleScroll();
        }, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateMetrics);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [maxTranslateY]);

    return (
        <div
            ref={placeholderRef}
            style={{ height: `${contentHeight}px`, position: 'relative' }}
            className={className}
        >
            <div
                ref={contentRef}
                style={{ position: 'sticky', top: 0 }}
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
