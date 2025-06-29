// src/components/About.jsx
import React from "react";
import ImageZoomProgressive from "./utils/ImageZoomProgressive";
import img1 from '../assets/images/profile_photo_02.jpg';

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
                <ImageZoomProgressive src={img1} maxScale={1.1} />
                <br />
                <p> I'm César Salcedo,</p>
                <p>
                    a Technical Artist with over 10 years of experience and a passion for solving complex technical puzzles.
                    My principle is simple: I don't just create 3D art; I design and build the procedural systems that generate it.
                    I have validated this focus on creating efficient and scalable tools by building a successful 3D asset business, generating over $200,000 in revenue.
                    I am now looking to apply this systems-thinking approach and my problem-solving skills in a team environment, contributing to large-scale projects.
                </p>



            </div>
        </section>
    );
}
