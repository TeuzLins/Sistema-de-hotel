import { Container, Typography, TextField, Button, Stack, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomTypeId = params.get('roomTypeId');
  const checkIn = params.get('checkIn');
  const checkOut = params.get('checkOut');
  const guests = Number(params.get('guests') || 2);

  const { data: quote } = useQuery({
    queryKey: ['quote', roomTypeId, checkIn, checkOut, guests],
    queryFn: async () => (await api.get(`/pricing/quote`, { params: { roomTypeId, checkIn, checkOut, guests } })).data.data,
    enabled: Boolean(roomTypeId && checkIn && checkOut)
  });

  const { register, handleSubmit } = useForm({ defaultValues: { guestName: '', guestEmail: '' } });

  const createBooking = useMutation({
    mutationFn: async (payload: any) => {
      // Find any room of this type available (simplificação demo)
      const rooms = (await api.get('/rooms')).data.data;
      const room = rooms.find((r: any) => r.roomTypeId === roomTypeId);
      const res = await api.post('/bookings', { ...payload, roomId: room.id, checkIn: `${checkIn}T14:00:00`, checkOut: `${checkOut}T12:00:00`, guests });
      return res.data.data;
    },
    onSuccess: (data) => {
      // mock payment
      api.post('/payments/intent', { bookingId: data.booking.id, method: 'CARD' }).then(() => {
        navigate(`/confirmacao?code=${data.booking.code}`);
      });
    }
  });

  const onSubmit = (data: any) => createBooking.mutate(data);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      {quote && <Alert severity="info">Total: R$ {Number(quote.total).toFixed(2)}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} maxWidth={480}>
          <TextField label="Nome" {...register('guestName', { required: true })} />
          <TextField label="Email" type="email" {...register('guestEmail', { required: true })} />
          <Button type="submit" variant="contained">Confirmar</Button>
        </Stack>
      </form>
    </Container>
  );
}