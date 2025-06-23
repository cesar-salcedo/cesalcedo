import React, { useEffect, useRef, useState } from "react";

/**
 * TypeB — Imagen con zoom progresivo y wrapper aislado
 * ----------------------------------------------------
 * • Al hacer scroll, la imagen escala entre 1× y `maxScale`.
 * • El wrapper incluye `contain: layout paint style` + `isolation: isolate` para
 *   asegurarse de que los repaints se limitan a esta capa y no afectan a GIFs u
 *   otros elementos cercanos ⇒ evita flicker.
 * • Todo en estilos inline (sin CSS externo).
 */

export default function TypeB({
    title,
    description,
    profit,
    imageH,
    imageW,
    maxScale = 1.5,
    objectPosition = "center center",
}) {
    // --------------------------------------------------
    //  Breakpoint
    // --------------------------------------------------
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== "undefined" ? window.innerWidth >= 768 : false
    );
    const imgRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // --------------------------------------------------
    //  Zoom progresivo al hacer scroll
    // --------------------------------------------------
    useEffect(() => {
        const el = imgRef.current;
        if (!el) return;

        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const distance = Math.abs(centerY - viewportCenter);
                const maxDist = viewportCenter + rect.height / 2;
                const ratio = Math.min(distance / maxDist, 1);
                setScale(1 + ratio * (maxScale - 1));
                ticking = false;
            });
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [maxScale]);

    // --------------------------------------------------
    //  Fuente según dispositivo
    // --------------------------------------------------
    const src = isDesktop ? imageW : imageH;

    // --------------------------------------------------
    //  Styles
    // --------------------------------------------------
    const wrapperStyle = {
        overflow: "hidden",
        width: "100%",
        position: "relative",
        isolation: "isolate", // nuevo stacking context
        contain: "layout paint style", // repaints limitados a este elemento
    };

    return (
        <div style={{ marginTop: "64px" }}>
            {title && (
                <h2 style={{ textAlign: "center", color: "#25a9f0" }}>{title}</h2>
            )}
            {description && (
                <h4 style={{ margin: "8px 0 16px", textAlign: "center" }}>{description}</h4>
            )}
            {profit && (
                <h4 style={{ margin: "8px 0 16px", textAlign: "center" }}>{profit}</h4>
            )}

            <div style={wrapperStyle}>
                <img
                    ref={imgRef}
                    src={src}
                    alt={title}
                    style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        objectPosition,
                        transform: `scale(${scale})`,
                        transformOrigin: "center center",

                    }}
                />
            </div>
        </div>
    );
}
