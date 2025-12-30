import { useState } from 'react';
import * as imageConversion from 'image-conversion';
import { useAlert } from '../context/alertcontext';

export const useImageConverter = () => {
  const { showSuccess, showError } = useAlert();
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    quality: 80,
    maxWidth: 1200,
    maxHeight: 1200,
    format: 'webp',
    keepOriginal: false
  });

  const [onAcceptCallback, setOnAcceptCallback] = useState(null);
  const [onCancelCallback, setOnCancelCallback] = useState(null);

  // ABRIR MODAL CON ARCHIVO
  const openConverter = (file, options = {}) => {
    return new Promise((resolve, reject) => {
      setOriginalFile(file);
      setConversionOptions(prev => ({ ...prev, ...options }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Calcular conversión inicial
      calculateConversion(file, { ...conversionOptions, ...options });
      
      // Guardar callbacks
      setOnAcceptCallback(() => (result) => resolve(result));
      setOnCancelCallback(() => () => reject(new Error('Conversión cancelada')));
    });
  };

  // CERRAR MODAL
  const closeConverter = () => {
    resetConverter();
    if (onCancelCallback) onCancelCallback();
  };

  // ACEPTAR CONVERSIÓN
  const acceptConversion = () => {
    if (!conversionResult || !onAcceptCallback) {
      closeConverter();
      return null;
    }
    
    const result = {
      file: conversionResult.converted.file,
      original: conversionResult.original,
      converted: conversionResult.converted,
      keepOriginal: conversionOptions.keepOriginal
    };
    
    showSuccess(`Imagen convertida a ${conversionOptions.format.toUpperCase()} (${conversionResult.converted.reduction}% menos)`);
    
    if (onAcceptCallback) onAcceptCallback(result);
    resetConverter();
    
    return result;
  };

  // CALCULAR CONVERSIÓN
  const calculateConversion = async (file, options) => {
    setIsConverting(true);
    
    try {
      const result = await imageConversion.compressAccurately(file, {
        size: options.maxSizeMB || 2,
        width: options.maxWidth,
        height: options.maxHeight,
        type: `image/${options.format}`,
        scale: options.quality / 100
      });

      setConversionResult({
        original: {
          name: file.name,
          size: file.size,
          type: file.type,
          sizeMB: (file.size / 1024 / 1024).toFixed(2)
        },
        converted: {
          file: result,
          size: result.size,
          type: result.type,
          sizeMB: (result.size / 1024 / 1024).toFixed(2),
          reduction: ((1 - result.size / file.size) * 100).toFixed(1)
        },
        preview: URL.createObjectURL(result),
        options
      });

    } catch (error) {
      console.error('Error calculando conversión:', error);
      showError('Error al procesar la imagen');
    } finally {
      setIsConverting(false);
    }
  };

  // ACTUALIZAR OPCIONES
  const updateOptions = (newOptions) => {
    const updatedOptions = { ...conversionOptions, ...newOptions };
    setConversionOptions(updatedOptions);
    
    if (originalFile) {
      calculateConversion(originalFile, updatedOptions);
    }
  };

  // RESET
  const resetConverter = () => {
    setOriginalFile(null);
    setConversionResult(null);
    setPreviewUrl(null);
    setConversionOptions({
      quality: 80,
      maxWidth: 1200,
      maxHeight: 1200,
      format: 'webp',
      keepOriginal: false
    });
    setOnAcceptCallback(null);
    setOnCancelCallback(null);
    setIsConverting(false);
  };

  // DETECTAR SI NECESITA CONVERSIÓN
  const needsConversion = (file) => {
    const sizeMB = file.size / 1024 / 1024;
    const isLarge = sizeMB > 2; // >2MB
    const isHeic = ['image/heic', 'image/heif', 'image/heif-sequence', 'image/heic-sequence'].includes(file.type);
    const isNotWebP = file.type !== 'image/webp';
    const isBmpOrTiff = ['image/bmp', 'image/tiff', 'image/tiff-fx'].includes(file.type);
    
    return isLarge || isHeic || isNotWebP || isBmpOrTiff;
  };

  // OBTENER TIPO DE ARCHIVO
  const getFileTypeName = (file) => {
    if (!file) return 'Desconocido';
    
    const typeMap = {
      'image/jpeg': 'JPEG',
      'image/jpg': 'JPG', 
      'image/png': 'PNG',
      'image/webp': 'WebP',
      'image/gif': 'GIF',
      'image/svg+xml': 'SVG',
      'image/heic': 'HEIC (iPhone)',
      'image/heif': 'HEIF',
      'image/bmp': 'BMP',
      'image/tiff': 'TIFF'
    };
    
    return typeMap[file.type] || file.type.split('/')[1]?.toUpperCase() || 'Desconocido';
  };

  return {
    // Estados
    isConverting,
    conversionResult,
    originalFile,
    previewUrl,
    conversionOptions,
    isOpen: !!originalFile,
    
    // Acciones
    openConverter,
    closeConverter,
    acceptConversion,
    updateOptions,
    needsConversion,
    getFileTypeName,
    
    // Utilidades
    hasConversion: !!conversionResult
  };
};