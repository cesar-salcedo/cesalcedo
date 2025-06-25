// Description.jsx
import React from "react";
import PropTypes from "prop-types";
import styles from "./DescriptionB.module.css";

export default function Description({ title, description, profit }) {
    const items = [description, profit].filter(Boolean);

    return (
        <div className={styles.container}>
            {/* Título estático */}
            <span className={styles.title}>{title}</span>

            {/* Carrusel de textos */}
            <div className={styles.carousel}>
                <div className={styles.track}>
                    {[...items, ...items].map((item, idx) => (
                        <span key={idx} className={styles.item}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

Description.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    profit: PropTypes.string,
};
