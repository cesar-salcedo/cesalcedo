// src/components/Portfolio.jsx
import React from "react";

// IMPORTA tus imágenes aquí. Ajusta los nombres si los tuyos son distintos.
import img1 from "../assets/images/earth.jpg";
import img2 from "../assets/images/saturn.jpg";
import img3 from "../assets/images/eye.jpg";
import img4 from "../assets/images/mouth.jpg";
import img5 from "../assets/images/elephant.jpg";
import img6 from "../assets/images/cave.jpg";
// Si tienes más imágenes, importa cada una:
// import img4 from "../assets/images/imagen4.jpg";
// etc.

export default function Portfolio() {
    // Aquí guardamos en un array las imágenes importadas y opcionalmente un texto.
    const imagenes = [
        { src: img1, alt: "image01" },
        { src: img2, alt: "image02" },
        { src: img3, alt: "image03" },
        { src: img4, alt: "image04" },
        { src: img5, alt: "image05" },
        { src: img6, alt: "image06" },
        // Si agregaste más importaciones, añádelas al array:
        // { src: img4, alt: "Descripción de la imagen 4" },
    ];

    return (
        <section
            id="portfolio"
            style={{
                padding: "64px 200px",
                backgroundColor: "#fafafa"
            }}
        >
            <h2 style={{ textAlign: "center" }}>Portfolio</h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "16px",
                    maxWidth: "1000px",
                    margin: "20px auto"
                }}
            >
                {imagenes.map((img, idx) => (
                    <div
                        key={idx}
                        style={{
                            border: "1px solid #e0e0e0",
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            style={{
                                width: "100%",
                                display: "block",
                                objectFit: "cover",
                                height: "180px"
                            }}
                        />
                        {/* Si quieres agregar un título o descripción breve debajo de cada imagen, descomenta: */}
                        {/*
            <div style={{ padding: "8px" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                Título o breve descripción
              </p>
            </div>
            */}
                    </div>
                ))}
            </div>
        </section>
    );
}
