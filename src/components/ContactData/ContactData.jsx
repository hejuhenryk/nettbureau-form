import React, { useState, useReducer, useEffect } from 'react'
import styles from './ContactData.module.css'
import { Input, Button } from './../UI/UIcomponentsIndex'


const ContactData = props => {
    const initialForm = {
        firstname: {
            elementType: 'input',
            label: 'Navn',
            invalidMsg: 'Navn trenger minst 4 bookstaver',
            elementConfig: {
                type: 'text',
                placeholder: 'Ole Alexander'
            },
            value: '',
            validation: {
                isRequired: true, 
                minLength: 2
            },
            isValid: false,
            isTouched: false
        },
        lastname: {
            elementType: 'input',
            label: 'Etternavn',
            elementConfig: {
                type: 'text',
                placeholder: 'Filibom-Bom-Bom'
            },
            value: '',
            validation: {
                isRequired: true, 
                minLength: 2
            },
            isValid: false,
            isTouched: false
        },
        email: {
            elementType: 'input',
            label: 'E-post',
            elementConfig: {
                type: 'email',
                placeholder: 'din.epost@yahoo.com'
            },
            value: '',
            validation: {
                isRequired: true,
                minLength: 8
            },
            isValid: false,
            isTouched: false
        },
        phone: {
            elementType: 'input',
            label: 'Telefonnummer',
            elementConfig: {
                type: 'text',
                placeholder: 'XXX XX XXX'
            },
            value: '',
            validation: {
                isRequired: true,
                minLength: 8,
                maxLength: 8
            },
            isValid: false,
            isTouched: false
        },
        zipCode: {
            elementType: 'input',
            label: 'Postnummer',
            elementConfig: {
                type: 'text',
                placeholder: '1234'
            },
            value: '',
            validation: {
                isRequired: true,
                minLength: 4,
                maxLength: 4
            },
            isValid: false,
            isTouched: false
        },
        comment: {
            elementType: 'textarea',
            label: 'Kommentar',
            elementConfig: {
                type: 'text',
                placeholder: ''
            },
            value: '',
            validation: {
                isRequired: false,
                maxLength: 300
            },
            isValid: false,
            isTouched: false
        }
    }
    const checkValidity = (value, rules) => {
        let isValid = true;
        if (rules.isRequired) {
            isValid = value.trim() !== '' && isValid
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }
        if (rules.emailType) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            isValid = re.test(value) && isValid
        }
        if (rules.phone)
        return isValid
    }
    const formReducer = (state, action) => {
        let newForm = JSON.parse(JSON.stringify(state))
        newForm[action.type].value = action.payload
        if ( newForm[action.type].validation ) {
            newForm[action.type].isTouched = true
            newForm[action.type].isValid = checkValidity(newForm[action.type].value, newForm[action.type].validation )
            if ( !newForm[action.type].isValid ) {

            }
        }
        return newForm    
    }
    const [isFormValid, setIsFormValid] = useState(false)
    const [formData, dispatch] = useReducer( formReducer, initialForm)
    useEffect(() => {
        setIsFormValid(checkIfFormIsValid(formData))
    }, [formData])
    const formInputs = []
    for (const input in formData) {
        formInputs.push(
            <Input 
                key={input}
                inputType={formData[input].elementType} 
                inputconfig={formData[input].elementConfig} 
                name={formData[input]}
                label={formData[input].label}
                invalidMsg={formData[input].invalidMsg}
                value={formData[input].value}
                change={(event) => inputChangeHandler(event, input)}
                isInvalid={!formData[input].isValid}
                shouldValidate={formData[input].validation}
                isTouched={formData[input].isTouched}
            />
        )
    }

    const submitHandler = event => {
        event.preventDefault()
        if(!isFormValid) return ;
        // setIsLoading(true)
        let customerData = {}
        for (const key in formData) {
            customerData[key] = formData[key].value
        }
        console.log(customerData)
        //POST request with customerData 
    }

    const checkIfFormIsValid = (form) => {
        let isValid = true
        for(let input in form) {
            if (form[input].validation) {
                isValid = (form[input].isValid && isValid);
            } 
        }
        return isValid
    }
    const inputChangeHandler = ( e, inputType ) => {
        e.preventDefault()
        dispatch({type: inputType , payload: e.target.value})
    }

    return (
        <div className={styles.ContactData}>
            <h2 className={styles.Title}>INFORMASJON</h2>
            <form onSubmit={(event) => isFormValid ? submitHandler(event) : null}> 
                {formInputs}
                <Button type='Success' disabled={!isFormValid}>Send inn</Button>
            </form>
        </div>
    )
}

export default ContactData
