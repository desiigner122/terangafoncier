import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Download, 
  Eye,
  Hash,
  Layers,
  Database,
  Zap,
  Globe,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  Building,
  MapPin,
  TrendingUp
} from 'lucide-react';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurBlockchain = () => {
  const [activeTab, setActiveTab] = useState('certificates');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Certificats blockchain
  const blockchainCertificates = [
    {
      id: 'cert-001',
      title: 'Résidence Les Almadies',
      type: 'Propriété',
      status: 'Validé',
      blockHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      transactionHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      timestamp: '2024-01-15T10:30:00Z',
      value: 450000,
      location: 'Almadies, Dakar',
      validatedBy: 'Notaire Maître Diop',
      validationDate: '2024-01-15',
      gasUsed: 0.0023,
      confirmations: 1247
    },
    {
      id: 'cert-002',
      title: 'Centre Commercial Liberté 6',
      type: 'Investissement Commercial',
      status: 'Validé',
      blockHash: '0x8e0cade2d1e68b8bf77bc5fbe80cade2d1e68b8bf77bc5fbe8d3d3fc8c22a0296',
      transactionHash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
      timestamp: '2023-08-10T14:20:00Z',
      value: 800000,
      location: 'Liberté 6, Dakar',
      validatedBy: 'Géomètre Expert Sy',
      validationDate: '2023-08-10',
      gasUsed: 0.0031,
      confirmations: 4382
    },
    {
      id: 'cert-003',
      title: 'Lotissement Diamaguène',
      type: 'Terrain',
      status: 'En cours',
      blockHash: 'Pending...',
      transactionHash: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789',
      timestamp: '2024-12-15T09:15:00Z',
      value: 320000,
      location: 'Diamaguène, Sicap',
      validatedBy: 'En attente validation',
      validationDate: null,
      gasUsed: 0.0019,
      confirmations: 12
    }
  ];

  // Historique des transactions
  const transactionHistory = [
    {
      id: 'tx-001',
      type: 'Création Certificat',
      certificateId: 'cert-001',
      hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      block: 18459372,
      timestamp: '2024-01-15T10:30:00Z',
      gas: 0.0023,
      status: 'Confirmé',
      value: 450000,
      from: '0x742d35Cc6532C85B84a0e8C1A87Ef74c4a1f8A9D',
      to: '0x8ba1f109551bD432803012645Hac189451c0078D'
    },
    {
      id: 'tx-002',
      type: 'Validation Notaire',
      certificateId: 'cert-001',
      hash: '0xd4e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab',
      block: 18459375,
      timestamp: '2024-01-15T10:32:00Z',
      gas: 0.0018,
      status: 'Confirmé',
      value: 0,
      from: '0x8ba1f109551bD432803012645Hac189451c0078D',
      to: '0x742d35Cc6532C85B84a0e8C1A87Ef74c4a1f8A9D'
    },
    {
      id: 'tx-003',
      type: 'Mise à jour Valeur',
      certificateId: 'cert-002',
      hash: '0xe5f6789012345678901234567890abcdef1234567890abcdef1234567890abcd',
      block: 18459380,
      timestamp: '2024-01-15T11:45:00Z',
      gas: 0.0015,
      status: 'Confirmé',
      value: 920000,
      from: '0x742d35Cc6532C85B84a0e8C1A87Ef74c4a1f8A9D',
      to: '0x9cb2f210662cE543904013756Ibd290562d1089E'
    }
  ];

  // Métriques de sécurité
  const securityMetrics = {
    totalCertificates: 12,
    validatedCertificates: 10,
    pendingValidation: 2,
    totalValue: 2850000,
    averageConfirmations: 2847,
    lastUpdate: '2024-12-15T14:30:00Z',
    networkUptime: 99.97,
    securityScore: 96
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Validé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Confirmé': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Validé': return <CheckCircle className="w-4 h-4" />;
      case 'Confirmé': return <CheckCircle className="w-4 h-4" />;
      case 'En cours': return <Clock className="w-4 h-4" />;
      case 'Pending': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Toast notification could be added here
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blockchain & Sécurité</h1>
            <p className="text-gray-600">Certification et traçabilité de vos investissements</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              Sécurisé
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Zap className="w-3 h-3 mr-1" />
              Temps réel
            </Badge>
          </div>
        </div>

        {/* Métriques de sécurité */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certificats Totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{securityMetrics.totalCertificates}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {securityMetrics.validatedCertificates} validés
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valeur Sécurisée</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(securityMetrics.totalValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">100% protégé blockchain</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score Sécurité</p>
                  <p className="text-2xl font-bold text-gray-900">{securityMetrics.securityScore}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={securityMetrics.securityScore} className="h-2" />
                <span className="text-sm text-green-600 mt-1">Excellent</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime Réseau</p>
                  <p className="text-2xl font-bold text-gray-900">{securityMetrics.networkUptime}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Disponibilité réseau</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Certificats
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Certificats */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Certificats Blockchain</CardTitle>
                    <CardDescription>
                      Vos investissements certifiés sur la blockchain
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau certificat
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blockchainCertificates.map((cert) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getStatusIcon(cert.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {cert.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(cert.status)}>
                            {cert.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{cert.type}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Valeur</p>
                          <p className="font-semibold">{formatCurrency(cert.value)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Confirmations</p>
                          <p className="font-semibold text-green-600">{cert.confirmations}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Gas utilisé</p>
                          <p className="font-semibold">{cert.gasUsed} ETH</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date création</p>
                          <p className="font-semibold">{formatDate(cert.timestamp)}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Hash Transaction:</span>
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {truncateHash(cert.transactionHash)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(cert.transactionHash)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        {cert.blockHash !== 'Pending...' && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Hash Block:</span>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {truncateHash(cert.blockHash)}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(cert.blockHash)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {cert.validatedBy && (
                            <span>Validé par: <strong>{cert.validatedBy}</strong></span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Explorer
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Transactions</CardTitle>
                <CardDescription>
                  Toutes les transactions blockchain de vos investissements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionHistory.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Hash className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tx.type}</p>
                          <p className="text-sm text-gray-600">Block #{tx.block}</p>
                          <p className="text-xs text-gray-500">{formatDate(tx.timestamp)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                        {tx.value > 0 && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            {formatCurrency(tx.value)}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">Gas: {tx.gas} ETH</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audit de Sécurité</CardTitle>
                  <CardDescription>
                    État de la sécurité de vos actifs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Certificats validés</span>
                      </div>
                      <span className="text-sm font-semibold">{securityMetrics.validatedCertificates}/{securityMetrics.totalCertificates}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">Chiffrement actif</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-5 h-5 text-purple-500" />
                        <span className="text-sm">Multi-signature</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Configuré</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Key className="w-5 h-5 text-orange-500" />
                        <span className="text-sm">Clés privées</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Sécurisées</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métriques Réseau</CardTitle>
                  <CardDescription>
                    Performance du réseau blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Uptime réseau</span>
                        <span className="text-sm font-semibold">{securityMetrics.networkUptime}%</span>
                      </div>
                      <Progress value={securityMetrics.networkUptime} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Confirmations moyennes</span>
                        <span className="text-sm font-semibold">{securityMetrics.averageConfirmations}</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Score sécurité</span>
                        <span className="text-sm font-semibold">{securityMetrics.securityScore}%</span>
                      </div>
                      <Progress value={securityMetrics.securityScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Blockchain</CardTitle>
                <CardDescription>
                  Analyse des performances et utilisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-sm text-gray-600">Transactions totales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">0.147</p>
                    <p className="text-sm text-gray-600">ETH économisé</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">24s</p>
                    <p className="text-sm text-gray-600">Temps moyen validation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestisseurBlockchain;