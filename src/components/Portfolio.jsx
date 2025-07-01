import React, { useState, useEffect } from 'react';
import Mouth from './portfolio_elements/Mouth';
import SolarSystem from './portfolio_elements/SolarSystem';
import Elephant from './portfolio_elements/Elephant';
import Eye from './portfolio_elements/Eye';
import GasPlanet from './portfolio_elements/GasPlanet';
import Rocks from './portfolio_elements/Rocks';
import ScrollReveal from "./utils/ScrollReveal";

// 1. Define tus componentes del portfolio en un array.
//    Esto hace que sea mucho más fácil añadirlos, eliminarlos o reordenarlos.
const portfolioItems = [
    { Component: Elephant, props: { /* props específicas si las hubiera */ } },
    { Component: Mouth, props: {} },
    { Component: SolarSystem, props: {} },
    { Component: Eye, props: {} },
    { Component: GasPlanet, props: {} },
    { Component: Rocks, props: { isDesktop: undefined } } // `isDesktop` no es necesaria para Rocks, se puede omitir.
];

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
        <section id="portfolio" style={{ marginTop: "32px" }}>
            <h2 style={{ textAlign: "center" }}>Portfolio</h2>
            <hr style={{ width: "100%", border: "none", borderTop: "1px solid #ccc" }} />

            {/* 2. Mapea el array para renderizar cada componente */}
            {portfolioItems.map((item, index) => {
                // Desestructura el componente y sus props del objeto del item.
                const { Component, props } = item;

                // Creamos un objeto de props comunes para pasar a cada componente.
                const commonProps = {
                    isDesktop: isDesktop
                };

                // El componente Rocks no necesita la prop `isDesktop`, así que la excluimos.
                const finalProps = Component === Rocks ? props : { ...commonProps, ...props };

                return (
                    <ScrollReveal><Component {...finalProps} />
                    </ScrollReveal>

                );
            })}
        </section>
    );
}