import React from 'react';
import ModernAdminLayout from '@/components/layout/ModernAdminLayout';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';

const AdminUsersWrapper = () => {
  return (
    <ModernAdminLayout 
      title="Gestion des Utilisateurs" 
      subtitle="Administration des comptes et permissions"
    >
      <AdminUsersPage />
    </ModernAdminLayout>
  );
};

export default AdminUsersWrapper;