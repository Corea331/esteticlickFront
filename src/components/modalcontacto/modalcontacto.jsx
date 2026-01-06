import { useState } from "react"
import { 
  Modal, 
  TextInput, 
  Textarea, 
  Button, 
  Group, 
  LoadingOverlay 
} from "@mantine/core"
import { useCreateMessage } from '../../hooks'
import { 
  showSuccess,
  showError,
} from '../../utils/notifications'
import { Phone, X, Send } from 'lucide-react'




function ModalContacto({ show, handleClose }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    phone: '', 
    message: '' });
  
    const createContactMutation = useCreateMessage();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createContactMutation.mutateAsync(formData)
      handleClose()
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
    <Modal
      opened={show}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <Phone size={20} />
          <span>Contacto</span>
        </Group>
      }
      size="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      closeButtonProps={{
        'aria-label': 'Cerrar modal',
      }}
    >
      <LoadingOverlay visible={createContactMutation.isLoading} overlayProps={{ blur: 2 }} />
      
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Nombre"
          placeholder="Tu nombre completo"
          value={formData.name}
          onChange={handleInputChange('name')}
          required
          mb="md"
          size="md"
        />

        <TextInput
          label="Email"
          placeholder="tu@email.com"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          required
          mb="md"
          size="md"
        />

        <TextInput
          label="Asunto"
          placeholder="Motivo de tu contacto"
          value={formData.subject}
          onChange={handleInputChange('subject')}
          required
          mb="md"
          size="md"
        />

        <TextInput
          label="Teléfono"
          placeholder="Número de contacto"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          required
          mb="md"
          size="md"
        />

        <Textarea
          label="Mensaje"
          placeholder="Escribe tu mensaje aquí..."
          value={formData.message}
          onChange={handleInputChange('message')}
          required
          minRows={4}
          mb="xl"
          size="md"
        />

        <Group justify="flex-end" gap="md">
          <Button
            variant="light"
            color="gray"
            onClick={handleClose}
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
    </Modal>
  )
}

export default ModalContacto;
