import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useForm } from 'react-hook-form';

export default function RoomTypesCrud() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['room-types'], queryFn: async () => (await api.get('/room-types')).data.data });
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '', capacity: 2, basePrice: 200, description: '' } });
  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/room-types', payload)).data.data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['room-types'] }); reset(); }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/room-types/${id}`)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['room-types'] })
  });
  return (
    <Stack spacing={2}>
      <form onSubmit={handleSubmit((data) => createMutation.mutate({ ...data, capacity: Number(data.capacity), basePrice: Number(data.basePrice) }))}>
        <Stack direction="row" spacing={1}>
          <TextField size="small" label="Nome" {...register('name', { required: true })} />
          <TextField size="small" label="Capacidade" type="number" {...register('capacity', { required: true })} />
          <TextField size="small" label="Preço base" type="number" {...register('basePrice', { required: true })} />
          <TextField size="small" label="Descrição" {...register('description')} />
          <Button type="submit" variant="contained">Adicionar</Button>
        </Stack>
      </form>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Capacidade</TableCell>
            <TableCell>Base</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((rt: any) => (
            <TableRow key={rt.id}>
              <TableCell>{rt.name}</TableCell>
              <TableCell>{rt.capacity}</TableCell>
              <TableCell>R$ {Number(rt.basePrice).toFixed(2)}</TableCell>
              <TableCell>
                <Button size="small" color="error" onClick={() => deleteMutation.mutate(rt.id)}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}