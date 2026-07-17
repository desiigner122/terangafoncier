import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Building,
  MapPin,
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  Search,
  Plus,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Briefcase,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
// Layout géré par CompleteSidebarInvestisseurDashboard

// Libellés lisibles pour les types réels ('terrain'|'immobilier'|'projet')
const TYPE_LABELS = {
  terrain: 'Terrain',
  immobilier: 'Immobilier',
  projet: 'Projet'
};

// Libellés lisibles pour les statuts réels ('active'|'sold'|'pending')
const STATUS_LABELS = {
  active: 'Actif',
  sold: 'Vendu',
  pending: 'En attente'
};

// Couleurs de répartition par type réel
const TYPE_COLORS = {
  terrain: 'bg-purple-500',
  immobilier: 'bg-blue-500',
  projet: 'bg-green-500'
};

const InvestisseurPortfolio = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Portefeuille réel : investments filtré par investor_id, enrichi de la propriété jointe
        const { data, error } = await supabase
          .from('investments')
          .select(`
            id, investor_id, property_id, title, type, amount, current_value, roi, status, invested_at, created_at,
            property:properties!investments_property_id_fkey ( id, title, name, location, region, city )
          `)
          .eq('investor_id', user.id)
          .order('invested_at', { ascending: false });

        if (error) throw error;
        setInvestments(data || []);
      } catch (err) {
        console.error('Erreur chargement portefeuille:', err);
        // Repli sans jointure si la contrainte FK nommée diffère
        try {
          const { data } = await supabase
            .from('investments')
            .select('id, investor_id, property_id, title, type, amount, current_value, roi, status, invested_at, created_at')
            .eq('investor_id', user.id)
            .order('invested_at', { ascending: false });
          setInvestments(data || []);
        } catch (e2) {
          console.error('Erreur repli portefeuille:', e2);
          setInvestments([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [user?.id]);

  // ---- Agrégats réels du portefeuille ----
  const totalInvested = investments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const totalValue = investments.reduce(
    (sum, inv) => sum + (Number(inv.current_value) ?? Number(inv.amount) ?? 0),
    0
  );
  const totalGains = totalValue - totalInvested;
  const averageRoi = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;
  const activeInvestments = investments.filter((inv) => inv.status === 'active').length;
  const completedInvestments = investments.filter((inv) => inv.status === 'sold').length;

  // ---- Répartition par type (agrégats réels) ----
  const allocationData = (() => {
    const byType = {};
    investments.forEach((inv) => {
      const t = inv.type || 'autre';
      const val = Number(inv.current_value) ?? Number(inv.amount) ?? 0;
      byType[t] = (byType[t] || 0) + val;
    });
    const total = Object.values(byType).reduce((a, b) => a + b, 0);
    return Object.entries(byType).map(([type, value]) => ({
      type: TYPE_LABELS[type] || type,
      rawType: type,
      value,
      percentage: total > 0 ? Math.round((value / total) * 1000) / 10 : 0,
      color: TYPE_COLORS[type] || 'bg-gray-400'
    }));
  })();

  const getLocation = (inv) =>
    inv.property?.location || inv.property?.city || inv.property?.region || '—';

  const filteredInvestments = investments.filter((investment) => {
    const matchesType = filterType === 'all' || investment.type === filterType;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (investment.title || '').toLowerCase().includes(term) ||
      getLocation(investment).toLowerCase().includes(term);
    return matchesType && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  };

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '—';
    }
  };

  const formatRoi = (roi) => {
    const n = Number(roi) || 0;
    return `${n > 0 ? '+' : ''}${n}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'sold': return <Target className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center text-gray-500">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Chargement de votre portefeuille...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* En-tête du portefeuille */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <TrendingUp className={`w-4 h-4 mr-1 ${totalGains >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalGains >= 0 ? '+' : ''}{formatCurrency(totalGains)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Plus-value totale</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {investments.length > 0 ? `${Math.round(averageRoi * 10) / 10}%` : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={Math.min(Math.max(averageRoi * 4, 0), 100)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Rendement global du portefeuille</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investissements Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeInvestments}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {completedInvestments} investissement{completedInvestments > 1 ? 's' : ''} terminé{completedInvestments > 1 ? 's' : ''}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Capital Investi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalInvested)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {investments.length} ligne{investments.length > 1 ? 's' : ''} de portefeuille
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des investissements */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mon Portefeuille Détaillé</CardTitle>
                    <CardDescription>
                      Tous vos investissements et leur performance
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtres et recherche */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un investissement..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={filterType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('all')}
                    >
                      Tous
                    </Button>
                    <Button
                      variant={filterType === 'terrain' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('terrain')}
                    >
                      Terrain
                    </Button>
                    <Button
                      variant={filterType === 'immobilier' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('immobilier')}
                    >
                      Immobilier
                    </Button>
                    <Button
                      variant={filterType === 'projet' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('projet')}
                    >
                      Projet
                    </Button>
                  </div>
                </div>

                {/* Liste des investissements */}
                {filteredInvestments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucun investissement</p>
                    <p className="text-sm">
                      {investments.length === 0
                        ? "Vous n'avez pas encore d'investissement dans votre portefeuille."
                        : 'Aucun investissement ne correspond à votre recherche.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredInvestments.map((investment) => (
                      <motion.div
                        key={investment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              {getStatusIcon(investment.status)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {investment.title || investment.property?.title || investment.property?.name || 'Investissement'}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-1" />
                                {getLocation(investment)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(investment.status)}>
                              {STATUS_LABELS[investment.status] || investment.status || '—'}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">
                              {TYPE_LABELS[investment.type] || investment.type || '—'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Investi</p>
                            <p className="font-semibold">{formatCurrency(investment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              {investment.status === 'sold' ? 'Valeur finale' : 'Valeur actuelle'}
                            </p>
                            <p className="font-semibold">
                              {formatCurrency(investment.current_value ?? investment.amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">ROI</p>
                            <p className={`font-semibold ${(Number(investment.roi) || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatRoi(investment.roi)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Investi le</p>
                            <p className="font-semibold">{formatDate(investment.invested_at)}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Répartition du portefeuille */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
                <CardDescription>
                  Diversification de votre portefeuille
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allocationData.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune donnée de répartition.</p>
                ) : (
                  <div className="space-y-4">
                    {allocationData.map((item) => (
                      <div key={item.rawType}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{item.type}</span>
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress value={item.percentage} className="flex-1 h-2" />
                          <span className="text-sm font-medium min-w-0">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel Investissement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyser Performance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Rapport Mensuel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestisseurPortfolio;
