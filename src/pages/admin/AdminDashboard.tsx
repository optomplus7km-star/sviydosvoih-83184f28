import { Link, Outlet, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Building2, Users, Briefcase, FileText, Home } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Обзор', icon: Home, exact: true },
  { href: '/admin/groups', label: 'Группы', icon: Users },
  { href: '/admin/projects', label: 'Проекты', icon: Briefcase },
  { href: '/admin/applications', label: 'Заявки', icon: FileText },
];

function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sidebar-primary" />
            <span className="font-semibold">Админ-панель</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
            
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  'w-full justify-start gap-2',
                  isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-sidebar-border">
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/">← На сайт</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout />
    </ProtectedRoute>
  );
}
