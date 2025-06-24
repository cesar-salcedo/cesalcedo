// src/components/About.jsx
import React from "react";

export default function About() {
    return (
        <section
            id="about"
            style={{
                backgroundColor: "#f5f5f5",
                padding: "96px 20px"
            }}
        >
            <h2 style={{ textAlign: "center" }}>About Me</h2>
            <hr style={{ width: "100%", border: "none", borderTop: "1px solid #ccc" }} />

            <div
                style={{
                    maxWidth: "800px",
                    margin: "20px auto",
                    lineHeight: "1.6",
                    color: "#333"
                }}
            >
                <p>Hello, I'm César.</p>
                <p>
                    I'm a Technical Artist and 3D Specialist with a background in Fine Arts and a strong focus on procedural workflows, simulations, shading, and high-fidelity modeling. My work bridges the gap between visual creativity and technical precision, aiming to produce assets that are both visually compelling and production-ready.

                    Here you’ll find a curated selection of my projects, including cinematic simulations, photorealistic assets, and real-time models used in games, VR, and scientific visualization.

                    Feel free to check out my demo reel above, explore the portfolio below, and reach out through the contact section if you'd like to collaborate or just say hello.
                </p>

            </div>
        </section>
    );
}
