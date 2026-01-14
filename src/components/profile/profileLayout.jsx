import {
  Box,
  Tabs,
  rem,
  useMantineTheme
} from '@mantine/core';
import {
  User,
  Edit,
  Image as ImageIcon
} from 'lucide-react';

const ProfileLayout = ({ children, activeTab, onTabChange }) => {
  const theme = useMantineTheme();
  
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Tabs 
        value={activeTab} 
        onChange={onTabChange}
        variant="outline"
        radius="md"
        mb="lg"
      >
        <Tabs.List>
          <Tabs.Tab 
            value="info"
            leftSection={<User style={{ width: rem(16), height: rem(16) }} />}
          >
            Datos
          </Tabs.Tab>
          <Tabs.Tab 
            value="edit"
            leftSection={<Edit style={{ width: rem(16), height: rem(16) }} />}
          >
            Editar
          </Tabs.Tab>
          <Tabs.Tab 
            value="avatar"
            leftSection={<ImageIcon style={{ width: rem(16), height: rem(16) }} />}
          >
            Avatar
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Box
        style={{
          flex: 1,
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ProfileLayout;