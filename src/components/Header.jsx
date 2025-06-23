// src/components/Header.jsx
import React, { useState, useEffect } from "react";

export default function Header() {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );
    const [menuOpen, setMenuOpen] = useState(false);

    // Actualiza isMobile al redimensionar
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setMenuOpen(false); // cerramos menú si salimos de móvil
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const headerStyle = {
        position: "relative",     // necesario para el nav absolute
        display: "flex",
        alignItems: "center",
        justifyContent: "center",


        padding: "16px 16px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        width: "100%",
        zIndex: 1000,
    };

    const nameStyle = {
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "1.7rem",
        fontWeight: 700,
        color: "#333",
        textDecoration: "none",
    };

    const navStyle = {
        display: "flex",
        alignItems: "center",
        gap: "24px",
        marginLeft: "auto",
    };

    const mobileNavStyle = {
        position: "absolute",
        top: "100%",
        right: 0,
        backgroundColor: "#fff",
        width: "100%",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0",
    };

    const linkStyle = {
        fontFamily: "'Open Sans', sans-serif",
        fontSize: "1rem",
        color: "#555",
        textDecoration: "none",
        padding: "8px 16px",
        width: "100%",
        textAlign: "center",
        transition: "background-color 0.2s ease, color 0.2s ease",
    };

    const buttonStyle = {
        marginLeft: "auto",
        background: "none",
        border: "none",
        fontSize: "1.8rem",
        cursor: "pointer",
    };

    const links = [
        { href: "#portfolio", label: "Portfolio" },
        { href: "#about", label: "About" },
        { href: "#contact", label: "Contact" },
    ];

    return (
        <header style={headerStyle}>
            <a href="#home" style={nameStyle}>
                CESAR SALCEDO
            </a>

            {isMobile ? (
                <button
                    style={buttonStyle}
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
            ) : (
                <nav style={navStyle}>
                    {links.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            )}

            {isMobile && menuOpen && (
                <nav style={mobileNavStyle}>
                    {links.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            style={linkStyle}
                            onClick={() => setMenuOpen(false)}     // cierra al clickar
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            )}
        </header>
    );
}
