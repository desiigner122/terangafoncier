import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Network, 
  Database,
  Key,
  FileCheck,
  Coins,
  Link,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Copy,
  ExternalLink,
  Zap,
  Users,
  TrendingUp,
  Eye,
  Download,
  RefreshCw,
  Plus,
  Wallet,
  History
} from 'lucide-react';

const VendeurBlockchain = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [walletConnected, setWalletConnected] = useState(false);

  const blockchainTabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: Shield },
    { id: 'certificates', name: 'Certificats', icon: FileCheck },
    { id: 'contracts', name: 'Smart Contracts', icon: Network },
    { id: 'transactions', name: 'Transactions', icon: History },
    { id: 'nft', name: 'NFT Propriétés', icon: Coins }
  ];

  const blockchainStats = [
    {
      title: 'Propriétés Certifiées',
      value: '8',
      change: '+2 ce mois',
      icon: Shield,
      color: 'text-green-600'
    },
    {
      title: 'Smart Contracts',
      value: '12',
      change: '+4 actifs',
      icon: Network,
      color: 'text-blue-600'
    },
    {
      title: 'NFT Générés',
      value: '5',
      change: '+1 cette semaine',
      icon: Coins,
      color: 'text-purple-600'
    },
    {
      title: 'Transactions',
      value: '24',
      change: '+6 récentes',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const certificates = [
    {
      id: 1,
      property: 'Villa Moderne Almadies',
      type: 'Titre de Propriété',
      status: 'verified',
      hash: '0x742d35cc6bf4c18e1e4f...a1b2c3d4e5f6',
      issueDate: '2024-01-15',
      verifications: 12,
      blockchain: 'Polygon'
    },
    {
      id: 2,
      property: 'Appartement Plateau',
      type: 'Certificat Urbanisme',
      status: 'pending',
      hash: '0x8a7b6c5d4e3f2g1h0i9j...k8l7m6n5o4p3',
      issueDate: '2024-01-20',
      verifications: 3,
      blockchain: 'Ethereum'
    },
    {
      id: 3,
      property: 'Terrain Saly',
      type: 'Permis de Construire',
      status: 'verified',
      hash: '0x1a2b3c4d5e6f7g8h9i0j...q1w2e3r4t5y6',
      issueDate: '2024-01-10',
      verifications: 8,
      blockchain: 'Polygon'
    }
  ];

  const smartContracts = [
    {
      id: 1,
      name: 'Contrat Vente Villa Almadies',
      address: '0x742d35cc6bf4c18e1e4f9d8c5b3a1234567890',
      status: 'active',
      type: 'Sale Contract',
      value: '85,000,000 FCFA',
      parties: 2,
      lastActivity: '2024-01-20',
      network: 'Polygon'
    },
    {
      id: 2,
      name: 'Escrow Appartement Plateau',
      address: '0x8a7b6c5d4e3f2g1h0i9j8k7l6m5n4o3p2q1r',
      status: 'pending',
      type: 'Escrow Contract',
      value: '45,000,000 FCFA',
      parties: 3,
      lastActivity: '2024-01-18',
      network: 'Ethereum'
    },
    {
      id: 3,
      name: 'Location Maison Parcelles',
      address: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r',
      status: 'completed',
      type: 'Rental Contract',
      value: '500,000 FCFA/mois',
      parties: 2,
      lastActivity: '2024-01-15',
      network: 'Polygon'
    }
  ];

  const transactions = [
    {
      id: 1,
      type: 'Certificate Creation',
      property: 'Villa Almadies',
      hash: '0x1234...5678',
      amount: '0.05 MATIC',
      status: 'confirmed',
      timestamp: '2024-01-20 14:30',
      blockNumber: '42,567,890'
    },
    {
      id: 2,
      type: 'Smart Contract Deploy',
      property: 'Appartement Plateau',
      hash: '0x9876...3210',
      amount: '0.08 ETH',
      status: 'pending',
      timestamp: '2024-01-20 12:15',
      blockNumber: 'Pending...'
    },
    {
      id: 3,
      type: 'NFT Mint',
      property: 'Terrain Saly',
      hash: '0x5678...9012',
      amount: '0.03 MATIC',
      status: 'confirmed',
      timestamp: '2024-01-19 16:45',
      blockNumber: '42,555,123'
    }
  ];

  const nftCollection = [
    {
      id: 1,
      name: 'Villa Almadies #001',
      image: '/api/placeholder/200/200',
      property: 'Villa Moderne Almadies',
      tokenId: '1',
      price: '2.5 ETH',
      status: 'minted',
      views: 234,
      likes: 12
    },
    {
      id: 2,
      name: 'Plateau Luxury #002',
      image: '/api/placeholder/200/200',
      property: 'Appartement Plateau',
      tokenId: '2',
      price: '1.8 ETH',
      status: 'draft',
      views: 89,
      likes: 5
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      verified: { color: 'bg-green-100 text-green-800', text: 'Vérifié' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'En attente' },
      active: { color: 'bg-blue-100 text-blue-800', text: 'Actif' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Terminé' },
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmé' },
      minted: { color: 'bg-purple-100 text-purple-800', text: 'Minté' },
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Brouillon' }
    };
    return badges[status] || badges.pending;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const truncateHash = (hash, start = 6, end = 4) => {
    return `${hash.slice(0, start)}...${hash.slice(-end)}`;
  };

  const renderTabContent = () => {
    switch(selectedTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Wallet Status */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Portefeuille Blockchain</h3>
                      <p className="text-sm text-gray-600">
                        {walletConnected 
                          ? '0x742d35cc6bf4c18e1e4f9d8c5b3a1234567890' 
                          : 'Portefeuille non connecté'
                        }
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setWalletConnected(!walletConnected)}
                    className={walletConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
                  >
                    {walletConnected ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Connecté
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connecter
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <FileCheck className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Certifier Propriété</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Créer un certificat blockchain pour une propriété
                  </p>
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Certifier
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Network className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Smart Contract</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Créer un contrat intelligent pour vos transactions
                  </p>
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Créer Contrat
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Coins className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Créer NFT</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Transformer votre propriété en NFT unique
                  </p>
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Minter NFT
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Network Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-blue-600" />
                  État des Réseaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <div>
                        <p className="font-medium">Polygon</p>
                        <p className="text-sm text-gray-600">Gas: 0.001 MATIC</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Opérationnel
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                      <div>
                        <p className="font-medium">Ethereum</p>
                        <p className="text-sm text-gray-600">Gas: 25 Gwei</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Opérationnel
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'certificates':
        return (
          <div className="space-y-4">
            {certificates.map(cert => (
              <Card key={cert.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">{cert.property}</h3>
                        <Badge className={getStatusBadge(cert.status).color}>
                          {getStatusBadge(cert.status).text}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Type</p>
                          <p className="font-medium">{cert.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Blockchain</p>
                          <p className="font-medium">{cert.blockchain}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date d'émission</p>
                          <p className="font-medium">{cert.issueDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">Hash:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {truncateHash(cert.hash)}
                        </code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(cert.hash)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{cert.verifications}</p>
                        <p className="text-xs text-gray-600">Vérifications</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Explorer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'contracts':
        return (
          <div className="space-y-4">
            {smartContracts.map(contract => (
              <Card key={contract.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Network className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">{contract.name}</h3>
                        <Badge className={getStatusBadge(contract.status).color}>
                          {getStatusBadge(contract.status).text}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Type</p>
                          <p className="font-medium">{contract.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Réseau</p>
                          <p className="font-medium">{contract.network}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Parties</p>
                          <p className="font-medium">{contract.parties} participants</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">Adresse:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {truncateHash(contract.address)}
                        </code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(contract.address)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{contract.value}</p>
                        <p className="text-xs text-gray-600">Valeur</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Explorer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-4">
            {transactions.map(tx => (
              <Card key={tx.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        tx.status === 'confirmed' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {tx.status === 'confirmed' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{tx.type}</h3>
                        <p className="text-xs text-gray-600">{tx.property}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-sm">{tx.amount}</p>
                      <p className="text-xs text-gray-600">{tx.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {truncateHash(tx.hash)}
                      </code>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(tx.hash)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <Badge className={getStatusBadge(tx.status).color}>
                      {getStatusBadge(tx.status).text}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'nft':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nftCollection.map(nft => (
              <Card key={nft.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusBadge(nft.status).color}>
                      {getStatusBadge(nft.status).text}
                    </Badge>
                  </div>
                  <div className="h-full w-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                    <Coins className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-1">{nft.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{nft.property}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-purple-600">{nft.price}</span>
                    <span className="text-sm text-gray-600">Token #{nft.tokenId}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {nft.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {nft.likes}
                    </div>
                  </div>
                  
                  {nft.status === 'minted' ? (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" className="w-full">
                      <Zap className="h-3 w-3 mr-1" />
                      Minter NFT
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certification Blockchain</h1>
          <p className="text-gray-600">Sécurisez vos propriétés avec la technologie blockchain</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Synchroniser
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Certificat
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {blockchainStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b">
        {blockchainTabs.map(tab => (
          <Button
            key={tab.id}
            variant={selectedTab === tab.id ? "default" : "ghost"}
            onClick={() => setSelectedTab(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default VendeurBlockchain;