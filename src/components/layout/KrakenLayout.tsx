import { ReactNode } from 'react';
import { KrakenHeader } from './KrakenHeader';
import { KrakenFooter } from './KrakenFooter';

interface KrakenLayoutProps {
  children: ReactNode;
}

export function KrakenLayout({ children }: KrakenLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <KrakenHeader />
      <main className="flex-1">
        {children}
      </main>
      <KrakenFooter />
    </div>
  );
}
