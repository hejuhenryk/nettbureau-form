import React from 'react'
import styles from './Input.module.css'

export const Input = props => {
    let inputElement = null
    let inputClasses = [styles.InputElement]

    if(!props.isValid && props.shouldValidate && props.isTouched) {
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
                {...props.inputConfig}/>
            break;
        case ( 'textarea' ):
            inputElement = <textarea 
                className={inputClasses.join(' ')} 
                value={props.value}
                onChange={props.change}
                {...props.inputconfig}/>
            break;
        default:
            console.log('Inveild input type')
    }

    return (
        <div className={styles.Input}>
            <label className={styles.Label}>{props.label}</label>
            {inputElement}
            {props.invalidMsg && <p className={styles.InvalidMsg}>{props.invalidMsg}</p>}
        </div>
    )
}

