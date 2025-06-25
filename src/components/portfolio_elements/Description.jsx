import React from 'react';



export default function Description({
    title,
    description,
    profit,
}) {
    return (
        <div style={{
            marginTop: "32px"
        }}>
            <h2 style={{

                textAlign: "center",

            }}>{title}</h2>
            <h4 style={{
                marginTop: "8px",
                textAlign: "center",
                marginBottom: "16px",

            }}> {description}</h4>
            <h4 style={{
                marginTop: "8px",
                textAlign: "center",
                marginBottom: "16px",
            }}>{profit}</h4>
        </div>
    );
}
