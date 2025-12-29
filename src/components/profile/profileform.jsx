import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

const ProfileForm = ({ initialData, onSuccess, compact = false }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
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
      
      // Aquí iría la llamada a la API
      // await updateProfile(dataToSend);
      console.log('Datos a enviar:', dataToSend);
      
      onSuccess();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrors({ general: error.message || 'Error al guardar cambios' });
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
  };

  // Generar IDs únicos para los campos
  const fieldIds = {
    name: 'profile-name',
    email: 'profile-email',
    phone: 'profile-phone',
    password: 'profile-password',
    password_confirmation: 'profile-password-confirmation'
  };

  // Versión compacta
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="mb-3">
          <label htmlFor={fieldIds.name} className="form-label">
            <User size={16} className="me-2" />
            Nombre completo
          </label>
          <input
            type="text"
            id={fieldIds.name}
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            aria-describedby="nameHelp"
          />
          <div id="nameHelp" className="form-text">Tu nombre completo</div>
        </div>

        <div className="mb-3">
          <label htmlFor={fieldIds.email} className="form-label">
            <Mail size={16} className="me-2" />
            Email
          </label>
          <input
            type="email"
            id={fieldIds.email}
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">Tu dirección de correo electrónico</div>
        </div>

        <div className="mb-3">
          <label htmlFor={fieldIds.phone} className="form-label">
            <Phone size={16} className="me-2" />
            Teléfono
          </label>
          <input
            type="tel"
            id={fieldIds.phone}
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="Opcional"
            aria-describedby="phoneHelp"
          />
          <div id="phoneHelp" className="form-text">Número de teléfono (opcional)</div>
        </div>

        <div className="mb-3">
          <label htmlFor={fieldIds.password} className="form-label">
            <Lock size={16} className="me-2" />
            Nueva contraseña
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id={fieldIds.password}
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Dejar en blanco para no cambiar"
              aria-describedby="passwordHelp"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div id="passwordHelp" className="form-text">Dejar vacío si no quieres cambiar la contraseña</div>
          {errors.password && (
            <div className="text-danger small mt-1">{errors.password}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor={fieldIds.password_confirmation} className="form-label">
            <Lock size={16} className="me-2" />
            Confirmar contraseña
          </label>
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id={fieldIds.password_confirmation}
              name="password_confirmation"
              className="form-control"
              value={formData.password_confirmation}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Confirmar nueva contraseña"
              aria-describedby="passwordConfirmationHelp"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div id="passwordConfirmationHelp" className="form-text">Repite la contraseña para confirmar</div>
          {errors.password_confirmation && (
            <div className="text-danger small mt-1">{errors.password_confirmation}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    );
  }

  // Versión completa (para tab de edición)
  return (
    <form onSubmit={handleSubmit} className="profile-form-full">
      {errors.general && (
        <div className="alert alert-danger" role="alert">
          {errors.general}
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor={fieldIds.name} className="form-label">
            <User size={16} className="me-2" />
            Nombre completo *
          </label>
          <input
            type="text"
            id={fieldIds.name}
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            aria-required="true"
            aria-describedby="nameHelpFull"
          />
          <div id="nameHelpFull" className="form-text">Tu nombre completo como aparece en tu documento</div>
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor={fieldIds.email} className="form-label">
            <Mail size={16} className="me-2" />
            Email *
          </label>
          <input
            type="email"
            id={fieldIds.email}
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            aria-required="true"
            aria-describedby="emailHelpFull"
          />
          <div id="emailHelpFull" className="form-text">Tu dirección de correo electrónico principal</div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={fieldIds.phone} className="form-label">
          <Phone size={16} className="me-2" />
          Teléfono
        </label>
        <input
          type="tel"
          id={fieldIds.phone}
          name="phone"
          className="form-control"
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="Opcional"
          aria-describedby="phoneHelpFull"
        />
        <div id="phoneHelpFull" className="form-text">Número de teléfono con código de país (opcional)</div>
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
              <label htmlFor={fieldIds.password} className="form-label">
                Nueva contraseña
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id={fieldIds.password}
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  aria-describedby="passwordHelpFull"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div id="passwordHelpFull" className="form-text">Mínimo 6 caracteres</div>
              {errors.password && (
                <div className="invalid-feedback d-block">{errors.password}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor={fieldIds.password_confirmation} className="form-label">
                Confirmar contraseña
              </label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id={fieldIds.password_confirmation}
                  name="password_confirmation"
                  className="form-control"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Repite la contraseña"
                  aria-describedby="passwordConfirmHelpFull"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div id="passwordConfirmHelpFull" className="form-text">Debe coincidir con la contraseña anterior</div>
              {errors.password_confirmation && (
                <div className="invalid-feedback d-block">{errors.password_confirmation}</div>
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