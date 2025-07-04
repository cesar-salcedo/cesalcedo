import React from "react";
import PropTypes from "prop-types";
import styles from "./DescriptionA.module.css";

export default function DescriptionTypeA({
    title,
    description,
    profit,
}) {


    return (
        <div className={styles.container}>
            <p className={styles.title}>{title}</p>
            <p className={styles.text}>{description}</p>
            <p className={styles.text}>{profit}</p>


        </div>
    );
}

DescriptionTypeA.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    profit: PropTypes.string,
};