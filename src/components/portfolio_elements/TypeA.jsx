import React from 'react';
import HorizontalScroll from './HorizontalScroll.jsx';



export default function TypeA({ title, description, profit, images }) {
    return (
        <div style={{
            marginTop: "128px"
        }}>
            <h2 style={{

                textAlign: "center",
                color: "#25a9f0"
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
            <HorizontalScroll
                images={images}
            />

        </div>
    );
}
