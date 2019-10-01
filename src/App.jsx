import React, { useState } from 'react'
import { Modal } from './components/UI/UIcomponentsIndex'
import ContactData from './components/ContactData/ContactData'

const App = () => {
const [showModal, setShowModal] = useState(false)
const backdropClickHandler = () => setShowModal(false)
  return (
    <div>
      <Modal show={showModal} backdropClick={backdropClickHandler} >MaybeModal</Modal>
      <ContactData />
    </div>
  )
}

export default App
