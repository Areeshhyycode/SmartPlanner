import type { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}

export default Layout;


