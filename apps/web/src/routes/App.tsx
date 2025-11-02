import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Results from '../pages/Results';
import Checkout from '../pages/Checkout';
import Confirmation from '../pages/Confirmation';
import AdminDashboard from '../pages/admin/Dashboard';
import RoomCalendar from '../pages/admin/RoomCalendar';
import AdminBookings from '../pages/admin/Bookings';
import AdminConfig from '../pages/admin/Config';
import Reports from '../pages/admin/Reports';
import { RequireRole } from './RequireRole';

const theme = createTheme({});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/resultados" element={<Results />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmacao" element={<Confirmation />} />

        <Route
          path="/admin"
          element={
            <RequireRole roles={["ADMIN", "OWNER", "STAFF"]}>
              <AdminDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/admin/calendario"
          element={
            <RequireRole roles={["ADMIN", "OWNER", "STAFF"]}>
              <RoomCalendar />
            </RequireRole>
          }
        />
        <Route
          path="/admin/reservas"
          element={
            <RequireRole roles={["ADMIN", "OWNER", "STAFF"]}>
              <AdminBookings />
            </RequireRole>
          }
        />
        <Route
          path="/admin/config"
          element={
            <RequireRole roles={["ADMIN", "OWNER"]}>
              <AdminConfig />
            </RequireRole>
          }
        />
        <Route
          path="/admin/relatorios"
          element={
            <RequireRole roles={["ADMIN", "OWNER"]}>
              <Reports />
            </RequireRole>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}