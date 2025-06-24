import React, { useRef, useEffect, useState, useCallback } from "react";

const HorizontalScrollGallery = ({ images }) => {
    const SCROLL_DIVISOR = 3; // entre más alto, más rápido va el scroll
    const containerRef = useRef(null);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [scrollX, setScrollX] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    const updateDims = useCallback(() => {
        const vw = window.innerWidth;
        setViewportWidth(vw);

        const perSlide = vw / SCROLL_DIVISOR;
        const animCount = Math.max(images.length - 1, 0);
        const totalScrollX = animCount * perSlide;
        setContainerHeight(totalScrollX + window.innerHeight);
    }, [images.length]);

    useEffect(() => {
        updateDims();
        window.addEventListener("resize", updateDims);
        return () => window.removeEventListener("resize", updateDims);
    }, [updateDims]);

    useEffect(() => {
        const onScroll = () => {
            if (!containerRef.current) return;
            const top = containerRef.current.offsetTop;
            const raw = window.scrollY - top;

            const perSlide = viewportWidth / SCROLL_DIVISOR;
            const animCount = Math.max(images.length - 1, 0);
            const max = animCount * perSlide;

            setScrollX(Math.min(Math.max(raw, 0), max));
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [images.length, viewportWidth]);

    if (!images?.length) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                height: `${containerHeight}px`,
                backgroundColor: "#efefef",
            }}
        >
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
                    // Primera imagen estática
                    if (idx === 0) {
                        return (
                            <div
                                key={idx}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100vw",
                                    height: "100vh",
                                    overflow: "hidden",
                                    zIndex: 0,
                                    transform: "translateX(0)",
                                }}
                            >
                                <img
                                    src={src}
                                    alt="slide-static"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        objectPosition: "center center",
                                    }}
                                />
                            </div>
                        );
                    }

                    // Imágenes animadas desde la segunda
                    const perSlide = viewportWidth / SCROLL_DIVISOR;
                    const animIndex = idx - 1;
                    const start = animIndex * perSlide;
                    const end = (animIndex + 1) * perSlide;

                    let x;
                    if (scrollX <= start) {
                        x = viewportWidth;
                    } else if (scrollX >= end) {
                        x = 0;
                    } else {
                        const progress = (scrollX - start) / perSlide;
                        x = viewportWidth - progress * viewportWidth;
                    }

                    return (
                        <div
                            key={idx}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                overflow: "hidden",
                                zIndex: idx,
                                transform: `translateX(${x}px)`,
                                willChange: "transform",
                            }}
                        >
                            <img
                                src={src}
                                alt={`slide-${idx}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "center center",
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HorizontalScrollGallery;
