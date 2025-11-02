import { Container, Typography, Card, CardContent, CardActions, Button, Grid } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function Results() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ['room-types'],
    queryFn: async () => (await api.get('/room-types')).data.data
  });

  const checkIn = params.get('checkIn');
  const checkOut = params.get('checkOut');
  const guests = Number(params.get('guests') || 2);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Resultados</Typography>
      <Grid container spacing={2}>
        {data?.map((rt: any) => (
          <Grid item xs={12} md={6} lg={4} key={rt.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{rt.name}</Typography>
                <Typography variant="body2">Capacidade: {rt.capacity}</Typography>
                <Typography variant="body2">Base: R$ {Number(rt.basePrice).toFixed(2)}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => navigate(`/checkout?roomTypeId=${rt.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)} variant="contained">Reservar</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}