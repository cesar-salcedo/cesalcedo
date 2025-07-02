import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollProgress } from '../hooks/useScrollProgress'; // Asegúrate que la ruta sea correcta

export default function DefocusScrollGallery({
    images,
    scrollSpeed = 1.0,
    holdRatio = 0.7,
    maxBlur = 60,
    className = ''
}) {
    const placeholderRef = useRef(null);
    const slideRefs = useRef([]);

    // 1. Calcular duraciones
    const animCount = Math.max(images.length - 1, 0);
    const transitionVh = 1 / scrollSpeed;
    const holdVh = transitionVh * holdRatio;
    const chapterVh = transitionVh + holdVh;

    // CAMBIO CLAVE 1: Separar la duración de la animación de la duración total del scroll.
    // La animación activa ocurre durante los 'animCount' capítulos.
    const animationVh = animCount * chapterVh;
    // La duración total incluye un 'hold' extra para la última imagen.
    const totalDurationInVh = animationVh + holdVh;

    // 2. Usar el hook con la nueva duración total
    const { scrollProgress, containerHeight } = useScrollProgress(placeholderRef, {
        durationInVh: totalDurationInVh
    });

    // 3. Un único useEffect que reacciona a los cambios en el progreso del scroll
    useEffect(() => {
        // CAMBIO CLAVE 2: Calcular el progreso relativo a la animación, no al scroll total.
        // Esto hace que el progreso de la animación llegue a 1 antes de que el scroll termine.
        let animationProgress = 0;
        if (animationVh > 0) {
            animationProgress = (scrollProgress * totalDurationInVh) / animationVh;
        }

        // CAMBIO CLAVE 3: Asegurarse de que el progreso de la animación no pase de 1.
        // Esto "congela" la animación en su estado final durante el último 'hold'.
        const clampedAnimationProgress = Math.min(1, animationProgress);

        const overallProg = clampedAnimationProgress * animCount;
        const chapterIdx = Math.floor(overallProg);
        const within = overallProg - chapterIdx;

        const holdRatioInChapter = holdVh / chapterVh;
        const transRatioInChapter = transitionVh / chapterVh;

        let animProg = 0;
        if (within > holdRatioInChapter && transRatioInChapter > 0) {
            animProg = (within - holdRatioInChapter) / transRatioInChapter;
        }

        const visualProg = chapterIdx + animProg;

        // Aplicar estilos a cada slide (sin cambios aquí)
        slideRefs.current.forEach((node, idx) => {
            if (!node) return;
            node.style.willChange = 'opacity, filter';

            const slideProg = visualProg - idx;
            const opacity = Math.max(0, 1 - Math.abs(slideProg));
            const blur = Math.min(maxBlur, Math.abs(slideProg) * maxBlur);

            node.style.opacity = opacity.toFixed(3);
            node.style.filter = `blur(${blur.toFixed(2)}px)`;
            node.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
        });

    }, [scrollProgress, animCount, chapterVh, holdVh, transitionVh, maxBlur, animationVh, totalDurationInVh]);

    if (!images || images.length === 0) return null;

    // El JSX no cambia
    return (
        <div
            ref={placeholderRef}
            style={{ height: `${containerHeight}px`, position: 'relative' }}
            className={className}
        >
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    backgroundColor: '#000'
                }}
            >
                {images.map((src, idx) => (
                    <div
                        key={idx}
                        ref={el => (slideRefs.current[idx] = el)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: idx,
                            opacity: 0,
                            filter: `blur(${maxBlur}px)`,
                            visibility: 'hidden'
                        }}
                    >
                        <img
                            src={src}
                            alt={`slide-${idx}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

DefocusScrollGallery.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    scrollSpeed: PropTypes.number,
    holdRatio: PropTypes.number,
    maxBlur: PropTypes.number,
    className: PropTypes.string
};