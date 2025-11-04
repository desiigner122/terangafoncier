import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { 
  FileCheck, Shield, DollarSign, TrendingUp, 
  AlertTriangle, CheckCircle, XCircle, Clock, Download,
  Activity, Target, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const COLORS = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444'
};

function AIAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30'); // days
  const [stats, setStats] = useState({
    documents: {
      total: 0,
      valid: 0,
      invalid: 0,
      pending: 0,
      avgScore: 0
    },
    fraud: {
      totalAnalyzed: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      avgScore: 0
    },
    prices: {
      totalEvaluated: 0,
      avgConfidence: 0,
      overpriced: 0,
      underpriced: 0,
      avgDeviation: 0
    }
  });
  const [trendsData, setTrendsData] = useState({
    validation: [],
    fraud: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));

      // Fetch document validation stats
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('ai_validation_status, ai_validation_score, ai_validated_at')
        .gte('ai_validated_at', startDate.toISOString())
        .lte('ai_validated_at', endDate.toISOString());

      if (docsError) throw docsError;

      // Process document stats
      const docStats = {
        total: docsData.length,
        valid: docsData.filter(d => d.ai_validation_status === 'valid').length,
        invalid: docsData.filter(d => d.ai_validation_status === 'invalid').length,
        pending: docsData.filter(d => d.ai_validation_status === 'pending').length,
        avgScore: docsData.reduce((sum, d) => sum + (d.ai_validation_score || 0), 0) / (docsData.length || 1)
      };

      // Fetch fraud detection stats
      const { data: fraudData, error: fraudError } = await supabase
        .from('purchase_cases')
        .select('fraud_risk_score, fraud_analyzed_at')
        .not('fraud_analyzed_at', 'is', null)
        .gte('fraud_analyzed_at', startDate.toISOString())
        .lte('fraud_analyzed_at', endDate.toISOString());

      if (fraudError) throw fraudError;

      // Process fraud stats
      const fraudStats = {
        totalAnalyzed: fraudData.length,
        low: fraudData.filter(c => c.fraud_risk_score < 30).length,
        medium: fraudData.filter(c => c.fraud_risk_score >= 30 && c.fraud_risk_score < 50).length,
        high: fraudData.filter(c => c.fraud_risk_score >= 50 && c.fraud_risk_score < 70).length,
        critical: fraudData.filter(c => c.fraud_risk_score >= 70).length,
        avgScore: fraudData.reduce((sum, c) => sum + (c.fraud_risk_score || 0), 0) / (fraudData.length || 1)
      };

      // Fetch price evaluation stats
      const { data: pricesData, error: pricesError } = await supabase
        .from('properties')
        .select('price, ai_estimated_price, ai_price_confidence, created_at')
        .not('ai_estimated_price', 'is', null)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (pricesError) throw pricesError;

      // Process price stats
      const priceStats = {
        totalEvaluated: pricesData.length,
        avgConfidence: pricesData.reduce((sum, p) => sum + (p.ai_price_confidence || 0), 0) / (pricesData.length || 1),
        overpriced: pricesData.filter(p => p.price > p.ai_estimated_price * 1.1).length,
        underpriced: pricesData.filter(p => p.price < p.ai_estimated_price * 0.9).length,
        avgDeviation: pricesData.reduce((sum, p) => sum + Math.abs(p.price - p.ai_estimated_price), 0) / (pricesData.length || 1)
      };

      setStats({
        documents: docStats,
        fraud: fraudStats,
        prices: priceStats
      });

      // Prepare trends data (group by day)
      const validationTrends = groupByDay(docsData, 'ai_validated_at', (items) => ({
        valides: items.filter(d => d.ai_validation_status === 'valid').length,
        invalides: items.filter(d => d.ai_validation_status === 'invalid').length,
        score: items.reduce((sum, d) => sum + (d.ai_validation_score || 0), 0) / (items.length || 1)
      }));

      const fraudTrends = groupByDay(fraudData, 'fraud_analyzed_at', (items) => ({
        faible: items.filter(c => c.fraud_risk_score < 30).length,
        moyen: items.filter(c => c.fraud_risk_score >= 30 && c.fraud_risk_score < 50).length,
        élevé: items.filter(c => c.fraud_risk_score >= 50 && c.fraud_risk_score < 70).length,
        critique: items.filter(c => c.fraud_risk_score >= 70).length
      }));

      setTrendsData({
        validation: validationTrends,
        fraud: fraudTrends
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Erreur lors du chargement des analytics');
      setLoading(false);
    }
  };

  const groupByDay = (data, dateField, processor) => {
    const grouped = {};
    data.forEach(item => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    return Object.entries(grouped)
      .map(([date, items]) => ({
        date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        ...processor(items)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Métrique', 'Valeur'],
      ['Documents validés', stats.documents.total],
      ['Documents valides', stats.documents.valid],
      ['Documents invalides', stats.documents.invalid],
      ['Score validation moyen', Math.round(stats.documents.avgScore)],
      ['Cas analysés (fraude)', stats.fraud.totalAnalyzed],
      ['Risque faible', stats.fraud.low],
      ['Risque moyen', stats.fraud.medium],
      ['Risque élevé', stats.fraud.high],
      ['Risque critique', stats.fraud.critical],
      ['Score fraude moyen', Math.round(stats.fraud.avgScore)],
      ['Prix évalués', stats.prices.totalEvaluated],
      ['Confiance moyenne', Math.round(stats.prices.avgConfidence)],
      ['Prix surévalués', stats.prices.overpriced],
      ['Prix sous-évalués', stats.prices.underpriced]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-ia-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Export CSV réussi');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="h-8 w-8 text-emerald-600" />
            Analytics Intelligence Artificielle
          </h1>
          <p className="text-gray-600 mt-2">
            Tableau de bord des performances IA (validation, fraude, prix)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
              <SelectItem value="365">Année complète</SelectItem>
            </SelectContent>
          </Select>

          {/* Export button */}
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Documents validés */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Documents Validés
            </CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documents.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                {stats.documents.valid} valides
              </div>
              <div className="flex items-center text-xs text-red-600">
                <XCircle className="h-3 w-3 mr-1" />
                {stats.documents.invalid} invalides
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Score moyen: {Math.round(stats.documents.avgScore)}%
            </p>
          </CardContent>
        </Card>

        {/* Cas analysés (fraude) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cas Analysés (Fraude)
            </CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fraud.totalAnalyzed}</div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                {stats.fraud.low} faible
              </span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                {stats.fraud.high} élevé
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Risque moyen: {Math.round(stats.fraud.avgScore)}/100
            </p>
          </CardContent>
        </Card>

        {/* Prix évalués */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Prix Évalués
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prices.totalEvaluated}</div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-red-600">
                {stats.prices.overpriced} surévalués
              </span>
              <span className="text-blue-600">
                {stats.prices.underpriced} sous-évalués
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Confiance moy: {Math.round(stats.prices.avgConfidence)}%
            </p>
          </CardContent>
        </Card>

        {/* Alertes critiques */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fraudes Critiques
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.fraud.critical}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Nécessitent action immédiate
            </p>
            <div className="mt-3">
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => window.location.href = '/admin/fraud-detection'}
              >
                <Zap className="h-3 w-3 mr-1" />
                Voir détails
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Validation Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Validations Documents ({period} jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData.validation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="valides" 
                  stroke={COLORS.success} 
                  name="Valides"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="invalides" 
                  stroke={COLORS.error} 
                  name="Invalides"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke={COLORS.info} 
                  name="Score Moyen %"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fraud Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution Risque Fraude</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Faible', value: stats.fraud.low, fill: COLORS.low },
                    { name: 'Moyen', value: stats.fraud.medium, fill: COLORS.medium },
                    { name: 'Élevé', value: stats.fraud.high, fill: COLORS.high },
                    { name: 'Critique', value: stats.fraud.critical, fill: COLORS.critical }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Évolution Détection Fraude ({period} jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendsData.fraud}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="faible" stackId="a" fill={COLORS.low} name="Faible" />
              <Bar dataKey="moyen" stackId="a" fill={COLORS.medium} name="Moyen" />
              <Bar dataKey="élevé" stackId="a" fill={COLORS.high} name="Élevé" />
              <Bar dataKey="critique" stackId="a" fill={COLORS.critical} name="Critique" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Résumé Performance IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Validation Performance */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Validation Documents</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Taux de succès:</span>
                  <span className="font-medium">
                    {Math.round((stats.documents.valid / (stats.documents.total || 1)) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taux d'erreur:</span>
                  <span className="font-medium">
                    {Math.round((stats.documents.invalid / (stats.documents.total || 1)) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Score moyen:</span>
                  <span className="font-medium">{Math.round(stats.documents.avgScore)}%</span>
                </div>
              </div>
            </div>

            {/* Fraud Performance */}
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Détection Fraude</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Taux critique:</span>
                  <span className="font-medium text-red-600">
                    {Math.round((stats.fraud.critical / (stats.fraud.totalAnalyzed || 1)) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taux élevé:</span>
                  <span className="font-medium text-orange-600">
                    {Math.round((stats.fraud.high / (stats.fraud.totalAnalyzed || 1)) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Score moyen:</span>
                  <span className="font-medium">{Math.round(stats.fraud.avgScore)}/100</span>
                </div>
              </div>
            </div>

            {/* Price Performance */}
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h3 className="font-semibold text-emerald-900 mb-2">Évaluation Prix</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Confiance moyenne:</span>
                  <span className="font-medium">{Math.round(stats.prices.avgConfidence)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Écart moyen:</span>
                  <span className="font-medium">
                    {Math.round(stats.prices.avgDeviation).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Précision:</span>
                  <span className="font-medium">
                    {Math.round((1 - (stats.prices.overpriced + stats.prices.underpriced) / (stats.prices.totalEvaluated || 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIAnalyticsDashboard;
