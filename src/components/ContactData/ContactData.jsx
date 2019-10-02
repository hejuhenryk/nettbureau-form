import React, { useState, useReducer, useEffect } from 'react'
import styles from './ContactData.module.css'
import { Input, Button, Modal, Loader } from '../UI/Index'
import { postData, NotInitialized, NotInitializedType, Fetching, FailFetchedType, FetchedType, FetchingType } from '../../dataService/dataService'


const ContactData = props => {
    const [modal, setModal] = useState({...NotInitialized(''), msg: ''})
    const backdropClickHandler = () => {
        setModal({...NotInitialized(''), msg: ''})
    }
    const initialForm = {
        name: {
            elementType: 'input',
            label: 'Navn',
            elementConfig: {
                type: 'text',
                placeholder: 'Ole Alexander',
                autoComplete: 'given-name'
            },
            value: '',
            validation: {
                isRequired: true, 
                minLength: 2, 
                nameType: true
            },
            isValid: false,
            isTouched: false
        }/* ,
        lastname: {
            elementType: 'input',
            label: 'Etternavn',
            elementConfig: {
                type: 'text',
                placeholder: 'Filibom-Bom-Bom',
                autoComplete: 'family-name'
            },
            value: '',
            validation: {
                isRequired: true, 
                minLength: 2, 
                nameType: true
            },
            isValid: false,
            isTouched: false
        } */,
        email: {
            elementType: 'input',
            label: 'E-post',
            elementConfig: {
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
            elementType: 'input',
            label: 'Telefonnummer',
            elementConfig: {
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
            elementType: 'input',
            label: 'Postnummer',
            elementConfig: {
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
            elementType: 'textarea',
            label: 'Kommentar',
            elementConfig: {
                type: 'text',
                placeholder: '',
                autoComplete: 'off'
            },
            value: ''/* ,
            validation: {
                isRequired: false,
                maxLength: 300
            } */,
            isValid: true,
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
            if(value.length === 8 && value[0] == 0) 
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
    const formReducer = (state, action) => {
        if( action.type === 'CLEAR' ) {
            return initialForm
        }
        let newForm = JSON.parse(JSON.stringify(state))
        newForm[action.type].value = action.payload
        if ( newForm[action.type].validation ) {
            newForm[action.type].isTouched = true
            newForm[action.type].isValid = checkValidity(newForm[action.type].value, newForm[action.type].validation)
            if ( !newForm[action.type].isValid ) {
                newForm[action.type].invalidMsg = invalidationMessenger(newForm[action.type].value, newForm[action.type].validation)
            } else {
                newForm[action.type].invalidMsg = ''
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
        setModal(Fetching('data'))
        postData(customerData)
        .then( res => {
            //remove spinner, add display respons data
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
            setModal({...res, msg: msg})
        })
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
                <Button type='Neutral' btnCliked={cleanFormHandler}>Clean Form</Button>
            </form>
        </div>
        </>
    )
}

export default ContactData
