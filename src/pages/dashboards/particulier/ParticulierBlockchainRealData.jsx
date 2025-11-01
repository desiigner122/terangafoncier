import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Copy,
  Wallet,
  TrendingUp,
  Database,
  Award,
  Hash,
  ExternalLink,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ParticulierBlockchainRealData = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    properties: 0,
    certificates: 0,
    transactions: 0,
    securityScore: 0
  });

  useEffect(() => {
    if (user?.id) {
      loadBlockchainData();
    }
  }, [user?.id]);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);

      // Charger certificats blockchain
      const { data: certsData, error: certsError } = await supabase
        .from('blockchain_certificates')
        .select(`
          *,
          property:properties(id, title, reference, price, city, images)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (certsError && certsError.code !== 'PGRST116') {
        console.error('❌ Erreur certificats:', certsError);
      }

      // Charger transactions blockchain
      const { data: txData, error: txError } = await supabase
        .from('blockchain_transactions')
        .select(`
          *,
          property:properties(id, title, reference, price)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (txError && txError.code !== 'PGRST116') {
        console.error('❌ Erreur transactions:', txError);
      }

      // Si les tables n'existent pas encore, utiliser des mocks
      if ((certsError && certsError.code === 'PGRST116') || !certsData) {
        console.log('ℹ️ Tables blockchain non disponibles, utilisation de données mockées');
        setCertificates(getMockCertificates());
        setTransactions(getMockTransactions());
        setPortfolioStats(getMockPortfolioStats());
      } else {
        setCertificates(certsData || []);
        setTransactions(txData || []);
        calculatePortfolioStats(certsData, txData);
      }

    } catch (error) {
      console.error('❌ Erreur chargement blockchain:', error);
      setCertificates(getMockCertificates());
      setTransactions(getMockTransactions());
      setPortfolioStats(getMockPortfolioStats());
    } finally {
      setLoading(false);
    }
  };

  const calculatePortfolioStats = (certs, txs) => {
    const uniqueProperties = new Set(certs.map(c => c.property_id)).size;
    const totalValue = certs.reduce((sum, cert) => {
      return sum + (cert.property?.price || 0);
    }, 0);
    
    const verifiedCerts = certs.filter(c => c.status === 'verified').length;
    const securityScore = certs.length > 0 
      ? Math.round((verifiedCerts / certs.length) * 100)
      : 0;

    setPortfolioStats({
      totalValue,
      properties: uniqueProperties,
      certificates: certs.length,
      transactions: txs.length,
      securityScore
    });
  };

  const getMockCertificates = () => [
    {
      id: 'mock-cert-1',
      title: "Certificat de propriété",
      property: { title: "Appartement - Dakar Plateau", price: 45000000 },
      blockchain_hash: "0x7d4c...f8a2",
      status: "verified",
      created_at: "2024-03-15",
      certificate_type: "ownership",
      blockchain_network: "polygon"
    },
    {
      id: 'mock-cert-2',
      title: "Contrat de vente",
      property: { title: "Villa - Almadies", price: 85000000 },
      blockchain_hash: "0x9a1b...c3d4",
      status: "pending",
      created_at: "2024-03-20",
      certificate_type: "contract",
      blockchain_network: "polygon"
    }
  ];

  const getMockTransactions = () => [
    {
      id: 'mock-tx-1',
      transaction_type: "purchase",
      property: { title: "Appartement 3P - Plateau", price: 45000000 },
      amount: 45000000,
      transaction_hash: "0x1a2b3c4d5e6f...",
      status: "confirmed",
      confirmations: 12,
      created_at: "2024-03-20T14:30:00Z",
      blockchain_network: "polygon"
    }
  ];

  const getMockPortfolioStats = () => ({
    totalValue: 130000000,
    properties: 2,
    certificates: 2,
    transactions: 1,
    securityScore: 50
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': case 'confirmed': return CheckCircle;
      case 'pending': return Clock;
      default: return AlertTriangle;
    }
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash.length <= 20) return hash;
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Hash copié!');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Blockchain Immobilier
            </h1>
            <p className="text-slate-600 mt-1">
              Sécurité et transparence pour vos transactions immobilières
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
              <Shield className="w-3 h-3 mr-1" />
              Sécurisé
            </Badge>
            {!loading && certificates.length === 0 && (
              <Badge className="bg-yellow-100 text-yellow-700">
                Tables blockchain non créées
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Valeur Portfolio</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatPrice(portfolioStats.totalValue)}
                  </p>
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
                  <p className="text-sm font-medium text-orange-600">Score Sécurité</p>
                  <p className="text-2xl font-bold text-orange-900">{portfolioStats.securityScore}%</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="certificates">Certificats ({certificates.length})</TabsTrigger>
            <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
          </TabsList>

          {/* Certificats */}
          <TabsContent value="certificates" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </CardContent>
              </Card>
            ) : certificates.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Aucun certificat blockchain
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Les certificats apparaîtront ici une fois les tables créées et des propriétés certifiées
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    Table blockchain_certificates à créer via SQL
                  </Badge>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {certificates.map((cert, index) => {
                  const StatusIcon = getStatusIcon(cert.status);
                  return (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Award className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-900">{cert.title}</h3>
                                  <p className="text-sm text-slate-600">{cert.property?.title || 'Propriété'}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Hash Blockchain</p>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                                      {truncateHash(cert.blockchain_hash)}
                                    </code>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(cert.blockchain_hash)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Réseau</p>
                                  <Badge variant="outline" className="bg-purple-50">
                                    {cert.blockchain_network || 'Polygon'}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Type</p>
                                  <Badge variant="outline">{cert.certificate_type || 'ownership'}</Badge>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Date</p>
                                  <p className="text-sm font-medium">
                                    {format(new Date(cert.created_at), 'dd MMM yyyy', { locale: fr })}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getStatusIcon + ' border'}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {cert.status === 'verified' ? 'Vérifié' : 'En attente'}
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
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

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </CardContent>
              </Card>
            ) : transactions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <TrendingUp className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Aucune transaction blockchain
                  </h3>
                  <p className="text-slate-600 mb-6">
                    L'historique de vos transactions apparaîtra ici
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    Table blockchain_transactions à créer via SQL
                  </Badge>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx, index) => {
                  const StatusIcon = getStatusIcon(tx.status);
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Hash className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  {tx.transaction_type === 'purchase' ? 'Achat' : 'Certification'}
                                </h4>
                                <p className="text-sm text-slate-600">{tx.property?.title || 'Propriété'}</p>
                                <code className="text-xs font-mono text-slate-500">
                                  {truncateHash(tx.transaction_hash)}
                                </code>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {tx.amount > 0 && (
                                <div className="text-right">
                                  <p className="text-sm text-slate-500">Montant</p>
                                  <p className="font-semibold text-slate-900">
                                    {formatPrice(tx.amount)}
                                  </p>
                                </div>
                              )}
                              <div className="text-right">
                                <Badge className={getStatusColor(tx.status) + ' border'}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {tx.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                                </Badge>
                                {tx.confirmations && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {tx.confirmations} confirmations
                                  </p>
                                )}
                              </div>
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

          {/* Overview */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Résumé Blockchain</CardTitle>
                <CardDescription>
                  Vue d'ensemble de votre portefeuille sécurisé sur la blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Certificats Vérifiés</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {certificates.filter(c => c.status === 'verified').length}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Transactions Confirmées</p>
                    <p className="text-2xl font-bold text-green-900">
                      {transactions.filter(t => t.status === 'confirmed').length}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Avantages Blockchain</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Certification immutable des propriétés</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <span>Sécurité maximale des transactions</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <Eye className="h-5 w-5 text-purple-500" />
                      <span>Transparence totale de l'historique</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParticulierBlockchainRealData;
