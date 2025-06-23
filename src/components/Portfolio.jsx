import React from 'react';
import PortfolioItem from './portfolio_items/Type_a';

import img1 from '../assets/images/mouth_01.jpg';
import img2 from '../assets/images/mouth_02.jpg';
import img3 from '../assets/images/mouth_03.jpg';
import img4 from '../assets/images/mouth_04.jpg';
import img5 from '../assets/images/mouth_05.jpg';

export default function Portfolio() {
    return (
        <div style={{
            marginTop: "32px"
        }}>
            <h1 style={{
                textAlign: "center",
                marginBottom: "64px",
                color: "black"
            }}>PORTFOLIO</h1>
            <h2 style={{
                marginTop: "32px",
                textAlign: "center",
                color: "#25a9f0"
            }}>Human Mouth</h2>
            <h4 style={{
                marginTop: "8px",
                textAlign: "center",
                marginBottom: "16px",

            }}>Optimized for close-up rendering and facial animation. Features 8K textures, 16-bit displacement maps, and full compatibility with Cycles and V-Ray. Includes original modeling, UV layout, shading, rigging, and presentation.

            </h4>
            <PortfolioItem

                images={[img1, img2, img3, img4, img5]}
            />
            <h4 style={{
                marginTop: "8px",
                textAlign: "center",
                marginBottom: "16px",
            }}>$21.000 profit. + 300 sales.

            </h4>

            {/* Puedes repetir para más proyectos */}
        </div>
    );
}
