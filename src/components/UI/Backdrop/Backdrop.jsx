import React from 'react'
import styles from './Backdrop.module.css'

export const Backdrop = props => props.show ? 
    <div className={styles.Backdrop} onClick={props.click}></div> : null

