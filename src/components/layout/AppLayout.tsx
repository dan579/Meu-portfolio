import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F3F6FA] text-[#253247] flex flex-col font-body selection:bg-[#0877E8] selection:text-white">
      {/* Top Horizontal Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Institutional Navy Footer */}
      <Footer />
    </div>
  );
};
