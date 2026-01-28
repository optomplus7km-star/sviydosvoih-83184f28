import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * 
 * SECURITY NOTE:
 * This component provides UI-level route protection only. It prevents non-authenticated
 * or non-admin users from seeing protected pages, improving UX.
 * 
 * ACTUAL SECURITY is enforced by Row Level Security (RLS) policies at the database level.
 * Even if a user bypasses this component (e.g., via direct API calls), they cannot
 * access or modify protected data because RLS policies check `has_role(auth.uid(), 'admin')`.
 * 
 * The `requireAdmin` prop controls UI visibility, not actual authorization.
 */
interface ProtectedRouteProps {
  children: ReactNode;
  /** 
   * When true, redirects non-admin users to home page.
   * This is a UX feature - actual security is enforced by RLS.
   */
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
