import React, { useRef, useEffect, useState, useCallback, Fragment } from "react";

const GuillotineScrollGallery = ({
    images,
    scrollVelocity = 1.5,
    diagonalAngle = 25,
    separatorWidth = 3,
    separatorColor = "white",
}) => {
    const containerRef = useRef(null);
    const scrollSpaceRef = useRef(0);

    const [containerHeight, setContainerHeight] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [separatorAngle, setSeparatorAngle] = useState(0);
    const [separatorHeight, setSeparatorHeight] = useState(0);

    const updateDimensions = useCallback(() => {
        const vw = window.innerWidth;
        setViewportWidth(vw);

        const animCount = Math.max(images.length - 1, 0);
        const totalScrollSpace = window.innerHeight * animCount / scrollVelocity;
        scrollSpaceRef.current = totalScrollSpace;
        setContainerHeight(totalScrollSpace + window.innerHeight);

        const horizontalShift = diagonalAngle / 100 * vw;
        const verticalShift = window.innerHeight;
        const angleRad = Math.atan(horizontalShift / verticalShift);
        const angleDeg = angleRad * 180 / Math.PI;
        const hypo = Math.hypot(verticalShift, horizontalShift);

        setSeparatorAngle(angleDeg);
        setSeparatorHeight(hypo);
    }, [images.length, scrollVelocity, diagonalAngle]);

    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [updateDimensions]);

    useEffect(() => {
        const onScroll = () => {
            if (!containerRef.current) return;
            const { top } = containerRef.current.getBoundingClientRect();
            const prog = Math.min(Math.max(-top / scrollSpaceRef.current, 0), 1);
            setScrollProgress(prog);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!images?.length) return null;
    const animCount = images.length - 1;

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                height: `${containerHeight}px`,
                backgroundColor: "#000",
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
                    const progSlide = scrollProgress * animCount - (idx - 1);
                    const p = Math.min(Math.max(progSlide, 0), 1);

                    let clip = "polygon(100% 0%,100% 0%,100% 100%,100% 100%)";
                    let sepX = 0;
                    let sepOp = 0;

                    if (p > 0 && p < 1) {
                        const revealW = 100 + diagonalAngle;
                        const topPos = p * revealW;
                        const botPos = topPos - diagonalAngle;
                        const leftTopX = 100 - topPos;
                        const leftBotX = 100 - botPos;

                        clip = `polygon(${leftTopX}% 0%,100% 0%,100% 100%,${leftBotX}% 100%)`;

                        // calculamos en px en lugar de usar %
                        sepX = (leftTopX / 100) * viewportWidth;
                        sepOp = 1;
                    } else if (p >= 1) {
                        clip = "polygon(0% 0%,100% 0%,100% 100%,0% 100%)";
                    }

                    if (idx === 0) clip = "none";

                    return (
                        <Fragment key={idx}>
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100vw",
                                    height: "100vh",
                                    zIndex: idx,
                                    clipPath: clip,
                                    willChange: "clip-path",
                                }}
                            >
                                <img
                                    src={src}
                                    alt={`slide-${idx}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>

                            {idx > 0 && separatorWidth > 0 && sepOp > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: `${sepX}px`,
                                        width: `${separatorWidth}px`,
                                        height: `${separatorHeight}px`,
                                        backgroundColor: separatorColor,
                                        zIndex: idx,
                                        opacity: sepOp,
                                        willChange: "left, opacity, transform",
                                        transformOrigin: "top left",
                                        transform: `rotate(-${separatorAngle}deg)`,
                                    }}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default GuillotineScrollGallery;
