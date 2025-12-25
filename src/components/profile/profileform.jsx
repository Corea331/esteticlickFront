import { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';

const ProfileForm = ({ initialData, onSuccess, compact = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Aquí iría la llamada a la API
      // await updateProfile(formData);
      onSuccess();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="mb-3">
          <label className="form-label">
            <User size={16} className="me-2" />
            Nombre completo
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            <Mail size={16} className="me-2" />
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">
            <Phone size={16} className="me-2" />
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
          />
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
};

export default ProfileForm;