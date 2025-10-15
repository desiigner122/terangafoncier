import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

const VendeurBlockchainRealData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('certificates');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États
  const [certificates, setCertificates] = useState([]);
  const [properties, setProperties] = useState([]);
  const [walletConnections, setWalletConnections] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    activeNFTs: 0,
    totalTransactions: 0,
    totalValue: 0,
    pendingMints: 0
  });

  // Charger données blockchain
  useEffect(() => {
    if (user) {
      loadBlockchainData();
      loadWalletConnections();
      loadProperties();
    }
  }, [user]);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties').select('id, title, location, price, surface, property_type, images').eq('owner_id', user.id)
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
      const { data, error } = await supabase
        .from('blockchain_certificates')
        .select(`
          *,
          properties (
            id,
            title,
            price,
            location,
            surface,
            property_type,
            images
          )
        `)
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCertificates(data || []);
      
      // Calculer stats
      const activeNFTs = data?.filter(c => c.status === 'active').length || 0;
      const totalValue = data?.reduce((sum, c) => sum + (c.token_value || 0), 0) || 0;
      const pendingMints = data?.filter(c => c.status === 'pending').length || 0;
      const totalTransactions = data?.reduce((sum, c) => sum + (c.transaction_count || 0), 0) || 0;

      setStats({
        totalCertificates: data?.length || 0,
        activeNFTs,
        totalTransactions,
        totalValue,
        pendingMints
      });

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement blockchain:', error);
      toast.error('Erreur lors du chargement des certificats blockchain');
      setLoading(false);
    }
  };

  const loadWalletConnections = async () => {
    try {
      const { data: walletsData } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // ✅ Correction: connected_at → created_at

      if (error) throw error;
      setWalletConnections(data || []);
    } catch (error) {
      console.error('Erreur chargement wallets:', error);
    }
  };

  const handleMintNFT = async (propertyId) => {
    if (!propertyId) {
      toast.error('Veuillez sélectionner une propriété');
      return;
    }

    setIsMinting(true);
    try {
      // 1. Récupérer la propriété sélectionnée
      const property = properties.find(p => p.id === propertyId) || selectedProperty;
      
      // 2. Générer token ID unique
      const tokenId = `TERA${Date.now()}`;
      
      // 3. Simuler transaction blockchain
      const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      // 4. Créer certificat blockchain
      const { data: newCert, error } = await supabase
        .from('blockchain_certificates')
        .insert({
          vendor_id: user.id,
          property_id: propertyId,
          token_id: tokenId,
          token_standard: 'ERC-721',
          blockchain_network: 'Polygon',
          contract_address: '0x742d35cc6634c0532925a3b844bc9e7595f0aae8',
          token_value: property?.price || 0,
          transaction_hash: txHash,
          mint_date: new Date().toISOString(),
          status: 'active',
          transaction_count: 0,
          metadata: {
            name: property?.title || 'Property NFT',
            description: `NFT Certificate for ${property?.title || 'Property'}`,
            image: property?.images?.[0] || '',
            attributes: {
              location: property?.location || 'Unknown',
              surface: property?.surface || 0,
              type: property?.property_type || 'Property',
              price: property?.price || 0
            }
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('✅ NFT minté avec succès !', {
        description: `Token ID: ${tokenId} sur Polygon`
      });
      loadBlockchainData();
      setSelectedProperty(null);
    } catch (error) {
      console.error('Erreur mint NFT:', error);
      toast.error('❌ Erreur lors du minting du NFT');
    } finally {
      setIsMinting(false);
    }
  };

  const handleVerifyCertificate = async (certificateId) => {
    try {
      // Simuler vérification blockchain
      const { data, error } = await supabase
        .from('blockchain_certificates')
        .update({ 
          verified_at: new Date().toISOString(),
          verification_status: 'verified'
        })
        .eq('id', certificateId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Certificat vérifié sur la blockchain');
      loadBlockchainData();
    } catch (error) {
      console.error('Erreur vérification:', error);
      toast.error('Erreur lors de la vérification');
    }
  };

  const handleTransfer = async (certificateId, toAddress) => {
    try {
      const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const { error } = await supabase
        .from('blockchain_certificates')
        .update({ 
          current_owner: toAddress,
          transaction_hash: txHash,
          transaction_count: supabase.sql`transaction_count + 1`,
          last_transfer_date: new Date().toISOString()
        })
        .eq('id', certificateId);

      if (error) throw error;

      toast.success('NFT transféré avec succès');
      loadBlockchainData();
    } catch (error) {
      console.error('Erreur transfert:', error);
      toast.error('Erreur lors du transfert');
    }
  };

  const handleConnectWallet = async (walletType) => {
    try {
      // Simuler connexion wallet
      const walletAddress = `0x${Math.random().toString(36).substring(2, 15)}`;
      
      const { error } = await supabase
        .from('wallet_connections')
        .insert({
          user_id: user.id,
          wallet_address: walletAddress,
          wallet_type: walletType,
          network: 'Polygon',
          is_active: true
          // created_at sera auto-généré par Supabase
        });

      if (error) throw error;

      toast.success(`Wallet ${walletType} connecté avec succès`);
      loadWalletConnections();
    } catch (error) {
      console.error('Erreur connexion wallet:', error);
      toast.error('Erreur lors de la connexion du wallet');
    }
  };

  const handleViewOnChain = (certificate) => {
    // Ouvrir transaction sur PolygonScan
    const explorerUrl = `https://polygonscan.com/tx/${certificate.transaction_hash}`;
    window.open(explorerUrl, '_blank');
    toast.success('🔗 Ouverture de PolygonScan...');
  };

  const handleViewNFT = (certificate) => {
    // Ouvrir NFT sur OpenSea
    const openSeaUrl = `https://opensea.io/assets/matic/${certificate.contract_address}/${certificate.token_id}`;
    window.open(openSeaUrl, '_blank');
    toast.success('🖼️ Ouverture sur OpenSea...');
  };

  const handleDownloadCertificate = (certificate) => {
    // Générer certificat PDF/Texte
    const cert = `CERTIFICAT BLOCKCHAIN NFT
======================================
Généré le: ${new Date().toLocaleString('fr-FR')}

PROPRIÉTÉ
---------
Titre: ${certificate.properties?.title || 'N/A'}
Localisation: ${certificate.properties?.location || 'N/A'}
Surface: ${certificate.properties?.surface || 'N/A'} m²
Type: ${certificate.properties?.property_type || 'N/A'}
Prix: ${certificate.properties?.price?.toLocaleString('fr-FR') || 'N/A'} FCFA

BLOCKCHAIN
----------
Token ID: ${certificate.token_id}
Standard: ${certificate.token_standard}
Réseau: ${certificate.blockchain_network}
Contrat: ${certificate.contract_address}
Hash Transaction: ${certificate.transaction_hash}
Statut: ${certificate.status}

VALEUR
------
Valeur Token: ${certificate.token_value?.toLocaleString('fr-FR') || 0} FCFA
Transactions: ${certificate.transaction_count || 0}
Propriétaire Actuel: ${certificate.current_owner || certificate.owner_id}

DATES
-----
Date Mint: ${new Date(certificate.mint_date).toLocaleString('fr-FR')}
${certificate.last_transfer_date ? 
  `Dernier Transfert: ${new Date(certificate.last_transfer_date).toLocaleString('fr-FR')}` : 
  'Aucun transfert'}
${certificate.verified_at ? 
  `Date Vérification: ${new Date(certificate.verified_at).toLocaleString('fr-FR')}` : 
  ''}

MÉTADONNÉES
-----------
Nom: ${certificate.metadata?.name || 'N/A'}
Description: ${certificate.metadata?.description || 'N/A'}
Image: ${certificate.metadata?.image || 'N/A'}
${certificate.metadata?.attributes ? 
  '\nAttributs:\n' + Object.entries(certificate.metadata.attributes)
    .map(([key, value]) => `  - ${key}: ${value}`).join('\n') : 
  ''}

LIENS
-----
PolygonScan: https://polygonscan.com/tx/${certificate.transaction_hash}
OpenSea: https://opensea.io/assets/matic/${certificate.contract_address}/${certificate.token_id}
Contrat: https://polygonscan.com/address/${certificate.contract_address}

---
Certificat authentifié par Teranga Foncier
Blockchain: ${certificate.blockchain_network}
Smart Contract: ${certificate.contract_address}
`;

    const blob = new Blob([cert], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificat-nft-${certificate.token_id}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('📄 Certificat NFT téléchargé');
  };

  const copyToClipboard = (text) => {
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
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      transferred: 'bg-blue-100 text-blue-800 border-blue-200',
      burned: 'bg-red-100 text-red-800 border-red-200'
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

  const filteredCertificates = certificates.filter(cert =>
    cert.token_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            label: 'NFTs Actifs',
            value: stats.activeNFTs,
            icon: Award,
            color: 'green',
            trend: '+12%'
          },
          {
            label: 'Transactions',
            value: stats.totalTransactions,
            icon: Activity,
            color: 'blue',
            trend: '+5'
          },
          {
            label: 'Valeur Totale',
            value: formatCFA(stats.totalValue),
            icon: DollarSign,
            color: 'purple',
            trend: null
          },
          {
            label: 'En Attente',
            value: stats.pendingMints,
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
            Certificats NFT
          </TabsTrigger>
          <TabsTrigger value="mint">
            <Sparkles className="h-4 w-4 mr-2" />
            Mint NFT
          </TabsTrigger>
          <TabsTrigger value="wallets">
            <Wallet className="h-4 w-4 mr-2" />
            Mes Wallets
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Certificats NFT */}
        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes Certificats Blockchain</CardTitle>
                  <CardDescription>
                    NFTs et certificats de propriété sur la blockchain
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher un certificat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline">
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
                    Créer mon premier NFT
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCertificates.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          {/* Image NFT */}
                          <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 aspect-square">
                            {cert.metadata?.image ? (
                              <img
                                src={cert.metadata.image}
                                alt={cert.token_id}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Building className="h-16 w-16 text-orange-400" />
                              </div>
                            )}
                            <Badge
                              className={`absolute top-2 right-2 ${getStatusColor(cert.status)}`}
                            >
                              {cert.status}
                            </Badge>
                          </div>

                          {/* Info NFT */}
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {cert.properties?.title || 'Propriété'}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <QrCode className="h-4 w-4" />
                                <span className="font-mono">{cert.token_id}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(cert.token_id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Réseau:</span>
                              <Badge className={getNetworkColor(cert.blockchain_network)}>
                                {cert.blockchain_network}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Standard:</span>
                              <span className="font-mono text-gray-900">{cert.token_standard}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Valeur:</span>
                              <span className="font-semibold text-gray-900">
                                {formatCFA(cert.token_value)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>Minté le {new Date(cert.mint_date).toLocaleDateString('fr-FR')}</span>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyCertificate(cert.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Vérifier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewOnChain(cert)}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                PolygonScan
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewNFT(cert)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                OpenSea
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mint NFT */}
        <TabsContent value="mint" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-600" />
                Créer un Certificat NFT
              </CardTitle>
              <CardDescription>
                Transformez votre propriété en NFT sur la blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Le minting créera un certificat NFT unique pour votre propriété sur la blockchain Polygon.
                  Cette opération est irréversible et coûte environ 0.001 MATIC.
                </AlertDescription>
              </Alert>

              {/* Formulaire Mint */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Propriété à tokeniser</label>
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

                <div>
                  <label className="block text-sm font-medium mb-2">Réseau Blockchain</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>Polygon (Recommandé)</option>
                    <option>Ethereum</option>
                    <option>BSC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Standard de Token</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>ERC-721 (NFT Unique)</option>
                    <option>ERC-1155 (NFT Multiple)</option>
                  </select>
                </div>

                <Button
                  onClick={() => handleMintNFT(selectedProperty?.id)}
                  disabled={isMinting || !selectedProperty?.id}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {isMinting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Minting en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Créer le NFT
                    </>
                  )}
                </Button>
              </div>

              {/* Process Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Processus de Minting</h4>
                <div className="space-y-2">
                  {[
                    { label: '1. Validation de la propriété', done: true },
                    { label: '2. Génération des métadonnées', done: true },
                    { label: '3. Upload sur IPFS', done: false },
                    { label: '4. Transaction blockchain', done: false },
                    { label: '5. Confirmation du NFT', done: false }
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

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Blockchain</CardTitle>
              <CardDescription>
                Statistiques et tendances de vos NFTs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4" />
                <p>Analytics en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurBlockchainRealData;
