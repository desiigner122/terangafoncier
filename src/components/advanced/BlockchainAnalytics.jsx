import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, BarChart3 as BarChart, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const BlockchainAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalTransactions: 0,
    totalValue: 0,
    activeContracts: 0,
    growthRate: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

        const [
          { count: totalTransactions, error: txError },
          { data: amountRows, error: amountError },
          { count: activeContracts, error: certError },
          { count: txThisMonth, error: txThisMonthError },
          { count: txLastMonth, error: txLastMonthError }
        ] = await Promise.all([
          supabase.from('blockchain_transactions').select('*', { count: 'exact', head: true }),
          supabase.from('blockchain_transactions').select('amount'),
          supabase.from('blockchain_certificates').select('*', { count: 'exact', head: true }),
          supabase.from('blockchain_transactions').select('*', { count: 'exact', head: true }).gte('created_at', startOfThisMonth),
          supabase.from('blockchain_transactions').select('*', { count: 'exact', head: true }).gte('created_at', startOfLastMonth).lt('created_at', startOfThisMonth)
        ]);

        if (txError) throw txError;
        if (amountError) throw amountError;
        if (certError) throw certError;
        if (txThisMonthError) throw txThisMonthError;
        if (txLastMonthError) throw txLastMonthError;

        const totalValue = (amountRows || []).reduce((sum, row) => sum + Number(row.amount || 0), 0);

        let growthRate = null;
        if (typeof txLastMonth === 'number' && txLastMonth > 0) {
          growthRate = ((txThisMonth - txLastMonth) / txLastMonth) * 100;
        }

        if (active) {
          setAnalytics({
            totalTransactions: totalTransactions || 0,
            totalValue,
            activeContracts: activeContracts || 0,
            growthRate
          });
        }
      } catch (error) {
        console.error('Erreur chargement analytics blockchain:', error);
        if (active) {
          setAnalytics({ totalTransactions: 0, totalValue: 0, activeContracts: 0, growthRate: null });
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions Total</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '…' : analytics.totalTransactions}</div>
          {analytics.growthRate !== null && (
            <Badge className={`mt-2 ${analytics.growthRate >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {analytics.growthRate >= 0 ? '+' : ''}{analytics.growthRate.toFixed(1)}% ce mois
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '…' : `${analytics.totalValue.toLocaleString()} XOF`}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '…' : analytics.activeContracts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Croissance</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '…' : analytics.growthRate !== null ? `${analytics.growthRate.toFixed(1)}%` : 'N/D'}
          </div>
          <Badge className="mt-2 bg-gray-100 text-gray-700">
            {analytics.growthRate === null ? 'Données insuffisantes' : analytics.growthRate >= 0 ? 'Tendance positive' : 'Tendance négative'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainAnalytics;
