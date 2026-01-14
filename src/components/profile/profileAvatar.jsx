import { useState, useRef } from 'react';
import {
  Box,
  Stack,
  Button,
  Text,
  Paper,
  Group,
  Alert,
  Badge,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useImageConverter } from '../../hooks/useimageconverter';
import { 
  ArrowLeft, 
  Upload, 
  AlertTriangle,
  FileImage,
  Download,
  X
} from 'lucide-react';
import AvatarUploader from '../uploaders/avatarUploader';
import ImageConverterModal from '../modales/imageConverterModal';
import GlobalModal from '../modales/globalModal';

const ProfileAvatar = ({ currentAvatar, onUploadComplete, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [directUploadFile, setDirectUploadFile] = useState(null);
  const [fileStats, setFileStats] = useState(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [decisionModalOpened, { open: openDecisionModal, close: closeDecisionModal }] = useDisclosure(false);
  
  const fileInputRef = useRef(null);
  const converter = useImageConverter();

  // Analizar archivo cuando se selecciona
  const analyzeFile = (file) => {
    if (!file) return null;
    
    const sizeMB = file.size / (1024 * 1024);
    const needsConv = converter.needsConversion(file);
    const isMobile = converter.isMobileImage(file);
    
    return {
      name: file.name,
      type: file.type,
      sizeMB: sizeMB.toFixed(2),
      needsConversion: needsConv,
      isMobile,
      isLarge: sizeMB > 1,
      isNotWebP: file.type !== 'image/webp',
      format: converter.getFileTypeName(file)
    };
  };

  // Manejar selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Analizar archivo
    const stats = analyzeFile(file);
    setFileStats(stats);
    
    if (stats.needsConversion) {
      // Mostrar modal de decisión
      openDecisionModal();
    } else {
      // Subir directamente (no necesita conversión)
      setDirectUploadFile(file);
      console.log('📤 Archivo no necesita conversión, subiendo directamente');
    }
    
    // Resetear input
    event.target.value = '';
  };

  // Opción 1: Convertir imagen
  const handleConvertImage = () => {
    closeDecisionModal();
    
    // Iniciar conversión
    converter.openConverter(selectedFile);
    
    // Abrir modal de conversión
    openModal();
  };

  // Opción 2: Subir sin convertir
  const handleUploadDirectly = () => {
    closeDecisionModal();
    setDirectUploadFile(selectedFile);
    console.log('📤 Usuario eligió subir sin convertir');
  };

  // Manejar conversión completada
  const handleConversionComplete = (conversionResult) => {
    if (!conversionResult) return;
    
    console.log('✅ Conversión completada:', conversionResult);
    
    // Obtener archivo convertido
    const converted = conversionResult.converted?.file || conversionResult.file;
    if (converted) {
      setConvertedFile(converted);
      console.log('📁 Archivo convertido listo:', converted.name);
    }
    
    closeModal();
    setSelectedFile(null);
    setFileStats(null);
    converter.resetConversion();
  };

  // Resetear cuando se completa la subida
  const handleUploadComplete = (newAvatarUrl) => {
    setConvertedFile(null);
    setDirectUploadFile(null);
    setSelectedFile(null);
    setFileStats(null);
    
    if (onUploadComplete) {
      onUploadComplete(newAvatarUrl);
    }
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Box>
        <Button
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          onClick={onCancel}
          mb="md"
          size="sm"
        >
          Volver
        </Button>
        
        <Stack gap="xs">
          <Text size="xl" fw={600}>Cambiar Avatar</Text>
          <Text size="sm" c="dimmed">
            Sube una nueva foto de perfil. Las imágenes grandes se optimizarán automáticamente.
          </Text>
        </Stack>
      </Box>

      {/* Uploader que muestra estado actual */}
      <AvatarUploader
        currentAvatar={currentAvatar}
        onUploadComplete={handleUploadComplete}
        fileToUpload={convertedFile || directUploadFile}
        compact={false}
      />

      {/* Sección de información si hay archivo analizado */}
      {fileStats && (
        <Paper withBorder p="md" radius="md" bg="gray.0">
          <Stack gap="xs">
            <Group>
              <FileImage size={18} />
              <Text fw={500}>Análisis de imagen</Text>
            </Group>
            
            <Group justify="apart" wrap="nowrap">
              <Stack gap={2} style={{ flex: 1 }}>
                <Text size="sm" truncate>{fileStats.name}</Text>
                <Text size="xs" c="dimmed">
                  {fileStats.format} • {fileStats.sizeMB} MB
                </Text>
              </Stack>
              
              {fileStats.needsConversion ? (
                <Badge color="yellow" variant="filled">
                  Necesita optimización
                </Badge>
              ) : (
                <Badge color="green" variant="light">
                  Listo para subir
                </Badge>
              )}
            </Group>
            
            {fileStats.needsConversion && (
              <Stack gap="xs" mt="xs">
                <Text size="xs" fw={500}>Motivos para optimizar:</Text>
                <Group gap="xs">
                  {fileStats.isLarge && (
                    <Badge size="xs" color="orange" variant="outline">
                      Grande ({fileStats.sizeMB} MB)
                    </Badge>
                  )}
                  {fileStats.isMobile && (
                    <Badge size="xs" color="blue" variant="outline">
                      Formato móvil
                    </Badge>
                  )}
                  {fileStats.isNotWebP && (
                    <Badge size="xs" color="teal" variant="outline">
                      No es WebP
                    </Badge>
                  )}
                </Group>
                
                {fileStats.sizeMB > 5 && (
                  <Alert icon={<AlertTriangle size={14} />} color="orange" size="xs">
                    <Text size="xs">
                      Imagen muy grande. Se recomienda optimizar para reducir tiempo de subida.
                    </Text>
                  </Alert>
                )}
              </Stack>
            )}
          </Stack>
        </Paper>
      )}

      {/* Botón para abrir selector de archivos */}
      <Box>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <Button
          leftSection={<Upload size={16} />}
          onClick={() => fileInputRef.current?.click()}
          fullWidth
          size="md"
          variant="light"
        >
          Seleccionar nueva imagen
        </Button>
        
        <Text size="xs" c="dimmed" mt="xs" ta="center">
          Formatos: JPEG, PNG, WebP, HEIC (iPhone)
        </Text>
      </Box>

      {/* Modal de decisión: ¿Convertir o no? (USANDO GLOBALMODAL) */}
      <GlobalModal
        opened={decisionModalOpened}
        onClose={closeDecisionModal}
        title="¿Optimizar imagen?"
        size="lg"
        centered
        zIndex={1000}
        closeOnClickOutside={true}
        closeOnEscape={true}
      >
        <Stack gap="md">
          {fileStats && (
            <>
              <Alert color="blue" variant="light">
                <Text size="sm">
                  Esta imagen podría beneficiarse de optimización:
                </Text>
                <Text size="xs" mt={4}>
                  • Tamaño: <strong>{fileStats.sizeMB} MB</strong><br/>
                  • Formato: <strong>{fileStats.format}</strong><br/>
                  • Se reducirá aprox. <strong>70-90%</strong> en tamaño
                </Text>
              </Alert>
              
              <Group justify="center" mt="md">
                <Button
                  variant="outline"
                  leftSection={<X size={16} />}
                  onClick={handleUploadDirectly}
                  color="gray"
                >
                  Subir sin optimizar
                </Button>
                <Button
                  color="teal"
                  leftSection={<Download size={16} />}
                  onClick={handleConvertImage}
                >
                  Optimizar primero
                </Button>
              </Group>
              
              <Text size="xs" c="dimmed" ta="center">
                Recomendado para imágenes grandes o formatos móviles
              </Text>
            </>
          )}
        </Stack>
      </GlobalModal>

      {/* Modal de conversión (USANDO GLOBALMODAL) */}
      <GlobalModal
        opened={modalOpened}
        onClose={closeModal}
        title="Optimizar Imagen"
        size="xl"
        centered
        zIndex={1001} // Un z-index más alto que el modal anterior
        closeOnClickOutside={false} // Importante: no cerrar al hacer clic fuera
        closeOnEscape={true}
        fullScreen={false}
        padding="none" // Sin padding para que ImageConverterModal controle todo
      >
        <ImageConverterModal
          converter={converter}
          filesToProcess={selectedFile ? [selectedFile] : []}
          onClose={closeModal}
          onAccept={handleConversionComplete}
        />
      </GlobalModal>
    </Stack>
  );
};

export default ProfileAvatar;