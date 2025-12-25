/**
 * Utilidades para organizar archivos en Vercel Blob
 * Incluye soporte para: user, owner, staff, editor, admin
 */
export const blobOrganizer = {
  /**
   * Determinar tipo de usuario basado en user_type del backend
   */
  getUserType: (userData) => {
    // Usar user_type del backend si está disponible
    if (userData?.user_type) return userData.user_type;
    
    // Fallback: determinar basado en roles (backward compatibility)
    const roles = userData?.roles || [];
    const roleNames = roles.map(role => role.name || role);
    const ownerId = userData?.owner?.id;
    const tenantRoles = userData?.tenants || [];
    
    if (roleNames.includes('admin')) return 'admin';
    if (roleNames.includes('owner') && ownerId) return 'owner';
    if (tenantRoles.length > 0) {
      // Si tiene tenants, determinar rol principal
      const approvedTenants = tenantRoles.filter(t => t.is_approved);
      if (approvedTenants.some(t => t.role === 'editor')) return 'tenant_editor';
      if (approvedTenants.some(t => t.role === 'staff')) return 'tenant_staff';
    }
    return 'user';
  },
  
  /**
   * Obtener ID del negocio asociado
   */
  getBusinessId: (userData) => {
    const userType = userData?.user_type;
    
    if (userType === 'owner' && userData?.owner?.id) return userData.owner.id;
    
    if (userType === 'tenant_editor' || userType === 'tenant_staff') {
      // Para editor/staff, obtener el primer negocio donde trabaja
      const approvedTenants = (userData?.tenants || []).filter(t => t.is_approved);
      return approvedTenants[0]?.owner_id || null;
    }
    
    return null;
  },
  
  /**
   * Generar ruta organizada para avatar
   */
  getAvatarPath: (userData) => {
    const userId = userData?.id;
    const userType = this.getUserType(userData);
    const businessId = this.getBusinessId(userData);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    
    switch(userType) {
      case 'admin':
        return `admins/${userId}/avatar-${timestamp}-${randomSuffix}`;
      
      case 'owner':
        // Owner: su avatar personal dentro de su negocio
        return `businesses/${businessId}/avatars/owner-${userId}-${timestamp}-${randomSuffix}`;
      
      case 'tenant_editor':
      case 'tenant_staff':
        // Editor/Staff dentro de un negocio
        const roleFolder = userType === 'tenant_editor' ? 'editors' : 'staff';
        return `businesses/${businessId}/${roleFolder}/${userId}/avatar-${timestamp}-${randomSuffix}`;
      
      default:
        // Usuario normal (sin roles especiales o sin negocio)
        return `users/${userId}/avatar-${timestamp}-${randomSuffix}`;
    }
  },
  
  /**
   * Generar ruta para logo de negocio (solo para owners)
   */
  getLogoPath: (businessId) => {
    const timestamp = Date.now();
    return `businesses/${businessId}/logo/logo-${timestamp}`;
  },
  
  /**
   * Generar ruta para imágenes de trabajo del negocio
   */
  getWorkImagePath: (businessId, fileName = null) => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const name = fileName || `work-${timestamp}-${randomSuffix}`;
    return `businesses/${businessId}/work-images/${name}`;
  },
  
  /**
   * Parsear URL para obtener información de organización
   */
  parseBlobUrl: (url) => {
    if (!url) return { isCustomImage: false, source: 'unknown' };
    
    // Si es URL de DiceBear (avatar por defecto del backend)
    if (url.includes('dicebear.com')) {
      return { 
        isCustomImage: false, 
        source: 'dicebear',
        isDefault: true,
        provider: 'dicebear'
      };
    }
    
    // Si es URL de Vercel Blob (imagen personalizada)
    if (url.includes('vercel-storage.com')) {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname.substring(1); // Remove leading slash
        const parts = path.split('/');
        
        const info = {
          isCustomImage: true,
          source: 'vercel-blob',
          fullPath: path,
          fileName: parts[parts.length - 1],
          isBusinessFile: parts[0] === 'businesses',
          isUserFile: parts[0] === 'users',
          isAdminFile: parts[0] === 'admins'
        };
        
        // Analizar estructura según tipo
        if (info.isBusinessFile) {
          info.ownerId = parts[1]; // businessId
          info.folderType = parts[2]; // logo, avatars, editors, staff, work-images
          
          if (info.folderType === 'staff' || info.folderType === 'editors') {
            info.userId = parts[3];
            info.userType = info.folderType === 'editors' ? 'tenant_editor' : 'tenant_staff';
          } else if (info.folderType === 'avatars') {
            // owner-123-123456-abc123.jpg
            const fileNameParts = info.fileName.split('-');
            if (fileNameParts[0] === 'owner') {
              info.userId = fileNameParts[1];
              info.userType = 'owner';
            }
          }
        } else if (info.isUserFile) {
          info.userId = parts[1];
          info.userType = 'user';
        } else if (info.isAdminFile) {
          info.userId = parts[1];
          info.userType = 'admin';
        }
        
        return info;
      } catch (error) {
        console.error('Error parsing blob URL:', error);
        return { isCustomImage: false, source: 'error' };
      }
    }
    
    // Otras URLs (pueden ser de otros servicios)
    return { 
      isCustomImage: true, 
      source: 'external',
      isDefault: false 
    };
  },
  
  /**
   * Verificar permisos para modificar/eliminar un archivo
   * USANDO LA NUEVA ESTRUCTURA con user_type y tenants
   */
  validateAccess: (urlInfo, userData) => {
    if (!urlInfo || !userData) return false;
    
    const userId = userData?.id?.toString();

    let userType = userData?.user_type;
    if(!userType) {
      const roles = userData?.roles || [];
      const roleNames = roles.map(role => role.name || role);
      if (roleNames.includes('admin')) userType = 'admin';
      else if (roleNames.includes('owner') && userData?.owner?.id) userType = 'owner';
      else userType = 'user';
    }

    const tenants = userData?.tenants || [];
    
    // Si no es imagen personalizada, no hay restricciones
    if (!urlInfo.isCustomImage) return true;
    
    // 1. Admin puede todo
    if (userType === 'admin') return true;
    
    // 2. Usuario puede sus propios archivos
    if (urlInfo.userId && urlInfo.userId === userId) {
      return true;
    }
    
    // 3. Owner puede todo en su negocio
    if (userType === 'owner') {
      const ownerBusinessId = userData?.owner?.id?.toString();
      if (ownerBusinessId && urlInfo.ownerId === ownerBusinessId) {
        return true;
      }
    }
    
    // 4. Editor/Staff según tenant donde trabaja
    if (userType === 'tenant_editor' || userType === 'tenant_staff') {
      // Verificar si el archivo pertenece a un tenant donde trabaja
      const canAccessTenant = tenants.some(tenant => 
        tenant.owner_id?.toString() === urlInfo.ownerId
      );
      
      if (canAccessTenant && urlInfo.isBusinessFile) {
        // Puede acceder a archivos del negocio donde trabaja
        return true;
      }
      
      // Sus propios archivos personales dentro del tenant
      if (canAccessTenant && 
          (urlInfo.folderType === 'staff' || urlInfo.folderType === 'editors') &&
          urlInfo.userId === userId) {
        return true;
      }
    }
    
    // 5. Usuario normal solo sus archivos personales
    if (userType === 'user' && urlInfo.isUserFile && urlInfo.userId === userId) {
      return true;
    }
    
    // 6. Por compatibilidad: verificar permisos antiguos
    const permissions = userData?.permissions || [];
    if (permissions.includes('manage_own_profile') && 
        urlInfo.isUserFile && 
        urlInfo.userId === userId) {
      return true;
    }
    
    return false;
  },
  
  /**
   * Generar URL de avatar por defecto según tipo de usuario
   */
  getDefaultAvatarUrl: (userData) => {
    const userId = userData?.id;
  
    // Determinar userType directamente (sin this)
    let userType = userData?.user_type;
    if (!userType) {
      // Fallback manual
      const roles = userData?.roles || [];
      const roleNames = roles.map(role => role.name || role);
      const tenants = userData?.tenants || [];
      
      if (roleNames.includes('admin')) userType = 'admin';
      else if (roleNames.includes('owner') && userData?.owner?.id) userType = 'owner';
      else if (tenants.length > 0) {
        const approvedTenants = tenants.filter(t => t.is_approved);
        if (approvedTenants.some(t => t.role === 'editor')) userType = 'tenant_editor';
        else if (approvedTenants.some(t => t.role === 'staff')) userType = 'tenant_staff';
      } else {
        userType = 'user';
      }
    }
    
    // Determinar businessId directamente
    let businessId = null;
    if (userType === 'owner') {
      businessId = userData?.owner?.id;
    } else if (userType === 'tenant_editor' || userType === 'tenant_staff') {
      const approvedTenants = (userData?.tenants || []).filter(t => t.is_approved);
      businessId = approvedTenants[0]?.owner_id || null;
    }
    
    const baseUrl = 'https://api.dicebear.com/7.x/avataaars/svg';
    
    switch(userType) {
      case 'admin':
        return `${baseUrl}?seed=admin-${userId}&backgroundColor=6366f1&hairColor=2c2c2c`;
      
      case 'owner':
        return `${baseUrl}?seed=owner-${userId}-${businessId}&backgroundColor=b6e3f4&hairColor=2c2c2c`;
      
      case 'tenant_editor':
        return `${baseUrl}?seed=editor-${userId}-${businessId}&backgroundColor=c0aede&hairColor=2c2c2c`;
      
      case 'tenant_staff':
        return `${baseUrl}?seed=staff-${userId}-${businessId}&backgroundColor=ffd5dc&hairColor=2c2c2c`;
      
      default:
        return `${baseUrl}?seed=user-${userId}&backgroundColor=d1d4f9&hairColor=2c2c2c`;
    }
  }
};