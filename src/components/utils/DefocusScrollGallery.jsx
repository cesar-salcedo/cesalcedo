import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function DefocusScrollGallery({
    images,
    scrollSpeed = 1.0,
    holdRatio = 0.7,
    maxBlur = 60,
    className = ''
}) {
    const placeholderRef = useRef(null);
    const slideRefs = useRef([]);
    const [containerHeight, setContainerHeight] = useState('auto');

    const animCount = Math.max(images.length - 1, 0);
    const transitionVh = 1 / scrollSpeed;
    const holdVh = transitionVh * holdRatio;
    const chapterVh = transitionVh + holdVh;
    const totalVh = animCount * chapterVh;

    // Calcular altura en píxeles según viewport
    useEffect(() => {
        const updateHeight = () => {
            setContainerHeight(window.innerHeight * totalVh);
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [totalVh]);

    // Animación por scroll manipulando el DOM directamente
    useEffect(() => {
        let rafId;

        // Pre-promoción de capas
        slideRefs.current.forEach(node => {
            if (node) node.style.willChange = 'opacity, filter';
        });

        const handleScroll = () => {
            if (!placeholderRef.current) return;
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const { top } = placeholderRef.current.getBoundingClientRect();
                const viewportH = window.innerHeight;
                const maxScroll = containerHeight - viewportH;
                const scrollDelta = -Math.min(0, top);
                const scrollProg = maxScroll > 0 ? Math.min(1, Math.max(0, scrollDelta / maxScroll)) : 0;

                // Cálculo de progreso visual
                const overallProg = scrollProg * animCount;
                const chapterIdx = Math.floor(overallProg);
                const within = overallProg - chapterIdx;
                const holdRatioInChapter = holdVh / chapterVh;
                const transRatioInChapter = transitionVh / chapterVh;
                let animProg = 0;
                if (within > holdRatioInChapter && transRatioInChapter > 0) {
                    animProg = (within - holdRatioInChapter) / transRatioInChapter;
                }
                const visualProg = chapterIdx + animProg;

                // Aplicar estilos a cada slide
                slideRefs.current.forEach((node, idx) => {
                    if (!node) return;
                    const slideProg = visualProg - idx;
                    const opacity = Math.max(0, 1 - Math.abs(slideProg));
                    const blur = Math.min(maxBlur, Math.abs(slideProg) * maxBlur);
                    node.style.opacity = opacity;
                    node.style.filter = `blur(${blur}px)`;
                    node.style.visibility = opacity > 0 ? 'visible' : 'hidden';
                });
            });
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [animCount, containerHeight, transitionVh, holdVh, chapterVh, maxBlur]);

    if (!images || images.length === 0) return null;

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
