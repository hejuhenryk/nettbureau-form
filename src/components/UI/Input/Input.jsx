import React from 'react'
import styles from './Input.module.css'

export const Input = props => {
    let inputElement = null
    let inputClasses = [styles.InputElement]

    if(props.isInvalid && props.shouldValidate && props.isTouched) {
        inputClasses.push(styles.Invalid)
    } else {
        inputClasses = [styles.InputElement]
    }

    switch ( props.inputType ) {
        case ( 'input' ):
            inputElement = <input 
                className={inputClasses.join(' ')} 
                value={props.value}
                onChange={props.change}
                {...props.inputconfig}/>
            break;
        case ( 'textarea' ):
            inputElement = <textarea 
                className={inputClasses.join(' ')} 
                value={props.value}
                onChange={props.change}
                {...props.inputconfig}/>
            break;
        default:
            inputElement = <input 
                className={styles.InputElement} 
                value={props.value}
                {...props}/>
    }

    return (
        <div className={styles.Input}>
            <label className={styles.Label}>{props.label}</label>
            {inputElement}
        </div>
    )
}

