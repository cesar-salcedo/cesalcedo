import React from "react";

/**
 * TypeC — Sketchfab Tile (TypeA-style)
 * ------------------------------------
 * Similar estructura a TypeA, pero en lugar de un carrusel de imágenes
 * incrusta un visor 3D de Sketchfab.
 *
 * Props:
 *   • title        → H2 centrado (#25a9f0)
 *   • description  → H4 secundario
 *   • profit       → H4 adicional (beneficio/resultados)
 *   • embedUrl*    → URL de embebido Sketchfab (formato /embed)
 *   • ratio        → % para mantener relación de aspecto (default 56.25 = 16:9)
 */

export default function TypeC({
    title,
    description,
    profit,
    embedUrl,
    ratio = 56.25,
}) {
    if (!embedUrl) return null;

    return (
        <div style={{ marginTop: "64px" }}>
            {title && (
                <h2 style={{ textAlign: "center", color: "#25a9f0" }}>{title}</h2>
            )}
            {description && (
                <h4
                    style={{
                        marginTop: "16px",
                        textAlign: "center",
                        marginBottom: "16px",
                    }}
                >
                    {description}
                </h4>
            )}
            {profit && (
                <h4
                    style={{
                        marginTop: "8px",
                        textAlign: "center",
                        marginBottom: "16px",
                    }}
                >
                    {profit}
                </h4>
            )}

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: `${ratio}%`,
                    overflow: "hidden",

                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
            >
                <iframe
                    title={title || "Sketchfab 3D Model"}
                    src={embedUrl}
                    frameBorder="0"
                    allow="autoplay; fullscreen; vr"
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>
        </div>
    );
}
