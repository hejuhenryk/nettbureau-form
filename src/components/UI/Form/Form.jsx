import React, { useState, useReducer } from 'react'
// import styles from './Form.module.css'

const Form = props => {
    const [isFormValid, setIsFormValid] = useState(false)
    const [formData, dispatch] = useReducer( formReducer, initialForm)
    const formInputs = []
    for (const input in formData) {
        formInputs.push(
            <Input 
                key={input}
                inputtype={formData[input].elementType} 
                inputconfig={formData[input].elementConfig} 
                name={formData[input]}
                value={formData[input].value}
                // change={(event) => inputChangeHandler(event, input)}
                isInvalid={!formData[input].isValid}
                shouldValidate={formData[input].validation}
                isTouched={formData[input].isTouched}
            />
        )
    }


    return (
        <form onSubmit={(event) => isFormValid ? submitHandler(event) : null}> 
            {formInputs}
            <Button type='Success' disabled={!isFormValid}>Send inn</Button>
        </form>
    )
}

export default Form
