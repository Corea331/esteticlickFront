// src/components/modalcontacto/modalcontacto.jsx
import { useState } from "react"
import { 
  TextInput, 
  Textarea, 
  Button, 
  Group
} from "@mantine/core"
import { useCreateMessage } from '../../hooks'
import { 
  showSuccess,
  showError,
} from '../../utils/notifications'
import { Phone, X, Send } from 'lucide-react'
import ModalReutilizable from '../modales/globalModal'

function ModalContacto({ opened, onClose }) {  // Cambiado de show/handleClose
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    phone: '', 
    message: '' 
  });
  
  const createContactMutation = useCreateMessage();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createContactMutation.mutateAsync(formData)
      onClose()
      setFormData({ name: '', email: '', subject: '', phone: '', message: '' })
      showSuccess("Tu mensaje ha sido enviado exitosamente")
    } catch (error) {
      showError("No se pudo enviar el mensaje. Por favor, inténtalo nuevamente.")
    }
  }

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  return (
    <ModalReutilizable
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <Phone size={20} />
          <span>Contacto</span>
        </Group>
      }
      loading={createContactMutation.isLoading}
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Nombre"
          placeholder="Tu nombre completo"
          value={formData.name}
          onChange={handleInputChange('name')}
          required
          mb="xs"
        />

        <TextInput
          label="Email"
          placeholder="tu@email.com"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          required
          mb="xs"
        />

        <TextInput
          label="Asunto"
          placeholder="Motivo de tu contacto"
          value={formData.subject}
          onChange={handleInputChange('subject')}
          required
          mb="xs"
        />

        <TextInput
          label="Teléfono"
          placeholder="Número de contacto"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          required
          mb="xs"
        />

        <Textarea
          label="Mensaje"
          placeholder="Escribe tu mensaje aquí..."
          value={formData.message}
          onChange={handleInputChange('message')}
          required
          minRows={4}
          mb="md"
        />

        <Group justify="flex-end" gap="xs">
          <Button
            variant="light"
            color="gray"
            onClick={onClose}
            leftSection={<X size={16} />}
          >
            Cerrar
          </Button>
          
          <Button
            type="submit"
            color="teal"
            loading={createContactMutation.isLoading}
            leftSection={!createContactMutation.isLoading && <Send size={16} />}
          >
            {createContactMutation.isLoading ? 'Enviando...' : 'Enviar Mensaje'}
          </Button>
        </Group>
      </form>
    </ModalReutilizable>
  )
}

export default ModalContacto;