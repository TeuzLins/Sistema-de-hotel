import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../stores/auth';

export function RequireRole({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}