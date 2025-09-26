import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BanquePortfolio = ({ dashboardStats = {} }) => {
  // Données par défaut
  const defaultStats = {
    portfolioValue: 2800000000,
    totalCredits: 156,
    approvedCredits: 139,
    pendingCredits: 17
  };
  const stats = { ...defaultStats, ...dashboardStats };
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Portefeuille de Crédits</h2>
        <p className="text-gray-600 mt-1">Gestion et suivi du portefeuille bancaire</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-green-600" />
            Vue d'ensemble du Portefeuille
          </CardTitle>
          <CardDescription>
            Valeur totale: {(stats.portfolioValue / 1000000000).toFixed(2)}Md FCFA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">2.45Md</p>
              <p className="text-sm text-gray-600">Portefeuille Total</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">1,847</p>
              <p className="text-sm text-gray-600">Clients Actifs</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <PieChart className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">98%</p>
              <p className="text-sm text-gray-600">Taux de Recouvrement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanquePortfolio;