import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarResponsive from './SidebarResponsive';
import Header from './Header';
import AIChatbot from '@/components/AIChatbot';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex pt-16 md:pt-20">
        {/* Sidebar responsive */}
        <SidebarResponsive />

        {/* Main content */}
        <main className="flex-1 md:ml-64 lg:ml-72 overflow-x-hidden overflow-y-auto">
          <div className="max-w-full mx-auto p-4 md:p-6">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>
      
      {/* Chatbot IA */}
      <AIChatbot />
    </div>
  );
};

export default DashboardLayout;