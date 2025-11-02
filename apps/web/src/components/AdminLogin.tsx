import { Stack, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import api from '../lib/api';
import { useAuth } from '../stores/auth';

export default function AdminLogin() {
  const { register, handleSubmit } = useForm({ defaultValues: { email: 'admin@example.com', password: 'password123' } });
  const loginStore = useAuth((s) => s.login);
  const onSubmit = async (data: any) => {
    const res = await api.post('/auth/login', data);
    loginStore(res.data.data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing={1}>
        <TextField size="small" label="Email" {...register('email', { required: true })} />
        <TextField size="small" label="Senha" type="password" {...register('password', { required: true })} />
        <Button type="submit" variant="outlined">Login Admin</Button>
      </Stack>
    </form>
  );
}