import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Blocks, 
  FileText, 
  Key,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Building,
  Zap,
  Lock,
  Unlock,
  QrCode,
  Download,
  Upload,
  Eye,
  Copy,
  RefreshCw,
  Settings,
  Award,
  Verified,
  Globe,
  Database,
  Network,
  Hash,
  Link2,
  Fingerprint
} from 'lucide-react';

const PromoteurBlockchain = () => {
  const [activeTab, setActiveTab] = useState('certificates');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Certificats blockchain
  const certificates = [
    {
      id: 1,
      type: 'Titre de Propriété',
      project: 'Résidence Teranga',
      unit: 'Appartement 3A-205',
      owner: 'Moussa Ba',
      hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      blockNumber: 18457392,
      timestamp: '2024-11-30T14:30:00Z',
      status: 'Validé',
      value: 85000000,
      gasUsed: 0.0023,
      confirmations: 156,
      ipfsHash: 'QmX7Y8Z9A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T',
      verificationLevel: 'Triple validation'
    },
    {
      id: 2,
      type: 'Contrat de Vente',
      project: 'Villa Duplex Mermoz',
      unit: 'Villa B-102',
      owner: 'Aminata Diop',
      hash: '0x9876543210fedcba0987654321fedcba09876543',
      blockNumber: 18455821,
      timestamp: '2024-11-28T09:15:00Z',
      status: 'En attente',
      value: 65000000,
      gasUsed: 0.0019,
      confirmations: 89,
      ipfsHash: 'QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W',
      verificationLevel: 'Double validation'
    },
    {
      id: 3,
      type: 'Permis de Construire',
      project: 'Appartements VDN',
      unit: 'Ensemble immobilier',
      owner: 'Teranga Foncier SARL',
      hash: '0xabcdef1234567890abcdef1234567890abcdef12',
      blockNumber: 18452156,
      timestamp: '2024-11-25T16:45:00Z',
      status: 'Validé',
      value: 0,
      gasUsed: 0.0031,
      confirmations: 234,
      ipfsHash: 'QmZ9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0F9E8D',
      verificationLevel: 'Validation gouvernementale'
    },
    {
      id: 4,
      type: 'Certificat de Conformité',
      project: 'Entrepôt Logistics',
      unit: 'Bâtiment principal',
      owner: 'Logistics Corp',
      hash: '0x5555666677778888999900001111222233334444',
      blockNumber: 18448792,
      timestamp: '2024-11-20T11:20:00Z',
      status: 'Révoqué',
      value: 0,
      gasUsed: 0.0015,
      confirmations: 445,
      ipfsHash: 'QmP1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L',
      verificationLevel: 'Validation technique'
    }
  ];

  // Transactions récentes
  const transactions = [
    {
      id: 1,
      type: 'Émission certificat',
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      from: 'Teranga Foncier',
      to: 'Moussa Ba',
      amount: 0.0023,
      timestamp: '2024-12-11T10:30:00Z',
      status: 'Confirmé',
      confirmations: 12,
      gasPrice: 25.5,
      blockHeight: 18459871
    },
    {
      id: 2,
      type: 'Transfert propriété',
      hash: '0xabcdef1234567890abcdef1234567890abcdef12',
      from: 'Aminata Diop',
      to: 'Ibrahima Sarr',
      amount: 0.0019,
      timestamp: '2024-12-11T09:15:00Z',
      status: 'En attente',
      confirmations: 3,
      gasPrice: 23.8,
      blockHeight: 18459845
    },
    {
      id: 3,
      type: 'Validation document',
      hash: '0x9876543210fedcba0987654321fedcba09876543',
      from: 'Notaire Sénégal',
      to: 'Blockchain Registry',
      amount: 0.0031,
      timestamp: '2024-12-11T08:45:00Z',
      status: 'Confirmé',
      confirmations: 25,
      gasPrice: 27.2,
      blockHeight: 18459823
    }
  ];

  // Métriques blockchain
  const blockchainMetrics = {
    totalCertificates: 127,
    validatedCertificates: 98,
    pendingTransactions: 8,
    totalTransactions: 1456,
    networkFees: 2.45,
    securityScore: 98.7,
    uptimePercentage: 99.94,
    averageConfirmationTime: 12.5
  };

  // Smart contracts déployés
  const smartContracts = [
    {
      id: 1,
      name: 'PropertyRegistry',
      address: '0x742d35Cc6554C1A2F2b0b8B9C7bA8E1C9A5F2E3D',
      type: 'Registre des propriétés',
      status: 'Actif',
      transactions: 324,
      lastActivity: '2024-12-11T10:30:00Z',
      gasUsed: 15.23,
      version: 'v2.1.0'
    },
    {
      id: 2,
      name: 'SalesContract',
      address: '0x8E3D2F1A9B7C6554E2F3D1C9A5B8E7F4A3B2C1D0',
      type: 'Contrats de vente',
      status: 'Actif',
      transactions: 156,
      lastActivity: '2024-12-11T09:15:00Z',
      gasUsed: 8.67,
      version: 'v1.8.2'
    },
    {
      id: 3,
      name: 'DocumentVerification',
      address: '0xF4A3B2C1D09E8D7C6B5A49382716E5D4C3B2A190',
      type: 'Vérification documents',
      status: 'Maintenance',
      transactions: 89,
      lastActivity: '2024-12-10T16:20:00Z',
      gasUsed: 4.12,
      version: 'v1.5.1'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Validé': case 'Confirmé': case 'Actif': return 'bg-green-100 text-green-800';
      case 'En attente': case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Révoqué': case 'Échoué': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Titre de Propriété': return <Building className="w-4 h-4" />;
      case 'Contrat de Vente': return <FileText className="w-4 h-4" />;
      case 'Permis de Construire': return <Shield className="w-4 h-4" />;
      case 'Certificat de Conformité': return <Award className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Afficher notification de copie
  };

  const truncateHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className="w-full h-full bg-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blockchain Immobilier</h1>
            <p className="text-gray-600">Certification et traçabilité blockchain pour vos projets</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              Réseau sécurisé
            </Badge>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Nouveau certificat
            </Button>
          </div>
        </div>

        {/* Métriques blockchain */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certificats Totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{blockchainMetrics.totalCertificates}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Blocks className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  {blockchainMetrics.validatedCertificates} validés
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sécurité Réseau</p>
                  <p className="text-2xl font-bold text-green-600">{blockchainMetrics.securityScore}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={blockchainMetrics.securityScore} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">Score de sécurité</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{blockchainMetrics.totalTransactions}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Network className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-purple-600 font-medium">
                  {blockchainMetrics.pendingTransactions} en attente
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponibilité</p>
                  <p className="text-2xl font-bold text-gray-900">{blockchainMetrics.uptimePercentage}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-orange-600 font-medium">
                  {blockchainMetrics.averageConfirmationTime}s confirmation
                </span>
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
              <Network className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <Blocks className="w-4 h-4" />
              Smart Contracts
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          {/* Certificats blockchain */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Certificats Blockchain</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4 mr-2" />
                      Scanner QR
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Gestion des certificats immobiliers sur blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            {getTypeIcon(cert.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {cert.type}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><strong>Projet:</strong> {cert.project}</p>
                              <p><strong>Unité:</strong> {cert.unit}</p>
                              <p><strong>Propriétaire:</strong> {cert.owner}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={getStatusColor(cert.status)}>
                                {cert.status}
                              </Badge>
                              <Badge variant="outline">
                                <Verified className="w-3 h-3 mr-1" />
                                {cert.verificationLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">
                            Block #{cert.blockNumber}
                          </p>
                          <p className="text-sm text-gray-500 mb-1">
                            {cert.confirmations} confirmations
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(cert.timestamp)}
                          </p>
                        </div>
                      </div>

                      {/* Hash et métadonnées */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Hash Transaction</p>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs bg-white px-2 py-1 rounded border font-mono">
                                {truncateHash(cert.hash)}
                              </code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(cert.hash)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">IPFS Hash</p>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs bg-white px-2 py-1 rounded border font-mono">
                                {truncateHash(cert.ipfsHash)}
                              </code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(cert.ipfsHash)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Métriques */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="text-xs text-blue-600">Valeur</p>
                          <p className="font-semibold text-blue-800">
                            {cert.value > 0 ? formatCurrency(cert.value) : 'N/A'}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <p className="text-xs text-purple-600">Gas Utilisé</p>
                          <p className="font-semibold text-purple-800">{cert.gasUsed} ETH</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <p className="text-xs text-green-600">Confirmations</p>
                          <p className="font-semibold text-green-800">{cert.confirmations}</p>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <p className="text-xs text-orange-600">Statut</p>
                          <p className="font-semibold text-orange-800">{cert.status}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Fingerprint className="w-4 h-4" />
                          <span>Empreinte cryptographique vérifiée</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          <Button variant="outline" size="sm">
                            <QrCode className="w-4 h-4 mr-1" />
                            QR Code
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions blockchain */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transactions Récentes</CardTitle>
                <CardDescription>
                  Historique des transactions blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border rounded-lg p-4 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Network className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{tx.type}</h3>
                            <p className="text-sm text-gray-600">
                              {tx.from} → {tx.to}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            Block #{tx.blockHeight}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Hash</p>
                          <div className="flex items-center space-x-1">
                            <code className="text-xs font-mono">{truncateHash(tx.hash)}</code>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => copyToClipboard(tx.hash)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Frais</p>
                          <p className="font-medium">{tx.amount} ETH</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Confirmations</p>
                          <p className="font-medium">{tx.confirmations}/12</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDate(tx.timestamp)} • Gas: {tx.gasPrice} Gwei
                        </span>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Explorer
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Contracts */}
          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Smart Contracts Déployés</CardTitle>
                <CardDescription>
                  Contrats intelligents pour l'immobilier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartContracts.map((contract) => (
                    <motion.div
                      key={contract.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Blocks className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {contract.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{contract.type}</p>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(contract.status)}>
                                {contract.status}
                              </Badge>
                              <Badge variant="outline">
                                {contract.version}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">
                            {contract.transactions} TX
                          </p>
                          <p className="text-sm text-gray-500">
                            {contract.gasUsed} ETH utilisé
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-xs text-gray-500 mb-1">Adresse du Contrat</p>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-white px-3 py-1 rounded border font-mono">
                            {contract.address}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(contract.address)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Dernière activité: {formatDate(contract.lastActivity)}
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Monitorer
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-1" />
                            Configurer
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score de sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    Score de Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-green-600 mb-2">
                      {blockchainMetrics.securityScore}
                    </div>
                    <p className="text-gray-600">Score global de sécurité</p>
                    <Progress value={blockchainMetrics.securityScore} className="h-3 mt-4" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Chiffrement</span>
                      <span className="font-medium text-green-600">AES-256</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Consensus</span>
                      <span className="font-medium text-blue-600">Proof of Stake</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Validation</span>
                      <span className="font-medium text-purple-600">Multi-signature</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audits de sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle>Audits de Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Audit Smart Contracts</p>
                          <p className="text-sm text-green-600">Dernière vérification: 15 Nov 2024</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Validé</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-800">Pénétration Testing</p>
                          <p className="text-sm text-blue-600">Dernière vérification: 10 Nov 2024</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Réussi</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-800">Audit Infrastructure</p>
                          <p className="text-sm text-yellow-600">Planifié: 20 Déc 2024</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Planifié</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clés et certificats */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Clés</CardTitle>
                <CardDescription>
                  Clés cryptographiques et certificats de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Key className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 mb-1">Clé Maître</h3>
                    <p className="text-sm text-gray-600 mb-2">RSA-4096</p>
                    <Badge className="bg-green-100 text-green-800">Sécurisée</Badge>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold text-gray-900 mb-1">Certificat SSL</h3>
                    <p className="text-sm text-gray-600 mb-2">Expire: Mars 2025</p>
                    <Badge className="bg-green-100 text-green-800">Valide</Badge>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Fingerprint className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold text-gray-900 mb-1">Empreintes</h3>
                    <p className="text-sm text-gray-600 mb-2">SHA-256</p>
                    <Badge className="bg-purple-100 text-purple-800">Vérifiées</Badge>
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

export default PromoteurBlockchain;