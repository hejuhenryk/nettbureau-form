import React from 'react'
import styles from './ContactData.module.css'
import { Input, Button } from './../UI/UIcomponentsIndex'


const ContactData = props => {
    return (
        <div className={styles.ContactData}>
            <h2 className={styles.Title}>INFORMASJON</h2>
            <Input label='Name:' inputType='input' />
            <Input label='E-post:' inputType='input' />
            <Input label='Telefon:' inputType='input' />
            <Input label='Postnummer:' inputType='input' />
            <Input label='Komentar:' inputType='textarea' />
            <Button type='Success'>Success</Button>
            <Button type='Danger'>Danger</Button>
            <Button type='Neutral'>Neutral</Button>
            <Button type='Neutral' disabled>Neutral</Button>
        </div>
    )
}

export default ContactData
