import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 bg-muted/30">
        <div className="civic-container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Civic Platform. Платформа гражданского сотрудничества.
        </div>
      </footer>
    </div>
  );
}
