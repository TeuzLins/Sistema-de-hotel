import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useForm } from 'react-hook-form';

export default function SeasonsCrud() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['seasons'], queryFn: async () => (await api.get('/seasons')).data.data });
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '', startDate: '', endDate: '', priceMultiplier: 1.0 } });
  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/seasons', { ...payload, priceMultiplier: Number(payload.priceMultiplier) })).data.data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['seasons'] }); reset(); }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/seasons/${id}`)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seasons'] })
  });
  return (
    <Stack spacing={2}>
      <form onSubmit={handleSubmit((data) => createMutation.mutate(data))}>
        <Stack direction="row" spacing={1}>
          <TextField size="small" label="Nome" {...register('name', { required: true })} />
          <TextField size="small" label="Início" type="date" {...register('startDate', { required: true })} />
          <TextField size="small" label="Fim" type="date" {...register('endDate', { required: true })} />
          <TextField size="small" label="Multiplicador" type="number" step="0.01" {...register('priceMultiplier', { required: true })} />
          <Button type="submit" variant="contained">Adicionar</Button>
        </Stack>
      </form>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Período</TableCell>
            <TableCell>Multiplicador</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((s: any) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()}</TableCell>
              <TableCell>{Number(s.priceMultiplier).toFixed(2)}</TableCell>
              <TableCell>
                <Button size="small" color="error" onClick={() => deleteMutation.mutate(s.id)}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}