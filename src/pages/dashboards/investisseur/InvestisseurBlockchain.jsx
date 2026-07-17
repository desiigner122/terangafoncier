import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Hash,
  Database,
  Copy,
  MapPin,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
// Layout géré par CompleteSidebarInvestisseurDashboard

// Libellés lisibles pour les statuts réels des certificats / transactions blockchain
const STATUS_LABELS = {
  verified: 'Validé',
  valid: 'Validé',
  confirmed: 'Confirmé',
  active: 'Actif',
  pending: 'En attente',
  processing: 'En cours',
  failed: 'Échoué',
  revoked: 'Révoqué'
};

const InvestisseurBlockchain = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('certificates');
  const [loading, setLoading] = useState(true);

  // Données réelles (Supabase)
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [propertiesById, setPropertiesById] = useState({});

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Récupérer les propriétés liées aux investissements de l'investisseur.
        //    blockchain_certificates n'expose que property_id : on passe par
        //    investments (investor_id = user.id) pour connaître les property_id concernés.
        const { data: investments, error: invError } = await supabase
          .from('investments')
          .select('property_id, title, amount, current_value')
          .eq('investor_id', user.id);

        if (invError) throw invError;

        const propertyIds = [
          ...new Set((investments || []).map((i) => i.property_id).filter(Boolean))
        ];

        // 2. Enrichir avec les propriétés réelles (titre, localisation, valeur)
        let propsMap = {};
        if (propertyIds.length > 0) {
          const { data: props, error: propsError } = await supabase
            .from('properties')
            .select('id, title, name, location, region, city, price, estimated_value, market_value')
            .in('id', propertyIds);

          if (propsError) throw propsError;
          (props || []).forEach((p) => {
            propsMap[p.id] = p;
          });
        }
        // Compléter avec le titre de l'investissement si la propriété n'a pas de titre
        (investments || []).forEach((i) => {
          if (i.property_id && !propsMap[i.property_id]) {
            propsMap[i.property_id] = { id: i.property_id, title: i.title, estimated_value: i.current_value ?? i.amount };
          }
        });
        setPropertiesById(propsMap);

        // 3. Certificats blockchain réels (filtrés sur les property_id de l'investisseur)
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
        setCertificates(certs);

        // 4. Transactions blockchain réelles (filtrées par user_id dans le code)
        const { data: txData, error: txError } = await supabase
          .from('blockchain_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (txError) throw txError;
        setTransactions(txData || []);
      } catch (error) {
        console.error('Erreur chargement données blockchain:', error);
        setCertificates([]);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlockchainData();
  }, [user?.id]);

  // Métriques réelles calculées à partir des données Supabase
  const metrics = useMemo(() => {
    const validatedStatuses = ['verified', 'valid', 'confirmed', 'active'];
    const validatedCertificates = certificates.filter((c) =>
      validatedStatuses.includes((c.status || '').toLowerCase())
    ).length;
    const pendingCertificates = certificates.length - validatedCertificates;
    // Valeur sécurisée : somme des montants réels des transactions blockchain
    const totalValue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return {
      totalCertificates: certificates.length,
      validatedCertificates,
      pendingCertificates,
      totalTransactions: transactions.length,
      totalValue
    };
  }, [certificates, transactions]);

  const formatCurrency = (amount) => {
    if (amount == null) return '—';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusLabel = (status) => STATUS_LABELS[(status || '').toLowerCase()] || status || 'Inconnu';

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'verified':
      case 'valid':
      case 'confirmed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'verified':
      case 'valid':
      case 'confirmed':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const copyToClipboard = (text) => {
    if (text) navigator.clipboard.writeText(text);
  };

  const truncateHash = (hash) => {
    if (!hash) return '—';
    if (hash.length <= 18) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const propertyTitle = (propertyId) => {
    const p = propertiesById[propertyId];
    return p?.title || p?.name || 'Propriété';
  };

  const propertyLocation = (propertyId) => {
    const p = propertiesById[propertyId];
    return p?.location || [p?.city, p?.region].filter(Boolean).join(', ') || null;
  };

  const propertyValue = (propertyId) => {
    const p = propertiesById[propertyId];
    return p?.estimated_value ?? p?.market_value ?? p?.price ?? null;
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

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
          </div>
        </div>

        {/* Métriques réelles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certificats Totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalCertificates}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {metrics.validatedCertificates} validé{metrics.validatedCertificates > 1 ? 's' : ''}
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
                    {metrics.totalValue > 0 ? formatCurrency(metrics.totalValue) : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Montant tracé sur la blockchain</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalTransactions}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Enregistrées sur la chaîne</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
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
          </TabsList>

          {/* Certificats */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificats Blockchain</CardTitle>
                <CardDescription>
                  Vos investissements certifiés sur la blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Aucun certificat blockchain</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Vos certificats apparaîtront ici dès qu'un investissement sera certifié.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {certificates.map((cert) => {
                      const value = propertyValue(cert.property_id);
                      const location = propertyLocation(cert.property_id);
                      return (
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
                                <h3 className="font-semibold text-gray-900">
                                  {propertyTitle(cert.property_id)}
                                </h3>
                                {location && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {location}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(cert.status)}>
                                {statusLabel(cert.status)}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Valeur</p>
                              <p className="font-semibold">{value != null ? formatCurrency(value) : '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Date création</p>
                              <p className="font-semibold">{formatDate(cert.created_at)}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Hash certificat:</span>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {truncateHash(cert.certificate_hash)}
                              </code>
                              {cert.certificate_hash && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(cert.certificate_hash)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
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
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Aucune transaction blockchain</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Vos transactions certifiées apparaîtront ici.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Hash className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {propertyTitle(tx.property_id)}
                            </p>
                            {tx.block_number != null && (
                              <p className="text-sm text-gray-600">Block #{tx.block_number}</p>
                            )}
                            <div className="flex items-center gap-2 mt-0.5">
                              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {truncateHash(tx.transaction_hash)}
                              </code>
                              {tx.transaction_hash && (
                                <button
                                  onClick={() => copyToClipboard(tx.transaction_hash)}
                                  className="text-gray-400 hover:text-gray-700"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{formatDate(tx.created_at)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(tx.status)}>
                            {statusLabel(tx.status)}
                          </Badge>
                          {Number(tx.amount) > 0 && (
                            <p className="text-sm font-medium text-green-600 mt-1">
                              {formatCurrency(Number(tx.amount))}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit de Sécurité</CardTitle>
                <CardDescription>
                  État de la certification de vos actifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Certificats validés</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {metrics.validatedCertificates}/{metrics.totalCertificates}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Taux de certification</span>
                      <span className="text-sm font-semibold">
                        {metrics.totalCertificates > 0
                          ? Math.round((metrics.validatedCertificates / metrics.totalCertificates) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        metrics.totalCertificates > 0
                          ? (metrics.validatedCertificates / metrics.totalCertificates) * 100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">En attente de validation</span>
                    </div>
                    <span className="text-sm font-semibold">{metrics.pendingCertificates}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">Transactions enregistrées</span>
                    </div>
                    <span className="text-sm font-semibold">{metrics.totalTransactions}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Métriques réseau</p>
                    <p className="text-sm text-gray-500">
                      Les indicateurs de performance réseau (uptime, temps de validation) seront disponibles prochainement.
                    </p>
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
