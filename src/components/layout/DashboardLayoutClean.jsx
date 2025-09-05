import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarResponsive from '@/components/layout/SidebarResponsive';
import Header from '@/components/layout/Header';
import AIChatbot from '@/components/AIChatbot';

const DashboardLayoutClean = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header fixe en haut */}
      <Header />
      
      {/* Container principal avec sidebar et contenu */}
      <div className="flex pt-16 md:pt-20">
        {/* Sidebar responsive (desktop fixe, mobile modal) */}
        <SidebarResponsive />

        {/* Zone de contenu principal */}
        <main className="flex-1 min-h-screen overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      {/* Chatbot IA flottant */}
      <AIChatbot />
    </div>
  );
};

export default DashboardLayoutClean;
