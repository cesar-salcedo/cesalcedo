import React from 'react';

export default function TypeB({ title, description, profit, imageH, imageW }) {
    return (
        <div style={{
            marginTop: '64px'
        }}>
            <h2 style={{
                textAlign: 'center',
                color: '#25a9f0'
            }}>{title}</h2>
            <h4 style={{
                marginTop: '8px',
                textAlign: 'center',
                marginBottom: '16px'
            }}>{description}</h4>
            <h4 style={{
                marginTop: '8px',
                textAlign: 'center',
                marginBottom: '16px'
            }}>{profit}</h4>

            {/* Responsive image: mobile uses imageH, desktop uses imageW */}
            <picture>
                <source media="(min-width: 76px)" srcSet={imageW} />
                <img
                    src={imageH}
                    alt={title}
                    style={{
                        display: 'block',
                        margin: '0 auto',
                        width: '100%',
                        height: 'auto'
                    }}
                />
            </picture>
        </div>
    );
}
