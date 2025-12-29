import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/authcontext';

const ProfileForm = ({ initialData, onSuccess, compact = false }) => {
  const { updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    password: '',
    password_confirmation: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    
    // Validación de contraseña
    if (formData.password && formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Las contraseñas no coinciden' });
      return;
    }
    
    if (formData.password && formData.password.length < 6) {
      setErrors({ password: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Preparar datos para enviar
      const dataToSend = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
      };
      
      // Solo incluir password si se está cambiando
      if (formData.password) {
        dataToSend.password = formData.password;
        dataToSend.password_confirmation = formData.password_confirmation;
      }
      
      // Llamada a la API real
      const response = await updateProfile(dataToSend);
      
      if (response.success) {
        setSuccessMessage('Perfil actualizado correctamente');
        
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          password: '',
          password_confirmation: ''
        }));
        
        // Esperar un momento y luego llamar a onSuccess
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setErrors({ general: response.message || 'Error al actualizar el perfil' });
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      
      // Manejar errores específicos del backend
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'Error al guardar cambios. Intenta nuevamente.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: null }));
    }
  };

  // Versión compacta
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="profile-form">
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        
        {errors.general && (
          <div className="alert alert-danger">{errors.general}</div>
        )}

        <div className="mb-3">
          <label className="form-label">
            <User size={16} className="me-2" />
            Nombre completo
          </label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">
            <Mail size={16} className="me-2" />
            Email
          </label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">
            <Phone size={16} className="me-2" />
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            value={formData.phone}
            onChange={handleChange}
            placeholder="Opcional"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">
            <Lock size={16} className="me-2" />
            Nueva contraseña
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Dejar en blanco para no cambiar"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">
            <Lock size={16} className="me-2" />
            Confirmar contraseña
          </label>
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirmar nueva contraseña"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isSubmitting}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password_confirmation && (
            <div className="invalid-feedback">{errors.password_confirmation}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : 'Guardar cambios'}
        </button>
      </form>
    );
  }

  // Versión completa (para tab de edición)
  return (
    <form onSubmit={handleSubmit} className="profile-form-full">
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}
      
      {errors.general && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errors.general}
          <button type="button" className="btn-close" onClick={() => setErrors(prev => ({ ...prev, general: null }))}></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            <User size={16} className="me-2" />
            Nombre completo *
          </label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">
            <Mail size={16} className="me-2" />
            Email *
          </label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">
          <Phone size={16} className="me-2" />
          Teléfono
        </label>
        <input
          type="tel"
          name="phone"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          value={formData.phone}
          onChange={handleChange}
          placeholder="Opcional"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <div className="invalid-feedback">{errors.phone}</div>
        )}
      </div>

      <div className="card border mt-4 mb-4">
        <div className="card-header bg-light">
          <h6 className="mb-0 d-flex align-items-center">
            <Lock size={16} className="me-2" />
            Cambiar contraseña
          </h6>
          <small className="text-muted">Dejar en blanco si no quieres cambiar la contraseña</small>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nueva contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Confirmar contraseña</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password_confirmation && (
                <div className="invalid-feedback">{errors.password_confirmation}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;