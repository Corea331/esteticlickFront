import { useState, useCallback } from 'react';
import * as imageConversion from 'image-conversion';
import { showSuccess, showError } from '../utils/notifications';

export const useImageConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  
  const [conversionOptions, setConversionOptions] = useState({
    quality: 85,
    maxWidth: 1200,
    maxHeight: 1200,
    format: 'webp',
    keepOriginal: false,
    mobileOptimized: true,
    preserveMetadata: false
  });

  // QUITAMOS los estados de control de apertura
  const [batchMode, setBatchMode] = useState(false);
  const [batchFiles, setBatchFiles] = useState([]);

  // ============ DETECTAR IMAGEN MÓVIL ============
  const isMobileImage = (file) => {
    return file.type.includes('heic') || file.type.includes('heif') || file.type.includes('heif-sequence') || file.type.includes('heic-sequence');
  };

  // ============ AJUSTAR OPCIONES PARA MÓVILES ============
  const optimizeOptionsForMobile = (file, currentOptions) => {
    if (!isMobileImage(file)) return currentOptions;
    
    return {
      ...currentOptions,
      quality: Math.min(currentOptions.quality + 10, 95),
      maxWidth: 1920,
      maxHeight: 1920,
      mobileOptimized: true,
      preserveMetadata: true // Intentar mantener metadatos
    };
  };

  // ============ COMPRIMIR CON IMAGE-CONVERSION (PRIMER INTENTO) ============
  const compressWithImageConversion = async (file, options) => {
    try {
      console.log('Intentando compresión con image-conversion...');
      
      const compressedData = await imageConversion.compressAccurately(file, {
        size: Math.max(options.maxSizeMB || 2, 5), // Aumentar límite para móviles
        width: options.maxWidth,
        height: options.maxHeight,
        type: `image/${options.format}`,
        scale: options.quality / 100,
        accuracy: 0.9 // Mayor precisión
      });

      // Convertir Blob a File
      const compressedFile = new File(
        [compressedData],
        file.name.replace(/\.[^/.]+$/, '') + '_optimizado.' + options.format,
        {
          type: `image/${options.format}`,
          lastModified: Date.now()
        }
      );

      return {
        file: compressedFile,
        size: compressedFile.size,
        type: compressedFile.type,
        success: true,
        method: 'image-conversion'
      };
    } catch (error) {
      console.warn('image-conversion falló:', error);
      return { success: false, error };
    }
  };

  // ============ COMPRIMIR CON CANVAS (FALLBACK MEJORADO) ============
  const compressWithCanvas = useCallback((file, options) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      
      img.onload = () => {
        // DIMENSIONES INTELIGENTES
        let width = img.width;
        let height = img.height;
        const ratio = width / height;
        
        // Para imágenes móviles, mantener mejor calidad
        const isMobile = isMobileImage(file);
        const maxDimension = isMobile ? 
          Math.max(options.maxWidth, options.maxHeight) * 1.2 : // 20% más para móviles
          Math.max(options.maxWidth, options.maxHeight);
        
        if (width > maxDimension || height > maxDimension) {
          if (ratio > 1) {
            width = maxDimension;
            height = Math.floor(maxDimension / ratio);
          } else {
            height = maxDimension;
            width = Math.floor(maxDimension * ratio);
          }
        }
        
        // Crear canvas con configuración optimizada
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        
        // MEJORAR CALIDAD DE RENDERIZADO
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Ajustar calidad para móviles
        let quality = options.quality;
        if (isMobile) {
          quality = Math.min(quality + 5, 95); // +5% calidad para móviles
        }
        
        // Dibujar imagen
        ctx.drawImage(img, 0, 0, width, height);
        
        // Para imágenes HEIC, intentar mantener transparencia
        let mimeType = `image/${options.format}`;
        let qualityParam = quality / 100;
        
        // PNG mantiene calidad 1 siempre
        if (options.format === 'png') {
          qualityParam = 1;
        }
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('No se pudo generar la imagen comprimida'));
              return;
            }
            
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + '_optimizado.' + options.format,
              {
                type: mimeType,
                lastModified: Date.now()
              }
            );
            
            resolve({
              file: compressedFile,
              size: compressedFile.size,
              type: compressedFile.type,
              width,
              height,
              quality: options.quality,
              method: 'canvas'
            });
          },
          mimeType,
          qualityParam
        );
      };
      
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.onabort = () => reject(new Error('Carga de imagen cancelada'));
      
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }, []);

  // ============ COMPRESIÓN UNIFICADA MEJORADA ============
  const compressImage = async (file, options) => {
    console.log('Iniciando compresión para:', {
      nombre: file.name,
      tipo: file.type,
      tamaño: (file.size / 1024 / 1024).toFixed(2) + 'MB',
      esMobile: isMobileImage(file)
    });

    // Optimizar opciones para el tipo de imagen
    const optimizedOptions = optimizeOptionsForMobile(file, options);
    
    let result;
    
    // Intentar con image-conversion primero (excepto para HEIC/HEIF)
    if (!isMobileImage(file)) {
      result = await compressWithImageConversion(file, optimizedOptions);
      if (result.success) {
        console.log('✅ Compresión exitosa con image-conversion');
        return result;
      }
    }
    
    // Fallback a Canvas (funciona para todo, incluyendo HEIC/HEIF)
    console.log('Usando fallback Canvas para:', file.name);
    try {
      const canvasResult = await compressWithCanvas(file, optimizedOptions);
      console.log('✅ Compresión Canvas exitosa');
      return {
        ...canvasResult,
        success: true,
        method: 'canvas-fallback'
      };
    } catch (error) {
      console.error('Error en compresión Canvas:', error);
      throw error;
    }
  };

  // ============ ABRIR CONVERTIDOR (VERSIÓN SIMPLIFICADA) ============
  const openConverter = (files, options = {}) => {
    const fileArray = Array.isArray(files) ? files : [files];
    
    console.log('openConverter llamado con:', {
      cantidad: fileArray.length,
      archivos: fileArray.map(f => ({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(2) + 'MB',
        type: f.type
      })),
      modo: fileArray.length > 1 ? 'batch' : 'single'
    });
    
    // Configurar modo batch si hay múltiples archivos
    const isBatchMode = fileArray.length > 1;
    setBatchMode(isBatchMode);
    
    if (isBatchMode) {
      setBatchFiles(fileArray);
      setCurrentBatchIndex(0);
      setBatchResults([]);
      
      // Procesar primer archivo para preview
      const firstFile = fileArray[0];
      setOriginalFile(firstFile);
      createPreview(firstFile);
      return calculateConversion(firstFile, { ...conversionOptions, ...options });
    } else {
      // Modo simple (un archivo)
      const file = fileArray[0];
      setOriginalFile(file);
      setBatchMode(false);
      createPreview(file);
      return calculateConversion(file, { ...conversionOptions, ...options });
    }
  };

  // ============ CREAR PREVIEW ============
  const createPreview = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.onerror = () => {
      console.error('Error creando preview');
      setPreviewUrl(null);
    };
    reader.readAsDataURL(file);
  };

  // ============ CALCULAR CONVERSIÓN ============
  const calculateConversion = async (file, options) => {
    console.log('Calculando conversión para:', file.name);
    setIsConverting(true);
    
    try {
      const result = await compressImage(file, options);
      
      if (!result.success) {
        throw new Error('Compresión fallida');
      }
      
      const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
      const compressedSizeMB = (result.file.size / 1024 / 1024).toFixed(2);
      const reduction = ((1 - result.file.size / file.size) * 100).toFixed(1);
      
      // Crear URL para preview
      const previewUrl = URL.createObjectURL(result.file);
      
      const conversionData = {
        original: {
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          sizeMB: originalSizeMB,
          isMobile: isMobileImage(file)
        },
        converted: {
          file: result.file,
          size: result.file.size,
          type: result.file.type,
          sizeMB: compressedSizeMB,
          reduction: reduction,
          width: result.width,
          height: result.height,
          quality: result.quality,
          method: result.method
        },
        preview: previewUrl,
        options: options
      };
      
      setConversionResult(conversionData);
      console.log('✅ Conversión calculada:', {
        original: originalSizeMB + 'MB',
        comprimido: compressedSizeMB + 'MB',
        reduccion: reduction + '%',
        metodo: result.method
      });
      
      return conversionData;
      
    } catch (error) {
      console.error('Error en calculateConversion:', error);
      showError('Error al procesar la imagen: ' + error.message);
      
      // Fallback: usar archivo original
      const fallbackData = {
        original: {
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          sizeMB: (file.size / 1024 / 1024).toFixed(2),
          isMobile: isMobileImage(file)
        },
        converted: {
          file: file,
          size: file.size,
          type: file.type,
          sizeMB: (file.size / 1024 / 1024).toFixed(2),
          reduction: '0',
          width: 0,
          height: 0,
          quality: 0,
          method: 'none'
        },
        preview: previewUrl || URL.createObjectURL(file),
        options: options
      };
      
      setConversionResult(fallbackData);
      return fallbackData;
      
    } finally {
      setIsConverting(false);
    }
  };

  // ============ MANEJAR SIGUIENTE IMAGEN EN BATCH ============
  const processNextInBatch = async () => {
    if (!batchMode || currentBatchIndex >= batchFiles.length - 1) {
      return false;
    }
    
    const nextIndex = currentBatchIndex + 1;
    const nextFile = batchFiles[nextIndex];
    
    // Guardar resultado actual
    if (conversionResult) {
      setBatchResults(prev => [...prev, conversionResult]);
    }
    
    // Procesar siguiente archivo
    setCurrentBatchIndex(nextIndex);
    setOriginalFile(nextFile);
    createPreview(nextFile);
    return calculateConversion(nextFile, conversionOptions);
  };

  // ============ CAMBIAR ÍNDICE DEL BATCH ============
  const changeBatchIndex = (index) => {
    if (!batchMode || index < 0 || index >= batchFiles.length) {
      console.warn('Índice de batch inválido:', index);
      return;
    }
    
    console.log(`Cambiando índice batch de ${currentBatchIndex} a ${index}`);
    setCurrentBatchIndex(index);
    
    const file = batchFiles[index];
    setOriginalFile(file);
    createPreview(file);
    calculateConversion(file, conversionOptions);
  };

  // ============ ACEPTAR CONVERSIÓN ============
  const acceptConversion = () => {
    console.log('acceptConversion llamado, modo batch:', batchMode);
    
    if (!conversionResult) {
      console.error('No hay resultado para aceptar');
      return null;
    }
    
    let result;
    
    if (batchMode) {
      // Modo batch: recolectar todos los resultados
      const allResults = [...batchResults, conversionResult];
      result = {
        files: allResults.map(r => r.converted.file),
        results: allResults,
        keepOriginal: conversionOptions.keepOriginal,
        batchSize: allResults.length
      };
      
      console.log(`✅ Batch completado: ${allResults.length} imágenes`);
      showSuccess(`${allResults.length} imágenes optimizadas correctamente`);
      
    } else {
      // Modo single
      result = {
        file: conversionResult.converted.file,
        original: conversionResult.original,
        converted: conversionResult.converted,
        keepOriginal: conversionOptions.keepOriginal
      };
      
      console.log('✅ Conversión individual aceptada');
      showSuccess(`Imagen convertida a ${conversionOptions.format.toUpperCase()} (${conversionResult.converted.reduction}% menos)`);
    }
    
    // Liberar URLs de objeto
    if (conversionResult?.preview) {
      URL.revokeObjectURL(conversionResult.preview);
    }
    
    batchResults.forEach(result => {
      if (result.preview) {
        URL.revokeObjectURL(result.preview);
      }
    });
    
    return result;
  };

  // ============ ACTUALIZAR OPCIONES ============
  const updateOptions = (newOptions) => {
    const updatedOptions = { ...conversionOptions, ...newOptions };
    setConversionOptions(updatedOptions);
    
    if (originalFile) {
      calculateConversion(originalFile, updatedOptions);
    }
  };

  // ============ CERRAR CONVERTIDOR ============
  const closeConverter = () => {
    console.log('closeConverter llamado');
    
    // Liberar URLs de objeto
    if (conversionResult?.preview) {
      URL.revokeObjectURL(conversionResult.preview);
    }
    
    batchResults.forEach(result => {
      if (result.preview) {
        URL.revokeObjectURL(result.preview);
      }
    });
    
    // Resetear estado
    setOriginalFile(null);
    setConversionResult(null);
    setPreviewUrl(null);
    setBatchResults([]);
    setBatchFiles([]);
    setCurrentBatchIndex(0);
    setBatchMode(false);
    setIsConverting(false);
  };

  // ============ RESET CONVERSIÓN ============
  const resetConversion = () => {
    console.log('🔄 resetConversion llamado');
    
    // Liberar URLs de objeto
    if (conversionResult?.preview) {
      URL.revokeObjectURL(conversionResult.preview);
    }
    
    batchResults.forEach(result => {
      if (result.preview) {
        URL.revokeObjectURL(result.preview);
      }
    });
    
    // Resetear estado
    setOriginalFile(null);
    setConversionResult(null);
    setPreviewUrl(null);
    setBatchResults([]);
    setBatchFiles([]);
    setCurrentBatchIndex(0);
    setBatchMode(false);
    setIsConverting(false);
  };

  // ============ DETECTAR SI NECESITA CONVERSIÓN ============
  const needsConversion = (file) => {
    if (!file) return false;
    
    const sizeMB = file.size / 1024 / 1024;
    const isLarge = sizeMB > 1; // >1MB ahora (más sensible)
    const isMobile = isMobileImage(file);
    const isNotWebP = file.type !== 'image/webp';
    const isBmpOrTiff = ['image/bmp', 'image/tiff', 'image/tiff-fx'].includes(file.type);
    const isGif = file.type === 'image/gif';
    
    const needs = isLarge || isMobile || isNotWebP || isBmpOrTiff || isGif;
    
    console.log('needsConversion:', {
      name: file.name,
      size: sizeMB.toFixed(2) + 'MB',
      type: file.type,
      isLarge,
      isMobile,
      isNotWebP,
      isBmpOrTiff,
      isGif,
      needs
    });
    
    return needs;
  };

  // ============ OBTENER TIPO DE ARCHIVO ============
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
      'image/heif-sequence': 'HEIF Secuencia',
      'image/heic-sequence': 'HEIC Secuencia',
      'image/bmp': 'BMP',
      'image/tiff': 'TIFF',
      'image/tiff-fx': 'TIFF'
    };
    
    return typeMap[file.type] || file.type.split('/')[1]?.toUpperCase() || 'Desconocido';
  };

  // ============ VALIDAR MÚLTIPLES ARCHIVOS ============
  const validateFiles = (files, maxFiles = 10, maxSizeMB = 20) => {
    const fileArray = Array.isArray(files) ? files : [files];
    const errors = [];
    const validFiles = [];
    
    if (fileArray.length > maxFiles) {
      errors.push(`Máximo ${maxFiles} archivos permitidos`);
    }
    
    fileArray.forEach((file, index) => {
      const sizeMB = file.size / 1024 / 1024;
      
      if (sizeMB > maxSizeMB) {
        errors.push(`${file.name}: Tamaño máximo ${maxSizeMB}MB`);
      } else if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: No es una imagen válida`);
      } else {
        validFiles.push(file);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      validFiles,
      total: fileArray.length,
      validCount: validFiles.length
    };
  };

  return {
    // Estados
    isConverting,
    conversionResult,
    originalFile,
    previewUrl,
    conversionOptions,
    batchMode,
    batchFiles,
    currentBatchIndex,
    batchResults,
    batchProgress: batchMode ? {
      current: currentBatchIndex + 1,
      total: batchFiles.length,
      percentage: ((currentBatchIndex + 1) / batchFiles.length * 100).toFixed(0)
    } : null,
    
    // Acciones principales
    openConverter,
    closeConverter,
    acceptConversion,
    updateOptions,
    calculateConversion,
    processNextInBatch,
    changeBatchIndex,
    resetConversion,
    
    // Utilidades
    needsConversion,
    getFileTypeName,
    validateFiles,
    isMobileImage: (file) => isMobileImage(file),
    
    // Métodos para debug
    getStats: () => conversionResult ? {
      originalSize: conversionResult.original.sizeMB,
      convertedSize: conversionResult.converted.sizeMB,
      reduction: conversionResult.converted.reduction,
      format: conversionOptions.format,
      method: conversionResult.converted.method
    } : null
  };
};