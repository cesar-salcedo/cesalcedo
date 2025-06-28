import React, { useState, useEffect } from 'react';
import Mouth from './portfolio_elements/Mouth';
import SolarSystem from './portfolio_elements/SolarSystem';
import Elephant from './portfolio_elements/Elephant';
import Eye from './portfolio_elements/Eye';
import GasPlanet from './portfolio_elements/GasPlanet'
import Rocks from './portfolio_elements/Rocks'







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

            <Elephant isDesktop={isDesktop} />
            <Mouth isDesktop={isDesktop} />
            <SolarSystem isDesktop={isDesktop} />
            <Eye isDesktop={isDesktop} />
            <GasPlanet isDesktop={isDesktop} />
            <Rocks />



        </section>
    );
}
