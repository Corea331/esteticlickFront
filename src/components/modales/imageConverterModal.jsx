import { useState } from 'react';
import { 
  Group, Button, Stack, 
  Text, Image, Progress, Alert, 
  SegmentedControl, Switch, Badge, Paper,
  Grid, Box, Flex, Slider,
  useMantineTheme
} from '@mantine/core';
import {
  X, Check, Download, RotateCw, ZoomIn,
  ZoomOut, Settings, FileImage,
  ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { useMediaQuery } from '@mantine/hooks';

const ImageConverterModal = ({ 
  converter, 
  filesToProcess,
  onClose,
  onAccept
}) => {
  const {
    conversionResult,
    originalFile,
    previewUrl,
    conversionOptions,
    isConverting,
    updateOptions,
    acceptConversion,
    getFileTypeName,
    batchMode,
    batchFiles,
    currentBatchIndex,
    batchResults,
    batchProgress,
    processNextInBatch,
    changeBatchIndex,
  } = converter;

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Si es modo batch, usar archivos del batch
  const isBatch = batchMode && batchFiles.length > 0;
  const currentFile = isBatch ? batchFiles[currentBatchIndex] : originalFile;
  const totalFiles = isBatch ? batchFiles.length : 1;

  // Calcular estadísticas
  const stats = conversionResult ? {
    originalSize: conversionResult.original.sizeMB,
    convertedSize: conversionResult.converted.sizeMB,
    reduction: conversionResult.converted.reduction,
    format: conversionOptions.format.toUpperCase(),
    dimensions: `${conversionResult.converted.width || conversionOptions.maxWidth}×${conversionResult.converted.height || conversionOptions.maxHeight}px`,
    method: conversionResult.converted.method
  } : null;

  // Detectar si es imagen móvil
  const isMobileImage = currentFile && (
    currentFile.type.includes('heic') || 
    currentFile.type.includes('heif')
  );

  const handleAccept = async () => {
    if (isBatch && currentBatchIndex < batchFiles.length - 1) {
      // Si estamos en modo batch y hay más archivos, procesar siguiente
      const hasNext = await processNextInBatch();
      if (hasNext) {
        setZoom(1);
        setRotation(0);
        setActiveTab('preview');
        return;
      }
    }
    
    // Último archivo o modo single, aceptar todo
    const result = acceptConversion();
    
    if (onAccept && result) {
      onAccept(result);
    }
    
    if (onClose) {
      onClose();
    }
  };

  const handleDownloadPreview = () => {
    if (conversionResult?.preview) {
      const link = document.createElement('a');
      link.href = conversionResult.preview;
      const fileName = currentFile?.name?.replace(/\.[^/.]+$/, '') || 'optimizada';
      link.download = `${fileName}_optimizada.${conversionOptions.format}`;
      link.click();
    }
  };

  const formatSizes = [
    { label: 'WebP', value: 'webp', description: 'Mejor compresión' },
    { label: 'JPEG', value: 'jpeg', description: 'Amplia compatibilidad' },
    { label: 'PNG', value: 'png', description: 'Calidad sin pérdida' }
  ];

  const dimensionPresets = [
    { label: 'Pequeño (800×800)', value: '800x800' },
    { label: 'Mediano (1200×1200)', value: '1200x1200' },
    { label: 'Grande (1920×1080)', value: '1920x1080' },
    { label: 'Original', value: '9999x9999' }
  ];

  // Obtener valor actual de dimensiones
  const getCurrentDimensionsValue = () => {
    return `${conversionOptions.maxWidth}x${conversionOptions.maxHeight}`;
  };

  const handleDimensionsChange = (value) => {
    const [width, height] = value.split('x').map(Number);
    updateOptions({ maxWidth: width, maxHeight: height });
  };

  const getQualityBadgeColor = (quality) => {
    if (quality > 80) return 'green';
    if (quality > 60) return 'yellow';
    return 'red';
  };

  const getQualityBadgeLabel = (quality) => {
    if (quality > 80) return 'Alta';
    if (quality > 60) return 'Media';
    return 'Baja';
  };

  const renderImagePreview = () => {
    if (!conversionResult?.preview) {
      return (
        <Stack align="center" gap="md">
          <RefreshCw size={32} className="animate-spin" />
          <Text c="dimmed">Procesando imagen...</Text>
        </Stack>
      );
    }

    return (
      <Box style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
        <Image
          src={conversionResult.preview}
          alt="Imagen convertida"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            maxHeight: '400px',
            maxWidth: '100%',
            transition: 'transform 0.3s ease'
          }}
          fit="contain"
        />
        {isMobileImage && (
          <Badge 
            color="blue" 
            variant="filled" 
            style={{ 
              position: 'absolute', 
              top: 10, 
              right: 10,
              backdropFilter: 'blur(4px)'
            }}
          >
            Móvil
          </Badge>
        )}
      </Box>
    );
  };

  const renderComparisonView = () => {
    return (
      <Grid gutter="md" w="100%">
        <Grid.Col span={6}>
          <Stack gap="xs" align="center" h="100%">
            <Text size="xs" c="dimmed">Original</Text>
            {previewUrl && (
              <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  src={previewUrl}
                  alt="Original"
                  fit="contain"
                  style={{ maxHeight: '250px', maxWidth: '100%' }}
                />
              </Box>
            )}
            {stats && (
              <Text size="xs" c="dimmed">
                {stats.originalSize} MB
              </Text>
            )}
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack gap="xs" align="center" h="100%">
            <Text size="xs" c="dimmed">
              Optimizado ({stats?.format})
            </Text>
            {conversionResult?.preview ? (
              <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  src={conversionResult.preview}
                  alt="Convertida"
                  fit="contain"
                  style={{ maxHeight: '250px', maxWidth: '100%' }}
                />
              </Box>
            ) : (
              <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={24} className="animate-spin" />
              </Box>
            )}
            {stats && (
              <>
                <Text size="xs" c="teal" fw={600}>
                  {stats.convertedSize} MB
                </Text>
                <Text size="xs" c="teal">
                  ↓ {stats.reduction}% menos
                </Text>
                {stats.method && (
                  <Text size="xs" c="dimmed">
                    Método: {stats.method}
                  </Text>
                )}
              </>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    );
  };

  // Navegar al índice anterior
  const goToPrevious = () => {
    if (currentBatchIndex > 0) {
      changeBatchIndex(currentBatchIndex - 1);
      setZoom(1);
      setRotation(0);
    }
  };

  // Navegar al índice siguiente
  const goToNext = () => {
    if (currentBatchIndex < batchFiles.length - 1) {
      changeBatchIndex(currentBatchIndex + 1);
      setZoom(1);
      setRotation(0);
    }
  };

  return (
    <Flex direction="column" h="100%">
      {/* Header con navegación para batch */}
      {isBatch && batchFiles.length > 1 && (
        <Paper p="sm" radius={0} withBorder>
          <Group justify="space-between">
            <Button
              variant="subtle"
              leftSection={<ChevronLeft size={16} />}
              onClick={goToPrevious}
              disabled={currentBatchIndex === 0 || isConverting}
              size="xs"
            >
              Anterior
            </Button>
            
            <Stack gap={0} align="center">
              <Text size="sm" fw={500} ta="center">
                {currentFile?.name || `Imagen ${currentBatchIndex + 1}`}
              </Text>
              <Text size="xs" c="dimmed">
                {currentBatchIndex + 1} de {batchFiles.length}
                {batchProgress && ` (${batchProgress.percentage}%)`}
              </Text>
            </Stack>
            
            <Button
              variant="subtle"
              rightSection={<ChevronRight size={16} />}
              onClick={goToNext}
              disabled={currentBatchIndex === batchFiles.length - 1 || isConverting}
              size="xs"
            >
              Siguiente
            </Button>
          </Group>
        </Paper>
      )}

      {/* Contenido principal */}
      <Grid gutter={0} m={0} style={{ flex: 1, overflow: 'hidden' }}>
        {/* Panel izquierdo - Preview */}
        <Grid.Col 
          span={{ base: 12, md: 7 }} 
          style={{ 
            borderRight: `1px solid ${theme.colors.gray[3]}`,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Stack p="md" gap="md" style={{ flex: 1 }}>
            {/* Controles de vista */}
            <Group justify="space-between" wrap="wrap" gap="xs">
              <SegmentedControl
                value={activeTab}
                onChange={setActiveTab}
                data={[
                  { label: 'Vista previa', value: 'preview' },
                  { label: 'Comparar', value: 'compare' }
                ]}
                disabled={isConverting}
                size="xs"
              />
              
              <Group gap="xs">
                <Button.Group>
                  <Button
                    variant="light"
                    size="xs"
                    onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                    disabled={zoom <= 0.5 || isConverting}
                    leftSection={<ZoomOut size={14} />}
                  />
                  <Button
                    variant="light"
                    size="xs"
                    disabled
                    style={{ minWidth: '60px' }}
                  >
                    {Math.round(zoom * 100)}%
                  </Button>
                  <Button
                    variant="light"
                    size="xs"
                    onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
                    disabled={zoom >= 3 || isConverting}
                    leftSection={<ZoomIn size={14} />}
                  />
                  <Button
                    variant="light"
                    size="xs"
                    onClick={() => setRotation(prev => (prev + 90) % 360)}
                    disabled={isConverting}
                    leftSection={<RotateCw size={14} />}
                  />
                </Button.Group>
              </Group>
            </Group>

            {/* Preview de imagen */}
            <Paper 
              withBorder 
              p="md" 
              style={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                backgroundColor: theme.colors.gray[0]
              }}
            >
              {!conversionResult && isConverting ? (
                <Stack align="center" gap="md">
                  <RefreshCw size={32} className="animate-spin" />
                  <Text c="dimmed">Procesando imagen...</Text>
                </Stack>
              ) : activeTab === 'preview' ? renderImagePreview() : renderComparisonView()}
            </Paper>

            {/* Información del archivo */}
            {currentFile && (
              <Paper withBorder p="md">
                <Group mb="xs">
                  <FileImage size={16} />
                  <Text size="sm" fw={600}>Información del archivo</Text>
                </Group>
                
                <Grid>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Nombre:</Text>
                    <Text size="xs" truncate>{currentFile.name}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Formato original:</Text>
                    <Text size="xs">{getFileTypeName(currentFile)}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Tamaño original:</Text>
                    <Text size="xs">
                      {(currentFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Tipo:</Text>
                    <Text size="xs">
                      {isMobileImage ? 'Imagen móvil (HEIC/HEIF)' : 'Imagen estándar'}
                    </Text>
                  </Grid.Col>
                  {isBatch && batchFiles.length > 1 && (
                    <Grid.Col span={12} mt="xs">
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Progreso del batch:</Text>
                        <Text size="xs" fw={500}>
                          {currentBatchIndex + 1} / {batchFiles.length}
                        </Text>
                      </Group>
                      <Progress 
                        value={(currentBatchIndex + 1) / batchFiles.length * 100} 
                        size="sm" 
                        mt={4}
                      />
                    </Grid.Col>
                  )}
                </Grid>
              </Paper>
            )}
          </Stack>
        </Grid.Col>

        {/* Panel derecho - Configuración */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack p="md" gap="lg" h="100%">
            <Group>
              <Settings size={18} />
              <Text fw={600}>Configuración</Text>
            </Group>

            <Stack gap="lg" style={{ overflow: 'auto', flex: 1 }}>
              {/* Formato */}
              <Stack gap="xs">
                <Text size="sm" fw={500}>Formato de salida</Text>
                <SegmentedControl
                  value={conversionOptions.format}
                  onChange={(value) => updateOptions({ format: value })}
                  data={formatSizes}
                  disabled={isConverting}
                  fullWidth
                />
                <Text size="xs" c="dimmed">
                  {conversionOptions.format === 'webp' && '✅ Mejor compresión (recomendado)'}
                  {conversionOptions.format === 'jpeg' && '✅ Amplia compatibilidad'}
                  {conversionOptions.format === 'png' && '✅ Calidad sin pérdida'}
                </Text>
              </Stack>

              {/* Calidad */}
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    Calidad: {conversionOptions.quality}%
                  </Text>
                  <Badge 
                    color={getQualityBadgeColor(conversionOptions.quality)}
                    variant="light"
                  >
                    {getQualityBadgeLabel(conversionOptions.quality)}
                  </Badge>
                </Group>
                <Slider
                  value={conversionOptions.quality}
                  onChange={(value) => updateOptions({ quality: value })}
                  min={10}
                  max={100}
                  step={5}
                  disabled={isConverting}
                  marks={[
                    { value: 20, label: '20%' },
                    { value: 50, label: '50%' },
                    { value: 80, label: '80%' },
                    { value: 100, label: '100%' }
                  ]}
                />
                <Group justify="apart">
                  <Text size="xs" c="dimmed">Peor calidad</Text>
                  <Text size="xs" c="dimmed">Mejor calidad</Text>
                </Group>
              </Stack>

              {/* Dimensiones */}
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Dimensiones máximas
                </Text>
                <SegmentedControl
                  value={getCurrentDimensionsValue()}
                  onChange={handleDimensionsChange}
                  data={dimensionPresets}
                  disabled={isConverting}
                  fullWidth
                />
                <Text size="xs" c="dimmed">
                  Actual: {conversionOptions.maxWidth}×{conversionOptions.maxHeight}px
                </Text>
              </Stack>

              {/* Opciones adicionales */}
              <Stack gap="xs">
                <Switch
                  label="Mantener archivo original"
                  checked={conversionOptions.keepOriginal}
                  onChange={(e) => updateOptions({ keepOriginal: e.currentTarget.checked })}
                  disabled={isConverting}
                />
                <Switch
                  label="Optimizar para móviles"
                  checked={conversionOptions.mobileOptimized || false}
                  onChange={(e) => updateOptions({ 
                    mobileOptimized: e.currentTarget.checked,
                    quality: e.currentTarget.checked ? 85 : conversionOptions.quality
                  })}
                  disabled={isConverting}
                />
                {isMobileImage && (
                  <Alert color="blue" size="xs">
                    <Text size="xs">
                      Esta imagen es de un dispositivo móvil. Se recomienda calidad alta (85%+)
                    </Text>
                  </Alert>
                )}
              </Stack>

              {/* Estadísticas */}
              {stats && (
                <Paper withBorder p="md" bg="blue.0">
                  <Text size="sm" fw={600} mb="xs">Resumen de optimización</Text>
                  <Grid>
                    <Grid.Col span={6}>
                      <Text size="xs" c="dimmed">Original:</Text>
                      <Text size="sm" fw={600}>{stats.originalSize} MB</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="xs" c="dimmed">Optimizado:</Text>
                      <Text size="sm" fw={600} c="teal">{stats.convertedSize} MB</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="xs" c="dimmed">Reducción:</Text>
                      <Text size="sm" fw={600} c="teal">
                        {stats.reduction}%
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="xs" c="dimmed">Formato:</Text>
                      <Text size="sm" fw={600}>{stats.format}</Text>
                    </Grid.Col>
                    <Grid.Col span={12} mt="sm">
                      <Progress 
                        value={100 - parseFloat(stats.reduction)} 
                        color="teal" 
                        size="md"
                        radius="xl"
                      />
                      <Text size="xs" c="teal" ta="center" mt="xs">
                        Ahorro de <strong>{stats.reduction}%</strong> en espacio
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Paper>
              )}

              {isConverting && (
                <Alert color="yellow" icon={<RefreshCw size={16} />}>
                  <Text size="sm">Procesando imagen...</Text>
                  {isBatch && (
                    <Text size="xs" mt={4}>
                      Procesando imagen {currentBatchIndex + 1} de {batchFiles.length}
                    </Text>
                  )}
                </Alert>
              )}
            </Stack>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Footer con botones */}
      <Paper p="md" withBorder radius={0}>
        <Group justify="space-between" wrap="wrap">
          <Button
            variant="subtle"
            color="gray"
            leftSection={<X size={16} />}
            onClick={onClose}
            disabled={isConverting}
          >
            Cancelar
          </Button>
          
          <Group gap="sm">
            <Button
              variant="light"
              leftSection={<Download size={16} />}
              onClick={handleDownloadPreview}
              disabled={!conversionResult || isConverting}
            >
              Descargar preview
            </Button>
            
            <Button
              color="teal"
              leftSection={<Check size={16} />}
              onClick={handleAccept}
              disabled={!conversionResult || isConverting}
              loading={isConverting}
            >
              {isBatch && currentBatchIndex < batchFiles.length - 1 
                ? 'Siguiente imagen' 
                : `Aceptar ${isBatch ? `(${batchFiles.length} imágenes)` : ''}`}
            </Button>
          </Group>
        </Group>
      </Paper>
    </Flex>
  );
};

export default ImageConverterModal;