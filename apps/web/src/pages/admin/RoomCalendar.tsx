import { Container, Typography, Box } from '@mui/material';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const locales = { 'pt-BR': ptBR } as any;
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales
});

export default function RoomCalendar() {
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => (await api.get('/bookings')).data.data
  });

  const events: Event[] = (bookings || []).map((b: any) => ({
    title: `${b.room.number} - ${b.guestName}`,
    start: new Date(b.checkIn),
    end: new Date(b.checkOut),
    resource: b
  }));

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Calendário por quarto</Typography>
      <Box sx={{ height: 600 }}>
        <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" />
      </Box>
    </Container>
  );
}