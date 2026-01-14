import { useEffect } from 'react';
import { 
  Group, 
  Text, 
  Button, 
  Stack, 
  Box, 
  Container,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { 
  Phone, 
  Mail, 
  Share2, 
  ChevronUp,
  Home,
  MessageCircle,
  Heart
} from 'lucide-react';
import ModalContacto from '../modales/modalContacto';
import ModalRedesSociales from '../modales/modalRedesSociales';

function Footer() {
  const [modalContactoOpened, { open: openModalContacto, close: closeModalContacto }] = useDisclosure(false);
  const [modalRedesOpened, { open: openModalRedes, close: closeModalRedes }] = useDisclosure(false);
  const [showScrollTop, { open: openScrollTop, close: closeScrollTop }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 992px)');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        openScrollTop();
      } else {
        closeScrollTop();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Container size="xl">
        <Stack gap={isMobile ? 'lg' : 'xl'} py={isMobile ? 'lg' : 'xl'}>
          {/* Botonera superior */}
          <Group 
            justify="center" 
            gap={isMobile ? 'sm' : 'md'} 
            wrap="wrap"
            style={{
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
            }}
          >
            <Button
              variant="light"
              color="blue"
              leftSection={<Home size={isMobile ? 16 : 18} />}
              onClick={scrollToTop}
              w={isMobile ? '100%' : 'auto'}
              maw={isMobile ? 300 : 'none'}
            >
              Volver al inicio
            </Button>

            <Button
              variant="light"
              color="orange"
              leftSection={<Mail size={isMobile ? 16 : 18} />}
              onClick={() => window.location.href = 'mailto:contacto@esteticlick.com'}
              w={isMobile ? '100%' : 'auto'}
              maw={isMobile ? 300 : 'none'}
            >
              Enviar Email
            </Button>

            <Button
              variant="light"
              color="green"
              leftSection={<MessageCircle size={isMobile ? 16 : 18} />}
              onClick={() => window.open('https://wa.me/5491122334455', '_blank')}
              w={isMobile ? '100%' : 'auto'}
              maw={isMobile ? 300 : 'none'}
            >
              WhatsApp
            </Button>

            <Button
              variant="light"
              color="violet"
              leftSection={<Share2 size={isMobile ? 16 : 18} />}
              onClick={openModalRedes}
              w={isMobile ? '100%' : 'auto'}
              maw={isMobile ? 300 : 'none'}
            >
              Redes Sociales
            </Button>

            <Button
              variant="filled"
              bg="var(--color-botones)"
              leftSection={<Phone size={isMobile ? 16 : 18} />}
              onClick={openModalContacto}
              w={isMobile ? '100%' : 'auto'}
              maw={isMobile ? 300 : 'none'}
              styles={{
                root: {
                  '&:hover': {
                    backgroundColor: 'var(--color-botones-hover)',
                  },
                },
              }}
            >
              Contacto Rápido
            </Button>
          </Group>

          {/* Información de contacto */}
          <Group 
            justify="center" 
            gap={isMobile ? 'lg' : 'xl'} 
            wrap="wrap"
            style={{
              flexDirection: isTablet ? 'column' : 'row',
              gap: isTablet ? 'xl' : 'xl',
            }}
          >
            <Stack gap="xs" align="center">
              <Text fw={600} size="lg" c="white">Contacto</Text>
              <Text size="sm" c="white" opacity={0.9}>contacto@esteticlick.com</Text>
              <Text size="sm" c="white" opacity={0.9}>+54 9 11 2233-4455</Text>
            </Stack>

            <Stack gap="xs" align="center">
              <Text fw={600} size="lg" c="white">Horarios</Text>
              <Text size="sm" c="white" opacity={0.9}>Lun a Vie: 9:00 - 18:00</Text>
              <Text size="sm" c="white" opacity={0.9}>Sábados: 9:00 - 13:00</Text>
            </Stack>

            <Stack gap="xs" align="center">
              <Text fw={600} size="lg" c="white">Dirección</Text>
              <Text size="sm" c="white" opacity={0.9} ta="center">Av. Siempre Viva 123</Text>
              <Text size="sm" c="white" opacity={0.9} ta="center">Buenos Aires, Argentina</Text>
            </Stack>
          </Group>

          {/* Copyright */}
          <Box ta="center" mt="md">
            <Text size="sm" c="white" opacity={0.8}>
              Hecho con{' '}
              <Heart 
                size={12} 
                style={{ 
                  display: 'inline', 
                  margin: '0 4px',
                  color: 'var(--color-botones)',
                  verticalAlign: 'middle' 
                }} 
              />{' '}
              para tu belleza
            </Text>
            <Text size="xs" c="white" opacity={0.6} mt="xs">
              © {new Date().getFullYear()} Esteticlick - Todos los derechos reservados. 
              Sistema de gestión para estéticas profesionales.
            </Text>
          </Box>
        </Stack>
      </Container>

      {/* Botón volver arriba */}
      {showScrollTop && (
        <Tooltip label="Volver arriba" position="left">
          <ActionIcon
            variant="filled"
            bg="var(--color-botones)"
            size={isMobile ? 'lg' : 'xl'}
            radius="xl"
            onClick={scrollToTop}
            pos="fixed"
            bottom={30}
            right={30}
            style={{ zIndex: 1000 }}
            styles={{
              root: {
                '&:hover': {
                  backgroundColor: 'var(--color-botones-hover)',
                },
              },
            }}
          >
            <ChevronUp size={isMobile ? 18 : 20} />
          </ActionIcon>
        </Tooltip>
      )}

      <ModalContacto
        opened={modalContactoOpened}
        onClose={closeModalContacto}
      />

      <ModalRedesSociales
        opened={modalRedesOpened}
        onClose={closeModalRedes}
      />
    </>
  );
}

export default Footer;