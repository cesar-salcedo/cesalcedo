// src/components/Header.jsx
import React from "react";

export default function Header() {
    // Make sure to include these Google Fonts in your index.html or import them via CSS:
    // <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400&display=swap" rel="stylesheet">

    const headerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
    };

    const nameStyle = {
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "1.8rem",
        fontWeight: 700,
        color: "#333",
        textDecoration: "none",
    };

    const navStyle = {
        display: "flex",
        gap: "24px",
    };

    const linkStyle = {
        fontFamily: "'Open Sans', sans-serif",
        fontSize: "1rem",
        color: "#555",
        textDecoration: "none",
        padding: "4px 8px",
        transition: "color 0.2s ease",
    };

    const linkHover = {
        color: "#000",
    };

    return (
        <header style={headerStyle}>
            {/* Replace "César Salcedo García" with your preferred display name */}
            <a href="#home" style={nameStyle}>
                CESAR SALCEDO
            </a>
            <nav style={navStyle}>
                <a
                    href="#reel"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = linkHover.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
                >
                    Demo Reel
                </a>
                <a
                    href="#portfolio"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = linkHover.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
                >
                    Portfolio
                </a>
                <a
                    href="#about"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = linkHover.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
                >
                    About
                </a>
                <a
                    href="#contact"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = linkHover.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
                >
                    Contact
                </a>
            </nav>
        </header>
    );
}
