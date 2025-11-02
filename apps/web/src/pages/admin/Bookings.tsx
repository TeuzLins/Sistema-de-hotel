import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

export default function AdminBookings() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => (await api.get('/bookings')).data.data
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: any) => (await api.patch(`/bookings/${id}/status`, { status })).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] })
  });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Reservas</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Quarto</TableCell>
            <TableCell>Hóspede</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Check-out</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((b: any) => (
            <TableRow key={b.id}>
              <TableCell>{b.code}</TableCell>
              <TableCell>{b.room.number}</TableCell>
              <TableCell>{b.guestName}</TableCell>
              <TableCell>{new Date(b.checkIn).toLocaleString()}</TableCell>
              <TableCell>{new Date(b.checkOut).toLocaleString()}</TableCell>
              <TableCell>{b.status}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => updateStatus.mutate({ id: b.id, status: 'CHECKED_IN' })}>Check-in</Button>
                  <Button size="small" onClick={() => updateStatus.mutate({ id: b.id, status: 'CHECKED_OUT' })}>Check-out</Button>
                  <Button size="small" color="error" onClick={() => updateStatus.mutate({ id: b.id, status: 'CANCELLED' })}>Cancelar</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}