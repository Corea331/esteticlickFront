import InfoForm from './infoForm';
import {
  Box,
  Stack,
  Button,
  Text,
} from '@mantine/core';
import { ArrowLeft } from 'lucide-react';

const ProfileEdit = ({ profile, onSuccess, onCancel }) => {
  return (
    <Stack gap="lg">
      <Box>
        <Button
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          onClick={onCancel}
          mb="md"
          size="sm"
        >
          Volver
        </Button>
        
        <Stack gap="xs">
          <Text size="xl" fw={600}>Editar Información Personal</Text>
          <Text size="sm" c="dimmed">Actualiza tus datos personales</Text>
        </Stack>
      </Box>

      <InfoForm
        initialData={profile}
        onSuccess={onSuccess}
      />
    </Stack>
  );
};

export default ProfileEdit;