import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Key,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Copy,
  QrCode,
  Wallet,
  Coins,
  TrendingUp,
  BarChart3,
  Activity,
  Database,
  Link,
  Zap,
  Globe,
  Award,
  Fingerprint,
  Server,
  CreditCard,
  Hash,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const ParticulierBlockchain = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ownedProperties, setOwnedProperties] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadBlockchainData();
    }
  }, [user?.id]);

  const loadBlockchainData = async () => {
    setLoading(true);
    try {
      // Propriétés possédées par l'utilisateur (owner_id)
      const { data: props } = await supabase
        .from('properties')
        .select('id, title, name, location, price')
        .eq('owner_id', user.id);
      const properties = props || [];
      setOwnedProperties(properties);
      const propertyIds = properties.map((p) => p.id);
      const propMap = Object.fromEntries(
        properties.map((p) => [p.id, p.title || p.name || p.location || 'Bien immobilier'])
      );

      // Transactions blockchain de l'utilisateur (user_id)
      const { data: txs } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setTransactions(
        (txs || []).map((t) => ({
          ...t,
          propertyLabel: propMap[t.property_id] || '—'
        }))
      );

      // Certificats blockchain liés aux biens possédés (via property_id)
      if (propertyIds.length > 0) {
        const { data: certs } = await supabase
          .from('blockchain_certificates')
          .select('*')
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false });
        setCertificates(
          (certs || []).map((c) => ({
            ...c,
            propertyLabel: propMap[c.property_id] || '—'
          }))
        );
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error('Erreur chargement blockchain:', error);
      setCertificates([]);
      setTransactions([]);
      setOwnedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Statistiques réelles calculées à partir des données Supabase
  const portfolioValue = ownedProperties.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const portfolioStats = {
    totalValue: portfolioValue,
    properties: ownedProperties.length,
    certificates: certificates.length,
    transactions: transactions.length
  };

  // Activité récente construite à partir des vraies transactions / certificats
  const recentActivity = [
    ...transactions.map((t) => ({
      kind: 'transaction',
      title: t.status === 'confirmed' || t.status === 'completed' ? 'Transaction confirmée' : 'Transaction enregistrée',
      subtitle: t.propertyLabel,
      date: t.created_at
    })),
    ...certificates.map((c) => ({
      kind: 'certificate',
      title: c.status === 'verified' || c.status === 'active' ? 'Certificat vérifié' : 'Certificat enregistré',
      subtitle: c.propertyLabel,
      date: c.created_at
    }))
  ]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  const formatFcfa = (value) =>
    value > 0 ? `${Number(value).toLocaleString('fr-FR')} FCFA` : '—';

  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('fr-FR');
    } catch {
      return '—';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
      case 'active':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'confirmed':
      case 'completed':
        return Shield;
      default:
        return AlertTriangle;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'verified': return 'Vérifié';
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Complété';
      default: return status || 'Inconnu';
    }
  };

  const truncateHash = (hash) => {
    if (!hash) return '—';
    if (hash.length <= 20) return hash;
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Blockchain Immobilier</h1>
          <p className="text-slate-600 mt-1">Sécurité et transparence pour vos transactions immobilières</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <Shield className="w-3 h-3 mr-1" />
            Sécurisé
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Valeur Portfolio</p>
                <p className="text-2xl font-bold text-blue-900">{formatFcfa(portfolioStats.totalValue)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Propriétés</p>
                <p className="text-2xl font-bold text-green-900">{portfolioStats.properties}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Database className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Certificats</p>
                <p className="text-2xl font-bold text-purple-900">{portfolioStats.certificates}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Transactions</p>
                <p className="text-2xl font-bold text-orange-900">{portfolioStats.transactions}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          Chargement des données blockchain...
        </div>
      ) : (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Certificats
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Activity className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">Aucune activité blockchain pour le moment</p>
                  </div>
                ) : (
                  recentActivity.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        item.kind === 'certificate' ? 'bg-green-50' : 'bg-blue-50'
                      }`}
                    >
                      {item.kind === 'certificate' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Database className="w-5 h-5 text-blue-600" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-slate-600">{item.subtitle}</p>
                      </div>
                      <span className="text-xs text-slate-500">{formatDate(item.date)}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Sécurité du portefeuille */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Sécurité du Portefeuille
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  <Lock className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">Tableau de bord de sécurité</p>
                  <p className="text-xs mt-1">Bientôt disponible</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <div className="space-y-4">
            {certificates.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-slate-500">
                  <Award className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">Aucun certificat blockchain</p>
                  <p className="text-sm mt-1">Vos certificats de propriété apparaîtront ici une fois vos biens certifiés.</p>
                </CardContent>
              </Card>
            ) : (
              certificates.map((cert) => {
                const StatusIcon = getStatusIcon(cert.status);
                return (
                  <Card key={cert.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <Award className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">Certificat de propriété</h3>
                              <Badge className={getStatusColor(cert.status)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {getStatusLabel(cert.status)}
                              </Badge>
                            </div>
                            <p className="text-slate-600 mb-2">{cert.propertyLabel}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>Hash: {truncateHash(cert.certificate_hash)}</span>
                              <span>Date: {formatDate(cert.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-slate-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">Aucune transaction blockchain</p>
                  <p className="text-sm mt-1">Vos transactions enregistrées sur la blockchain apparaîtront ici.</p>
                </CardContent>
              </Card>
            ) : (
              transactions.map((tx) => {
                const StatusIcon = getStatusIcon(tx.status);
                const isConfirmed = tx.status === 'confirmed' || tx.status === 'completed';
                return (
                  <Card key={tx.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-green-50 rounded-xl">
                            <Coins className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">Transaction</h3>
                              <Badge className={getStatusColor(tx.status)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {getStatusLabel(tx.status)}
                              </Badge>
                            </div>
                            <p className="text-slate-600 mb-2">{tx.propertyLabel}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>Hash: {truncateHash(tx.transaction_hash)}</span>
                              {tx.block_number != null && <span>Bloc: {tx.block_number}</span>}
                              <span>{formatDate(tx.created_at)}</span>
                            </div>
                            {Number(tx.amount) > 0 && (
                              <p className="font-semibold text-green-600 mt-2">{formatFcfa(tx.amount)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Hash className="w-4 h-4 mr-1" />
                            Explorer
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4 mr-1" />
                            Copier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Paramètres de Sécurité
              </CardTitle>
              <CardDescription>
                Portefeuille crypto, clés de récupération et stockage décentralisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500">
                <Wallet className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">Portefeuille blockchain</p>
                <p className="text-sm mt-1">
                  L'intégration du portefeuille crypto et des paramètres de sécurité avancés sera bientôt disponible.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
};

export default ParticulierBlockchain;
