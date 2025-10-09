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
import { NotaireSupabaseService } from '@/services/NotaireSupabaseService';
import { LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

/**
 * NotaireComplianceModernized.jsx
 * Tableau de bord conformité réglementaire avec données Supabase réelles
 * Remplace NotaireCompliance.jsx (mock data)
 */

export default function NotaireComplianceModernized() {
  const { user } = useAuth();

  // États principaux
  const [checks, setChecks] = useState([]);
  const [filteredChecks, setFilteredChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // États statistiques
  const [globalScore, setGlobalScore] = useState(0);
  const [pendingActions, setPendingActions] = useState(0);
  const [criticalIssues, setCriticalIssues] = useState(0);

  // États de filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  /**
   * 🔄 CHARGEMENT DONNÉES SUPABASE
   */
  useEffect(() => {
    if (user?.id) {
      loadCompliance();
    }
  }, [user]);

  const loadCompliance = async () => {
    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.getComplianceChecks(user.id);

      if (result.success) {
        setChecks(result.data);
        setFilteredChecks(result.data);

        // Calculer statistiques
        const avgScore = result.data.length > 0
          ? result.data.reduce((sum, c) => sum + (c.compliance_score || 0), 0) / result.data.length
          : 100;
        setGlobalScore(Math.round(avgScore));

        const pending = result.data.reduce((count, check) => {
          if (check.corrective_actions) {
            const actions = typeof check.corrective_actions === 'string' 
              ? JSON.parse(check.corrective_actions) 
              : check.corrective_actions;
            return count + (actions.filter(a => a.status !== 'completed').length || 0);
          }
          return count;
        }, 0);
        setPendingActions(pending);

        const critical = result.data.filter(c => 
          c.check_status === 'failed' && c.compliance_score < 60
        ).length;
        setCriticalIssues(critical);

      } else {
        window.safeGlobalToast?.({
          title: "Erreur de chargement",
          description: result.error || "Impossible de charger les données de conformité",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur chargement conformité:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🔍 FILTRAGE
   */
  useEffect(() => {
    let filtered = [...checks];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.check_number?.toLowerCase().includes(search) ||
        c.check_type?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.check_status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(c => c.check_type === typeFilter);
    }

    setFilteredChecks(filtered);
  }, [searchTerm, statusFilter, typeFilter, checks]);

  /**
   * 📊 DONNÉES GRAPHIQUES
   */
  const trendData = checks
    .sort((a, b) => new Date(a.check_date) - new Date(b.check_date))
    .slice(-6)
    .map(c => ({
      date: new Date(c.check_date).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      score: c.compliance_score || 0
    }));

  const typeDistribution = [
    { name: 'Réglementaire', value: checks.filter(c => c.check_type === 'regulatory').length, color: '#3b82f6' },
    { name: 'Qualité', value: checks.filter(c => c.check_type === 'quality').length, color: '#10b981' },
    { name: 'Sécurité', value: checks.filter(c => c.check_type === 'security').length, color: '#f59e0b' }
  ];

  const statusDistribution = [
    { name: 'Réussi', value: checks.filter(c => c.check_status === 'completed').length, color: '#10b981' },
    { name: 'En attente', value: checks.filter(c => c.check_status === 'pending').length, color: '#f59e0b' },
    { name: 'Échoué', value: checks.filter(c => c.check_status === 'failed').length, color: '#ef4444' }
  ];

  /**
   * 🎨 FONCTIONS D'AFFICHAGE
   */
  const getStatusConfig = (status) => {
    const configs = {
      completed: { label: 'Réussi', color: 'bg-green-500', icon: CheckCircle, textColor: 'text-green-700' },
      pending: { label: 'En attente', color: 'bg-yellow-500', icon: Clock, textColor: 'text-yellow-700' },
      failed: { label: 'Échoué', color: 'bg-red-500', icon: XCircle, textColor: 'text-red-700' }
    };
    return configs[status] || configs.pending;
  };

  const getTypeLabel = (type) => {
    const types = {
      regulatory: 'Réglementaire',
      quality: 'Qualité',
      security: 'Sécurité'
    };
    return types[type] || type;
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
              Suivi de la conformité notariale • Données temps réel
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
                </div>
                <Progress value={globalScore} className="h-3 mt-4" />
              </div>
              <div className="grid grid-cols-3 gap-6 ml-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{checks.filter(c => c.check_status === 'completed').length}</p>
                  <p className="text-sm text-gray-600">Réussis</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{checks.filter(c => c.check_status === 'pending').length}</p>
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
                    {checks.length > 0 
                      ? Math.round((checks.filter(c => c.check_status === 'completed').length / checks.length) * 100)
                      : 0}%
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
                <option value="completed">Réussi</option>
                <option value="pending">En attente</option>
                <option value="failed">Échoué</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">Tous les types</option>
                <option value="regulatory">Réglementaire</option>
                <option value="quality">Qualité</option>
                <option value="security">Sécurité</option>
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
              <p className="text-gray-500">Modifiez vos filtres ou lancez une nouvelle vérification</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredChecks.map((check, index) => {
                const statusConfig = getStatusConfig(check.check_status);
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
                                  {check.check_number}
                                </h3>
                                <Badge variant="outline">{getTypeLabel(check.check_type)}</Badge>
                                <Badge className={getScoreBadgeColor(check.compliance_score)}>
                                  Score: {check.compliance_score}%
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(check.check_date)}
                                </span>
                                {check.completed_date && (
                                  <span className="flex items-center gap-1">
                                    <CheckCheck className="h-3 w-3" />
                                    Complété: {formatDate(check.completed_date)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Progress value={check.compliance_score} className="h-2 w-32 mb-1" />
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
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
                {pendingActions} actions en attente de traitement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {checks
                .filter(c => c.corrective_actions)
                .map(check => {
                  const actions = typeof check.corrective_actions === 'string' 
                    ? JSON.parse(check.corrective_actions) 
                    : check.corrective_actions;
                  
                  return actions?.map((action, idx) => (
                    <div key={`${check.id}-${idx}`} className="p-4 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {action.title || action.description}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Check: {check.check_number}
                          </p>
                          {action.dueDate && (
                            <p className="text-xs text-gray-500">
                              Échéance: {formatDate(action.dueDate)}
                            </p>
                          )}
                        </div>
                        <Badge className={action.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {action.status === 'completed' ? 'Complété' : 'En cours'}
                        </Badge>
                      </div>
                    </div>
                  ));
                })}
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
              {selectedCheck?.check_number}
            </DialogDescription>
          </DialogHeader>

          {selectedCheck && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Score de conformité</p>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedCheck.compliance_score} className="h-2 flex-1" />
                      <span className={`text-2xl font-bold ${getScoreColor(selectedCheck.compliance_score)}`}>
                        {selectedCheck.compliance_score}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Statut</p>
                    <Badge className={getStatusConfig(selectedCheck.check_status).color}>
                      {getStatusConfig(selectedCheck.check_status).label}
                    </Badge>
                  </div>
                </div>

                {selectedCheck.findings && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Anomalies détectées
                    </h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {typeof selectedCheck.findings === 'string' 
                        ? selectedCheck.findings 
                        : JSON.stringify(selectedCheck.findings, null, 2)}
                    </div>
                  </div>
                )}

                {selectedCheck.notes && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCheck.notes}</p>
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
