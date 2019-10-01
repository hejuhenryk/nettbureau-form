import React from 'react'
import styles from './Modal.module.css'
import { Backdrop } from './../UIcomponentsIndex'

export const Modal = props => {
    let classN = [styles.Modal, props.show ? null : styles.Away ].join(' ')
    
    return (
        <>
        <Backdrop show={props.show} click={props.backdropClick}/>
        <div className={classN}>
            {props.children}
        </div>
    </>
    )
}

