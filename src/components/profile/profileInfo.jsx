import {
  Card,
  Group,
  Text,
  Badge,
  Stack,
  Box,
  Button
} from '@mantine/core';
import {
  Edit,
  User,
  Mail,
  Phone,
  Shield
} from 'lucide-react';

const ProfileInfo = ({ profile, formatDate, onEdit }) => {
  if (!profile) return null;

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="xl" fw={600}>Información Personal</Text>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          leftSection={<Edit size={14} />}
        >
          Editar
        </Button>
      </Group>

      <Group grow align="flex-start">
        {/* Datos Básicos */}
        <Card withBorder radius="md" shadow="sm">
          <Card.Section withBorder inheritPadding py="sm">
            <Group>
              <User size={16} />
              <Text fw={500}>Datos Básicos</Text>
            </Group>
          </Card.Section>
          
          <Stack gap="md" mt="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Nombre completo:</Text>
              <Text fw={500}>{profile.name}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Email:</Text>
              <Text fw={500}>{profile.email}</Text>
            </Group>
            
            {profile.phone && (
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Teléfono:</Text>
                <Text fw={500}>{profile.phone}</Text>
              </Group>
            )}
          </Stack>
        </Card>

        {/* Información de Cuenta */}
        <Card withBorder radius="md" shadow="sm">
          <Card.Section withBorder inheritPadding py="sm">
            <Group>
              <Shield size={16} />
              <Text fw={500}>Información de Cuenta</Text>
            </Group>
          </Card.Section>
          
          <Stack gap="md" mt="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Miembro desde:</Text>
              <Text fw={500}>{formatDate(profile.created_at)}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Última actualización:</Text>
              <Text fw={500}>{formatDate(profile.updated_at)}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Estado:</Text>
              <Badge
                color={profile.is_active ? 'green' : 'gray'}
                variant="light"
              >
                {profile.is_active ? 'Activa' : 'Inactiva'}
              </Badge>
            </Group>
          </Stack>
        </Card>
      </Group>

      {/* Roles y Permisos */}
      <Card withBorder radius="md" shadow="sm">
        <Card.Section withBorder inheritPadding py="sm">
          <Group>
            <Shield size={16} />
            <Text fw={500}>Roles y Permisos</Text>
          </Group>
        </Card.Section>
        
        <Box mt="md">
          <Text size="sm" c="dimmed" mb="xs">Roles asignados:</Text>
          <Group gap="xs">
            {profile.roles?.map((role, index) => (
              <Badge
                key={index}
                color="blue"
                variant="light"
                size="lg"
              >
                {role.name}
              </Badge>
            ))}
          </Group>
        </Box>
      </Card>
    </Stack>
  );
};

export default ProfileInfo;