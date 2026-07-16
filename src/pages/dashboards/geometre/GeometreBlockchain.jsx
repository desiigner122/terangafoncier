import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Clock,
  FileText,
  Hash,
  Eye,
  Download,
  CheckCircle,
  Users,
  Calendar,
  MapPin,
  Target,
  Compass,
  Copy,
  ExternalLink,
  Blocks
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const GeometreBlockchain = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('certificates');
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlockchain = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        // Propriétés du géomètre → sert à relier les certificats (blockchain_certificates n'a pas de user_id)
        const { data: props, error: propsError } = await supabase
          .from('properties')
          .select('id, title, name, location, surface')
          .eq('owner_id', user.id);
        if (propsError) throw propsError;

        const propMap = new Map((props || []).map((p) => [p.id, p]));
        const propertyIds = (props || []).map((p) => p.id);

        // Certificats blockchain liés aux propriétés du géomètre
        let certs = [];
        if (propertyIds.length > 0) {
          const { data: certData, error: certError } = await supabase
            .from('blockchain_certificates')
            .select('*')
            .in('property_id', propertyIds)
            .order('created_at', { ascending: false });
          if (certError) throw certError;
          certs = certData || [];
        }

        setCertificates(
          certs.map((c) => {
            const p = propMap.get(c.property_id);
            return {
              id: c.id,
              hash: c.certificate_hash,
              status: c.status,
              date: c.created_at,
              title: p?.title || p?.name || 'Certificat blockchain',
              location: p?.location || '—',
              surface: p?.surface ? `${p.surface} m²` : '—'
            };
          })
        );

        // Transactions blockchain du géomètre
        const { data: txData, error: txError } = await supabase
          .from('blockchain_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (txError) throw txError;

        setTransactions(
          (txData || []).map((t) => ({
            id: t.id,
            hash: t.transaction_hash,
            status: t.status,
            blockNumber: t.block_number,
            amount: t.amount,
            date: t.created_at
          }))
        );
      } catch (err) {
        console.error('Erreur chargement blockchain:', err);
        setCertificates([]);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlockchain();
  }, [user?.id]);

  // Stats calculées sur la vraie donnée
  const isValidated = (s) => ['validé', 'valid', 'confirmed', 'confirmé', 'active', 'completed'].includes((s || '').toLowerCase());
  const blockchainStats = [
    {
      title: 'Certificats émis',
      value: certificates.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Certificats validés',
      value: certificates.filter((c) => isValidated(c.status)).length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Transactions',
      value: transactions.length,
      icon: Hash,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Transactions confirmées',
      value: transactions.filter((t) => isValidated(t.status)).length,
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getStatusLabel = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'active': return 'Actif';
      case 'valid':
      case 'validated': return 'Validé';
      default: return status || '—';
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'valid':
      case 'validated':
      case 'active':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'confirmé': return 'bg-blue-100 text-blue-800';
      case 'failed':
      case 'échoué': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateHash = (hash) => {
    if (!hash) return '—';
    if (hash.length <= 20) return hash;
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—');
  const formatDateTime = (d) => (d ? new Date(d).toLocaleString('fr-FR') : '—');

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
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {loading ? '—' : stat.value}
                        </p>
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
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">Chargement…</CardContent>
              </Card>
            ) : certificates.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Blocks className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Aucun certificat blockchain pour le moment.</p>
                </CardContent>
              </Card>
            ) : (
              certificates.map((cert, index) => (
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
                            <MapPin className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{cert.title}</h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {cert.location}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(cert.date)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(cert.status)}>
                            {getStatusLabel(cert.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Hash du certificat</p>
                          <div className="flex items-center mt-1">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {truncateHash(cert.hash)}
                            </code>
                            {cert.hash && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 p-1"
                                onClick={() => navigator.clipboard?.writeText(cert.hash)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Surface certifiée</p>
                          <p className="text-sm text-gray-900 mt-1">{cert.surface}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
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
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Chargement…</div>
                ) : transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <Hash className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Aucune transaction blockchain enregistrée.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Hash className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {tx.amount != null ? `Montant: ${tx.amount}` : 'Transaction blockchain'}
                            </h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>Hash: {truncateHash(tx.hash)}</span>
                              {tx.blockNumber != null && <span>Bloc #{tx.blockNumber.toLocaleString()}</span>}
                              <span>{formatDateTime(tx.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(tx.status)}>
                            {getStatusLabel(tx.status)}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                      <span className="text-sm text-gray-600">Certificats enregistrés</span>
                      <span className="text-sm text-gray-900">{loading ? '—' : certificates.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Transactions enregistrées</span>
                      <span className="text-sm text-gray-900">{loading ? '—' : transactions.length}</span>
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
                  <div className="py-8 text-center">
                    <Lock className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">
                      La gestion des clés de signature sera bientôt disponible.
                    </p>
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
