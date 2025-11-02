import { Container, Typography, TextField, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      checkIn: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      checkOut: dayjs().add(9, 'day').format('YYYY-MM-DD'),
      guests: 2
    }
  });
  const navigate = useNavigate();
  const onSubmit = (data: any) => {
    navigate(`/resultados?checkIn=${data.checkIn}&checkOut=${data.checkOut}&guests=${data.guests}`);
  };
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Busca de disponibilidade</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} maxWidth={400}>
          <TextField label="Check-in" type="date" {...register('checkIn', { required: true })} />
          <TextField label="Check-out" type="date" {...register('checkOut', { required: true })} />
          <TextField label="Hóspedes" type="number" {...register('guests', { required: true, min: 1 })} />
          <Button type="submit" variant="contained">Buscar</Button>
        </Stack>
      </form>
    </Container>
  );
}