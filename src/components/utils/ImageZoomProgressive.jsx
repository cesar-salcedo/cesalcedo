import React, { useEffect, useRef, useState } from 'react';

export default function ImageZoomProgressive({
    alt = '',
    src,
    maxScale,
    objectPosition = 'center center',
}) {
    // 1. Ahora el ref principal estará en el contenedor para observar su visibilidad y posición.
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1); // Empezamos en 1, el estado se actualizará al cargar.

    // 2. Añadimos nuestros refs para el patrón de performance.
    const isIntersectingRef = useRef(false);
    const animationFrameId = useRef(null);

    // --- EFECTO 1: Observador de visibilidad (El "Interruptor") ---
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersectingRef.current = entry.isIntersecting;
            },
            { threshold: [0, 1] } // Se activa al entrar y al salir
        );

        const node = containerRef.current;
        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
        };
    }, []);

    // --- EFECTO 2: Lógica de Animación por Scroll (Performante) ---
    useEffect(() => {
        const handleUpdate = () => {
            // No hacemos nada si no está en pantalla
            if (!isIntersectingRef.current || !containerRef.current) {
                return;
            }

            // Cancelamos frames pendientes y creamos uno nuevo
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            animationFrameId.current = requestAnimationFrame(() => {
                // La lógica de cálculo del zoom es EXACTAMENTE la misma que antes.
                // Lo único que cambia es que ahora se ejecuta de forma segura y eficiente.
                const rect = containerRef.current.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const distance = Math.abs(centerY - viewportCenter);
                const maxDist = viewportCenter + rect.height / 2;
                const ratio = Math.min(distance / maxDist, 1);

                setScale(1 + ratio * (maxScale - 1));
            });
        };

        handleUpdate(); // Llamada inicial para el estado correcto al cargar
        window.addEventListener('scroll', handleUpdate, { passive: true });
        window.addEventListener('resize', handleUpdate);

        return () => {
            window.removeEventListener('scroll', handleUpdate);
            window.removeEventListener('resize', handleUpdate);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [maxScale]); // La dependencia de maxScale se mantiene.

    return (
        <div
            // El ref ahora está aquí
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <img
                // El ref de la imagen ya no es necesario
                src={src}
                alt={alt}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    // La transición se puede eliminar o ajustar si se prefiere un leve suavizado.
                    // Para un seguimiento 1:1 del scroll, 0s es correcto.
                    transition: 'transform 0.0s linear',
                }}
            />
        </div>
    );
}