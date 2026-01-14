import { useState } from 'react';
import { 
  Button, Group, Paper, Stack, Text, Alert, 
  Box, SimpleGrid, Image, Badge, Modal
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  ImageIcon, AlertCircle, Check, 
  X, Eye
} from 'lucide-react';
import ImageConverterWrapper from './imageConverterWrapper';

const ImageUploader = ({ 
  onImagesUploaded, 
  multiple = true, 
  maxFiles = 10,
  label = "Subir imágenes",
  description = "Sube imágenes de tus trabajos, productos o servicios",
  existingImages = [],
  onDeleteImage,
  compact = false
}) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleImagesConverted = (conversionResult) => {
    if (!conversionResult) return;
    
    try {
      setError(null);
      
      let convertedFiles = [];
      if (conversionResult.file) {
        convertedFiles = [conversionResult.file];
      } else if (conversionResult.results) {
        convertedFiles = conversionResult.results.map(r => r.converted.file);
      } else if (conversionResult.files) {
        convertedFiles = conversionResult.files;
      }
      
      if (convertedFiles.length === 0) {
        throw new Error('No se obtuvieron archivos convertidos');
      }
      
      const newUploadedImages = convertedFiles.map((file, index) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        reduction: conversionResult.results?.[index]?.converted?.reduction || '0',
        id: Date.now() + index
      }));
      
      setUploadedImages(prev => [...prev, ...newUploadedImages]);
      setSuccess(true);
      
      if (onImagesUploaded) {
        onImagesUploaded(convertedFiles);
      }
      
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error procesando imágenes:', error);
      setError(error.message || 'Error al procesar las imágenes');
      setSuccess(false);
    }
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      if (onDeleteImage) {
        onDeleteImage(existingImages[index]);
      }
    } else {
      const imageToRemove = uploadedImages[index];
      
      if (imageToRemove.previewUrl) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      
      const newUploadedImages = [...uploadedImages];
      newUploadedImages.splice(index, 1);
      setUploadedImages(newUploadedImages);
      
      if (onImagesUploaded) {
        onImagesUploaded(newUploadedImages.map(img => img.file));
      }
    }
  };

  const handlePreviewImage = (url) => {
    setPreviewImage(url);
  };

  if (compact) {
    return (
      <ImageConverterWrapper onImagesConverted={handleImagesConverted} maxFiles={multiple ? maxFiles : 1}>
        {({ DropzoneComponent }) => (
          <Box>
            {DropzoneComponent}
            
            {error && (
              <Alert
                icon={<AlertCircle size={14} />}
                title="Error"
                color="red"
                size="xs"
                mt="sm"
                withCloseButton
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert
                icon={<Check size={14} />}
                title="Éxito"
                color="green"
                size="xs"
                mt="sm"
              >
                Imágenes subidas correctamente
              </Alert>
            )}
            
            {uploadedImages.length > 0 && (
              <SimpleGrid cols={3} spacing="xs" mt="sm">
                {uploadedImages.map((img, index) => (
                  <Box key={img.id} pos="relative">
                    <Image
                      src={img.previewUrl}
                      height={60}
                      radius="sm"
                      fit="cover"
                    />
                    <Button
                      size="xs"
                      radius="xl"
                      variant="filled"
                      color="red"
                      pos="absolute"
                      top={-5}
                      right={-5}
                      p={0}
                      w={20}
                      h={20}
                      onClick={() => handleRemoveImage(index, false)}
                    >
                      <X size={10} />
                    </Button>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>
        )}
      </ImageConverterWrapper>
    );
  }

  return (
    <ImageConverterWrapper onImagesConverted={handleImagesConverted} maxFiles={multiple ? maxFiles : 1}>
      {({ DropzoneComponent }) => (
        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group>
              <ImageIcon size={20} />
              <Text fw={500}>{label}</Text>
              {uploadedImages.length > 0 && (
                <Badge color="teal" variant="light">
                  {uploadedImages.length} imágenes
                </Badge>
              )}
            </Group>
            
            <Text size="sm" c="dimmed">{description}</Text>
            
            {DropzoneComponent}
            
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
            
            {success && (
              <Alert
                icon={<Check size={16} />}
                title="Éxito"
                color="green"
                variant="light"
              >
                Imágenes procesadas correctamente
              </Alert>
            )}
            
            {existingImages.length > 0 && (
              <Box>
                <Text size="sm" fw={500} mb="xs">Imágenes existentes:</Text>
                <SimpleGrid cols={isMobile ? 2 : 4} spacing="sm">
                  {existingImages.map((url, index) => (
                    <Box key={`existing-${index}`} pos="relative">
                      <Image
                        src={url}
                        height={100}
                        radius="sm"
                        fit="cover"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handlePreviewImage(url)}
                      />
                      {onDeleteImage && (
                        <Button
                          size="xs"
                          radius="xl"
                          variant="filled"
                          color="red"
                          pos="absolute"
                          top={-5}
                          right={-5}
                          p={0}
                          w={20}
                          h={20}
                          onClick={() => handleRemoveImage(index, true)}
                        >
                          <X size={10} />
                        </Button>
                      )}
                      <Badge
                        size="xs"
                        variant="filled"
                        color="blue"
                        pos="absolute"
                        bottom={5}
                        left={5}
                      >
                        Existente
                      </Badge>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}
            
            {uploadedImages.length > 0 && (
              <Box>
                <Text size="sm" fw={500} mb="xs">Nuevas imágenes:</Text>
                <SimpleGrid cols={isMobile ? 2 : 4} spacing="sm">
                  {uploadedImages.map((img, index) => (
                    <Box key={img.id} pos="relative">
                      <Image
                        src={img.previewUrl}
                        height={100}
                        radius="sm"
                        fit="cover"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handlePreviewImage(img.previewUrl)}
                      />
                      <Button
                        size="xs"
                        radius="xl"
                        variant="filled"
                        color="red"
                        pos="absolute"
                        top={-5}
                        right={-5}
                        p={0}
                        w={20}
                        h={20}
                        onClick={() => handleRemoveImage(index, false)}
                      >
                        <X size={10} />
                      </Button>
                      <Badge
                        size="xs"
                        variant="filled"
                        color="teal"
                        pos="absolute"
                        bottom={5}
                        left={5}
                      >
                        -{img.reduction}%
                      </Badge>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="gray"
                        pos="absolute"
                        top={5}
                        left={5}
                        p={2}
                        onClick={() => handlePreviewImage(img.previewUrl)}
                      >
                        <Eye size={12} />
                      </Button>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </Stack>
          
          <Modal
            opened={!!previewImage}
            onClose={() => setPreviewImage(null)}
            title="Vista previa"
            size="lg"
          >
            {previewImage && (
              <Image
                src={previewImage}
                fit="contain"
                style={{ maxHeight: '60vh' }}
              />
            )}
          </Modal>
        </Paper>
      )}
    </ImageConverterWrapper>
  );
};

export default ImageUploader;