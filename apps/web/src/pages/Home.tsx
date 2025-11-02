import { Container, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom>
        Sistema de Reservas
      </Typography>
      <Typography variant="body1" gutterBottom>
        Busque disponibilidade, simule preços dinâmicos e finalize sua reserva.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button component={RouterLink} to="/buscar" variant="contained">Buscar disponibilidade</Button>
        <Button component={RouterLink} to="/admin" variant="outlined">Painel Admin</Button>
      </Stack>
    </Container>
  );
}