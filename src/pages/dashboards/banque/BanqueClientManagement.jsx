import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BanqueClientManagement = ({ dashboardStats }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion Clients Bancaires</CardTitle>
          <CardDescription>Portefeuille clients immobilier</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Page de gestion des clients bancaires pour les services immobiliers.</p>
          <div className="mt-4">
            <div className="text-lg font-semibold">Clients Actifs: {dashboardStats?.activeClients?.toLocaleString() || 0}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueClientManagement;