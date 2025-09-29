import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Blocks, 
  Shield, 
  Lock, 
  Key,
  CheckCircle,
  Clock,
  FileText,
  Hash,
  Database,
  Network,
  Eye,
  Download,
  Upload,
  Zap,
  Award,
  TrendingUp,
  AlertCircle,
  Activity,
  Plus,
  AlertTriangle,
  Users,
  Calendar,
  MapPin,
  Target,
  Compass,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const GeometreBlockchain = () => {
  const [activeTab, setActiveTab] = useState('certificates');

  // Certificats blockchain
  const certificates = [
    {
      id: 1,
      title: "Certificat de levé topographique",
      client: "Amadou Diallo",
      location: "Rufisque",
      date: "2025-01-10",
      hash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c5f7af66ab4ead7",
      status: "Validé",
      blockNumber: 2847293,
      surface: "2.5 ha",
      type: "Topographie",
      confidence: 99.2
    },
    {
      id: 2,
      title: "Certificat de bornage",
      client: "Fatou Sow",
      location: "Dakar",
      date: "2025-01-08",
      hash: "0x2c5f7af66ab4ead7fade1c0d57a7af66ab4ead79f2c5f7af66ab4ead7fade1c0d5",
      status: "En attente",
      blockNumber: null,
      surface: "800 m²",
      type: "Bornage",
      confidence: 0
    },
    {
      id: 3,
      title: "Plan cadastral certifié",
      client: "SARL Teranga Construction",
      location: "Thiès",
      date: "2025-01-05",
      hash: "0x4ead7fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c5f7af66ab4e",
      status: "Validé",
      blockNumber: 2845891,
      surface: "15 ha",
      type: "Cadastral",
      confidence: 98.7
    }
  ];

  // Transactions blockchain récentes
  const transactions = [
    {
      id: 1,
      type: "Certification",
      description: "Levé topographique validé",
      hash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c5f7",
      timestamp: "2025-01-10 14:30:25",
      gasUsed: "21,000",
      status: "Confirmé"
    },
    {
      id: 2,
      type: "Signature",
      description: "Document signé numériquement",
      hash: "0x2c5f7af66ab4ead7fade1c0d57a7af66ab4ead79f2c5f7af66ab4e",
      timestamp: "2025-01-09 16:45:12",
      gasUsed: "15,500",
      status: "Confirmé"
    },
    {
      id: 3,
      type: "Horodatage",
      description: "Mesures GPS horodatées",
      hash: "0x4ead7fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2",
      timestamp: "2025-01-08 09:15:08",
      gasUsed: "18,200",
      status: "Confirmé"
    }
  ];

  // Stats blockchain
  const blockchainStats = [
    {
      title: "Certificats émis",
      value: "247",
      change: "+18 ce mois",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Validations",
      value: "234",
      change: "94.7% de succès",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Transactions",
      value: "1,425",
      change: "+156 ce mois",
      icon: Hash,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Économies gaz",
      value: "12.5 ETH",
      change: "Optimisé -23%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Validé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmé': return 'bg-blue-100 text-blue-800';
      case 'Échoué': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Topographie': return Compass;
      case 'Bornage': return Target;
      case 'Cadastral': return MapPin;
      case 'Certification': return Shield;
      case 'Signature': return Lock;
      case 'Horodatage': return Clock;
      default: return FileText;
    }
  };

  const truncateHash = (hash) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blockchain</h1>
            <p className="text-gray-600 mt-1">Certification et sécurisation de vos mesures</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-4 h-4 mr-1" />
              Réseau sécurisé
            </Badge>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau certificat
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blockchainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="certificates">Certificats</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="space-y-4">
            {certificates.map((cert, index) => {
              const TypeIcon = getTypeIcon(cert.type);
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <TypeIcon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{cert.title}</h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {cert.client}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {cert.location}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(cert.date).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(cert.status)}>
                            {cert.status}
                          </Badge>
                          {cert.confidence > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">Confiance</p>
                              <p className="text-lg font-bold text-green-600">{cert.confidence}%</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Hash de transaction</p>
                          <div className="flex items-center mt-1">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {truncateHash(cert.hash)}
                            </code>
                            <Button variant="ghost" size="sm" className="ml-2 p-1">
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Bloc #</p>
                          <p className="text-sm text-gray-900 mt-1">
                            {cert.blockNumber ? cert.blockNumber.toLocaleString() : 'En attente'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Surface certifiée</p>
                          <p className="text-sm text-gray-900 mt-1">{cert.surface}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Type: {cert.type}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Explorer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
                <CardDescription>
                  Toutes vos interactions avec la blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx, index) => {
                    const TypeIcon = getTypeIcon(tx.type);
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <TypeIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{tx.description}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>Hash: {truncateHash(tx.hash)}</span>
                              <span>Gas: {tx.gasUsed}</span>
                              <span>{tx.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    Sécurité du réseau
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">État du réseau</span>
                      <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dernière synchronisation</span>
                      <span className="text-sm text-gray-900">Il y a 2 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Nœuds connectés</span>
                      <span className="text-sm text-gray-900">847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Niveau de sécurité</span>
                      <div className="flex items-center">
                        <Progress value={95} className="w-20 h-2 mr-2" />
                        <span className="text-sm font-medium text-green-600">95%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-blue-600" />
                    Clés de signature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Clé publique</p>
                      <div className="flex items-center">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1">
                          0x742d35Cc6634C0532925a3b8D...
                        </code>
                        <Button variant="ghost" size="sm" className="ml-2 p-1">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Statut de la clé</p>
                      <Badge className="bg-green-100 text-green-800">Active et sécurisée</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Dernière utilisation</p>
                      <p className="text-sm text-gray-900">Hier à 16:45</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Renouveler les clés
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GeometreBlockchain;