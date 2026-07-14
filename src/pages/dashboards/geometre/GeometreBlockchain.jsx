import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
  // certificates RÉEL depuis Supabase (aucune donnée fictive)
  const [certificates, setCertificates] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('blockchain_certificates').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setCertificates(data || []);
      } catch (err) {
        console.warn('certificates indisponible:', err?.message);
        if (active) setCertificates([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Transactions blockchain récentes RÉEL depuis Supabase (aucune donnée fictive)
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('blockchain_transactions').select('*').order('created_at', { ascending: false }).limit(50);
        if (error) throw error;
        if (active) setTransactions(data || []);
      } catch (err) {
        console.warn('transactions indisponible:', err?.message);
        if (active) setTransactions([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Stats blockchain dérivées des données réelles
  const blockchainStats = [
    {
      title: "Certificats émis",
      value: certificates.length,
      change: null,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Validations",
      value: certificates.filter(c => c.status === 'Validé' || c.status === 'validated').length,
      change: null,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Transactions",
      value: transactions.length,
      change: null,
      icon: Hash,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Économies gaz",
      value: "—",
      change: null,
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
    if (!hash) return '—';
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
            {certificates.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">Aucun certificat pour le moment</p>
            )}
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
                                {(cert.date || cert.created_at) ? new Date(cert.date || cert.created_at).toLocaleDateString('fr-FR') : '—'}
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
                  {transactions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">Aucune transaction pour le moment</p>
                  )}
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
                      <span className="text-sm text-gray-900">—</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Nœuds connectés</span>
                      <span className="text-sm text-gray-900">—</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Niveau de sécurité</span>
                      <div className="flex items-center">
                        <Progress value={0} className="w-20 h-2 mr-2" />
                        <span className="text-sm font-medium text-green-600">—</span>
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
                          —
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
                      <p className="text-sm text-gray-900">—</p>
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