import React, { useRef, useEffect, useState, useCallback, Fragment } from "react";

const GuillotineScrollGallery = ({
    images,
    scrollVelocity = 1.5,
    diagonalAngle = 25,
    separatorWidth = 4,
    separatorColor = "white",
}) => {
    const containerRef = useRef(null);
    const scrollSpaceRef = useRef(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [separatorAngle, setSeparatorAngle] = useState(0);
    const [separatorHeight, setSeparatorHeight] = useState(0);

    const updateDimensions = useCallback(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const count = Math.max(images.length - 1, 0);

        // 1) altura total de scroll
        const totalScroll = vh * count / scrollVelocity;
        scrollSpaceRef.current = totalScroll;
        setContainerHeight(totalScroll + vh);

        // 2) cálculo ángulo y longitud de la hipotenusa
        const horiz = (diagonalAngle / 100) * vw;
        const angleRad = Math.atan(horiz / vh);
        setSeparatorAngle(angleRad * 180 / Math.PI);
        setSeparatorHeight(Math.hypot(vh, horiz));
    }, [images.length, scrollVelocity, diagonalAngle]);

    useEffect(() => {
        let frameId;

        const handleUpdate = () => {
            // cancelamos cualquier frame pendiente
            if (frameId) cancelAnimationFrame(frameId);

            frameId = requestAnimationFrame(() => {
                updateDimensions();

                // 3) progreso de scroll
                if (!containerRef.current) return;
                const top = containerRef.current.getBoundingClientRect().top;
                const prog = Math.min(Math.max(-top / scrollSpaceRef.current, 0), 1);
                setScrollProgress(prog);
            });
        };

        window.addEventListener("scroll", handleUpdate, { passive: true });
        window.addEventListener("resize", handleUpdate);
        handleUpdate(); // llamada inicial

        return () => {
            window.removeEventListener("scroll", handleUpdate);
            window.removeEventListener("resize", handleUpdate);
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [updateDimensions]);

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
                    // 4) cálculo de clip-path y posición de la línea
                    const slideProg = scrollProgress * animCount - (idx - 1);
                    const p = Math.min(Math.max(slideProg, 0), 1);

                    let clip = "polygon(100% 0%,100% 0%,100% 100%,100% 100%)";
                    let sepX = 0;
                    let sepOp = 0;

                    if (p > 0 && p < 1) {
                        const revealW = 100 + diagonalAngle;
                        const topPos = p * revealW;
                        const botPos = topPos - diagonalAngle;
                        const leftTop = 100 - topPos;
                        const leftBot = 100 - botPos;

                        clip = `polygon(${leftTop}% 0%,100% 0%,100% 100%,${leftBot}% 100%)`;
                        sepX = (leftTop / 100) * window.innerWidth;
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
