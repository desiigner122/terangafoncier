import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Certificate,
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
  const [activeTab, setActiveTab] = useState('overview');

  // Certificats blockchain
  const certificates = [
    {
      id: 1,
      title: "Certificat de propriété",
      property: "Appartement - Dakar Plateau",
      hash: "0x7d4c...f8a2",
      status: "verified",
      date: "2024-03-15",
      type: "ownership"
    },
    {
      id: 2,
      title: "Contrat de vente",
      property: "Villa - Almadies",
      hash: "0x9a1b...c3d4",
      status: "pending",
      date: "2024-03-20",
      type: "contract"
    },
    {
      id: 3,
      title: "Attestation d'évaluation",
      property: "Terrain - Saly",
      hash: "0x2e5f...b7c8",
      status: "verified",
      date: "2024-03-18",
      type: "evaluation"
    }
  ];

  // Transactions blockchain
  const transactions = [
    {
      id: 1,
      type: "Achat",
      property: "Appartement 3P - Plateau",
      amount: "45,000,000 FCFA",
      hash: "0x1a2b3c4d5e6f...",
      status: "confirmed",
      confirmations: 12,
      timestamp: "2024-03-20 14:30"
    },
    {
      id: 2,
      type: "Certification",
      property: "Villa - Almadies",
      amount: "-",
      hash: "0x9f8e7d6c5b4a...",
      status: "pending",
      confirmations: 3,
      timestamp: "2024-03-20 16:45"
    }
  ];

  // Portfolio blockchain
  const portfolioStats = {
    totalValue: "125,000,000",
    properties: 3,
    certificates: 8,
    transactions: 15,
    securityScore: 98
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
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

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
            <Certificate className="w-4 h-4 mr-2" />
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
                <p className="text-2xl font-bold text-blue-900">{portfolioStats.totalValue} FCFA</p>
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
                <Certificate className="w-6 h-6 text-purple-600" />
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Certificate className="w-4 h-4" />
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
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Certificat vérifié</p>
                    <p className="text-xs text-slate-600">Appartement - Dakar Plateau</p>
                  </div>
                  <span className="text-xs text-slate-500">Il y a 2h</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Transaction confirmée</p>
                    <p className="text-xs text-slate-600">45M FCFA - Achat propriété</p>
                  </div>
                  <span className="text-xs text-slate-500">Il y a 1j</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Key className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Clé privée générée</p>
                    <p className="text-xs text-slate-600">Nouveau portefeuille créé</p>
                  </div>
                  <span className="text-xs text-slate-500">Il y a 3j</span>
                </div>
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
                    <span className="font-semibold">Score Global</span>
                    <span className="text-2xl font-bold text-green-600">{portfolioStats.securityScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <div className="space-y-4">
            {certificates.map((cert) => {
              const StatusIcon = getStatusIcon(cert.status);
              return (
                <Card key={cert.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <Certificate className="w-6 h-6 text-blue-600" />
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
                    <p className="font-mono text-sm font-semibold mb-3">0x742d35Cc6634C0532925a3b8D1E...</p>
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
                    <span className="text-sm">Solde TERA</span>
                    <span className="font-semibold">1,250 TERA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Valeur USD</span>
                    <span className="font-semibold text-green-600">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Récompenses</span>
                    <span className="font-semibold text-blue-600">+15 TERA</span>
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