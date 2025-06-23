import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * HorizontalScrollGallery
 * -----------------------
 * • Desktop (≥ 1024 px): every slide **after the first** is cropped to 50 vw so
 *   the horizontal journey is halved ⇢ faster progression.
 * • Mobile/tablet: original full-width behaviour.
 * • NEW: Cropped slides now display the **central portion** of each image.
 */

const DESKTOP_BREAKPOINT = 1024; // px

const HorizontalScrollGallery = ({ images }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    const [containerHeight, setContainerHeight] = useState(0);
    const [maxScrollX, setMaxScrollX] = useState(0);
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== "undefined" && window.innerWidth >= DESKTOP_BREAKPOINT
    );

    /* ---------------------------------------------------------------------- */
    /*  RESIZE & DIMENSIONS                                                   */
    /* ---------------------------------------------------------------------- */
    const handleResize = useCallback(() => {
        setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    }, []);

    const updateDimensions = useCallback(() => {
        if (!trackRef.current) return;

        const scrollWidth = trackRef.current.scrollWidth - window.innerWidth;
        setMaxScrollX(scrollWidth);
        setContainerHeight(scrollWidth + window.innerHeight);
    }, []);

    /* ---------------------------------------------------------------------- */
    /*  SCROLL SYNC                                                           */
    /* ---------------------------------------------------------------------- */
    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", handleResize);
        window.addEventListener("resize", updateDimensions);

        const handleScroll = () => {
            if (!containerRef.current || !trackRef.current) return;

            const scrollY = window.scrollY;
            const containerTop = containerRef.current.offsetTop;

            const scrollInSection = Math.min(
                Math.max(scrollY - containerTop, 0),
                maxScrollX
            );

            trackRef.current.style.transform = `translateX(-${scrollInSection}px)`;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("resize", updateDimensions);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleResize, updateDimensions, maxScrollX]);

    if (!images?.length) return null;

    /* ---------------------------------------------------------------------- */
    /*  RENDER                                                                */
    /* ---------------------------------------------------------------------- */
    return (
        <div
            ref={containerRef}
            style={{
                height: `${containerHeight}px`,
                position: "relative",
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
                <div
                    ref={trackRef}
                    style={{ display: "flex", height: "100%", willChange: "transform" }}
                >
                    {images.map((src, idx) => {
                        const shouldCrop = isDesktop && idx > 0;

                        return (
                            <div
                                key={idx}
                                style={{
                                    flexShrink: 0,
                                    width: shouldCrop ? "50vw" : "100vw",
                                    height: "100vh",
                                    overflow: "hidden",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    src={src}
                                    alt={`slide-${idx}`}
                                    style={{
                                        width: shouldCrop ? "100vw" : "100%", // ensures central crop
                                        height: "100%",
                                        objectFit: "cover",
                                        objectPosition: "center center", // <-- centring enforced
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HorizontalScrollGallery;
