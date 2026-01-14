import { useState, useEffect } from 'react'; 
import {
  Avatar,
  Button,
  Group,
  Stack,
  Text,
  Alert,
  Paper,
  Loader,
  Box 
} from '@mantine/core';
import {
  User,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useImageUpload } from '../../hooks/useimageupload';

// Componente de Presentación - solo recibe archivo y lo sube
const AvatarUploader = ({ 
  currentAvatar, 
  onUploadComplete, 
  compact = false,
  fileToUpload = null  // Nuevo prop: archivo a subir
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { uploadAvatar, deleteAvatar } = useImageUpload();

  // Efecto para subir cuando se pasa un archivo
  useEffect(() => {
    if (fileToUpload) {
      console.log('📤 AvatarUploader recibió archivo para subir:', fileToUpload.name);
      handleUpload(fileToUpload);
    }
  }, [fileToUpload]); // ← Se ejecuta cuando fileToUpload cambia

  // Subir archivo al servidor
  const handleUpload = async (file) => {
    try {
      setUploading(true);
      setError(null);
      setSuccess(false);
      
      console.log('🚀 Subiendo avatar al servidor...');
      const result = await uploadAvatar(file);
      
      if (result.image_url || result.avatar_url) {
        setSuccess(true);
        console.log('✅ Avatar subido correctamente:', result.image_url || result.avatar_url);
        
        if (onUploadComplete) {
          onUploadComplete(result.image_url || result.avatar_url);
        }
      }
      
    } catch (error) {
      console.error('❌ Error subiendo avatar:', error);
      setError(error.message || 'Error al subir la imagen');
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  // Eliminar avatar
  const handleDelete = async () => {
    try {
      setUploading(true);
      setError(null);
      
      await deleteAvatar();
      setSuccess(true);
      
      if (onUploadComplete) {
        onUploadComplete(null);
      }
      
    } catch (error) {
      console.error('Error eliminando avatar:', error);
      setError(error.message || 'Error al eliminar la imagen');
    } finally {
      setUploading(false);
    }
  };

  // Versión compacta
  if (compact) {
    return (
      <Group>
        <Box pos="relative">
          <Avatar
            src={currentAvatar}
            size={60}
            radius="50%"
            color="blue"
          >
            <User size={24} />
          </Avatar>
        </Box>

        <Stack gap="xs" style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            {uploading ? 'Subiendo...' : 'Selecciona imagen'}
          </Text>
          
          {error && (
            <Alert
              icon={<AlertCircle size={14} />}
              title="Error"
              color="red"
              size="xs"
              py="xs"
              withCloseButton
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          
          {success && !uploading && (
            <Alert
              icon={<Check size={14} />}
              title="Éxito"
              color="green"
              size="xs"
              py="xs"
            >
              ¡Imagen actualizada!
            </Alert>
          )}
        </Stack>
      </Group>
    );
  }

  // Versión completa
  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="md">
        {/* Avatar preview */}
        <Group justify="center">
          <Avatar
            src={currentAvatar}
            size={150}
            radius="50%"
            color="blue"
          >
            <User size={64} />
          </Avatar>
        </Group>

        {/* Mensajes de estado */}
        {uploading && (
          <Group justify="center">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Subiendo imagen...</Text>
          </Group>
        )}

        {success && !uploading && (
          <Alert
            icon={<Check size={16} />}
            title="Éxito"
            color="green"
            variant="light"
          >
            ¡Foto actualizada correctamente!
          </Alert>
        )}

        {error && (
          <Alert
            icon={<AlertCircle size={16} />}
            title="Error"
            color="red"
            variant="light"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Información */}
        <Paper withBorder p="md" radius="sm" bg="gray.0">
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              {uploading ? 'Subiendo imagen...' : 'Esperando archivo'}
            </Text>
            <Text size="xs" c="dimmed">
              {fileToUpload 
                ? `Archivo listo: ${fileToUpload.name}`
                : 'Selecciona una imagen desde el botón'
              }
            </Text>
            <Text size="xs" c="dimmed">
              Formatos soportados: JPEG, PNG, WebP, HEIC (iPhone)
            </Text>
          </Stack>
        </Paper>

        {/* Botón eliminar si tiene imagen personalizada */}
        {currentAvatar && !currentAvatar.includes('api.dicebear.com') && (
          <Button
            variant="outline"
            color="red"
            onClick={handleDelete}
            loading={uploading}
            leftSection={<Trash2 size={16} />}
            fullWidth
          >
            Eliminar foto actual
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default AvatarUploader;