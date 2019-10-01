import React from 'react'
import styles from './Button.module.css';


export const Button = props => {
    return (
        <button 
            disabled={props.disabled}
            className={[styles.Button, styles[props.type]].join(' ')} 
            onClick={props.btnCliked}>
            {props.children}
        </button>
    )
}

