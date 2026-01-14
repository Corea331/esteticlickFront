import { useState } from "react"
import { 
  Grid, 
  Button, 
  Group,
  Text,
  Stack,
  Box,
  ActionIcon,
  Tooltip
} from "@mantine/core"
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe,
  X as CloseIcon,
  Share2,
  Mail,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react'
import ModalReutilizable from '../modales/globalModal'

const redesSociales = [
  { nombre: 'Facebook', icono: <Facebook size={24} />, color: '#1877F2', url: 'https://facebook.com/esteticlick' },
  { nombre: 'Instagram', icono: <Instagram size={24} />, color: '#E4405F', url: 'https://instagram.com/esteticlick' },
  { nombre: 'Twitter', icono: <Twitter size={24} />, color: '#1DA1F2', url: 'https://twitter.com/esteticlick' },
  { nombre: 'LinkedIn', icono: <Linkedin size={24} />, color: '#0A66C2', url: 'https://linkedin.com/company/esteticlick' },
  { nombre: 'YouTube', icono: <Youtube size={24} />, color: '#FF0000', url: 'https://youtube.com/esteticlick' },
  { nombre: 'Sitio Web', icono: <Globe size={24} />, color: '#10B981', url: 'https://esteticlick.com' },
];

function ModalRedesSociales({ opened, onClose }) {  // Cambiado de show/handleClose
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  
  const email = "contacto@esteticlick.com";
  const whatsapp = "+5491122334455";
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  const copiarEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copiarWhatsApp = () => {
    navigator.clipboard.writeText(whatsapp);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  return (
    <ModalReutilizable
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <Share2 size={20} />
          <span>Conecta con Nosotros</span>
        </Group>
      }
      size="md"
    >
      <Stack gap="xl">
        {/* Redes Sociales */}
        <Box>
          <Text fw={600} mb="md" size="lg">Síguenos en redes sociales</Text>
          <Grid gutter="md">
            {redesSociales.map((red) => (
              <Grid.Col key={red.nombre} span={{ base: 6, sm: 4 }}>
                <Button
                  fullWidth
                  variant="light"
                  leftSection={red.icono}
                  onClick={() => window.open(red.url, '_blank')}
                  style={{
                    borderColor: red.color,
                    color: red.color,
                    backgroundColor: `${red.color}15`,
                    height: '50px',
                  }}
                >
                  {red.nombre}
                </Button>
              </Grid.Col>
            ))}
          </Grid>
        </Box>

        {/* Contacto Directo */}
        <Box>
          <Text fw={600} mb="md" size="lg">Contacto Directo</Text>
          <Stack gap="md">
            {/* Email */}
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs">
                <ActionIcon color="blue" variant="light" size="lg">
                  <Mail size={18} />
                </ActionIcon>
                <Text size="sm" fw={500}>{email}</Text>
              </Group>
              <Tooltip label={copiedEmail ? "¡Copiado!" : "Copiar email"} position="left">
                <ActionIcon
                  variant="light"
                  color={copiedEmail ? "green" : "gray"}
                  onClick={copiarEmail}
                  size="lg"
                >
                  {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                </ActionIcon>
              </Tooltip>
            </Group>

            {/* WhatsApp */}
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs">
                <ActionIcon color="green" variant="light" size="lg">
                  <MessageCircle size={18} />
                </ActionIcon>
                <Text size="sm" fw={500}>{whatsapp}</Text>
              </Group>
              <Group gap="xs">
                <Tooltip label={copiedWhatsApp ? "¡Copiado!" : "Copiar número"} position="left">
                  <ActionIcon
                    variant="light"
                    color={copiedWhatsApp ? "green" : "gray"}
                    onClick={copiarWhatsApp}
                    size="lg"
                  >
                    {copiedWhatsApp ? <Check size={16} /> : <Copy size={16} />}
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Abrir WhatsApp" position="left">
                  <ActionIcon
                    variant="filled"
                    color="green"
                    onClick={() => window.open(whatsappUrl, '_blank')}
                    size="lg"
                  >
                    <MessageCircle size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Stack>
        </Box>

        <Group justify="flex-end" mt="xl">
          <Button
            variant="light"
            color="gray"
            onClick={onClose}
            leftSection={<CloseIcon size={16} />}
          >
            Cerrar
          </Button>
        </Group>
      </Stack>
    </ModalReutilizable>
  )
}

export default ModalRedesSociales;