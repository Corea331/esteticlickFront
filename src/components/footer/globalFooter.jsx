import { useState } from 'react';
import { Group, Text, Button, Stack, Box } from '@mantine/core';
import { Phone } from 'lucide-react';
import ModalContacto from '../modalcontacto/modalcontacto';
import SocialSelector from '../socialselector/socialselector';
import './globalFooter.css';

function Footer() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Group justify="space-between" align="center" h="100%" px="md" wrap="wrap">
      {/* Izquierda: Contacto */}
      <Stack gap="xs" align="center">
        <Text fw={600} size="lg" c="white" ta="center">
          ¿Desea promocionar su empresa? Solicite información
        </Text>
        
        <Button
          onClick={handleShow}
          leftSection={<Phone size={20} />}
          size="lg"
          style={{
            background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-texto-primario)',
            fontWeight: 600,
            padding: '0.75rem 2rem',
            boxShadow: 'var(--sombra-suave)',
            transition: 'var(--transicion-suave)',
          }}
          styles={{
            root: {
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-botones-hover) 0%, #c98778 100%)',
                color: 'var(--color-blanco)',
                transform: 'translateY(-2px)',
                boxShadow: 'var(--sombra-media)',
              },
            },
          }}
        >
          Contacto
        </Button>

        <ModalContacto show={show} handleClose={handleClose} />
      </Stack>

      {/* Derecha: Redes sociales */}
      <Box>
        <SocialSelector />
      </Box>

      {/* Copyright */}
      <Text size="sm" c="white" opacity={0.8} w="100%" ta="center" mt="md">
        © {new Date().getFullYear()} Esteticlick - Todos los derechos reservados
      </Text>
    </Group>
  );
}

export default Footer;