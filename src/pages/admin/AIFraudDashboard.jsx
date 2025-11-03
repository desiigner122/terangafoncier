/**
 * @file AIFraudDashboard.jsx
 * @description Dashboard admin surveillance fraude IA
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, TrendingUp, Activity, Filter,
  Search, Download, RefreshCw, Eye, Clock, CheckCircle2, XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

const AIFraudDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    riskLevel: 'all',
    dateRange: '30days'
  });

  // Charger données
  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      // Query avec filtres
      let query = supabase
        .from('purchase_cases')
        .select(`
          *,
          buyer:profiles!purchase_cases_buyer_id_fkey(id, full_name, email),
          seller:profiles!purchase_cases_seller_id_fkey(id, full_name, email),
          property:properties(id, title, location, price)
        `)
        .not('fraud_risk_score', 'is', null)
        .order('fraud_risk_score', { ascending: false });

      // Filtre niveau risque
      if (filters.riskLevel !== 'all') {
        const riskRanges = {
          critical: [80, 100],
          high: [60, 80],
          medium: [30, 60],
          low: [0, 30]
        };
        const [min, max] = riskRanges[filters.riskLevel];
        query = query.gte('fraud_risk_score', min).lt('fraud_risk_score', max);
      }

      // Filtre date
      if (filters.dateRange !== 'all') {
        const days = filters.dateRange === '7days' ? 7 : filters.dateRange === '30days' ? 30 : 90;
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);
        query = query.gte('fraud_analyzed_at', dateLimit.toISOString());
      }

      // Filtre recherche
      if (filters.search) {
        query = query.or(`buyer.full_name.ilike.%${filters.search}%,seller.full_name.ilike.%${filters.search}%,property.title.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      setCases(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer statistiques
  const calculateStats = (casesData) => {
    const total = casesData.length;
    const critical = casesData.filter(c => c.fraud_risk_score >= 80).length;
    const high = casesData.filter(c => c.fraud_risk_score >= 60 && c.fraud_risk_score < 80).length;
    const medium = casesData.filter(c => c.fraud_risk_score >= 30 && c.fraud_risk_score < 60).length;
    const low = casesData.filter(c => c.fraud_risk_score < 30).length;
    
    const avgScore = total > 0 
      ? casesData.reduce((sum, c) => sum + (c.fraud_risk_score || 0), 0) / total 
      : 0;

    const totalFlags = casesData.reduce((sum, c) => sum + (c.fraud_flags?.length || 0), 0);

    setStats({
      total,
      critical,
      high,
      medium,
      low,
      avgScore,
      totalFlags
    });
  };

  // Config niveau risque
  const getRiskConfig = (score) => {
    if (score >= 80) return { label: 'CRITIQUE', color: 'bg-red-600 text-white', icon: XCircle };
    if (score >= 60) return { label: 'ÉLEVÉ', color: 'bg-orange-500 text-white', icon: AlertTriangle };
    if (score >= 30) return { label: 'MOYEN', color: 'bg-yellow-500 text-white', icon: AlertTriangle };
    return { label: 'FAIBLE', color: 'bg-green-500 text-white', icon: CheckCircle2 };
  };

  // Exporter CSV
  const handleExport = () => {
    const csv = [
      ['ID', 'Acheteur', 'Vendeur', 'Propriété', 'Score Risque', 'Niveau', 'Alertes', 'Date Analyse'].join(','),
      ...cases.map(c => [
        c.id,
        c.buyer?.full_name || 'N/A',
        c.seller?.full_name || 'N/A',
        c.property?.title || 'N/A',
        c.fraud_risk_score || 0,
        getRiskConfig(c.fraud_risk_score).label,
        c.fraud_flags?.length || 0,
        new Date(c.fraud_analyzed_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraude-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveillance Fraude IA</h1>
          <p className="text-gray-600 mt-1">
            Détection et analyse des risques de fraude par Intelligence Artificielle
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critique</p>
                  <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Élevé</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.high}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Moyen</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.medium}</p>
                </div>
                <Activity className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faible</p>
                  <p className="text-3xl font-bold text-green-600">{stats.low}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats supplémentaires */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Score moyen</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(stats.avgScore)}/100
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total analysés</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total alertes</p>
                  <p className="text-2xl font-bold text-red-600">{stats.totalFlags}</p>
                </div>
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Nom, propriété..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Niveau de risque</label>
              <Select value={filters.riskLevel} onValueChange={(v) => setFilters({ ...filters, riskLevel: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="critical">Critique (80-100)</SelectItem>
                  <SelectItem value="high">Élevé (60-80)</SelectItem>
                  <SelectItem value="medium">Moyen (30-60)</SelectItem>
                  <SelectItem value="low">Faible (0-30)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Période</label>
              <Select value={filters.dateRange} onValueChange={(v) => setFilters({ ...filters, dateRange: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 derniers jours</SelectItem>
                  <SelectItem value="30days">30 derniers jours</SelectItem>
                  <SelectItem value="90days">90 derniers jours</SelectItem>
                  <SelectItem value="all">Toute la période</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cas analysés ({cases.length})</CardTitle>
          <CardDescription>
            Liste des transactions analysées par l'IA avec scores de risque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Acheteur</TableHead>
                  <TableHead>Vendeur</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Alertes</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : cases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-600">
                      Aucun cas trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  cases.map((caseItem) => {
                    const riskConfig = getRiskConfig(caseItem.fraud_risk_score);
                    const RiskIcon = riskConfig.icon;

                    return (
                      <TableRow key={caseItem.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs">
                          {caseItem.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{caseItem.buyer?.full_name || 'N/A'}</p>
                            <p className="text-xs text-gray-600">{caseItem.buyer?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{caseItem.seller?.full_name || 'N/A'}</p>
                            <p className="text-xs text-gray-600">{caseItem.seller?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{caseItem.property?.title}</p>
                          <p className="text-xs text-gray-600">{caseItem.property?.location}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-bold">
                              {Math.round(caseItem.fraud_risk_score)}
                            </div>
                            <span className="text-xs text-gray-600">/100</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={riskConfig.color}>
                            <RiskIcon className="w-3 h-3 mr-1" />
                            {riskConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {caseItem.fraud_flags && caseItem.fraud_flags.length > 0 ? (
                            <Badge variant="outline" className="border-red-300 text-red-600">
                              {caseItem.fraud_flags.length} alerte(s)
                            </Badge>
                          ) : (
                            <span className="text-xs text-gray-600">Aucune</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            {new Date(caseItem.fraud_analyzed_at).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => navigate(`/admin/cases/${caseItem.id}`)}
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFraudDashboard;
