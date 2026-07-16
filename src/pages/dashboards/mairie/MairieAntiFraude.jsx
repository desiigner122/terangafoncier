import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Brain,
  FileText,
  AlertTriangle,
  CheckCircle,
  Scan,
  Upload,
  Eye,
  Network,
  Clock,
  Download,
  Database,
  Lock,
  FileCheck,
  TrendingUp,
  Archive,
  Award,
  Loader2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Normalise le champ jsonb `parties` de la table disputes vers un tableau
// { name, role, contact }. Gère tableau d'objets, tableau de chaînes ou chaîne JSON.
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
  return arr.map((p) => {
    if (typeof p === 'string') return { name: p, role: '', contact: '' };
    if (!p || typeof p !== 'object') return { name: '—', role: '', contact: '' };
    return {
      name: p.name || p.nom || p.fullName || p.full_name || '—',
      role: p.role || p.type || p.qualite || '',
      contact: p.contact || p.phone || p.telephone || p.email || ''
    };
  });
};

const MairieAntiFraude = ({ dashboardStats }) => {
  const { profile } = useAuth();
  const [selectedTab, setSelectedTab] = useState('scanner');
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState(null);

  // Statistiques anti-fraude issues des tables réelles (properties + disputes)
  const [fraudStats, setFraudStats] = useState({
    validDocuments: 0,      // properties verification_status = 'verified'
    activeDisputes: 0,      // disputes status = 'open'
    resolvedDisputes: 0,    // disputes status = 'resolved'/'closed'
    pendingVerification: 0  // properties verification_status = 'pending'
  });

  // Analyses récentes = litiges réels (disputes)
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  // Statistiques blockchain réelles (comptages)
  const [blockchainStats, setBlockchainStats] = useState({
    transactions: 0,
    certificates: 0
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorData(null);
    try {
      // Filtrage par commune de la mairie si disponible dans le profil
      const communeCity = profile?.city || null;

      let propertiesQuery = supabase
        .from('properties')
        .select('id, verification_status, city');
      if (communeCity) {
        propertiesQuery = propertiesQuery.eq('city', communeCity);
      }

      const [propsRes, disputesRes, txRes, certRes] = await Promise.all([
        propertiesQuery,
        supabase
          .from('disputes')
          .select('id, title, property_id, status, parties, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('blockchain_transactions')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('blockchain_certificates')
          .select('id', { count: 'exact', head: true })
      ]);

      if (propsRes.error) throw propsRes.error;
      if (disputesRes.error) throw disputesRes.error;

      const props = propsRes.data || [];
      const disputes = disputesRes.data || [];

      const validDocuments = props.filter((p) => p.verification_status === 'verified').length;
      const pendingVerification = props.filter((p) => p.verification_status === 'pending').length;
      const activeDisputes = disputes.filter((d) => d.status === 'open').length;
      const resolvedDisputes = disputes.filter((d) => d.status === 'resolved' || d.status === 'closed').length;

      setFraudStats({
        validDocuments,
        activeDisputes,
        resolvedDisputes,
        pendingVerification
      });

      // Mapping litiges -> lignes d'analyse. Les litiges ouverts constituent
      // les cas de suspicion de fraude à traiter, les résolus sont validés.
      const mapped = disputes.slice(0, 10).map((d) => {
        const isResolved = d.status === 'resolved' || d.status === 'closed';
        const parties = normalizeParties(d.parties);
        const partyName = parties.length ? parties.map((p) => p.name).filter(Boolean).join(' vs ') : '—';
        return {
          id: d.id,
          title: d.title || 'Litige sans titre',
          partyName,
          date: d.created_at,
          status: isResolved ? 'validated' : (d.status === 'open' ? 'fraud_detected' : 'pending'),
          riskLevel: isResolved ? 'low' : (d.status === 'open' ? 'high' : 'medium'),
          propertyId: d.property_id || null
        };
      });
      setRecentAnalyses(mapped);

      setBlockchainStats({
        transactions: txRes?.count ?? 0,
        certificates: certRes?.count ?? 0
      });
    } catch (err) {
      console.error('Erreur chargement anti-fraude:', err);
      setErrorData(err.message || 'Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  }, [profile?.city]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800';
      case 'fraud_detected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLabel = (risk) => {
    switch (risk) {
      case 'low': return 'faible';
      case 'medium': return 'moyen';
      case 'high': return 'élevé';
      default: return '—';
    }
  };

  const DocumentScanCard = ({ title, description, icon: Icon }) => (
    <div className="opacity-75">
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          <Icon className="h-12 w-12 text-teal-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          <Badge variant="outline" className="mt-3 text-xs">Bientôt disponible</Badge>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {errorData && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>{errorData}</AlertDescription>
        </Alert>
      )}

      {/* Header avec statistiques anti-fraude réelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Documents Vérifiés</p>
                  <p className="text-2xl font-bold text-green-900">
                    {loading ? '—' : fraudStats.validDocuments}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Litiges Actifs</p>
                  <p className="text-2xl font-bold text-red-900">
                    {loading ? '—' : fraudStats.activeDisputes}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Litiges Résolus</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {loading ? '—' : fraudStats.resolvedDisputes}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">En Vérification</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {loading ? '—' : fraudStats.pendingVerification}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interface principale anti-fraude */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-teal-600" />
            <span>Système Anti-Fraude Municipal</span>
          </CardTitle>
          <CardDescription>
            Suivi de la vérification des documents fonciers et des litiges de la commune
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="scanner">Scanner IA</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="analyses">Analyses</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            {/* Scanner de documents avec IA (fonctionnalité à venir) */}
            <TabsContent value="scanner" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocumentScanCard
                  title="Analyse Document"
                  description="Scanner et analyser un document avec IA"
                  icon={Scan}
                />

                <DocumentScanCard
                  title="Vérification Signature"
                  description="Analyse biométrique des signatures"
                  icon={FileCheck}
                />

                <DocumentScanCard
                  title="Contrôle Tampon"
                  description="Vérification authenticité des tampons"
                  icon={Award}
                />
              </div>

              {/* Zone de scan - fonctionnalité IA non encore branchée */}
              <div className="border-2 border-dashed border-teal-300 bg-teal-50 p-8 rounded-lg text-center">
                <Upload className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-teal-900 mb-2">
                  Analyse IA de documents
                </h3>
                <p className="text-teal-700 mb-4">
                  Le scan automatique des documents par intelligence artificielle
                  sera bientôt disponible. En attendant, consultez l'onglet
                  « Analyses » pour le suivi des litiges en cours.
                </p>
                <Badge variant="outline">Bientôt disponible</Badge>
              </div>
            </TabsContent>

            {/* Vérification Blockchain (comptages réels) */}
            <TabsContent value="blockchain" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6 text-center">
                    <Network className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-purple-900 mb-2">Certificats Blockchain</h3>
                    <p className="text-2xl font-bold text-purple-900">
                      {loading ? '—' : blockchainStats.certificates.toLocaleString('fr-FR')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6 text-center">
                    <Database className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900 mb-2">Transactions</h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {loading ? '—' : blockchainStats.transactions.toLocaleString('fr-FR')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6 text-center">
                    <Lock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-900 mb-2">Documents Vérifiés</h3>
                    <p className="text-2xl font-bold text-green-900">
                      {loading ? '—' : fraudStats.validDocuments.toLocaleString('fr-FR')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Network className="h-4 w-4" />
                <AlertTitle>Blockchain Municipal Teranga</AlertTitle>
                <AlertDescription>
                  Les documents officiels certifiés sont enregistrés sur la blockchain
                  pour garantir leur authenticité et leur traçabilité. Les compteurs
                  ci-dessus reflètent les enregistrements réels.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Analyses récentes = litiges réels */}
            <TabsContent value="analyses" className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Chargement des analyses...
                </div>
              ) : recentAnalyses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p>Aucun litige à analyser pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis, index) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-teal-100 p-2 rounded-lg">
                                <FileText className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{analysis.title}</h4>
                                <p className="text-sm text-gray-600">{analysis.partyName}</p>
                                <p className="text-xs text-gray-500">
                                  {analysis.date ? new Date(analysis.date).toLocaleDateString('fr-FR') : '—'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className={`text-sm ${getRiskColor(analysis.riskLevel)}`}>
                                  Risque: {getRiskLabel(analysis.riskLevel)}
                                </div>
                              </div>

                              <Badge className={getStatusColor(analysis.status)}>
                                {analysis.status === 'validated' ? 'Résolu' :
                                 analysis.status === 'fraud_detected' ? 'En cours' : 'En attente'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Rapports */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rapport Mensuel</h3>
                    <p className="text-sm text-gray-600 mb-4">Statistiques anti-fraude du mois</p>
                    <Button size="sm" disabled>
                      <Download className="h-4 w-4 mr-2" />
                      Bientôt disponible
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Archive className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Archive Analyses</h3>
                    <p className="text-sm text-gray-600 mb-4">Historique complet des vérifications</p>
                    <Button size="sm" variant="outline" onClick={() => setSelectedTab('analyses')}>
                      <Eye className="h-4 w-4 mr-2" />
                      Consulter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MairieAntiFraude;
