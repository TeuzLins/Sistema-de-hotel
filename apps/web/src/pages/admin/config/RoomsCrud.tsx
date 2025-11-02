import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select } from '@mui/material';
import { useForm } from 'react-hook-form';

export default function RoomsCrud() {
  const qc = useQueryClient();
  const { data: rooms } = useQuery({ queryKey: ['rooms'], queryFn: async () => (await api.get('/rooms')).data.data });
  const { data: roomTypes } = useQuery({ queryKey: ['room-types'], queryFn: async () => (await api.get('/room-types')).data.data });
  const { register, handleSubmit, setValue, watch, reset } = useForm({ defaultValues: { number: '', roomTypeId: '', status: 'AVAILABLE' } });
  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/rooms', payload)).data.data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rooms'] }); reset(); }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/rooms/${id}`)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] })
  });
  return (
    <Stack spacing={2}>
      <form onSubmit={handleSubmit((data) => createMutation.mutate(data))}>
        <Stack direction="row" spacing={1}>
          <TextField size="small" label="Número" {...register('number', { required: true })} />
          <Select size="small" value={watch('roomTypeId')} onChange={(e) => setValue('roomTypeId', e.target.value)} displayEmpty>
            <MenuItem value=""><em>Tipo</em></MenuItem>
            {roomTypes?.map((rt: any) => (
              <MenuItem key={rt.id} value={rt.id}>{rt.name}</MenuItem>
            ))}
          </Select>
          <Select size="small" value={watch('status')} onChange={(e) => setValue('status', e.target.value)}>
            <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
            <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
            <MenuItem value="CLEANING">CLEANING</MenuItem>
          </Select>
          <Button type="submit" variant="contained">Adicionar</Button>
        </Stack>
      </form>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Número</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms?.map((r: any) => (
            <TableRow key={r.id}>
              <TableCell>{r.number}</TableCell>
              <TableCell>{r.roomType?.name}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>
                <Button size="small" color="error" onClick={() => deleteMutation.mutate(r.id)}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}