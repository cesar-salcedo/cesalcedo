// src/utils/VerticalScrollGallery.jsx

import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * Un componente de galería que transforma el scroll vertical del usuario en una animación
 * de imágenes que aparecen desde abajo dentro de un contenedor "pegajoso" (sticky).
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string[]} props.images - Un array de URLs de las imágenes a mostrar.
 * @param {number} [props.scrollVelocity=1] - Factor que controla la velocidad. Un valor más alto
 * hace que la animación sea más rápida en relación al scroll vertical.
 * @param {boolean} [props.isDesktop=false] - Para ajustar la velocidad en escritorio.
 */
const VerticalScrollGallery = ({ images, scrollVelocity = 1, isDesktop = false }) => {
    // Referencia al contenedor principal para medir su posición y altura.
    const containerRef = useRef(null);
    const resScrollVelocity = isDesktop ? scrollVelocity * 3 : scrollVelocity;

    // Estados para almacenar las dimensiones y el progreso del scroll.
    const [viewportDimensions, setViewportDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [clampedScrollY, setClampedScrollY] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // --- CÁLCULO DE DIMENSIONES ---
    // La lógica aquí es idéntica a la versión horizontal. Calculamos una altura
    // total para el contenedor que nos da suficiente "espacio de scroll" para
    // completar toda la secuencia de animación.
    const updateDims = useCallback(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        setViewportDimensions({ width: vw, height: vh });

        // 'perSlide' es la cantidad de píxeles de scroll vertical necesarios para la animación de una imagen.
        // Mantenemos la lógica original basada en el ancho para que la 'sensación' de velocidad sea similar.
        const perSlide = vw / resScrollVelocity;
        const animCount = Math.max(images.length - 1, 0);

        // La altura total es la distancia de scroll para todas las animaciones + la altura de la ventana.
        const totalScrollDistance = animCount * perSlide;
        setContainerHeight(totalScrollDistance + vh);
    }, [images.length, resScrollVelocity]);

    // Efecto para actualizar las dimensiones al montar y al redimensionar.
    useEffect(() => {
        updateDims();
        window.addEventListener("resize", updateDims);
        return () => window.removeEventListener("resize", updateDims);
    }, [updateDims]);


    // --- MANEJO DEL SCROLL ---
    // Esta lógica tampoco cambia. Escucha el scroll global y calcula cuánto se ha
    // scrolleado DENTRO de nuestro componente.
    useEffect(() => {
        const onScroll = () => {
            if (!containerRef.current) return;

            const containerTop = containerRef.current.offsetTop;
            const rawScroll = window.scrollY - containerTop;

            const perSlide = viewportDimensions.width / resScrollVelocity;
            const animCount = Math.max(images.length - 1, 0);
            const maxScroll = animCount * perSlide;

            // Guardamos el valor de scroll, limitado entre 0 y el máximo posible.
            const clamped = Math.min(Math.max(rawScroll, 0), maxScroll);
            setClampedScrollY(clamped);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [images.length, viewportDimensions.width, resScrollVelocity]);


    // --- RENDERIZADO ---
    if (!images?.length) return null;

    return (
        // Contenedor principal con la altura calculada para permitir el scroll.
        <div
            ref={containerRef}
            style={{
                position: "relative",
                height: `${containerHeight}px`,
                // El fondo es opcional, ayuda a depurar el área de scroll.
                // backgroundColor: "#111", 
            }}
        >
            {/* Contenedor "pegajoso" que actúa como nuestro viewport de animación. */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                {images.map((src, idx) => {
                    // La primera imagen (idx === 0) es el fondo estático.
                    if (idx === 0) {
                        return (
                            <div
                                key={idx}
                                style={{
                                    position: "absolute",
                                    top: 0, left: 0,
                                    width: "100%", height: "100%",
                                    zIndex: 0,
                                }}
                            >
                                <img src={src} alt="slide-static" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                        );
                    }

                    // --- LÓGICA DE ANIMACIÓN VERTICAL POR IMAGEN ---
                    const perSlide = viewportDimensions.width / resScrollVelocity;
                    const animIndex = idx - 1;

                    // Define el rango de scroll en el que esta imagen se anima.
                    const startAt = animIndex * perSlide;
                    const endAt = (animIndex + 1) * perSlide;

                    // AQUI ESTÁ EL CAMBIO CLAVE
                    let y; // Usamos 'y' para la posición vertical.
                    if (clampedScrollY <= startAt) {
                        // Antes de que empiece su animación, la imagen está fuera de la pantalla, ABAJO.
                        y = viewportDimensions.height;
                    } else if (clampedScrollY >= endAt) {
                        // Después de que termine, la imagen está completamente visible en su posición final.
                        y = 0;
                    } else {
                        // Durante la animación, calcula el progreso (de 0 a 1).
                        const progress = (clampedScrollY - startAt) / perSlide;
                        // Mueve la imagen desde abajo (viewportHeight) hacia arriba (0).
                        y = viewportDimensions.height - (progress * viewportDimensions.height);
                    }

                    return (
                        <div
                            key={idx}
                            style={{
                                position: "absolute",
                                top: 0, left: 0,
                                width: "100%", height: "100%",
                                zIndex: idx,
                                // Aplicamos la transformación en el eje Y.
                                transform: `translateY(${y}px)`,
                                willChange: "transform",
                            }}
                        >
                            <img src={src} alt={`slide-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VerticalScrollGallery;