import { Container, Typography, Stack, TextField, Button, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import RoomTypesCrud from './config/RoomTypesCrud';
import RoomsCrud from './config/RoomsCrud';
import SeasonsCrud from './config/SeasonsCrud';
import PriceRulesCrud from './config/PriceRulesCrud';

export default function AdminConfig() {
  const { register, handleSubmit } = useForm({ defaultValues: { checkinHour: 14, checkoutHour: 12, timezone: 'America/Sao_Paulo' } });
  const onSubmit = (data: any) => {
    // Demo: somente exibe. Em produção, salvaria via API de config.
    alert(`Config salva: ${JSON.stringify(data)}`);
  };
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Configurações</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} maxWidth={400}>
          <TextField label="Hora Check-in" type="number" {...register('checkinHour')} />
          <TextField label="Hora Check-out" type="number" {...register('checkoutHour')} />
          <TextField label="Timezone" {...register('timezone')} />
          <Button type="submit" variant="contained">Salvar</Button>
        </Stack>
      </form>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>Tipos de Quarto</Typography>
      <RoomTypesCrud />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>Quartos</Typography>
      <RoomsCrud />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>Temporadas</Typography>
      <SeasonsCrud />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>Regras de Preço</Typography>
      <PriceRulesCrud />
    </Container>
  );
}