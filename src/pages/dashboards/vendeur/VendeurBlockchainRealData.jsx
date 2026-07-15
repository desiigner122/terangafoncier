import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Network, Shield, Bitcoin, Wallet, Link2, Award,
  TrendingUp, Users, Globe, Lock, Key, Zap,
  ArrowRight, Copy, ExternalLink, CheckCircle,
  AlertTriangle, Star, Clock, DollarSign, Building,
  Sparkles, QrCode, Eye, Download, Upload, RefreshCw,
  Settings, Info, FileText, Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';
import { toast } from 'sonner';

const VendeurBlockchainRealData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('certificates');
  const [searchTerm, setSearchTerm] = useState('');

  // États
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [walletConnections, setWalletConnections] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    verifiedCertificates: 0,
    pendingCertificates: 0,
    totalTransactions: 0,
    totalValue: 0
  });

  // Charger données blockchain
  useEffect(() => {
    if (user) {
      loadBlockchainData();
      loadWalletConnections();
      loadProperties();
    }
  }, [user]);

  // Index des propriétés du vendeur par id, pour enrichir certificats/transactions
  // (blockchain_certificates et blockchain_transactions ne stockent que property_id)
  const propertiesById = useMemo(() => {
    const map = {};
    properties.forEach(p => { map[p.id] = p; });
    return map;
  }, [properties]);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, location, price, surface, type')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
    }
  };

  const loadBlockchainData = async () => {
    try {
      setLoading(true);

      const [certResult, txResult] = await Promise.all([
        VendeurSupabaseService.getBlockchainCertificates(user.id),
        VendeurSupabaseService.getBlockchainTransactions(user.id, { limit: 100 })
      ]);

      if (!certResult.success) throw new Error(certResult.error || 'Erreur certificats');
      if (!txResult.success) throw new Error(txResult.error || 'Erreur transactions');

      const certs = certResult.data || [];
      const txs = txResult.data || [];

      setCertificates(certs);
      setTransactions(txs);

      // Calculer stats à partir des vraies données (certificate_hash, status, transaction_hash, amount...)
      const verifiedCertificates = certs.filter(c => c.status === 'verified').length;
      const pendingCertificates = certs.filter(c => c.status === 'pending').length;
      const totalValue = txs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      setStats({
        totalCertificates: certs.length,
        verifiedCertificates,
        pendingCertificates,
        totalTransactions: txs.length,
        totalValue
      });
    } catch (error) {
      console.error('Erreur chargement blockchain:', error);
      toast.error('Erreur lors du chargement des données blockchain');
    } finally {
      setLoading(false);
    }
  };

  const loadWalletConnections = async () => {
    try {
      const { data: walletsData, error } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWalletConnections(walletsData || []);
    } catch (error) {
      // Table optionnelle selon l'environnement : on affiche simplement l'état vide plutôt que de fabriquer des wallets
      console.error('Erreur chargement wallets:', error);
      setWalletConnections([]);
    }
  };

  const handleMintNFT = async (propertyId) => {
    if (!propertyId) {
      toast.error('Veuillez sélectionner une propriété');
      return;
    }

    setIsMinting(true);
    try {
      // La certification on-chain (émission réelle d'un hash de certificat sur la blockchain)
      // n'est pas encore câblée côté backend : on informe honnêtement plutôt que de générer
      // un faux hash de transaction.
      toast.info('La certification blockchain de cette propriété sera bientôt disponible.');
    } finally {
      setIsMinting(false);
    }
  };

  const handleVerifyCertificate = async (certificateId) => {
    try {
      const { error } = await supabase
        .from('blockchain_certificates')
        .update({ status: 'verified' })
        .eq('id', certificateId);

      if (error) throw error;

      toast.success('Certificat marqué comme vérifié');
      loadBlockchainData();
    } catch (error) {
      console.error('Erreur vérification:', error);
      toast.error('Erreur lors de la vérification');
    }
  };

  const handleConnectWallet = async (walletType) => {
    // La connexion réelle d'un wallet (MetaMask, WalletConnect...) nécessite une intégration
    // Web3 côté navigateur qui n'est pas encore branchée ici. On ne fabrique plus d'adresse
    // aléatoire : on informe honnêtement l'utilisateur.
    toast.info(`La connexion du wallet ${walletType || ''} sera bientôt disponible.`.trim());
  };

  const handleViewOnChain = (transactionHash) => {
    if (!transactionHash) {
      toast.error('Hash de transaction indisponible');
      return;
    }
    const explorerUrl = `https://polygonscan.com/tx/${transactionHash}`;
    window.open(explorerUrl, '_blank');
    toast.success('🔗 Ouverture de PolygonScan...');
  };

  const handleDownloadCertificate = (certificate) => {
    const property = propertiesById[certificate.property_id];
    const cert = `CERTIFICAT BLOCKCHAIN
======================================
Généré le: ${new Date().toLocaleString('fr-FR')}

PROPRIÉTÉ
---------
Titre: ${property?.title || 'N/A'}
Localisation: ${property?.location || 'N/A'}
Surface: ${property?.surface || 'N/A'} m²
Type: ${property?.type || 'N/A'}
Prix: ${property?.price?.toLocaleString('fr-FR') || 'N/A'} FCFA

BLOCKCHAIN
----------
ID Certificat: ${certificate.id}
Hash du Certificat: ${certificate.certificate_hash || "En attente d'attribution"}
Statut: ${certificate.status || 'N/A'}
Date de création: ${certificate.created_at ? new Date(certificate.created_at).toLocaleString('fr-FR') : 'N/A'}

---
Certificat authentifié par Teranga Foncier
`;

    const blob = new Blob([cert], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificat-${certificate.id}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('📄 Certificat téléchargé');
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatCFA = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      verified: 'bg-green-100 text-green-800 border-green-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getNetworkColor = (network) => {
    const colors = {
      Polygon: 'bg-purple-100 text-purple-800',
      Ethereum: 'bg-blue-100 text-blue-800',
      BSC: 'bg-yellow-100 text-yellow-800'
    };
    return colors[network] || 'bg-gray-100 text-gray-800';
  };

  const filteredCertificates = certificates.filter(cert => {
    const property = propertiesById[cert.property_id];
    const term = searchTerm.toLowerCase();
    return (cert.certificate_hash || '').toLowerCase().includes(term) ||
      (property?.title || '').toLowerCase().includes(term);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Chargement des données blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            Blockchain & NFTs
          </h1>
          <p className="text-gray-600 mt-2">
            Certificats blockchain et NFTs de vos propriétés
          </p>
        </div>
        <Button
          onClick={() => handleConnectWallet('MetaMask')}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Connecter Wallet
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Total Certificats',
            value: stats.totalCertificates,
            icon: FileText,
            color: 'orange',
            trend: null
          },
          {
            label: 'Certificats Vérifiés',
            value: stats.verifiedCertificates,
            icon: Award,
            color: 'green',
            trend: null
          },
          {
            label: 'Transactions',
            value: stats.totalTransactions,
            icon: Activity,
            color: 'blue',
            trend: null
          },
          {
            label: 'Valeur des Transactions',
            value: formatCFA(stats.totalValue),
            icon: DollarSign,
            color: 'purple',
            trend: null
          },
          {
            label: 'En Attente',
            value: stats.pendingCertificates,
            icon: Clock,
            color: 'yellow',
            trend: null
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4" style={{ borderLeftColor: `var(--${stat.color}-500)` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <Badge variant="outline" className="mt-2 text-green-700 bg-green-50">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="certificates">
            <Award className="h-4 w-4 mr-2" />
            Certificats
          </TabsTrigger>
          <TabsTrigger value="mint">
            <Sparkles className="h-4 w-4 mr-2" />
            Certification
          </TabsTrigger>
          <TabsTrigger value="wallets">
            <Wallet className="h-4 w-4 mr-2" />
            Mes Wallets
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
        </TabsList>

        {/* Certificats */}
        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes Certificats Blockchain</CardTitle>
                  <CardDescription>
                    Certificats de propriété enregistrés sur la blockchain
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher un certificat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" onClick={loadBlockchainData}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCertificates.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucun certificat blockchain</p>
                  <Button
                    onClick={() => setActiveTab('mint')}
                    className="bg-gradient-to-r from-orange-500 to-orange-600"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Demander une certification
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCertificates.map((cert, index) => {
                    const property = propertiesById[cert.property_id];
                    return (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            {/* Illustration */}
                            <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 aspect-square">
                              <div className="flex items-center justify-center h-full">
                                <Building className="h-16 w-16 text-orange-400" />
                              </div>
                              <Badge
                                className={`absolute top-2 right-2 ${getStatusColor(cert.status)}`}
                              >
                                {cert.status || 'inconnu'}
                              </Badge>
                            </div>

                            {/* Info certificat */}
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {property?.title || 'Propriété'}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <QrCode className="h-4 w-4" />
                                  <span className="font-mono">
                                    {cert.certificate_hash ? formatAddress(cert.certificate_hash) : "En attente d'attribution"}
                                  </span>
                                  {cert.certificate_hash && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(cert.certificate_hash)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {property?.location && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Localisation:</span>
                                  <span className="text-gray-900">{property.location}</span>
                                </div>
                              )}

                              {property?.price != null && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Valeur du bien:</span>
                                  <span className="font-semibold text-gray-900">
                                    {formatCFA(property.price)}
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Créé le {cert.created_at ? new Date(cert.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                </span>
                              </div>

                              {/* Actions */}
                              <div className="grid grid-cols-2 gap-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVerifyCertificate(cert.id)}
                                  disabled={cert.status === 'verified'}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Vérifier
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadCertificate(cert)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Certificat
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certification */}
        <TabsContent value="mint" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-600" />
                Demander une Certification Blockchain
              </CardTitle>
              <CardDescription>
                Sécurisez la traçabilité de votre propriété sur la blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  La certification blockchain on-chain de vos propriétés arrive bientôt.
                  Vous pourrez alors générer un certificat vérifiable et infalsifiable pour le bien sélectionné.
                </AlertDescription>
              </Alert>

              {/* Formulaire */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Propriété à certifier</label>
                  {properties.length > 0 ? (
                    <select
                      className="w-full p-2 border rounded-lg"
                      onChange={(e) => {
                        const prop = properties.find(p => p.id === e.target.value);
                        setSelectedProperty(prop);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Sélectionner une propriété...</option>
                      {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>
                          {prop.title} - {prop.location} ({prop.price?.toLocaleString('fr-FR')} FCFA)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-center py-4 border rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600">
                        Aucune propriété disponible. Ajoutez une propriété d'abord.
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleMintNFT(selectedProperty?.id)}
                  disabled={isMinting || !selectedProperty?.id}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {isMinting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Envoi de la demande...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Demander la certification
                    </>
                  )}
                </Button>
              </div>

              {/* Process Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Étapes du processus (à venir)</h4>
                <div className="space-y-2">
                  {[
                    { label: '1. Validation de la propriété', done: false },
                    { label: '2. Génération des métadonnées', done: false },
                    { label: '3. Ancrage sur la blockchain', done: false },
                    { label: '4. Confirmation du certificat', done: false }
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {step.done ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={step.done ? 'text-gray-900' : 'text-gray-500'}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mes Wallets */}
        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mes Wallets Connectés</CardTitle>
              <CardDescription>
                Gérez vos connexions de wallets crypto
              </CardDescription>
            </CardHeader>
            <CardContent>
              {walletConnections.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucun wallet connecté</p>
                  <div className="flex gap-2 justify-center">
                    {['MetaMask', 'WalletConnect', 'Coinbase'].map((wallet) => (
                      <Button
                        key={wallet}
                        onClick={() => handleConnectWallet(wallet)}
                        variant="outline"
                      >
                        {wallet}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {walletConnections.map((wallet, index) => (
                    <motion.div
                      key={wallet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <Wallet className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{wallet.wallet_type}</p>
                          <p className="text-sm text-gray-600 font-mono">
                            {formatAddress(wallet.wallet_address)}
                          </p>
                          <Badge className={getNetworkColor(wallet.network)} variant="outline">
                            {wallet.network}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(wallet.wallet_address)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Badge
                          className={wallet.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {wallet.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions blockchain */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Transactions Blockchain</CardTitle>
              <CardDescription>
                Transactions enregistrées sur la blockchain pour vos propriétés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>Aucune transaction blockchain enregistrée pour le moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx, index) => {
                    const property = propertiesById[tx.property_id];
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium">{property?.title || 'Propriété'}</p>
                          <p className="text-sm text-gray-600 font-mono">
                            {formatAddress(tx.transaction_hash)}
                          </p>
                          {tx.block_number != null && (
                            <p className="text-xs text-gray-500">Bloc n° {tx.block_number}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            {tx.created_at ? new Date(tx.created_at).toLocaleString('fr-FR') : ''}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-semibold text-gray-900">{formatCFA(tx.amount)}</span>
                          <Badge className={getStatusColor(tx.status)}>{tx.status || 'inconnu'}</Badge>
                          {tx.transaction_hash && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOnChain(tx.transaction_hash)}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurBlockchainRealData;
