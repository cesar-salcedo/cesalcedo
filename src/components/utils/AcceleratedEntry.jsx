// AcceleratedEntry.js
import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import './AcceleratedEntry.css';

export default function AcceleratedEntry({
    children,
    intensity = 1.0,
    className = ''
}) {
    const placeholderRef = useRef(null);
    const contentRef = useRef(null);

    // Hook corregido para ser más robusto
    useLayoutEffect(() => {
        const contentNode = contentRef.current;
        if (!contentNode) return undefined;

        let animationFrameId = null;

        const ro = new ResizeObserver(entries => {
            // Cancelamos cualquier frame pendiente para evitar trabajo innecesario.
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Programamos la actualización de la altura para el próximo frame de animación.
            // Esto resuelve el error del "loop" al separar la lectura (observador)
            // de la escritura en el DOM.
            animationFrameId = requestAnimationFrame(() => {
                if (entries[0]) {
                    const contentHeight = entries[0].contentRect.height;
                    if (placeholderRef.current) {
                        placeholderRef.current.style.height = `${contentHeight}px`;
                    }
                }
            });
        });

        ro.observe(contentNode);

        // Función de limpieza al desmontar el componente
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            ro.disconnect();
        };
    }, []); // El array de dependencias vacío se mantiene

    // ... resto del componente sin cambios ...
    const clampedIntensity = Math.min(1, Math.max(0, intensity));

    return (
        <div
            ref={placeholderRef}
            className={`accelerated-entry-placeholder ${className}`}
        >
            <div
                ref={contentRef}
                className="accelerated-entry-content"
                style={{ '--intensity': clampedIntensity }}
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