import React from 'react';
import styles from './style.module.css';

const AlertMessage = (props) => {
    const { style, text } = props;
    return (
        <div className={styles.border} style={style}>{text}</div>
    );
}

export { AlertMessage };