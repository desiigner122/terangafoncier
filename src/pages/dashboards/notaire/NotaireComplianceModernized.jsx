import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, AlertTriangle, XCircle, TrendingUp,
  FileText, Calendar, User, Target, Award, Activity,
  BarChart3, PieChart, Clock, AlertCircle, Filter, Search,
  Download, Eye, CheckCheck, ListChecks, Wrench, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/UnifiedAuthContext.jsx';
import supabase from '@/lib/supabaseClient';
import { LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

/**
 * NotaireComplianceModernized.jsx
 * Tableau de bord conformité réglementaire — données Supabase réelles.
 * Source : table compliance_checks (colonnes réelles : id, notaire_id, act_id,
 * check_type, compliance_score, status ['pending'|'passed'|'failed'], details jsonb, created_at).
 * Aucun score inventé : valeurs réelles ou état vide honnête.
 */

const TYPE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];

// Libellés lisibles pour les types de contrôle connus ; sinon on affiche la valeur brute.
const TYPE_LABELS = {
  regulatory: 'Réglementaire',
  reglementaire: 'Réglementaire',
  quality: 'Qualité',
  qualite: 'Qualité',
  security: 'Sécurité',
  securite: 'Sécurité',
  aml: 'Anti-blanchiment',
  kyc: 'KYC / Identité',
  fiscal: 'Fiscal',
  document: 'Documentaire'
};

