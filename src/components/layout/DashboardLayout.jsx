import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AIChatbot from '@/components/AIChatbot';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex pt-20">
        <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-sidebar-bg flex-col flex transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:flex`}>
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-full mx-auto">
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