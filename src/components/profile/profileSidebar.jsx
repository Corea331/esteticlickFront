import {
  Card,
  Group,
  Text,
  Avatar,
  Badge,
  Stack,
  Box,
  Paper
} from '@mantine/core';
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  Folder
} from 'lucide-react';

const ProfileSidebar = ({ profile, currentAvatar, formatDate }) => {
  if (!profile) return null;

  return (
    <Stack gap="md">
      {/* Cabecera tipo fichero */}
      <Card withBorder radius="md" shadow="sm" p={0}>
        <Card.Section 
          bg="blue" 
          c="white"
          px="lg"
          py="md"
        >
          <Group justify='center' gap="sm" mt={10}>
            <Folder size={20} />
            <Text fw={600}>Perfil</Text>
          </Group>
        </Card.Section>
        
        <Stack align="center" p="xl">
          <Avatar
            src={currentAvatar}
            size={150}
            radius="50%"
            color="blue"
          />
          
          <Stack gap="xs" align="center">
            <Text size="lg" fw={600}>{profile.name}</Text>
            <Text size="sm" c="dimmed">{profile.email}</Text>
            
            <Group gap="xs">
              {profile.roles?.map((role, index) => (
                <Badge
                  key={index}
                  color="blue"
                  variant="light"
                  size="sm"
                >
                  {role.name}
                </Badge>
              ))}
            </Group>
          </Stack>
        </Stack>
      </Card>

      {/* Información resumida */}
      <Paper withBorder radius="md" p="md">
        <Stack gap="md">
          <Group>
            <Mail size={16} />
            <Text size="sm">{profile.email}</Text>
          </Group>
          
          {profile.phone && (
            <Group>
              <Phone size={16} />
              <Text size="sm">{profile.phone}</Text>
            </Group>
          )}
          
          <Group>
            <Calendar size={16} />
            <Text size="sm">Miembro desde: {formatDate(profile.created_at)}</Text>
          </Group>
          
          <Group>
            <Shield size={16} />
            <Text size="sm">Estado: </Text>
            <Badge
              color={profile.is_active ? 'green' : 'gray'}
              variant="light"
              size="sm"
            >
              {profile.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ProfileSidebar;