export default function NotaireComplianceModernized() {
  const { user } = useAuth();

  // États principaux
  const [checks, setChecks] = useState([]);
  const [filteredChecks, setFilteredChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // États de filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  /**
   * 🔄 CHARGEMENT DONNÉES SUPABASE (colonnes réelles uniquement)
   */
  useEffect(() => {
    if (user?.id) {
      loadCompliance();
    }
  }, [user]);

  const loadCompliance = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('compliance_checks')
        .select(`
          id,
          check_type,
          status,
          compliance_score,
          details,
          created_at,
          act:notarial_acts(reference, client_name, act_type)
        `)
        .eq('notaire_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setChecks(data || []);
      setFilteredChecks(data || []);
    } catch (error) {
      console.error('Erreur chargement conformité:', error);
      window.safeGlobalToast?.({
        title: "Erreur de chargement",
        description: error.message || "Impossible de charger les données de conformité",
        variant: "destructive"
      });
      setChecks([]);
      setFilteredChecks([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 📊 STATISTIQUES DÉRIVÉES (calculées sur les données réelles, jamais fabriquées)
   */
  const passedCount = checks.filter(c => c.status === 'passed').length;
  const pendingCount = checks.filter(c => c.status === 'pending').length;
  const failedChecks = checks.filter(c => c.status === 'failed');
  // Actions correctives = contrôles échoués nécessitant une correction (donnée réelle)
  const pendingActions = failedChecks.length;
  // Problèmes critiques = contrôles échoués avec un score faible
  const criticalIssues = failedChecks.filter(c => (c.compliance_score || 0) < 60).length;
  const hasData = checks.length > 0;
  // Score global = moyenne réelle des compliance_score ; null si aucune donnée (pas de valeur inventée)
  const globalScore = hasData
    ? Math.round(checks.reduce((sum, c) => sum + (c.compliance_score || 0), 0) / checks.length)
    : null;
  const successRate = hasData ? Math.round((passedCount / checks.length) * 100) : null;

  // Types de contrôle réellement présents (pour le filtre dynamique)
  const availableTypes = [...new Set(checks.map(c => c.check_type).filter(Boolean))];

  /**
   * 🔍 FILTRAGE
   */
  useEffect(() => {
    let filtered = [...checks];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.check_type?.toLowerCase().includes(search) ||
        c.act?.reference?.toLowerCase().includes(search) ||
        c.act?.client_name?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(c => c.check_type === typeFilter);
    }

    setFilteredChecks(filtered);
  }, [searchTerm, statusFilter, typeFilter, checks]);

  /**
   * 📊 DONNÉES GRAPHIQUES (dérivées des données réelles)
   */
  const trendData = [...checks]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .slice(-12)
    .map(c => ({
      date: new Date(c.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      score: c.compliance_score || 0
    }));

  const typeDistribution = Object.entries(
    checks.reduce((acc, c) => {
      const t = c.check_type || 'autre';
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, value], index) => ({
    name: getTypeLabel(type),
    value,
    color: TYPE_COLORS[index % TYPE_COLORS.length]
  }));

  /**
   * 🎨 FONCTIONS D'AFFICHAGE
   */
  function getTypeLabel(type) {
    if (!type) return 'Autre';
    return TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  const getStatusConfig = (status) => {
    const configs = {
      passed: { label: 'Conforme', color: 'bg-green-500', icon: CheckCircle, textColor: 'text-green-700' },
      pending: { label: 'En attente', color: 'bg-yellow-500', icon: Clock, textColor: 'text-yellow-700' },
      failed: { label: 'Non conforme', color: 'bg-red-500', icon: XCircle, textColor: 'text-red-700' }
    };
    return configs[status] || configs.pending;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-700';
    if (score >= 70) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // Référence lisible d'un contrôle (pas de "check_number" en base : on dérive de l'acte lié)
  const getCheckRef = (check) => {
    if (check.act?.reference) return check.act.reference;
    return `Contrôle ${getTypeLabel(check.check_type)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderDetails = (details) => {
    if (!details) return null;
    if (typeof details === 'string') return details;
    if (Array.isArray(details)) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {details.map((d, i) => (
            <li key={i}>{typeof d === 'string' ? d : JSON.stringify(d)}</li>
          ))}
        </ul>
      );
    }
    // Objet jsonb : afficher les paires clé/valeur
    return (
      <div className="space-y-1">
        {Object.entries(details).map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span>
            <span>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              Conformité Réglementaire
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Suivi de la conformité notariale
            </p>
          </div>
          <Button>
            <Download className="h-5 w-5 mr-2" />
            Exporter Rapport
          </Button>
        </div>

        {/* Score global */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Score de Conformité Global
                </h3>
                <div className="flex items-baseline gap-3">
                  {hasData ? (
                    <>
                      <span className={`text-5xl font-bold ${getScoreColor(globalScore)}`}>
                        {globalScore}%
                      </span>
                      {globalScore >= 90 ? (
                        <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                      ) : globalScore >= 70 ? (
                        <Badge className="bg-yellow-100 text-yellow-700">Satisfaisant</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700">À améliorer</Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-5xl font-bold text-gray-400">—</span>
                  )}
                </div>
                <Progress value={globalScore || 0} className="h-3 mt-4" />
                {!hasData && (
                  <p className="text-sm text-gray-500 mt-2">
                    Aucune vérification de conformité enregistrée pour le moment.
                  </p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-6 ml-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{passedCount}</p>
                  <p className="text-sm text-gray-600">Conformes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                  <p className="text-sm text-gray-600">En attente</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{criticalIssues}</p>
                  <p className="text-sm text-gray-600">Critiques</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total vérifications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{checks.length}</p>
                </div>
                <ListChecks className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Actions correctives</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingActions}</p>
                </div>
                <Wrench className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Problèmes critiques</p>
                  <p className="text-2xl font-bold text-red-600">{criticalIssues}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Taux de réussite</p>
                  <p className="text-2xl font-bold text-green-600">
                    {successRate !== null ? `${successRate}%` : '—'}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <Tabs defaultValue="checks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checks">Vérifications</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="actions">Actions Correctives</TabsTrigger>
        </TabsList>

        {/* Tab Vérifications */}
        <TabsContent value="checks" className="space-y-4">
          {/* Filtres */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">Tous les statuts</option>
                <option value="passed">Conforme</option>
                <option value="pending">En attente</option>
                <option value="failed">Non conforme</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">Tous les types</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>{getTypeLabel(type)}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Liste vérifications */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredChecks.length === 0 ? (
            <Card className="p-12 text-center">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune vérification</h3>
              <p className="text-gray-500">
                {checks.length === 0
                  ? "Aucune vérification de conformité n'a encore été enregistrée."
                  : "Aucun résultat ne correspond à vos filtres."}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredChecks.map((check, index) => {
                const statusConfig = getStatusConfig(check.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedCheck(check);
                            setShowDetailsDialog(true);
                          }}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`p-3 rounded-lg ${statusConfig.color} bg-opacity-10`}>
                              <StatusIcon className={`h-6 w-6 ${statusConfig.color.replace('bg-', 'text-')}`} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {getCheckRef(check)}
                                </h3>
                                <Badge variant="outline">{getTypeLabel(check.check_type)}</Badge>
                                {check.compliance_score != null && (
                                  <Badge className={getScoreBadgeColor(check.compliance_score)}>
                                    Score: {check.compliance_score}%
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(check.created_at)}
                                </span>
                                {check.act?.client_name && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {check.act.client_name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Progress value={check.compliance_score || 0} className="h-2 w-32 mb-1" />
                              <p className={`text-sm font-semibold ${statusConfig.textColor}`}>
                                {statusConfig.label}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab Tendances */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du Score de Conformité</CardTitle>
              </CardHeader>
              <CardContent>
                {trendData.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                    Aucune donnée à afficher
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Score" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                {typeDistribution.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                    Aucune donnée à afficher
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={typeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {typeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Actions Correctives */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Actions Correctives en Cours
              </CardTitle>
              <CardDescription>
                {pendingActions} contrôle(s) non conforme(s) nécessitant une correction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {failedChecks.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                  Aucune action corrective en attente.
                </div>
              ) : (
                failedChecks.map(check => (
                  <div key={check.id} className="p-4 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {getCheckRef(check)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {getTypeLabel(check.check_type)}
                          {check.compliance_score != null && ` • Score ${check.compliance_score}%`}
                          {' • '}{formatDate(check.created_at)}
                        </p>
                        {check.details && (
                          <div className="text-xs text-gray-500">
                            {renderDetails(check.details)}
                          </div>
                        )}
                      </div>
                      <Badge className="bg-red-100 text-red-700 whitespace-nowrap">
                        Non conforme
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Détails de la vérification
            </DialogTitle>
            <DialogDescription>
              {selectedCheck && getCheckRef(selectedCheck)}
            </DialogDescription>
          </DialogHeader>

          {selectedCheck && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Score de conformité</p>
                    {selectedCheck.compliance_score != null ? (
                      <div className="flex items-center gap-2">
                        <Progress value={selectedCheck.compliance_score} className="h-2 flex-1" />
                        <span className={`text-2xl font-bold ${getScoreColor(selectedCheck.compliance_score)}`}>
                          {selectedCheck.compliance_score}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">—</span>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Statut</p>
                    <Badge className={getStatusConfig(selectedCheck.status).color}>
                      {getStatusConfig(selectedCheck.status).label}
                    </Badge>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Type de contrôle</p>
                    <p className="font-medium text-gray-900 dark:text-white">{getTypeLabel(selectedCheck.check_type)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedCheck.created_at)}</p>
                  </div>
                </div>

                {selectedCheck.act?.client_name && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-1">Acte lié</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedCheck.act.reference ? `${selectedCheck.act.reference} — ` : ''}
                      {selectedCheck.act.client_name}
                    </p>
                  </div>
                )}

                {selectedCheck.details ? (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Détails du contrôle
                    </h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {renderDetails(selectedCheck.details)}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-500">
                    Aucun détail complémentaire enregistré pour ce contrôle.
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
