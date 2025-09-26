import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const BanqueRiskManagement = ({ dashboardStats = {} }) => {
  // Données par défaut
  const defaultStats = {
    riskLevel: 'Modéré',
    riskScore: 2.3,
    portfolioValue: 2800000000
  };
  const stats = { ...defaultStats, ...dashboardStats };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Gestion des Risques</h2>
        <p className="text-gray-600 mt-1">Analyse et gestion des risques de crédit</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-600" />
            Niveau de Risque Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-lg font-medium">Risque {stats.riskLevel}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueRiskManagement;