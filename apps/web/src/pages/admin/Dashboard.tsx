import { Container, Typography, Stack, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Painel Admin</Typography>
      <Stack direction="row" spacing={2}>
        <Button component={RouterLink} to="/admin/calendario" variant="contained">Calendário</Button>
        <Button component={RouterLink} to="/admin/reservas" variant="contained">Reservas</Button>
        <Button component={RouterLink} to="/admin/config" variant="contained">Configurações</Button>
        <Button component={RouterLink} to="/admin/relatorios" variant="contained">Relatórios</Button>
      </Stack>
    </Container>
  );
}