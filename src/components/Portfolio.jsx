// src/components/Portfolio.js
import React from 'react';

// Ya no importamos useIsDesktop aquí

import Mouth from './portfolio_elements/Mouth';
import SolarSystem from './portfolio_elements/SolarSystem';
import Elephant from './portfolio_elements/Elephant';
import Eye from './portfolio_elements/Eye';
import GasPlanet from './portfolio_elements/GasPlanet';
import Terrain from './portfolio_elements/Terrain';

// El array de configuración ya no necesita flags ni props especiales relacionadas con isDesktop
const portfolioItems = [
    { Component: Elephant },
    { Component: Mouth },
    { Component: SolarSystem },
    { Component: Eye },
    { Component: GasPlanet },
    { Component: Terrain }
];

export default function Portfolio() {
    // ¡Toda la lógica de isDesktop ha desaparecido! ✨
    return (
        <section id="portfolio" style={{ marginTop: "32px" }}>
            <h2 style={{ textAlign: "center" }}>Portfolio</h2>
            <hr style={{ width: "100%", border: "none", borderTop: "1px solid #ccc" }} />

            {portfolioItems.map(({ Component }, index) => (
                <Component key={index} />
            ))}
        </section>
    );
}