import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 14);

  const { data: occupancy } = useQuery({
    queryKey: ['occupancy'],
    queryFn: async () => (await api.get('/reports/occupancy', { params: { from: from.toISOString(), to: to.toISOString() } })).data.data
  });
  const { data: revenue } = useQuery({
    queryKey: ['revenue'],
    queryFn: async () => (await api.get('/reports/revenue', { params: { from: from.toISOString(), to: to.toISOString() } })).data.data
  });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Relatórios</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography>Ocupação (%)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={occupancy || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="occupancyPct" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Receita (R$)</Typography>
              <Typography variant="h5">{Number(revenue?.total || 0).toFixed(2)}</Typography>
              <Typography>Pagamentos: {revenue?.count || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}