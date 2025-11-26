import { Modal, Form } from "react-bootstrap"
import { useState } from "react"
import { useCreateContactMessage } from '../../hooks/apihooks.js'
import './modalcontacto.css'



function ModalContacto({ show, handleClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', phone: '', message: '' });
  const createContactMutation = useCreateContactMessage();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createContactMutation.mutateAsync(formData)
      handleClose()
      setFormData({ name: '', email: '', subject: '', phone: '', message: '' })
      alert('Mensaje enviado exitosamente!')
    } catch (error) {
      alert('Error al enviar el mensaje')
    }
  }


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title><i className="bi bi-telephone-fill"></i> Contacto</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Control 
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Form.Control 
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Form.Control 
            type="text"
            placeholder="Asunto"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required
          />
          <Form.Control 
            type="text"
            placeholder="Telefono"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <Form.Control 
            as="textarea"
            placeholder="Mensaje"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
          />
        </Modal.Body>

        <Modal.Footer>
          <button type="button" onClick={handleClose}><i className="bi bi-x-lg"></i> Cerrar</button>
          <button type="submit" disabled={createContactMutation.isLoading}>
            <i className="bi bi-send-check-fill"></i> {createContactMutation.isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default ModalContacto;
