// src/components/Contact.jsx
import React, { useState } from "react";

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(
            `Thank you, ${name}! I've received your message:\n\n"${message}"\n\nI'll reply to you soon at ${email}.`
        );
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <section
            id="contact"
            style={{
                padding: "96px 20px",
                backgroundColor: "#ffffff"
            }}
        >
            <h2 style={{ textAlign: "center" }}>Contact Me</h2>
            <form
                onSubmit={handleSubmit}
                style={{
                    maxWidth: "500px",
                    margin: "20px auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}
            >
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                        padding: "8px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                    }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: "8px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                    }}
                />
                <textarea
                    placeholder="Message"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{
                        padding: "8px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                    }}
                ></textarea>
                <button
                    type="submit"
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        backgroundColor: "#333",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Send
                </button>
            </form>
            <p style={{ textAlign: "center", marginTop: "20px", color: "#555" }}>
                Or write me directly at{" "}
                <a href="mailto:cesarsalcedogarcia@gmail.com" style={{ color: "#0066cc" }}>
                    cesarsalcedogarcia@gmail.com
                </a>
            </p>
        </section>
    );
}
