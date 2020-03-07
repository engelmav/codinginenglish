import React from 'react';
import styles from './style.module.css';

const AlertMessage = (props) => {
    return (
        <div className={styles.border}>{props.text}</div>
    )
}

export { AlertMessage };