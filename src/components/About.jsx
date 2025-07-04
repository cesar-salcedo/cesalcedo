// src/components/About.jsx
import React from "react";
import ImageZoomProgressive from "./utils/ImageZoomProgressive";
import img1 from '../assets/images/profile_photo_03.jpg';

import descriptions from '../data/descriptions.json'

export default function About() {
    const descriptionA = descriptions.about.descriptionA
    const descriptionB = descriptions.about.descriptionB
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
                <ImageZoomProgressive src={img1} maxScale={1.1} />
                <br />
                <p> {descriptionA},</p>
                <p> {descriptionB} </p>



            </div>
        </section>
    );
}
