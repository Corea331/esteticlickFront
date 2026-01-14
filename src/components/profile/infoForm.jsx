import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Group,
  Alert,
  Card,
  Text,
  Box
} from '@mantine/core';
import {
  User,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  Save
} from 'lucide-react';

const InfoForm = ({ initialData, onSuccess, compact = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    password: '',
    password_confirmation: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
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
      const dataToSend = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
      };
      
      if (formData.password) {
        dataToSend.password = formData.password;
        dataToSend.password_confirmation = formData.password_confirmation;
      }
      
      console.log('Datos a enviar:', dataToSend);
      
      setTimeout(() => {
        onSuccess();
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrors({ general: error.message || 'Error al guardar cambios' });
      setIsSubmitting(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Versión compacta
  if (compact) {
    return (
      <Box component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
          {errors.general && (
            <Alert 
              icon={<AlertCircle size={16} />}
              title="Error"
              color="red"
              variant="light"
            >
              {errors.general}
            </Alert>
          )}

          <TextInput
            label={
              <Group gap="xs">
                <User size={16} />
                <span>Nombre completo</span>
              </Group>
            }
            placeholder="Tu nombre completo"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            autoComplete="name"
            description="Tu nombre completo"
            error={errors.name}
          />

          <TextInput
            label={
              <Group gap="xs">
                <Mail size={16} />
                <span>Email</span>
              </Group>
            }
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            autoComplete="email"
            description="Tu dirección de correo electrónico"
            error={errors.email}
          />

          <TextInput
            label={
              <Group gap="xs">
                <Phone size={16} />
                <span>Teléfono</span>
              </Group>
            }
            type="tel"
            placeholder="Opcional"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            autoComplete="tel"
            description="Número de teléfono (opcional)"
            error={errors.phone}
          />

          <PasswordInput
            label={
              <Group gap="xs">
                <Lock size={16} />
                <span>Nueva contraseña</span>
              </Group>
            }
            placeholder="Dejar en blanco para no cambiar"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            autoComplete="new-password"
            description="Dejar vacío si no quieres cambiar la contraseña"
            error={errors.password}
          />

          <PasswordInput
            label={
              <Group gap="xs">
                <Lock size={16} />
                <span>Confirmar contraseña</span>
              </Group>
            }
            placeholder="Confirmar nueva contraseña"
            value={formData.password_confirmation}
            onChange={(e) => handleChange('password_confirmation', e.target.value)}
            autoComplete="new-password"
            description="Repite la contraseña para confirmar"
            error={errors.password_confirmation}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            leftSection={<Save size={16} />}
            fullWidth
            mt="md"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Stack>
      </Box>
    );
  }

  // Versión completa
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="md">
        {errors.general && (
          <Alert 
            icon={<AlertCircle size={16} />}
            title="Error"
            color="red"
            variant="light"
          >
            {errors.general}
          </Alert>
        )}

        <Group grow>
          <TextInput
            label={
              <Group gap="xs">
                <User size={16} />
                <span>Nombre completo *</span>
              </Group>
            }
            placeholder="Tu nombre completo"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            autoComplete="name"
            description="Tu nombre completo como aparece en tu documento"
            error={errors.name}
          />

          <TextInput
            label={
              <Group gap="xs">
                <Mail size={16} />
                <span>Email *</span>
              </Group>
            }
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            autoComplete="email"
            description="Tu dirección de correo electrónico principal"
            error={errors.email}
          />
        </Group>

        <TextInput
          label={
            <Group gap="xs">
              <Phone size={16} />
              <span>Teléfono</span>
            </Group>
          }
          type="tel"
          placeholder="Opcional"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          autoComplete="tel"
          description="Número de teléfono con código de país (opcional)"
          error={errors.phone}
        />

        <Card withBorder padding="lg" radius="md" mt="md">
          <Card.Section withBorder inheritPadding py="sm">
            <Group>
              <Lock size={18} />
              <Text fw={500}>Cambiar contraseña</Text>
            </Group>
            <Text size="sm" c="dimmed" mt={2}>
              Dejar en blanco si no quieres cambiar la contraseña
            </Text>
          </Card.Section>

          <Stack gap="md" mt="md">
            <Group grow>
              <PasswordInput
                label="Nueva contraseña"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                autoComplete="new-password"
                description="Mínimo 6 caracteres"
                error={errors.password}
              />

              <PasswordInput
                label="Confirmar contraseña"
                placeholder="Repite la contraseña"
                value={formData.password_confirmation}
                onChange={(e) => handleChange('password_confirmation', e.target.value)}
                autoComplete="new-password"
                description="Debe coincidir con la contraseña anterior"
                error={errors.password_confirmation}
              />
            </Group>
          </Stack>
        </Card>

        <Group justify="flex-end" mt="xl">
          <Button
            type="submit"
            loading={isSubmitting}
            leftSection={<Save size={16} />}
            size="md"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default InfoForm;