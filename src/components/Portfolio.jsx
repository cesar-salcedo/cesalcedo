import React from 'react';
import TypeA from './portfolio_elements/TypeA';
import TypeB from './portfolio_elements/TypeB';
import TypeC from './portfolio_elements/TypeC';

import img1 from '../assets/images/mouth_01.jpg';
import img2 from '../assets/images/mouth_02.jpg';
import img3 from '../assets/images/mouth_03.jpg';
import img4 from '../assets/images/mouth_04.jpg';
import img5 from '../assets/images/mouth_05.jpg';
import img6 from '../assets/images/solar_system_01.jpg';
import img7 from '../assets/images/solar_system_02.jpg';
import img8 from '../assets/images/elephant_01.jpg';
import img9 from '../assets/images/elephant_02.jpg';
import img10 from '../assets/images/elephant_03.jpg';
import img11 from '../assets/images/elephant_04.jpg';
import img12 from '../assets/images/elephant_05.jpg';


export default function Portfolio() {
    return (
        <div style={{
            marginTop: "32px"
        }}>
            <h1 style={{
                textAlign: "center",
                margin: "32px",
                color: "black"
            }}>PORTFOLIO</h1>

            <TypeA
                title={"Human Mouth"}
                description={"Optimized for close-up rendering and facial animation. Features 8K textures, 16-bit displacement maps, and full compatibility with Cycles and V-Ray. Includes original modeling, UV layout, shading, rigging, and presentation."}
                profit={"$21.000 profit. + 300 sales."}
                images={[img1, img2, img3, img4, img5]}
            />

            <TypeB
                title={"Solar System"}
                description={"Highly accurate planetary models. Venus, Uranus, Neptune, and part of Saturn are hand-painted. The Sun is fully procedural. All planets include 16K to 23K PBR textures in equirectangular format. Used by Ubisoft."}
                profit={"$68,000 profit, +300 sales."}
                imageH={img7}
                imageW={img6}
            />
            <TypeC
                title={"African Elephant"}
                description={"Game-ready 3D model with 8K PBR textures, clean UVs, and a fully rigged skeleton with IK/FK chains. Balanced for real-time performance and visual fidelity across VR, AR, games, and cinematics."}
                profit={"$8.000 profit. +50 sales"}
                embedUrl={"https://sketchfab.com/models/78ce17c0b1f84563967bfbd3fc68d85c/embed"}
            />




            {/* Puedes repetir para más proyectos */}
        </div>
    );
}
