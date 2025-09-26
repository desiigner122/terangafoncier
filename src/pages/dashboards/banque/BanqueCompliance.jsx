import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle } from 'lucide-react';

const BanqueCompliance = ({ dashboardStats = {} }) => {
  // Données par défaut si dashboardStats n'est pas fourni
  const defaultStats = {
    complianceScore: 87,
    auditScore: 92,
    riskLevel: 'Faible',
    lastAudit: '2024-01-15'
  };

  // Fusionner les stats par défaut avec celles fournies
  const stats = { ...defaultStats, ...dashboardStats };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Conformité Réglementaire</h2>
        <p className="text-gray-600 mt-1">Respect des normes et audits bancaires</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-gold-600" />
            Score de Conformité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{stats.complianceScore}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueCompliance;