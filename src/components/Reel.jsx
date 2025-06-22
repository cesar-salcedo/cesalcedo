// src/components/Reel.jsx
import React from "react";

export default function Reel() {
    return (
        <section
            id="reel"
            style={{
                padding: "64px 20px",
                textAlign: "center",
                backgroundColor: "#fafafa",
            }}
        >
            <h2>Demo Reel</h2>
            <div
                style={{
                    position: "relative",
                    width: "100%",

                    margin: "20px auto",
                    aspectRatio: "16/9",          // <— hace que el contenedor siempre respete 16:9
                    borderRadius: "0px",
                    overflow: "hidden",
                }}
            >
                <iframe
                    title="Demo Reel"
                    src="https://www.youtube.com/embed/ZCTRNmknwVc"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                    }}
                ></iframe>
            </div>
        </section>
    );
}
