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
                    I'm a Technical Artist and 3D specialist with experience in modeling, shading, simulations, and procedural workflows. On this site, I share my projects, videos, and ways to get in touch.
                </p>
                <p>
                    Feel free to explore my demo reel at the top, browse my work in the portfolio section, and if you'd like to collaborate or have any questions, scroll down to send me a message.
                </p>

            </div>
        </section>
    );
}
