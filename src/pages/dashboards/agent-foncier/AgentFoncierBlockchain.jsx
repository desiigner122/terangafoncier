import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Blocks, 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Link,
  Search,
  Hash,
  Clock,
  Eye,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Activity,
  TrendingUp,
  Lock,
  Unlock,
  Server,
  Zap,
  Users,
  Globe,
  Database,
  ChevronRight,
  Info,
  Star,
  Award,
  Cpu,
  HardDrive,
  Network,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const AgentFoncierBlockchain = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchHash, setSearchHash] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [networkStats, setNetworkStats] = useState({
    blockHeight: 2847395,
    hashRate: '145.2 TH/s',
    difficulty: '26.69T',
    pendingTx: 23,
    confirmedTx: 1247,
    gasPrice: '45 gwei'
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
    
    // Simuler mise à jour temps réel
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 3),
        pendingTx: Math.max(0, prev.pendingTx + Math.floor(Math.random() * 5) - 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const documentsBlockchain = [
    {
      id: 1,
      nom: 'TF-2024-001',
      type: 'Titre Foncier',
      hash: '0x1a2b3c4d5e6f789012345678901234567890abcd',
      shortHash: '0x1a2b...abcd',
      statut: 'certifié',
      date: '15/09/2024',
      blockNumber: 2847392,
      confirmations: 156,
      gasUsed: '0.0023 ETH',
      client: 'M. Amadou Diallo',
      valeur: '850M XOF',
      location: 'Almadies, Dakar',
      certificat: 'CERT-2024-TF-001'
    },
    {
      id: 2,
      nom: 'AV-2024-012',
      type: 'Acte de Vente',
      hash: '0x7g8h9i0j1k2l345678901234567890mnop5678qrst',
      shortHash: '0x7g8h...qrst',
      statut: 'en_attente',
      date: '20/09/2024',
      blockNumber: null,
      confirmations: 0,
      gasUsed: 'Pending',
      client: 'Société IMMOGO',
      valeur: '1.2B XOF',
      location: 'Parcelles Assainies',
      certificat: 'Pending'
    },
    {
      id: 3,
      nom: 'PE-2024-089',
      type: 'Permis Environnemental',
      hash: '0xabcd1234efgh5678ijkl9012mnop3456qrst7890',
      shortHash: '0xabcd...7890',
      statut: 'certifié',
      date: '18/09/2024',
      blockNumber: 2847388,
      confirmations: 298,
      gasUsed: '0.0018 ETH',
      client: 'Green Development SARL',
      valeur: '450M XOF',
      location: 'Rufisque',
      certificat: 'CERT-2024-PE-089'
    },
    {
      id: 4,
      nom: 'CC-2024-156',
      type: 'Certificat de Conformité',
      hash: '0x9876543210fedcba0987654321abcdef12345678',
      shortHash: '0x9876...5678',
      statut: 'révoqué',
      date: '10/09/2024',
      blockNumber: 2847350,
      confirmations: 445,
      gasUsed: '0.0031 ETH',
      client: 'M. Cheikh Ba',
      valeur: '320M XOF',
      location: 'Thiès',
      certificat: 'REV-2024-CC-156'
    }
  ];

  const smartContracts = [
    {
      id: 1,
      nom: 'TerangaFoncier_TitleRegistry',
      address: '0xA1B2C3D4E5F6789012345678901234567890ABCD',
      type: 'Registre des Titres',
      status: 'actif',
      deployedAt: '2024-08-15',
      transactions: 1247,
      gasUsed: '12.45 ETH',
      version: '2.1.0'
    },
    {
      id: 2,
      nom: 'TerangaFoncier_Escrow',
      address: '0xEFGH5678IJKL9012MNOP3456QRST7890UVWX1234',
      type: 'Séquestre Automatique',
      status: 'actif',
      deployedAt: '2024-08-20',
      transactions: 89,
      gasUsed: '3.67 ETH',
      version: '1.8.2'
    },
    {
      id: 3,
      nom: 'TerangaFoncier_Validation',
      address: '0x567890ABCDEF123456789012ABCDEF567890ABCD',
      type: 'Validation Documents',
      status: 'maintenance',
      deployedAt: '2024-09-01',
      transactions: 456,
      gasUsed: '7.89 ETH',
      version: '1.5.1'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      hash: '0xa1b2c3d4e5f6789012345678901234567890abcd',
      type: 'Document Certification',
      from: '0x1234...5678',
      to: '0xabcd...ef90',
      value: '0.0023 ETH',
      gasUsed: '21,000',
      timestamp: '2024-09-26 14:32:15',
      status: 'confirmé',
      confirmations: 12
    },
    {
      id: 2,
      hash: '0xb2c3d4e5f6789012345678901234567890abcdef',
      type: 'Smart Contract Call',
      from: '0x5678...9012',
      to: '0xef90...1234',
      value: '0.0018 ETH',
      gasUsed: '45,230',
      timestamp: '2024-09-26 14:28:42',
      status: 'confirmé',
      confirmations: 18
    },
    {
      id: 3,
      hash: '0xc3d4e5f6789012345678901234567890abcdef12',
      type: 'Title Transfer',
      from: '0x9012...3456',
      to: '0x1234...5678',
      value: '0.0031 ETH',
      gasUsed: '67,890',
      timestamp: '2024-09-26 14:15:20',
      status: 'pending',
      confirmations: 0
    }
  ];

  const blockchainMetrics = [
    {
      title: 'Documents Sécurisés',
      value: '1,247',
      change: '+12%',
      icon: Shield,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Transactions Blockchain',
      value: '3,456',
      change: '+8%',
      icon: Activity,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Smart Contracts',
      value: '24',
      change: '+3',
      icon: Cpu,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Certificats Validés',
      value: '892',
      change: '+15%',
      icon: Award,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Ajout d'une notification toast ici si disponible
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Blocks className="h-8 w-8 mr-3 text-blue-600" />
            Blockchain Foncière
          </h1>
          <p className="text-gray-600">Sécurisation avancée et traçabilité complète des documents</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Réseau Actif
          </Badge>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Explorer
          </Button>
        </div>
      </div>

      {/* Métriques Blockchain */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {blockchainMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-green-600 font-medium">{metric.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Statistiques Réseau */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Network className="h-5 w-5 mr-2" />
            État du Réseau Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{networkStats.blockHeight.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Block Height</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{networkStats.hashRate}</div>
              <div className="text-sm text-gray-600">Hash Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{networkStats.difficulty}</div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{networkStats.pendingTx}</div>
              <div className="text-sm text-gray-600">Pending TX</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{networkStats.confirmedTx.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Confirmed TX</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{networkStats.gasPrice}</div>
              <div className="text-sm text-gray-600">Gas Price</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Smart Contracts
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="explorer" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Explorer
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Document Certifié</p>
                        <p className="text-sm text-green-700">TF-2024-001 validé</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-600">Il y a 5 min</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Smart Contract Executé</p>
                        <p className="text-sm text-blue-700">Escrow automatique</p>
                      </div>
                    </div>
                    <span className="text-xs text-blue-600">Il y a 12 min</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Upload className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">Nouveau Document</p>
                        <p className="text-sm text-purple-700">AV-2024-012 en attente</p>
                      </div>
                    </div>
                    <span className="text-xs text-purple-600">Il y a 25 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="h-5 w-5 mr-2" />
                  Statistiques de Stockage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Documents stockés</span>
                      <span className="text-sm font-medium">1,247 / 10,000</span>
                    </div>
                    <Progress value={12.47} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Espace utilisé</span>
                      <span className="text-sm font-medium">2.4 GB / 50 GB</span>
                    </div>
                    <Progress value={4.8} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Bande passante</span>
                      <span className="text-sm font-medium">145 MB / 1 GB</span>
                    </div>
                    <Progress value={14.5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Documents sur Blockchain
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentsBlockchain.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          doc.statut === 'certifié' ? 'bg-green-100' :
                          doc.statut === 'en_attente' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {doc.statut === 'certifié' ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : doc.statut === 'en_attente' ? (
                            <Clock className="h-6 w-6 text-yellow-600" />
                          ) : (
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{doc.nom}</h4>
                          <p className="text-sm text-gray-600 mb-2">{doc.client} • {doc.location}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <span className="ml-2 font-medium">{doc.type}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Valeur:</span>
                              <span className="ml-2 font-medium">{doc.valeur}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Block:</span>
                              <span className="ml-2 font-medium">{doc.blockNumber || 'Pending'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Confirmations:</span>
                              <span className="ml-2 font-medium">{doc.confirmations}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {doc.shortHash}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(doc.hash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={
                          doc.statut === 'certifié' ? 'bg-green-100 text-green-800' :
                          doc.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {doc.statut === 'certifié' ? 'Certifié' :
                           doc.statut === 'en_attente' ? 'En attente' : 'Révoqué'}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Contracts */}
        <TabsContent value="contracts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                Smart Contracts Déployés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smartContracts.map((contract, index) => (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          contract.status === 'actif' ? 'bg-green-100' :
                          contract.status === 'maintenance' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          <Server className={`h-6 w-6 ${
                            contract.status === 'actif' ? 'text-green-600' :
                            contract.status === 'maintenance' ? 'text-yellow-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{contract.nom}</h4>
                          <p className="text-sm text-gray-600">{contract.type}</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {contract.address}
                          </code>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          contract.status === 'actif' ? 'bg-green-100 text-green-800' :
                          contract.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {contract.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-2">
                          <div>v{contract.version}</div>
                          <div>{contract.transactions} TX</div>
                          <div>{contract.gasUsed} Gas</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Transactions Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        tx.status === 'confirmé' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-sm">{tx.type}</div>
                        <code className="text-xs text-gray-500 font-mono">{tx.hash}</code>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{tx.value}</div>
                      <div className="text-gray-500">{tx.confirmations} confirmations</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Explorer */}
        <TabsContent value="explorer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Explorateur Blockchain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Rechercher par hash, adresse, ou numéro de bloc..."
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col justify-center">
                    <Hash className="h-6 w-6 mb-2" />
                    Recherche par Hash
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col justify-center">
                    <Blocks className="h-6 w-6 mb-2" />
                    Explorer les Blocs
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col justify-center">
                    <Globe className="h-6 w-6 mb-2" />
                    Adresses
                  </Button>
                </div>
                
                {searchHash && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Résultats de recherche</h4>
                    <p className="text-sm text-blue-700">
                      Recherche en cours pour: <code className="bg-blue-100 px-2 py-1 rounded">{searchHash}</code>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AgentFoncierBlockchain;