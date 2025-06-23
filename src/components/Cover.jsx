import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ImageZoomProgressive from "./ImageZoomProgressive.jsx";
import img1 from "../assets/images/finn_01.jpg";
import img2 from "../assets/images/mouth_01.jpg";
import img3 from "../assets/images/gas_planet_01.jpg";
import img4 from "../assets/images/elephant_01.jpg";
import img5 from "../assets/images/eye_gen_01.jpg";
import img6 from "../assets/images/finn_04.jpg";
import img7 from "../assets/images/rocks_10.jpg";

/**
 * Portfolio — Animated Grid
 * -------------------------
 * Each tile fades‑in & slides from left to right (opacity 0 → 1, x: -30 → 0)
 * in a **staggered** sequence to create a rapid‑fire reveal effect.
 */

export default function Portfolio() {
    const allItems = [
        { alt: "Stormtrooper", src: img1, pos: "center center" },
        { alt: "Human Mouth", src: img2, pos: "61% center" },
        { alt: "Gas Planet", src: img3, pos: "77% center" },
        { alt: "Elephant", src: img4, pos: "62% 50%" },
        { alt: "Finn", src: img5, pos: "30% center" },
        { alt: "Eye Gen", src: img6, pos: "center center" },
        { alt: "Rock", src: img7, pos: "center center" },
    ];

    /* -------------------------------------------------------------------- */
    /*  Responsive helpers                                                   */
    /* -------------------------------------------------------------------- */
    const [width, setWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );

    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const isMobile = width < 600;
    const items = isMobile ? allItems.slice(0, 6) : allItems;
    const cols = isMobile ? 3 : items.length;
    const gap = "16px";
    const aspectRatio = isMobile ? "1/3.2" : "1/3.5";

    /* -------------------------------------------------------------------- */
    /*  Animation variants                                                   */
    /* -------------------------------------------------------------------- */
    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0.35, delay: i * 0.07, ease: "easeOut" },
        }),
    };

    /* -------------------------------------------------------------------- */
    /*  Render                                                               */
    /* -------------------------------------------------------------------- */
    return (
        <section
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap,
                padding: "16px",
                width: "100%",
                overflowX: isMobile ? "hidden" : "auto",
                overflowY: isMobile ? "auto" : "hidden",
            }}
        >
            {items.map(({ alt, src, pos }, idx) => (
                <motion.div
                    key={idx}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    viewport={{ once: true, margin: "-20%" }}
                    style={{
                        width: "100%",
                        aspectRatio,
                        overflow: "hidden",
                    }}
                >
                    <ImageZoomProgressive
                        src={src}
                        alt={alt}
                        maxScale={1.8}
                        objectPosition={pos}
                    />
                </motion.div>
            ))}
        </section>
    );
}
