import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import {
  Shield,
  Blocks,
  FileText,
  CheckCircle,
  Building,
  Upload,
  Eye,
  Copy,
  Award,
  Verified,
  Network,
  Fingerprint,
  Loader2
} from 'lucide-react';

const PromoteurBlockchain = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('certificates');
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalCertificates: 0,
    validatedCertificates: 0,
    totalTransactions: 0,
    pendingTransactions: 0
  });

  useEffect(() => {
    if (!user?.id) return;
    loadBlockchainData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);

      // 1) Propriétés du promoteur (pour relier les certificats)
      const { data: props } = await supabase
        .from('properties')
        .select('id, title, name, price')
        .eq('owner_id', user.id);
      const properties = props || [];
      const propsById = {};
      properties.forEach((p) => { propsById[p.id] = p; });
      const propertyIds = properties.map((p) => p.id);

      // 2) Certificats blockchain reliés à ces propriétés
      let certRows = [];
      if (propertyIds.length > 0) {
        const { data: certData } = await supabase
          .from('blockchain_certificates')
          .select('*')
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false });
        certRows = certData || [];
      }

      // 3) Transactions blockchain de l'utilisateur
      let txRows = [];
      const { data: txData, error: txError } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);
      if (!txError) {
        txRows = txData || [];
      }

      const mappedCerts = certRows.map((c) => mapCertificate(c, propsById));
      const mappedTxs = txRows.map(mapTransaction);

      setCertificates(mappedCerts);
      setTransactions(mappedTxs);

      const validated = mappedCerts.filter((c) =>
        ['minted', 'verified', 'confirmed', 'transferred'].includes(c.rawStatus)
      ).length;
      const pending = mappedTxs.filter((t) => t.rawStatus === 'pending').length;

      setMetrics({
        totalCertificates: mappedCerts.length,
        validatedCertificates: validated,
        totalTransactions: mappedTxs.length,
        pendingTransactions: pending
      });
    } catch (error) {
      console.error('Erreur chargement blockchain:', error);
      setCertificates([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const mapCertificate = (c, propsById) => {
    const property = propsById[c.property_id] || {};
    return {
      id: c.id,
      rawStatus: c.status || null,
      type: c.metadata?.type || c.metadata?.name || 'Certificat NFT',
      project: property.title || property.name || '—',
      unit: c.token_id ? `Token #${c.token_id}` : '—',
      owner: c.current_owner_wallet || c.minted_by_wallet || '—',
      hash: c.transaction_hash || null,
      timestamp: c.minted_at || c.created_at || null,
      status: c.status || '—',
      value: Number(property.price) || 0,
      gasUsed: c.gas_used ?? null,
      ipfsHash: c.ipfs_hash || null,
      network: c.blockchain_network || null,
      contractAddress: c.contract_address || null,
      verificationLevel: c.blockchain_network ? `Réseau ${c.blockchain_network}` : '—'
    };
  };

  const mapTransaction = (t) => ({
    id: t.id,
    rawStatus: t.status || null,
    type: t.transaction_type || t.type || 'Transaction',
    hash: t.transaction_hash || null,
    from: t.from_address || '—',
    to: t.to_address || '—',
    fee: t.transaction_fee ?? null,
    timestamp: t.created_at || null,
    status: t.status || '—',
    confirmations: t.confirmations ?? null,
    gasPrice: t.gas_price ?? null,
    blockHeight: t.block_number ?? null
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
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
      case 'Validé': case 'Confirmé': case 'Actif':
      case 'minted': case 'verified': case 'confirmed': case 'transferred':
        return 'bg-green-100 text-green-800';
      case 'En attente': case 'Maintenance':
      case 'pending': case 'minting':
        return 'bg-yellow-100 text-yellow-800';
      case 'Révoqué': case 'Échoué':
      case 'failed': case 'burned':
        return 'bg-red-100 text-red-800';
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
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  const truncateHash = (hash) => {
    if (!hash) return '—';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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

        {/* Métriques blockchain (données réelles) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certificats Totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalCertificates}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Blocks className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  {metrics.validatedCertificates} validés
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certificats Validés</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.validatedCertificates}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Verified className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs text-gray-500">Sur {metrics.totalCertificates} certificats</span>
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
                  <Network className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-purple-600 font-medium">
                  {metrics.pendingTransactions} en attente
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.pendingTransactions}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs text-gray-500">Transactions non confirmées</span>
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
                <CardTitle>Certificats Blockchain</CardTitle>
                <CardDescription>
                  Gestion des certificats immobiliers sur blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Blocks className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucun certificat blockchain</p>
                    <p className="text-sm">Vos certificats immobiliers apparaîtront ici une fois émis.</p>
                  </div>
                ) : (
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
                                {cert.hash && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(cert.hash)}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">IPFS Hash</p>
                              <div className="flex items-center space-x-2">
                                <code className="text-xs bg-white px-2 py-1 rounded border font-mono">
                                  {truncateHash(cert.ipfsHash)}
                                </code>
                                {cert.ipfsHash && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(cert.ipfsHash)}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Métriques */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-xs text-blue-600">Valeur</p>
                            <p className="font-semibold text-blue-800">
                              {cert.value > 0 ? formatCurrency(cert.value) : '—'}
                            </p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <p className="text-xs text-purple-600">Gas Utilisé</p>
                            <p className="font-semibold text-purple-800">
                              {cert.gasUsed != null ? cert.gasUsed : '—'}
                            </p>
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
                            <span>Empreinte cryptographique enregistrée</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Détails
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
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
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Network className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucune transaction blockchain</p>
                    <p className="text-sm">Vos transactions on-chain apparaîtront ici.</p>
                  </div>
                ) : (
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
                              {tx.blockHeight != null ? `Block #${tx.blockHeight}` : '—'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Hash</p>
                            <div className="flex items-center space-x-1">
                              <code className="text-xs font-mono">{truncateHash(tx.hash)}</code>
                              {tx.hash && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(tx.hash)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500">Frais</p>
                            <p className="font-medium">
                              {tx.fee != null ? formatCurrency(tx.fee) : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Confirmations</p>
                            <p className="font-medium">
                              {tx.confirmations != null ? tx.confirmations : '—'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDate(tx.timestamp)}
                            {tx.gasPrice != null ? ` • Gas: ${tx.gasPrice}` : ''}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Contracts - pas de source réelle */}
          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Smart Contracts Déployés</CardTitle>
                <CardDescription>
                  Contrats intelligents pour l'immobilier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Blocks className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Bientôt disponible</p>
                  <p className="text-sm">Le suivi des smart contracts déployés sera bientôt disponible.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sécurité - pas de source réelle */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Sécurité & Audits
                </CardTitle>
                <CardDescription>
                  Scores de sécurité, audits et gestion des clés cryptographiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Bientôt disponible</p>
                  <p className="text-sm">Le tableau de bord de sécurité et les audits blockchain seront bientôt disponibles.</p>
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
