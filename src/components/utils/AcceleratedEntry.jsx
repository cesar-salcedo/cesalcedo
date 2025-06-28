// AcceleratedEntry.jsx
import React, { useState, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function AcceleratedEntry({ children, intensity = 1.0, className = '' }) {
    // Referencia para el contenedor exterior (placeholder)
    const placeholderRef = useRef(null);
    // Referencia para el contenedor interior que envuelve a children
    const contentRef = useRef(null);

    // Estado para la altura, que será actualizado dinámicamente por el ResizeObserver
    const [contentHeight, setContentHeight] = useState('auto');
    const [animatedStyle, setAnimatedStyle] = useState({ opacity: 0, transform: 'translateY(100px)' });

    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    const maxTranslateY = 50 + 200 * clampedIntensity;

    // --- EFECTO 1: Observador de tamaño (Soluciona el colapso del layout) ---
    useLayoutEffect(() => {
        // El ResizeObserver nos notificará cada vez que el tamaño del contenido cambie.
        const observer = new ResizeObserver(entries => {
            // entries[0] es nuestro elemento observado (contentRef)
            if (entries[0]) {
                const height = entries[0].contentRect.height;
                setContentHeight(height); // Actualizamos la altura del placeholder
            }
        });

        const node = contentRef.current;
        if (node) {
            observer.observe(node); // Empezamos a observar el contenido
        }

        // Función de limpieza: crucial para evitar memory leaks
        return () => {
            if (node) {
                observer.unobserve(node);
            }
            observer.disconnect();
        };
    }, []); // Se ejecuta solo una vez para configurar el observador

    // --- EFECTO 2: Lógica de Animación por Scroll ---
    useLayoutEffect(() => {
        const handleScroll = () => {
            if (!placeholderRef.current) return;

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
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [clampedIntensity, maxTranslateY]);

    return (
        // 1. EL MARCADOR DE POSICIÓN
        // Ahora su altura es dinámica gracias al ResizeObserver.
        <div
            ref={placeholderRef}
            style={{
                height: `${contentHeight}px`,
                // Este position: relative es necesario como ancla para el hijo "sticky".
                position: 'relative',
            }}
            className={className}
        >
            {/* 2. EL ANIMADOR */}
            {/* Usamos position: sticky. No rompe el layout interno del hijo. */}
            <div
                ref={contentRef}
                style={{
                    ...animatedStyle,
                    position: 'sticky',
                    top: 0, // Se "pegará" en la parte superior de su contenedor (placeholder)
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
    className: PropTypes.string,
};