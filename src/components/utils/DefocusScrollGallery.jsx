import React, { useRef, useMemo } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";

const DefocusScrollGallery = ({
    images,
    scrollSpeed = 2.5,
    holdRatio = 0.7,
    maxBlur = 60,
}) => {
    const containerRef = useRef(null);
    const animCount = Math.max(images.length - 1, 0);

    // Los cálculos de duración ahora se hacen dentro del useMemo donde se usan,
    // pero calculamos la duración total aquí para pasarla al hook.
    const transitionDurationVh = 1 / scrollSpeed;
    const holdDurationVh = transitionDurationVh * holdRatio;
    const chapterDurationVh = transitionDurationVh + holdDurationVh;
    const totalDurationInVh = animCount * chapterDurationVh;

    const { scrollProgress, containerHeight } = useScrollProgress(containerRef, {
        durationInVh: totalDurationInVh,
    });

    const visualProgress = useMemo(() => {
        // --- INICIO DE LA CORRECCIÓN 1 ---
        // Movemos los cálculos que dependen de las props aquí dentro.
        const localTransitionDuration = 1 / scrollSpeed;
        const localHoldDuration = localTransitionDuration * holdRatio;
        const localChapterDuration = localTransitionDuration + localHoldDuration;

        if (animCount === 0 || localChapterDuration === 0) return 0;

        const overallChapterProgress = scrollProgress * animCount;
        const chapterIndex = Math.floor(overallChapterProgress);
        const progressWithinChapter = overallChapterProgress - chapterIndex;

        const holdRatioInChapter = localHoldDuration / localChapterDuration;
        const transitionRatioInChapter = localTransitionDuration / localChapterDuration;

        let animationProgress = 0;
        if (progressWithinChapter > holdRatioInChapter && transitionRatioInChapter > 0) {
            animationProgress = (progressWithinChapter - holdRatioInChapter) / transitionRatioInChapter;
        }

        return chapterIndex + animationProgress;
        // Ahora las dependencias son correctas y explícitas para el linter.
    }, [scrollProgress, animCount, scrollSpeed, holdRatio]);
    // --- FIN DE LA CORRECCIÓN 1 ---


    if (!images?.length) return null;

    return (
        <div
            ref={containerRef}
            style={{ position: "relative", height: `${containerHeight}px`, backgroundColor: "#000" }}
        >
            <div
                style={{ position: "sticky", top: 0, left: 0, width: "100%", height: "100vh", overflow: "hidden" }}
            >
                {images.map((src, idx) => {
                    const slideProgress = visualProgress - idx;
                    const opacity = Math.max(0, 1 - Math.abs(slideProgress));

                    // --- INICIO DE LA CORRECCIÓN 2 ---
                    // Usamos maxBlur en lugar de blur en el cálculo.
                    const blur = Math.min(maxBlur, Math.abs(slideProgress) * maxBlur);
                    // --- FIN DE LA CORRECCIÓN 2 ---

                    const isVisible = opacity > 0;

                    return (
                        <div
                            key={idx}
                            style={{
                                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                                zIndex: idx,
                                opacity,
                                filter: `blur(${blur}px)`,
                                visibility: isVisible ? "visible" : "hidden",
                                willChange: "opacity, filter",
                            }}
                        >
                            <img
                                src={src}
                                alt={`slide-${idx}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DefocusScrollGallery;