import React, { useState, useEffect } from 'react';
import Mouth from './portfolio_elements/Mouth';
import SolarSystem from './portfolio_elements/SolarSystem';
import Elephant from './portfolio_elements/Elephant';







export default function Portfolio() {
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== "undefined" ? window.innerWidth >= 768 : false
    );
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section id="portfolio" style={{
            marginTop: "32px"
        }}>
            <h2 style={{ textAlign: "center" }}>Portfolio</h2>
            <hr style={{ width: "100%", border: "none", borderTop: "1px solid #ccc" }} />

            <Elephant
                title={"African Elephant"}
                description={"Game-ready 3D model with 8K PBR textures, clean UVs, and a fully rigged skeleton with IK/FK chains. Balanced for real-time performance and visual fidelity across VR, AR, games, and cinematics."}
                profit={"$8.000 profit. +50 sales"}

                isDesktop={isDesktop}
            />
            <Mouth
                title={"Human Mouth"}
                description={"Optimized for close-up rendering and facial animation. Features 8K textures, 16-bit displacement maps, and full compatibility with Cycles and V-Ray. Includes original modeling, UV layout, shading, rigging, and presentation."}
                profit={"$21.000 profit. + 300 sales."}

                isDesktop={isDesktop}
            />

            <SolarSystem
                title={"Solar System"}
                description={"Highly accurate planetary models. Venus, Uranus, Neptune, and part of Saturn are hand-painted. The Sun is fully procedural. All planets include 16K to 23K PBR textures in equirectangular format. Used by Ubisoft."}
                profit={"$68,000 profit, +300 sales."}
                isDesktop={isDesktop}
            />


        </section>
    );
}
