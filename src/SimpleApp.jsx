import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SimpleHomePage from '@/pages/SimpleHomePage';
import LoginPage from '@/pages/LoginPage';

function SimpleApp() {
  return (
    <Routes>
      <Route path="/" element={<SimpleHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default SimpleApp;
