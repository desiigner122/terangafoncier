import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { 
  Shield,
  Key,
  Lock,
  Database,
  Globe,
  Link,
  QrCode,
  FileCheck,
  Zap,
  TrendingUp,
  Users,
  Building,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Copy,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Server,
  Coins,
  Wallet,
  ArrowUpDown,
  Hash,
  Award,
  Fingerprint,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MairieBlockchain = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  // État de la blockchain (chargé depuis Supabase)
  const [blockchainStatus, setBlockchainStatus] = useState({
    network: 'TerangaChain',
    lastBlock: '—',
    networkHealth: 0,
    gasPrice: '—',
    validators: 0,
    transactions24h: '0',
    municipalNode: '—'
  });

  // Portefeuille municipal (aucune donnée fictive)
  const municipalWallet = {
    address: '—',
    balance: '0',
    privateKey: '****************************************************',
    tokens: []
  };

  // NFTs municipaux
  // municipalNFTs RÉEL depuis Supabase (aucune donnée fictive)
  const [municipalNFTs, setMunicipalNFTs] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('blockchain_certificates').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setMunicipalNFTs(data || []);
      } catch (err) {
        console.warn('municipalNFTs indisponible:', err?.message);
        if (active) setMunicipalNFTs([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Transactions récentes (RÉELLES depuis Supabase)
  const [recentTransactions, setRecentTransactions] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('blockchain_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        if (active) {
          setRecentTransactions((data || []).map((tx) => ({
            id: tx.id,
            hash: tx.transaction_hash || tx.hash || String(tx.id),
            type: tx.transaction_type || tx.type || 'Transaction',
            description: tx.description || tx.transaction_type || 'Transaction blockchain',
            amount: tx.amount != null ? `${tx.amount}` : '—',
            status: tx.status || 'Confirmé',
            timestamp: tx.created_at ? new Date(tx.created_at).toLocaleString('fr-FR') : '—',
            block: tx.block_number != null ? String(tx.block_number) : '—',
            gasUsed: tx.gas_used != null ? String(tx.gas_used) : '—'
          })));
        }
      } catch (err) {
        console.warn('recentTransactions indisponible:', err?.message);
        if (active) setRecentTransactions([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Smart Contracts municipaux (aucune donnée fictive)
  const smartContracts = [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': 
      case 'Confirmé':
      case 'Déployé': 
        return 'bg-green-100 text-green-800';
      case 'En cours':
      case 'Test':
        return 'bg-yellow-100 text-yellow-800';
      case 'Échec':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const truncateHash = (hash, start = 6, end = 4) => {
    return `${hash.slice(0, start)}...${hash.slice(-end)}`;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blockchain Municipal</h2>
          <p className="text-gray-600 mt-1">
            Gestion décentralisée des actifs municipaux sur TerangaChain
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Réseau Actif
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      {/* Indicateurs Blockchain */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">NFTs Municipaux</p>
                <p className="text-2xl font-bold text-blue-600">{municipalNFTs.length}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions 24h</p>
                <p className="text-2xl font-bold text-green-600">{recentTransactions.length}</p>
              </div>
              <ArrowUpDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur Portfolio</p>
                <p className="text-2xl font-bold text-purple-600">—</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Santé Réseau</p>
                <p className="text-2xl font-bold text-orange-600">{blockchainStatus.networkHealth}%</p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* État du réseau */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Réseau TerangaChain opérationnel</strong> - Dernier bloc: {blockchainStatus.lastBlock} | 
          Validateurs actifs: {blockchainStatus.validators} | 
          Prix du gas: {blockchainStatus.gasPrice} TRGA
        </AlertDescription>
      </Alert>

      {/* Tabs Blockchain */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="nfts">NFTs Municipaux</TabsTrigger>
          <TabsTrigger value="wallet">Portefeuille</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
        </TabsList>

        {/* Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Statistiques réseau */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 text-blue-600 mr-2" />
                  État du Réseau TerangaChain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dernier bloc</span>
                    <span className="font-medium">{blockchainStatus.lastBlock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Santé réseau</span>
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">{blockchainStatus.networkHealth}%</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Prix du gas</span>
                    <span className="font-medium">{blockchainStatus.gasPrice} TRGA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Validateurs</span>
                    <span className="font-medium">{blockchainStatus.validators}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transactions 24h</span>
                    <span className="font-medium">{blockchainStatus.transactions24h}</span>
                  </div>
                </div>
                <Progress value={blockchainStatus.networkHealth} className="h-2" />
              </CardContent>
            </Card>

            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  Activité Municipale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {recentTransactions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">Aucune activité récente</p>
                  ) : (
                    recentTransactions.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <Award className="h-5 w-5 text-blue-600 mr-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{tx.description}</p>
                          <p className="text-xs text-gray-600">{tx.timestamp}</p>
                        </div>
                        <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NFTs Municipaux */}
        <TabsContent value="nfts" className="space-y-6">
          {municipalNFTs.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">Aucun NFT municipal enregistré</p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {municipalNFTs.map((nft) => (
              <Card key={nft.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedNFT(nft)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2">{nft.type}</Badge>
                      <CardTitle className="text-lg">{nft.title}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(nft.status)}>
                      {nft.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Propriétaire: {nft.owner}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Surface</span>
                      <p className="font-medium">{nft.surface}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Zone</span>
                      <p className="font-medium">{nft.zone}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-600">Token ID</span>
                    <p className="font-mono text-xs bg-gray-100 p-1 rounded">
                      #{nft.tokenId}
                    </p>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-600">Contrat</span>
                    <p className="font-mono text-xs bg-gray-100 p-1 rounded">
                      {truncateHash(nft.contractAddress)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">{nft.value}€</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Boutons d'action */}
          <div className="flex space-x-3">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Award className="h-4 w-4 mr-2" />
              Créer NFT
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </TabsContent>

        {/* Portefeuille */}
        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations portefeuille */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 text-purple-600 mr-2" />
                  Portefeuille Municipal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Adresse publique</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded flex-1">
                      {municipalWallet.address}
                    </p>
                    <Button size="sm" variant="outline" 
                            onClick={() => copyToClipboard(municipalWallet.address)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Clé privée</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded flex-1">
                      {showPrivateKey ? municipalWallet.privateKey : '****************************************************'}
                    </p>
                    <Button size="sm" variant="outline" 
                            onClick={() => setShowPrivateKey(!showPrivateKey)}>
                      {showPrivateKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {municipalWallet.balance} TRGA
                  </div>
                  <div className="text-sm text-gray-600">Solde principal</div>
                </div>
              </CardContent>
            </Card>

            {/* Tokens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="h-5 w-5 text-yellow-600 mr-2" />
                  Tokens Municipaux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {municipalWallet.tokens.map((token, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {token.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-sm text-gray-600">{token.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{token.balance}</p>
                      <p className="text-sm text-gray-600">{token.value}€</p>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Token
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpDown className="h-5 w-5 text-blue-600 mr-2" />
                Transactions Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">Aucune transaction enregistrée</p>
                )}
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Hash className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{tx.timestamp}</span>
                          <span>Bloc: {tx.block}</span>
                          <span>Gas: {tx.gasUsed}</span>
                        </div>
                        <p className="font-mono text-xs text-gray-500 mt-1">
                          {truncateHash(tx.hash, 10, 8)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(tx.status)}>
                        {tx.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">{tx.amount}</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Explorer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Contracts */}
        <TabsContent value="contracts" className="space-y-6">
          <div className="space-y-4">
            {smartContracts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">Aucun smart contract déployé</p>
            )}
            {smartContracts.map((contract, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{contract.name}</h3>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                        <Badge variant="secondary">v{contract.version}</Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{contract.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">Adresse:</span>
                        <p className="font-mono text-xs bg-gray-100 p-1 rounded">
                          {truncateHash(contract.address, 8, 6)}
                        </p>
                        <Button size="sm" variant="outline" 
                                onClick={() => copyToClipboard(contract.address)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>Interactions: {contract.interactions}</span>
                        <span>Mise à jour: {new Date(contract.lastUpdate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Explorer
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Upload className="h-4 w-4 mr-2" />
            Déployer Nouveau Contrat
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieBlockchain;