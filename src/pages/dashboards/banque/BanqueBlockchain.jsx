import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Link, 
  Activity, 
  Shield, 
  Eye, 
  Download, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Hash,
  Database,
  Zap,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Bot,
  Settings,
  RefreshCw,
  Fingerprint,
  Key,
  Globe,
  Server,
  Layers,
  UserCheck,
  FileText,
  CreditCard,
  Building2,
  Banknote
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const BanqueBlockchain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchHash, setSearchHash] = useState('');

  // Données blockchain spécifiques aux transactions bancaires de terrains
  const blockchainData = {
    networkStats: {
      totalTransactions: 15847,
      totalBlocks: 892,
      networkHealth: 99.8,
      avgBlockTime: 4.2,
      totalValueLocked: 125000000000 // 125 milliards FCFA
    },
    recentTransactions: [
      {
        id: 'TX-BC-001',
        hash: '0x4a2b8f9c3d1e7820abc456def789012345678901234567890123456789abcdef',
        type: 'Garantie Terrain',
        creditId: 'CR-TER-2024-001',
        amount: 20000000,
        landTitle: 'TF-OUAKAM-457/2023',
        timestamp: '2024-01-25 14:30:25',
        status: 'Confirmé',
        blockNumber: 892,
        confirmations: 12,
        gasUsed: 85000,
        parties: {
          bank: 'CBAO - Agence Plateau',
          borrower: 'Mamadou FALL',
          notary: 'Me Fatou DIAGNE'
        }
      },
      {
        id: 'TX-BC-002',
        hash: '0x7e5d3f2a1c9b8460def123abc789456012345678901234567890abcdef123456',
        type: 'Transfert Garantie',
        creditId: 'CR-TER-2024-002',
        amount: 96000000,
        landTitle: 'TF-PLATEAU-123/2023',
        timestamp: '2024-01-25 13:15:42',
        status: 'En Attente',
        blockNumber: 891,
        confirmations: 6,
        gasUsed: 120000,
        parties: {
          bank: 'BHS - Direction Générale',
          borrower: 'Société SENEGAL INVEST',
          notary: 'Me Amadou NDIAYE'
        }
      },
      {
        id: 'TX-BC-003',
        hash: '0x9c8b7a6e5d4f3210abc789def456123012345678901234567890123456abcdef',
        type: 'Libération Garantie',
        creditId: 'CR-TER-2024-003',
        amount: 45000000,
        landTitle: 'TF-THIES-AG-089/2023',
        timestamp: '2024-01-25 11:48:17',
        status: 'Confirmé',
        blockNumber: 890,
        confirmations: 25,
        gasUsed: 95000,
        parties: {
          bank: 'SGBS - Agence Thiès',
          borrower: 'Coopérative KAOLACK',
          notary: 'Me Khadija SECK'
        }
      }
    ],
    smartContracts: [
      {
        name: 'LandCreditGuarantee',
        address: '0x1a2b3c4d5e6f7890abc123def456789012345678',
        type: 'Garantie Terrain',
        status: 'Actif',
        deployedDate: '2024-01-15',
        totalTransactions: 1247,
        gasOptimization: 87
      },
      {
        name: 'EscrowManager',
        address: '0x9876543210abcdef1234567890abc123def456789',
        type: 'Gestion Séquestre',
        status: 'Actif',
        deployedDate: '2024-01-10',
        totalTransactions: 892,
        gasOptimization: 92
      },
      {
        name: 'CreditValidator',
        address: '0xabcdef123456789012345678901234567890abcdef',
        type: 'Validation Crédit',
        status: 'Test',
        deployedDate: '2024-01-20',
        totalTransactions: 156,
        gasOptimization: 78
      }
    ]
  };

  const handleRefreshNetwork = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Réseau actualisé",
        description: "État du réseau blockchain mis à jour",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleVerifyTransaction = (txHash) => {
    window.safeGlobalToast({
      title: "Transaction vérifiée",
      description: `Hash: ${txHash.substring(0, 20)}...`,
      variant: "success"
    });
  };

  const handleCreateSmartContract = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Smart Contract créé",
        description: "Nouveau contrat intelligent déployé",
        variant: "success"
      });
      setIsLoading(false);
    }, 3000);
  };

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    window.safeGlobalToast({
      title: "Hash copié",
      description: "Hash de transaction copié dans le presse-papier",
      variant: "success"
    });
  };

  const handleExploreTransaction = (txId) => {
    window.safeGlobalToast({
      title: "Explorateur ouvert",
      description: `Détails de ${txId} dans l'explorateur blockchain`,
      variant: "success"
    });
  };

  const handleSecureVault = () => {
    window.safeGlobalToast({
      title: "Coffre-fort sécurisé",
      description: "Accès au coffre-fort blockchain bancaire",
      variant: "success"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmé': return 'bg-green-100 text-green-800';
      case 'En Attente': return 'bg-yellow-100 text-yellow-800';
      case 'Échoué': return 'bg-red-100 text-red-800';
      case 'Actif': return 'bg-blue-100 text-blue-800';
      case 'Test': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Garantie Terrain': return <Shield className="h-4 w-4" />;
      case 'Transfert Garantie': return <CreditCard className="h-4 w-4" />;
      case 'Libération Garantie': return <Unlock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">TerangaChain Banking</h2>
          <p className="text-gray-600 mt-1">
            Blockchain pour la sécurisation des crédits et garanties foncières
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button 
            variant="outline"
            onClick={handleRefreshNetwork}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser Réseau
          </Button>
          <Button 
            variant="outline"
            onClick={handleCreateSmartContract}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Contrat
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={handleSecureVault}
          >
            <Lock className="h-4 w-4 mr-2" />
            Coffre-Fort
          </Button>
        </div>
      </div>

      {/* Statistiques du réseau */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-bold">{blockchainData.networkStats.totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Blocs Minés</p>
                <p className="text-xl font-bold">{blockchainData.networkStats.totalBlocks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Santé Réseau</p>
                <p className="text-xl font-bold">{blockchainData.networkStats.networkHealth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Temps Bloc Moyen</p>
                <p className="text-xl font-bold">{blockchainData.networkStats.avgBlockTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Banknote className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">TVL</p>
                <p className="text-xl font-bold">{(blockchainData.networkStats.totalValueLocked / 1000000000).toFixed(0)}Md</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions Récentes</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="explorer">Explorateur</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Transactions Blockchain Récentes
              </CardTitle>
              <CardDescription>
                Transactions de garanties et crédits terrains sur la blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blockchainData.recentTransactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getTypeIcon(tx.type)}
                          <span className="font-medium">{tx.type}</span>
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Hash de Transaction</p>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {tx.hash.substring(0, 20)}...
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyHash(tx.hash)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Montant</p>
                            <p className="font-medium">{(tx.amount / 1000000).toFixed(1)}M FCFA</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Titre Foncier</p>
                            <p className="font-medium">{tx.landTitle}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Confirmations</p>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{tx.confirmations}</span>
                              <Progress value={(tx.confirmations / 12) * 100} className="w-16 h-2" />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Bloc #{tx.blockNumber}</span>
                            <span>{tx.timestamp}</span>
                            <span>Gas: {tx.gasUsed.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerifyTransaction(tx.hash)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Vérifier
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExploreTransaction(tx.id)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Explorer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Smart Contracts Bancaires
              </CardTitle>
              <CardDescription>
                Contrats intelligents pour la gestion des crédits terrains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blockchainData.smartContracts.map((contract) => (
                  <Card key={contract.address} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{contract.name}</h3>
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Adresse</p>
                              <div className="flex items-center space-x-2">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {contract.address.substring(0, 15)}...
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyHash(contract.address)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">Transactions</p>
                              <p className="font-medium">{contract.totalTransactions.toLocaleString()}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">Optimisation Gas</p>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{contract.gasOptimization}%</span>
                                <Progress value={contract.gasOptimization} className="w-16 h-2" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Examiner
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3 mr-1" />
                            Configurer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explorer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-indigo-600" />
                Explorateur Blockchain
              </CardTitle>
              <CardDescription>
                Rechercher et explorer les transactions blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Rechercher par hash de transaction, adresse, ou bloc..."
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => handleVerifyTransaction(searchHash)}>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold">Réseau Principal</h3>
                      <p className="text-sm text-gray-600">TerangaChain Banking</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Explorer
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <Server className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-semibold">Nœuds Actifs</h3>
                      <p className="text-sm text-gray-600">47 nœuds validateurs</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Surveiller
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <Layers className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <h3 className="font-semibold">API Blockchain</h3>
                      <p className="text-sm text-gray-600">Interface développeur</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Documentation
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueBlockchain;