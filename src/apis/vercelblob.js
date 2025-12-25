import { blobOrganizer } from './bloborganizer.js';

export const vercelBlobApi = {
  /**
   * Subir avatar con organización automática
   */
  uploadAvatar: async (file, userData) => {
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      throw new Error('Token de Vercel Blob no configurado');
    }
    
    // Determinar tipo de usuario
    const userType = blobOrganizer.getUserType(
      userData.roles,
      userData.ownerId,
      userData.tenantRoles
    );
    
    // Obtener businessId si aplica
    const businessId = blobOrganizer.getBusinessId(
      userType,
      userData.ownerId,
      userData.tenantRoles
    );
    
    // Generar ruta organizada
    const basePath = blobOrganizer.getAvatarPath(
      userData.userId,
      userType,
      businessId
    );
    
    // Agregar extensión del archivo
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const finalPath = `${basePath}.${fileExtension}`;
    
    // Subir a Vercel Blob
    const response = await fetch(`https://public.blob.vercel-storage.com/${finalPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error Vercel Blob (${response.status}): ${errorText}`);
    }
    
    const blobData = await response.json();
    const publicUrl = blobData.url.replace('blob.vercel-storage.com', 'public.blob.vercel-storage.com');
    
    return {
      success: true,
      url: publicUrl,
      path: finalPath,
      organization: blobOrganizer.parseBlobUrl(publicUrl),
      userType,
      businessId
    };
  },
  
  /**
   * Subir logo de negocio (solo para owners)
   */
  uploadLogo: async (file, businessId) => {
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      throw new Error('Token de Vercel Blob no configurado');
    }
    
    // Generar ruta para logo
    const basePath = blobOrganizer.getLogoPath(businessId);
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const finalPath = `${basePath}.${fileExtension}`;
    
    const response = await fetch(`https://public.blob.vercel-storage.com/${finalPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al subir logo: ${errorText}`);
    }
    
    const blobData = await response.json();
    const publicUrl = blobData.url.replace('blob.vercel-storage.com', 'public.blob.vercel-storage.com');
    
    return {
      success: true,
      url: publicUrl,
      path: finalPath,
      organization: blobOrganizer.parseBlobUrl(publicUrl)
    };
  },
  
  /**
   * Subir imágenes de trabajo del negocio
   * Pueden subir: owners, staff y editors
   */
  uploadWorkImage: async (file, businessId, userData) => {
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      throw new Error('Token de Vercel Blob no configurado');
    }
    
    // Verificar que el usuario tenga acceso al negocio
    const userType = blobOrganizer.getUserType(
      userData.roles,
      userData.ownerId,
      userData.tenantRoles
    );
    
    const userBusinessId = blobOrganizer.getBusinessId(
      userType,
      userData.ownerId,
      userData.tenantRoles
    );
    
    if (userBusinessId !== businessId.toString()) {
      throw new Error('No tienes permisos para subir imágenes en este negocio');
    }
    
    // Generar ruta organizada
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remover extensión
    const basePath = blobOrganizer.getWorkImagePath(businessId, originalName);
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const finalPath = `${basePath}.${fileExtension}`;
    
    const response = await fetch(`https://public.blob.vercel-storage.com/${finalPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al subir imagen: ${errorText}`);
    }
    
    const blobData = await response.json();
    const publicUrl = blobData.url.replace('blob.vercel-storage.com', 'public.blob.vercel-storage.com');
    
    return {
      success: true,
      url: publicUrl,
      path: finalPath,
      organization: blobOrganizer.parseBlobUrl(publicUrl),
      uploadedBy: {
        userId: userData.userId,
        userName: userData.name,
        userType
      }
    };
  },
  
  /**
   * Eliminar archivo de Vercel Blob
   */
  deleteFile: async (url) => {
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      throw new Error('Token de Vercel Blob no configurado');
    }
    
    // No eliminar avatares por defecto
    const urlInfo = blobOrganizer.parseBlobUrl(url);

    console.log('🔍 URL Info para eliminar:', {
      url,
      urlInfo,
      isCustomImage: urlInfo.isCustomImage,
      source: urlInfo.source,
      fullPath: urlInfo.fullPath,
      fileName: urlInfo.fileName
    });

    if (!urlInfo.isCustomImage || urlInfo.source !== 'vercel-blob') {
      return { 
        success: true, 
        message: 'No es un archivo de Vercel Blob' 
      };
    }
    
    // Extraer nombre del archivo
    const filePath = urlInfo.fullPath;

    if (!filePath) {
      return { 
        success: false, 
        message: 'No se pudo extraer ruta del archivo' 
      };
    }

    console.log('🗑️ Eliminando archivo de Vercel Blob:', filePath);
    
    const response = await fetch(`https://blob.vercel-storage.com/${filePath}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('No se pudo eliminar de Vercel Blob:', errorText);
      return { 
        success: false, 
        message: `No se pudo eliminar: ${errorText}` 
      };
    }
    
    return { 
      success: true, 
      message: 'Archivo eliminado correctamente',
      deletedUrl: url 
    };
  },
  
  /**
   * Validar archivo de imagen
   */
  validateImageFile: (file, options = {}) => {
    const defaultOptions = {
      maxSizeMB: 5,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      ...options
    };
    
    const errors = [];
    
    if (!defaultOptions.allowedTypes.includes(file.type)) {
      errors.push(`Formato no permitido. Use: ${defaultOptions.allowedTypes.join(', ')}`);
    }
    
    const maxSizeBytes = defaultOptions.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.push(`Tamaño máximo: ${defaultOptions.maxSizeMB}MB`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2)
      }
    };
  }
};