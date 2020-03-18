import React from 'react';
import styles from './styles.css';


const Button = (props) => {
    const {
        btnType,
        children
    } = props;
    return (
        <button className={btnType}>{children}</button>
    );
};

export { Button };