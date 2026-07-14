import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
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
  Hash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierBlockchain = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    properties: 0,
    certificates: 0,
    transactions: 0
  });

  useEffect(() => {
    loadBlockchainData();
  }, [user]);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        setCertificates([]);
        setTransactions([]);
        setPortfolioStats({ totalValue: 0, properties: 0, certificates: 0, transactions: 0 });
        return;
      }

      const [certsResult, txResult, propsResult] = await Promise.allSettled([
        supabase
          .from('blockchain_certificates')
          .select('id, certificate_hash, status, created_at, properties!inner(id, title, owner_id)')
          .eq('properties.owner_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('blockchain_transactions')
          .select('id, amount, status, transaction_hash, block_number, created_at, properties:property_id(title)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('properties')
          .select('id', { count: 'exact' })
          .eq('owner_id', user.id)
          .limit(0)
      ]);

      const certsData = certsResult.value?.data || [];
      const txData = txResult.value?.data || [];

      const mappedCertificates = certsData.map(cert => ({
        id: cert.id,
        title: 'Certificat blockchain',
        property: cert.properties?.title || 'Propriété',
        hash: cert.certificate_hash,
        status: cert.status || 'pending',
        date: cert.created_at ? new Date(cert.created_at).toLocaleDateString('fr-FR') : '—',
        type: 'ownership'
      }));

      const mappedTransactions = txData.map(tx => ({
        id: tx.id,
        type: 'Transaction',
        property: tx.properties?.title || 'Propriété',
        amount: tx.amount ? `${new Intl.NumberFormat('fr-FR').format(tx.amount)} FCFA` : '-',
        rawAmount: Number(tx.amount) || 0,
        hash: tx.transaction_hash,
        status: tx.status || 'pending',
        confirmations: tx.status === 'confirmed' ? 12 : 0,
        timestamp: tx.created_at ? new Date(tx.created_at).toLocaleString('fr-FR') : '—'
      }));

      setCertificates(mappedCertificates);
      setTransactions(mappedTransactions);
      setPortfolioStats({
        totalValue: mappedTransactions
          .filter(tx => tx.status === 'confirmed')
          .reduce((sum, tx) => sum + tx.rawAmount, 0),
        properties: propsResult.value?.count || 0,
        certificates: mappedCertificates.length,
        transactions: mappedTransactions.length
      });
    } catch (error) {
      console.error('Erreur chargement données blockchain:', error);
      setCertificates([]);
      setTransactions([]);
      setPortfolioStats({ totalValue: 0, properties: 0, certificates: 0, transactions: 0 });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'pending': return Clock;
      case 'confirmed': return Shield;
      default: return AlertTriangle;
    }
  };

  const truncateHash = (hash) => {
    if (!hash) return '—';
    if (hash.length <= 18) return hash;
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Award className="w-4 h-4 mr-2" />
            Nouveau certificat
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Valeur Portfolio</p>
                <p className="text-2xl font-bold text-blue-900">{new Intl.NumberFormat('fr-FR').format(portfolioStats.totalValue)} FCFA</p>
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
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                {transactions.length === 0 && certificates.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Aucune activité blockchain pour le moment</p>
                  </div>
                )}
                {transactions.slice(0, 2).map((tx) => (
                  <div key={`tx-${tx.id}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Database className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {tx.status === 'confirmed' ? 'Transaction confirmée' : 'Transaction en attente'}
                      </p>
                      <p className="text-xs text-slate-600">{tx.amount !== '-' ? `${tx.amount} - ` : ''}{tx.property}</p>
                    </div>
                    <span className="text-xs text-slate-500">{tx.timestamp}</span>
                  </div>
                ))}
                {certificates.slice(0, 2).map((cert) => (
                  <div key={`cert-${cert.id}`} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {cert.status === 'verified' ? 'Certificat vérifié' : 'Certificat en attente'}
                      </p>
                      <p className="text-xs text-slate-600">{cert.property}</p>
                    </div>
                    <span className="text-xs text-slate-500">{cert.date}</span>
                  </div>
                ))}
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
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Authentification 2FA</span>
                    <Badge className="bg-green-100 text-green-800">Activée</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sauvegarde des clés</span>
                    <Badge className="bg-green-100 text-green-800">Sécurisée</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chiffrement avancé</span>
                    <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Certificats vérifiés</span>
                    <span className="text-2xl font-bold text-green-600">
                      {certificates.filter(c => c.status === 'verified').length}/{certificates.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          {certificates.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun certificat blockchain</h3>
                <p className="text-slate-500">Vos certificats de propriété apparaîtront ici une fois émis.</p>
              </CardContent>
            </Card>
          )}
          <div className="space-y-4">
            {certificates.map((cert) => {
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
                            <h3 className="font-semibold text-lg">{cert.title}</h3>
                            <Badge className={getStatusColor(cert.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {cert.status === 'verified' ? 'Vérifié' : 
                               cert.status === 'pending' ? 'En attente' : 'Confirmé'}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-2">{cert.property}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Hash: {truncateHash(cert.hash)}</span>
                            <span>Date: {cert.date}</span>
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
            })}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {transactions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Coins className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune transaction blockchain</h3>
                <p className="text-slate-500">Vos transactions sécurisées apparaîtront ici.</p>
              </CardContent>
            </Card>
          )}
          <div className="space-y-4">
            {transactions.map((tx) => {
              const StatusIcon = getStatusIcon(tx.status);
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
                            <h3 className="font-semibold text-lg">{tx.type}</h3>
                            <Badge className={getStatusColor(tx.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {tx.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-2">{tx.property}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Hash: {truncateHash(tx.hash)}</span>
                            <span>Confirmations: {tx.confirmations}/12</span>
                            <span>{tx.timestamp}</span>
                          </div>
                          {tx.amount !== '-' && (
                            <p className="font-semibold text-green-600 mt-2">{tx.amount}</p>
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
                    
                    {tx.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-600">Progression</span>
                          <span className="text-sm font-medium">{tx.confirmations}/12</span>
                        </div>
                        <Progress value={(tx.confirmations / 12) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Paramètres de sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-600" />
                  Paramètres de Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Authentification biométrique</p>
                      <p className="text-sm text-slate-600">Empreinte digitale</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activée</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Clés de récupération</p>
                      <p className="text-sm text-slate-600">12 mots de passe</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Sauvegardée</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Stockage décentralisé</p>
                      <p className="text-sm text-slate-600">IPFS + Blockchain</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Audit de sécurité
                </Button>
              </CardContent>
            </Card>

            {/* Portefeuille */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-600" />
                  Mon Portefeuille
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-blue-600 mb-1">Adresse du portefeuille</p>
                    <p className="font-mono text-sm font-semibold mb-3">Aucun portefeuille connecté</p>
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline">
                        <QrCode className="w-4 h-4 mr-1" />
                        QR Code
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4 mr-1" />
                        Copier
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Transactions confirmées</span>
                    <span className="font-semibold">{transactions.filter(tx => tx.status === 'confirmed').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Valeur totale</span>
                    <span className="font-semibold text-green-600">{new Intl.NumberFormat('fr-FR').format(portfolioStats.totalValue)} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Certificats</span>
                    <span className="font-semibold text-blue-600">{portfolioStats.certificates}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600">
                    <Upload className="w-4 h-4 mr-1" />
                    Recevoir
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Download className="w-4 h-4 mr-1" />
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierBlockchain;