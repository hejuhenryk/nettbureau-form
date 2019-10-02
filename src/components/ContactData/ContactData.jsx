import React, { useState, useReducer} from 'react'
import styles from './ContactData.module.css'
import { Input, Button, Modal, Loader } from '../UI/Index'
import { postData, NotInitialized, NotInitializedType, Fetching, FailFetchedType, FetchedType, FetchingType } from '../../dataService/dataService'

export const checkValidity = (value, rules) => {
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
    if (rules.nameType) {
        const re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g
        isValid = re.test(value) && isValid
    }
    if (rules.emailType) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        isValid = re.test(value) && isValid
    }
    if (rules.phoneType) {
        const re = /^((0047)?|(\+47)?|(47)?)([- _1-9])(\d{7})$/
        isValid = re.test(value.replace(/\s+/g, '')) && isValid
    }
    if (rules.zipCodeType) {
        const re = /^(\d{4})$/
        isValid = re.test(value.replace(/\s+/g, '')) && isValid
    }
    return isValid
}

const ContactData = props => {
    const [modal, setModal] = useState({...NotInitialized(''), msg: ''})
    const backdropClickHandler = () => {
        setModal({...NotInitialized(''), msg: ''})
    }
    const initialForm = {
        name: {
            inputType: 'input',
            label: 'Navn',
            inputConfig: {
                type: 'text',
                placeholder: 'Ole Alexander',
                autoComplete: 'name'
            },
            value: '',
            validation: {
                isRequired: true, 
                minLength: 2, 
                nameType: true
            },
            isValid: false,
            isTouched: false
        },
        email: {
            inputType: 'input',
            label: 'E-post',
            inputConfig: {
                type: 'email',
                placeholder: 'din.epost@yahoo.com',
                autoComplete: 'email'
            },
            value: '',
            validation: {
                isRequired: true,
                minLength: 8, 
                emailType: true
            },
            isValid: false,
            isTouched: false
        },
        phone: {
            inputType: 'input',
            label: 'Telefonnummer',
            inputConfig: {
                type: 'text',
                placeholder: 'XXX XX XXX',
                autoComplete: 'tel'
            },
            value: '',
            validation: {
                isRequired: true,
                minLength: 8,
                maxLength: 12,
                phoneType: true
            },
            isValid: false,
            isTouched: false
        },
        zipCode: {
            inputType: 'input',
            label: 'Postnummer',
            inputConfig: {
                type: 'text',
                placeholder: '1234',
                autoComplete: 'postal-code'
            },
            value: '',
            validation: {
                isRequired: true,
                minLength: 4,
                zipCodeType: true
            },
            isValid: false,
            isTouched: false
        },
        comment: {
            inputType: 'textarea',
            label: 'Kommentar',
            inputConfig: {
                type: 'text',
                placeholder: '',
                autoComplete: 'off'
            },
            value: '',
            isValid: true,
            isTouched: false
        }
    }
    
    const invalidationMessenger = (value, rules) => {
        let msg = ''
        if (rules.nameType) {
            msg = 'Må ha minst 2 bokstaver' //'Ikke gyldig navn'
        }
        if (rules.emailType) {
            msg = 'E-post er ikke skrevet riktig'
        }
        if (rules.phoneType) {
            msg = 'Må bestå av 8 siffer'
            if(value.length === 8 && (Number(value[0]) === 0)) 
            msg = 'Kan ikke begynne med 0'
        }
        if (rules.zipCodeType) {
            msg = 'Må bestå av 4 siffer'
        }
        if(value === '') {
            msg = 'Må fylles ut'
        }
        return msg
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
    const [isFormValid, setIsFormValid] = useState(false)

    const formReducer = (state, action) => {
        if( action.type === 'CLEAR' ) {
            return initialForm
        }
        let newState = JSON.parse(JSON.stringify(state))
        const input = newState[action.type] 
        input.value = action.payload
        if ( input.validation ) {
            input.isTouched = true
            input.isValid = checkValidity(input.value, input.validation)
            if ( !input.isValid ) {
                input.invalidMsg = invalidationMessenger(input.value, input.validation)
            } else {
                input.invalidMsg = ''
            }
        }
        setIsFormValid(checkIfFormIsValid(newState))
        return newState    
    }
    const [formData, dispatch] = useReducer( formReducer, initialForm)

    const formInputs = []
    for (const input in formData) {
        formInputs.push(
            <Input 
                key={input}
                shouldValidate={formData[input].validation}
                change={(event) => inputChangeHandler(event, input)}
                {...formData[input]}
/*                 inputType={formData[input].inputType} 
                inputConfig={formData[input].inputConfig} 
                name={formData[input]}
                label={formData[input].label}
                invalidMsg={formData[input].invalidMsg}
                value={formData[input].value}
                change={(event) => inputChangeHandler(event, input)}
                isValid={formData[input].isValid}
                shouldValidate={formData[input].validation}
                isTouched={formData[input].isTouched} */
            />
        )
    }

    const submitHandler = event => {
        event.preventDefault()
        if(!isFormValid) return ;
        let customerData = {}
        for (const key in formData) {
            customerData[key] = formData[key].value
        }
        setModal(Fetching('data'))
        postData(customerData)
        .then( res => {
            let msg = ''
            if (res.type === FailFetchedType) {
                msg = (
                    <div>
                    <h5>Ops, data ble ikke sent, error status er {res.value.response.status}</h5>
                    <Button type='Danger' btnCliked={backdropClickHandler}>Tilbake</Button>
                    </div>
                )
            } else if (res.type === FetchedType) {
                msg = (
                    <div>
                        <h5>Din data ble sent</h5>
                        <Button type='Success' btnCliked={backdropClickHandler}>Tilbake</Button>
                    </div>
                )
            }
            setModal({msg: msg})
        })
    }

    const inputChangeHandler = ( e, inputType ) => {
        e.preventDefault()
        dispatch({type: inputType , payload: e.target.value})
    }
    const cleanFormHandler = e => {
        e.preventDefault()
        dispatch({type: 'CLEAR'})
    }

    return (
        <>
            <Modal 
                show={modal.type !== NotInitializedType} 
                backdropClick={backdropClickHandler} 
                >
                    {modal.type === FetchingType ? <Loader /> : modal.msg}
            </Modal>
            <div className={styles.ContactData}>
            <h2 className={styles.Title}>INFORMASJON</h2>
            <form onSubmit={(event) => isFormValid ? submitHandler(event) : null}> 
                {formInputs}
                <Button type='Success' disabled={!isFormValid}>Send inn</Button>
                <Button type='Neutral' btnCliked={cleanFormHandler}>Reset</Button>
            </form>
        </div>
        </>
    )
}

export default ContactData

