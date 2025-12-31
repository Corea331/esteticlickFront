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

  // Comprimir con Canvas (FALLBACK SEGURO), en caso de fallo
  const compressWithCanvas = (file, options) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let width = img.width;
        let height = img.height;
        
        if (width > options.maxWidth || height > options.maxHeight) {
          const ratio = Math.min(
            options.maxWidth / width,
            options.maxHeight / height
          );
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        // Crear canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al comprimir imagen'));
              return;
            }
            
            // Crear File desde Blob manteniendo nombre y metadata
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + '.' + options.format,
              {
                type: `image/${options.format}`,
                lastModified: Date.now()
              }
            );
            
            resolve({
              file: compressedFile,
              size: compressedFile.size,
              type: compressedFile.type,
              width,
              height
            });
          },
          `image/${options.format}`,
          options.quality / 100
        );
      };
      
      img.onerror = () => reject(new Error('Error al cargar imagen'));
      reader.readAsDataURL(file);
    });
  };

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
      converted: {
        file: conversionResult.converted.file,
        size: conversionResult.converted.size,
        type: conversionResult.converted.type,
        sizeMB: conversionResult.converted.sizeMB,
        reduction: conversionResult.converted.reduction,
        width: conversionResult.converted.width,
        height: conversionResult.converted.height
      },
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
    try{

      let compressedFile;
      let compressedData;

      // Probar con image-converter primero
      try {
        compressedData = await imageConversion.compressAccurately(file, {
          size: options.maxSizeMB || 2,
          width: options.maxWidth,
          height: options.maxHeight,
          type: `image/${options.format}`,
          scale: options.quality / 100
        });
        
        // Crear File real desde el Blob
        compressedFile = new File(
          [compressedData],
          file.name.replace(/\.[^/.]+$/, '') + '.' + options.format,
          {
            type: compressedData.type,
            lastModified: Date.now()
          }
        );
        } catch (imageConversionError) {
          console.warn('image-conversion falló, usando Canvas:', imageConversionError);
          
          // FALLBACK A CANVAS
          const canvasResult = await compressWithCanvas(file, options);
          compressedFile = canvasResult.file;
          compressedData = compressedFile;
        }
      
        // Calcular reducción
        const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
        const compressedSizeMB = (compressedFile.size / 1024 / 1024).toFixed(2);
        const reduction = ((1 - compressedFile.size / file.size) * 100).toFixed(1);


        setConversionResult({
          original: {
            name: file.name,
            size: file.size,
            type: file.type,
            sizeMB: originalSizeMB,
            width: 0,
            height: 0,
          },
          converted: {
            file: compressedFile,
            size: compressedFile.size,
            type: compressedFile.type,
            sizeMB: compressedSizeMB,
            reduction: reduction,
            width: options.maxWidth,
            height: options.maxHeight,
          },
          preview: URL.createObjectURL(compressedFile),
          options
        });
      } catch (error) {
        console.error('Error calculando conversión:', error);
        showError('Error al procesar la imagen');
        setConversionResult({
          original: {
            name: file.name,
            size: file.size,
            type: file.type,
            sizeMB: (file.size / 1024 / 1024).toFixed(2)
          },
          converted: {
            file: file,
            size: file.size,
            type: file.type,
            sizeMB: (file.size / 1024 / 1024).toFixed(2),
            reduction: '0'
          },
          preview: URL.createObjectURL(file),
          options
        });
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

  // DETECTAR SI NECESITA CONVERSIÓN - AUMENTAR LÍMITE A 20MB
  const needsConversion = (file) => {
    const sizeMB = file.size / 1024 / 1024;
    const isLarge = sizeMB > 5; // Aumentado a 5MB para permitir más
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
    hasConversion: !!conversionResult,

    // Métodos para debug
    getOriginalSize: () => originalFile ? originalFile.size : 0,

    getCompressedSize: () => conversionResult ? conversionResult.converted.size : 0
  };
};