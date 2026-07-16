import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  MapPin,
  Building,
  TrendingUp,
  Eye,
  Heart,
  ArrowUpRight,
  CheckCircle,
  Home,
  Building2,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurOpportunites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [roiFilter, setRoiFilter] = useState('all');
  const [sortBy, setSortBy] = useState('roi');

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement des opportunités réelles (investment_opportunities — lecture publique)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('investment_opportunities')
          .select(`id, property_id, title, location, region, type, expected_roi,
                   min_investment, total_amount, risk_level, status, description, created_at,
                   properties ( surface, city, region, ai_score, estimated_value )`)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (!cancelled) setOpportunities(data || []);
      } catch (e) {
        console.error('Erreur chargement opportunités:', e);
        if (!cancelled) setOpportunities([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Statistiques dérivées des données réelles
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = opportunities.filter(o => o.created_at && new Date(o.created_at).getTime() >= weekAgo).length;
  const openCount = opportunities.filter(o => o.status === 'open').length;
  const roiValues = opportunities.map(o => Number(o.expected_roi)).filter(v => !isNaN(v) && v > 0);
  const averageRoi = roiValues.length ? (roiValues.reduce((a, b) => a + b, 0) / roiValues.length) : null;

  const formatCurrency = (amount) => {
    if (amount == null || isNaN(amount)) return '—';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const typeLabel = (type) => {
    if (!type) return 'Autre';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getTypeColor = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'immobilier': return 'bg-blue-100 text-blue-800';
      case 'projet': return 'bg-green-100 text-green-800';
      case 'terrain': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const riskLabel = (risk) => {
    switch ((risk || '').toLowerCase()) {
      case 'faible': return 'Faible';
      case 'moyen': return 'Modéré';
      case 'eleve': return 'Élevé';
      default: return null;
    }
  };

  const getRiskColor = (risk) => {
    switch ((risk || '').toLowerCase()) {
      case 'faible': return 'bg-green-100 text-green-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'eleve': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusLabel = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'open': return 'Ouverte';
      case 'funded': return 'Financée';
      case 'closed': return 'Clôturée';
      default: return status || '—';
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'funded': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'immobilier': return <Home className="w-4 h-4" />;
      case 'projet': return <Building2 className="w-4 h-4" />;
      case 'terrain': return <MapPin className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  // Types réellement présents dans les données (filtres dynamiques)
  const availableTypes = Array.from(
    new Set(opportunities.map(o => (o.type || '').toLowerCase()).filter(Boolean))
  );

  const filteredOpportunities = opportunities.filter(opp => {
    const haystack = `${opp.title || ''} ${opp.location || ''} ${opp.region || ''}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || (opp.type || '').toLowerCase() === selectedType;

    const min = Number(opp.min_investment);
    let matchesBudget = true;
    if (budgetFilter === 'lt100') matchesBudget = !isNaN(min) && min < 100000000;
    else if (budgetFilter === '100-300') matchesBudget = !isNaN(min) && min >= 100000000 && min <= 300000000;
    else if (budgetFilter === 'gt300') matchesBudget = !isNaN(min) && min > 300000000;

    const roi = Number(opp.expected_roi);
    let matchesRoi = true;
    if (roiFilter === 'gt15') matchesRoi = !isNaN(roi) && roi > 15;
    else if (roiFilter === 'gt20') matchesRoi = !isNaN(roi) && roi > 20;
    else if (roiFilter === 'gt25') matchesRoi = !isNaN(roi) && roi > 25;

    return matchesSearch && matchesType && matchesBudget && matchesRoi;
  });

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return (Number(b.expected_roi) || 0) - (Number(a.expected_roi) || 0);
      case 'price':
        return (Number(a.total_amount) || 0) - (Number(b.total_amount) || 0);
      case 'recent':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Opportunités d'Investissement</h1>
            <p className="text-gray-600">Découvrez les meilleures opportunités du marché</p>
          </div>
          {newThisWeek > 0 && (
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                {newThisWeek} nouvelle{newThisWeek > 1 ? 's' : ''} cette semaine
              </Badge>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Opportunités</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {averageRoi != null ? `${averageRoi.toFixed(1)}%` : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ouvertes</p>
                  <p className="text-2xl font-bold text-gray-900">{openCount}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouvelles (7j)</p>
                  <p className="text-2xl font-bold text-gray-900">{newThisWeek}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Liste des opportunités */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Opportunités Disponibles</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher une opportunité..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="roi">Trier par ROI</option>
                      <option value="price">Trier par Montant</option>
                      <option value="recent">Plus récentes</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtres par type (dynamiques selon les données réelles) */}
                {availableTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                      variant={selectedType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedType('all')}
                    >
                      Tous
                    </Button>
                    {availableTypes.map((t) => (
                      <Button
                        key={t}
                        variant={selectedType === t ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedType(t)}
                      >
                        {typeLabel(t)}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Opportunités */}
                {loading ? (
                  <div className="flex items-center justify-center py-16 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Chargement des opportunités...
                  </div>
                ) : sortedOpportunities.length === 0 ? (
                  <div className="text-center text-gray-500 py-16">
                    <Building className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">Aucune opportunité disponible</p>
                    <p className="text-xs mt-1">Aucune opportunité ne correspond à vos critères pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sortedOpportunities.map((opportunity) => {
                      const risk = riskLabel(opportunity.risk_level);
                      const surface = opportunity.properties?.surface;
                      return (
                        <motion.div
                          key={opportunity.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-6 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                {getTypeIcon(opportunity.type)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                  {opportunity.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                  {(opportunity.location || opportunity.region) && (
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {opportunity.location || opportunity.region}
                                    </div>
                                  )}
                                </div>
                                {opportunity.description && (
                                  <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                                )}

                                {/* Badges */}
                                <div className="flex items-center space-x-2">
                                  {opportunity.type && (
                                    <Badge className={getTypeColor(opportunity.type)}>
                                      {typeLabel(opportunity.type)}
                                    </Badge>
                                  )}
                                  {risk && (
                                    <Badge className={getRiskColor(opportunity.risk_level)}>
                                      Risque {risk}
                                    </Badge>
                                  )}
                                  <Badge className={getStatusColor(opportunity.status)}>
                                    {statusLabel(opportunity.status)}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {opportunity.expected_roi != null ? `${opportunity.expected_roi}%` : '—'}
                              </div>
                              <div className="text-sm text-gray-500">ROI attendu</div>
                            </div>
                          </div>

                          {/* Métriques réelles */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Montant total</p>
                              <p className="font-semibold">{formatCurrency(opportunity.total_amount)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Investissement min.</p>
                              <p className="font-semibold text-blue-600">{formatCurrency(opportunity.min_investment)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Région</p>
                              <p className="font-semibold">{opportunity.region || opportunity.properties?.region || '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Superficie</p>
                              <p className="font-semibold">{surface ? `${surface} m²` : '—'}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Heart className="w-4 h-4 mr-2" />
                                Sauvegarder
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Détails
                              </Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                Investir
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Filtres avancés */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres Avancés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Budget (investissement min.)</label>
                    <select
                      value={budgetFilter}
                      onChange={(e) => setBudgetFilter(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">Tous budgets</option>
                      <option value="lt100">Moins de 100M XOF</option>
                      <option value="100-300">100M - 300M XOF</option>
                      <option value="gt300">Plus de 300M XOF</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">ROI minimum</label>
                    <select
                      value={roiFilter}
                      onChange={(e) => setRoiFilter(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">Tous ROI</option>
                      <option value="gt15">Plus de 15%</option>
                      <option value="gt20">Plus de 20%</option>
                      <option value="gt25">Plus de 25%</option>
                    </select>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => { setBudgetFilter('all'); setRoiFilter('all'); setSelectedType('all'); setSearchTerm(''); }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </CardContent>
            </Card>

            {/* Mes favoris */}
            <Card>
              <CardHeader>
                <CardTitle>Mes Favoris</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-4">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Aucun favori pour l'instant</p>
                  <p className="text-xs mt-1">Bientôt disponible</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestisseurOpportunites;
