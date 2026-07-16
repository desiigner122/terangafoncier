import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  Search,
  Bell,
  FileText,
  Clock,
  MapPin,
  Scan,
  Target,
  TrendingUp,
  BarChart3,
  Activity,
  RefreshCw,
  ChevronRight,
  Flag,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Normalise le champ jsonb `parties` de la table disputes vers un tableau de noms.
const normalizeParties = (parties) => {
  if (!parties) return [];
  let arr = parties;
  if (typeof arr === 'string') {
    try { arr = JSON.parse(arr); } catch { return []; }
  }
  if (!Array.isArray(arr)) {
    if (Array.isArray(arr?.parties)) arr = arr.parties;
    else return [];
  }
  return arr
    .map((p) => {
      if (typeof p === 'string') return p;
      if (!p || typeof p !== 'object') return null;
      return p.name || p.nom || p.fullName || p.full_name || null;
    })
    .filter(Boolean);
};

const AgentFoncierAntiFraude = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Statistiques anti-fraude issues des tables réelles (properties + disputes)
  const [fraudeStats, setFraudeStats] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    resolvedCases: 0,
    verifiedRate: null // % de propriétés vérifiées, null si aucune propriété
  });

  // Alertes = litiges réels (disputes) sur les biens de l'agent
  //          + propriétés de l'agent en attente / rejet de vérification.
  const [alertes, setAlertes] = useState([]);

  // Répartition mensuelle réelle (comptage des alertes par mois de création)
  const [monthlyData, setMonthlyData] = useState([]);

  // Indicateurs clés calculés sur les vraies données
  const [indicators, setIndicators] = useState([]);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Biens de l'agent
      const { data: props, error: propsErr } = await supabase
        .from('properties')
        .select('id, title, name, location, region, city, verification_status, created_at')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      if (propsErr) throw propsErr;

      const properties = props || [];
      const propMap = {};
      properties.forEach((p) => {
        propMap[p.id] = {
          title: p.title || p.name || 'Bien sans titre',
          location: p.location || [p.city, p.region].filter(Boolean).join(', ') || '—'
        };
      });

      // Litiges (anti-fraude) portant sur les biens de l'agent
      const ids = properties.map((p) => p.id);
      let disputes = [];
      if (ids.length > 0) {
        const { data: disp, error: dispErr } = await supabase
          .from('disputes')
          .select('id, title, property_id, status, parties, created_at')
          .in('property_id', ids)
          .order('created_at', { ascending: false });
        if (dispErr) throw dispErr;
        disputes = disp || [];
      }

      // Construction des alertes à partir des litiges réels
      const disputeAlerts = disputes.map((d) => {
        const isResolved = d.status === 'resolved' || d.status === 'closed';
        const isOpen = d.status === 'open' || d.status === 'in_progress';
        const parties = normalizeParties(d.parties);
        const prop = propMap[d.property_id] || {};
        return {
          id: `dispute-${d.id}`,
          type: 'litige',
          severity: isResolved ? 'low' : (isOpen ? 'high' : 'medium'),
          title: d.title || 'Litige foncier',
          description: parties.length ? `Parties: ${parties.join(' vs ')}` : 'Litige enregistré sur un bien',
          location: prop.location || '—',
          timestamp: d.created_at ? new Date(d.created_at).toLocaleString('fr-FR') : '—',
          statusLabel: isResolved ? 'Résolu' : (isOpen ? 'En cours' : (d.status || 'À traiter')),
          statusKey: isResolved ? 'resolved' : (isOpen ? 'investigating' : 'pending'),
          evidence: parties,
          createdAt: d.created_at
        };
      });

      // Alertes de vérification : biens en attente ou rejetés
      const verifAlerts = properties
        .filter((p) => p.verification_status === 'pending' || p.verification_status === 'rejected')
        .map((p) => {
          const rejected = p.verification_status === 'rejected';
          return {
            id: `prop-${p.id}`,
            type: 'verification',
            severity: rejected ? 'critical' : 'medium',
            title: rejected ? 'Vérification rejetée' : 'Vérification en attente',
            description: p.title || p.name || 'Bien sans titre',
            location: p.location || [p.city, p.region].filter(Boolean).join(', ') || '—',
            timestamp: p.created_at ? new Date(p.created_at).toLocaleString('fr-FR') : '—',
            statusLabel: rejected ? 'Rejeté' : 'En attente',
            statusKey: rejected ? 'pending' : 'monitoring',
            evidence: [],
            createdAt: p.created_at
          };
        });

      const allAlerts = [...disputeAlerts, ...verifAlerts].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      // Stats réelles
      const verifiedCount = properties.filter((p) => p.verification_status === 'verified').length;
      const criticalAlerts = allAlerts.filter((a) => a.severity === 'critical' || a.severity === 'high').length;
      const resolvedCases = disputes.filter((d) => d.status === 'resolved' || d.status === 'closed').length;
      const verifiedRate = properties.length
        ? Math.round((verifiedCount / properties.length) * 100)
        : null;

      setFraudeStats({
        totalAlerts: allAlerts.length,
        criticalAlerts,
        resolvedCases,
        verifiedRate
      });

      // Répartition mensuelle réelle sur les 3 derniers mois
      const now = new Date();
      const months = [];
      for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          key: `${d.getFullYear()}-${d.getMonth()}`,
          label: d.toLocaleDateString('fr-FR', { month: 'long' }),
          count: 0
        });
      }
      const monthIndex = {};
      months.forEach((m, idx) => { monthIndex[m.key] = idx; });
      allAlerts.forEach((a) => {
        if (!a.createdAt) return;
        const d = new Date(a.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthIndex[key] !== undefined) months[monthIndex[key]].count += 1;
      });
      setMonthlyData(months);

      // Indicateurs clés réels
      const activeDisputes = disputes.filter((d) => d.status === 'open' || d.status === 'in_progress').length;
      setIndicators([
        { name: 'Biens suivis', value: `${properties.length}` },
        { name: 'Biens vérifiés', value: verifiedRate != null ? `${verifiedRate}%` : '—' },
        { name: 'Litiges actifs', value: `${activeDisputes}` },
        { name: 'Litiges résolus', value: `${resolvedCases}` }
      ]);

      setAlertes(allAlerts);
    } catch (e) {
      console.error('Erreur chargement anti-fraude agent:', e);
      setAlertes([]);
      setFraudeStats({ totalAlerts: 0, criticalAlerts: 0, resolvedCases: 0, verifiedRate: null });
      setMonthlyData([]);
      setIndicators([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (statusKey) => {
    switch(statusKey) {
      case 'investigating': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Flag className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Bell className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredAlertes = alertes.filter(alerte => {
    const matchesFilter = activeFilter === 'all' || alerte.severity === activeFilter;
    const matchesSearch = alerte.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (alerte.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-red-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-orange-700 to-amber-700 bg-clip-text text-transparent">
            Anti-Fraude
          </h1>
          <p className="text-slate-600">Détection et prévention des fraudes immobilières</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Alertes Totales',
            value: fraudeStats.totalAlerts,
            icon: Bell,
            color: 'from-blue-500 to-cyan-600'
          },
          {
            title: 'Alertes Critiques',
            value: fraudeStats.criticalAlerts,
            icon: AlertTriangle,
            color: 'from-red-500 to-pink-600'
          },
          {
            title: 'Litiges Résolus',
            value: fraudeStats.resolvedCases,
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-600'
          },
          {
            title: 'Taux Vérification',
            value: fraudeStats.verifiedRate != null ? `${fraudeStats.verifiedRate}%` : '—',
            icon: Target,
            color: 'from-purple-500 to-indigo-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-sm text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? '…' : stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alertes et filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Alertes de Sécurité
                </CardTitle>
                <CardDescription>
                  Litiges et vérifications en attente sur vos biens
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher une alerte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les alertes</SelectItem>
                  <SelectItem value="critical">Critiques</SelectItem>
                  <SelectItem value="high">Élevées</SelectItem>
                  <SelectItem value="medium">Moyennes</SelectItem>
                  <SelectItem value="low">Faibles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des alertes */}
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Chargement des alertes...
              </div>
            ) : filteredAlertes.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Shield className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">Aucune alerte</p>
                <p className="text-sm">Aucun litige ni vérification en attente sur vos biens.</p>
              </div>
            ) : (
            <div className="space-y-4">
              {filteredAlertes.map((alerte, index) => (
                <motion.div
                  key={alerte.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getSeverityIcon(alerte.severity)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{alerte.title}</h3>
                          <Badge className={getSeverityColor(alerte.severity)}>
                            {alerte.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{alerte.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alerte.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alerte.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(alerte.statusKey)}>
                        {alerte.statusLabel}
                      </Badge>
                    </div>
                  </div>

                  {alerte.evidence && alerte.evidence.length > 0 && (
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Parties impliquées:</p>
                          <div className="flex flex-wrap gap-1">
                            {alerte.evidence.map((evidence, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {evidence}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Systèmes de détection - fonctionnalité IA à venir, aucune source réelle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-purple-600" />
              Systèmes de Détection IA
            </CardTitle>
            <CardDescription>
              Détection automatique par intelligence artificielle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-slate-500">
              <Activity className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">Bientôt disponible</p>
              <p className="text-sm">
                Les modules de détection automatique (signatures, biométrie, GPS) seront activés prochainement.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métriques de performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Alertes par Mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Chargement...
              </div>
            ) : monthlyData.length === 0 ? (
              <p className="text-center py-8 text-slate-500 text-sm">Aucune donnée disponible</p>
            ) : (
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div key={data.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{data.label}</p>
                    <p className="text-sm text-slate-600">{data.count} alerte(s) enregistrée(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{data.count}</p>
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Indicateurs Clés
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Chargement...
              </div>
            ) : indicators.length === 0 ? (
              <p className="text-center py-8 text-slate-500 text-sm">Aucune donnée disponible</p>
            ) : (
            <div className="space-y-4">
              {indicators.map((metric) => (
                <div key={metric.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{metric.name}</p>
                    <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierAntiFraude;
