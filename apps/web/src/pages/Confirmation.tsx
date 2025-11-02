import { Container, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

export default function Confirmation() {
  const [params] = useSearchParams();
  const code = params.get('code');
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Reserva Confirmada</Typography>
      <Typography>Seu código de reserva: {code}</Typography>
    </Container>
  );
}