import { Link } from "react-router-dom";
import { 
  Paper, 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack 
} from "@mantine/core";
import { 
  ShieldAlert, 
  Home, 
  ArrowLeft 
} from "lucide-react";

function Unauthorized() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <Paper shadow="md" p="xl" radius="lg" withBorder style={{ maxWidth: "500px", width: "100%" }}>
        <Stack align="center" spacing="xl">
          <ShieldAlert size={80} style={{ color: "#fa5252" }} />
          
          <Stack spacing="md" align="center">
            <Title order={2} ta="center">Acceso No Autorizado</Title>
            <Text c="dimmed" ta="center">No tienes permisos para acceder a esta página.</Text>
          </Stack>
          
          <Group>
            <Button component={Link} to="/" leftSection={<Home size={18} />} variant="filled">
              Inicio
            </Button>
            <Button onClick={() => window.history.back()} leftSection={<ArrowLeft size={18} />} variant="outline">
              Atrás
            </Button>
          </Group>
        </Stack>
      </Paper>
    </div>
  );
}

export default Unauthorized;