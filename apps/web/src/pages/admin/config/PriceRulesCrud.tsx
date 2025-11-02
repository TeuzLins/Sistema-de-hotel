import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select } from '@mui/material';
import { useForm } from 'react-hook-form';

export default function PriceRulesCrud() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['price-rules'], queryFn: async () => (await api.get('/price-rules')).data.data });
  const { register, handleSubmit, setValue, watch, reset } = useForm({ defaultValues: { ruleType: 'WEEKEND', value: 1.15, operator: 'MULTIPLY', minNights: '' } });
  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/price-rules', { ...payload, value: Number(payload.value), minNights: payload.minNights ? Number(payload.minNights) : undefined })).data.data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['price-rules'] }); reset(); }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/price-rules/${id}`)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['price-rules'] })
  });
  return (
    <Stack spacing={2}>
      <form onSubmit={handleSubmit((data) => createMutation.mutate(data))}>
        <Stack direction="row" spacing={1}>
          <Select size="small" value={watch('ruleType')} onChange={(e) => setValue('ruleType', e.target.value)}>
            <MenuItem value="WEEKEND">WEEKEND</MenuItem>
            <MenuItem value="HOLIDAY">HOLIDAY</MenuItem>
            <MenuItem value="LAST_MINUTE">LAST_MINUTE</MenuItem>
            <MenuItem value="LONG_STAY">LONG_STAY</MenuItem>
          </Select>
          <Select size="small" value={watch('operator')} onChange={(e) => setValue('operator', e.target.value)}>
            <MenuItem value="MULTIPLY">MULTIPLY</MenuItem>
            <MenuItem value="ADD">ADD</MenuItem>
            <MenuItem value="SUBTRACT">SUBTRACT</MenuItem>
          </Select>
          <TextField size="small" label="Valor" type="number" step="0.01" {...register('value', { required: true })} />
          <TextField size="small" label="Min Nights" type="number" {...register('minNights')} />
          <Button type="submit" variant="contained">Adicionar</Button>
        </Stack>
      </form>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Regra</TableCell>
            <TableCell>Operador</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Min Noites</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((r: any) => (
            <TableRow key={r.id}>
              <TableCell>{r.ruleType}</TableCell>
              <TableCell>{r.operator}</TableCell>
              <TableCell>{Number(r.value).toFixed(2)}</TableCell>
              <TableCell>{r.minNights || '-'}</TableCell>
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