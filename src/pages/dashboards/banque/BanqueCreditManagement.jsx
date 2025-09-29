import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BanqueCreditManagement = ({ dashboardStats }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Crédits</CardTitle>
          <CardDescription>Crédit immobilier et hypothécaire</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Page de gestion des crédits immobiliers et hypothécaires.</p>
          <div className="mt-4">
            <div className="text-lg font-semibold">Demandes en cours: {dashboardStats?.pendingCreditApplications || 0}</div>
            <div className="text-lg font-semibold">Volume total: {dashboardStats?.totalCreditVolume || '0 CFA'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueCreditManagement;