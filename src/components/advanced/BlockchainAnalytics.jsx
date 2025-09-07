import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, BarChart, TrendingUp, Activity } from 'lucide-react';

const BlockchainAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalTransactions: 0,
    totalValue: 0,
    activeContracts: 0,
    growthRate: 0
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions Total</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalTransactions}</div>
          <Badge className="mt-2 bg-green-100 text-green-700">
            +12% ce mois
          </Badge>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalValue.toLocaleString()} XOF</div>
          <Badge className="mt-2 bg-blue-100 text-blue-700">
            +8% ce mois
          </Badge>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.activeContracts}</div>
          <Badge className="mt-2 bg-purple-100 text-purple-700">
            🆕 +15 nouveaux
          </Badge>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Croissance</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.growthRate}%</div>
          <Badge className="mt-2 bg-yellow-100 text-yellow-700">
            Tendance positive
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainAnalytics;