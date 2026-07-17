import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Blocks,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
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
  Server,
  Zap,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Network,
  Plus,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';

const shortenHash = (hash) => {
  if (!hash || typeof hash !== 'string') return '—';
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

// Mapping des statuts réels (blockchain_certificates.status) vers l'affichage FR
const certStatusMeta = (status) => {
  switch (status) {
    case 'minted':
    case 'transferred':
      return { label: 'Certifié', key: 'certifié' };
    case 'pending':
    case 'minting':
      return { label: 'En attente', key: 'en_attente' };
    case 'burned':
      return { label: 'Révoqué', key: 'révoqué' };
    default:
      return { label: status || 'Inconnu', key: 'en_attente' };
  }
};

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('fr-FR');
  } catch {
    return '—';
  }
};

const AgentFoncierBlockchain = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchHash, setSearchHash] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const loadBlockchainData = async () => {
      setLoading(true);

      // blockchain_certificates : certificats NFT / documents ancrés on-chain
      let certs = [];
      try {
        const { data, error } = await supabase
          .from('blockchain_certificates')
          .select('id, property_id, blockchain_network, contract_address, token_id, transaction_hash, ipfs_hash, ipfs_url, metadata, status, minted_at, gas_used, gas_price_gwei, total_cost_eth, created_at, properties(title, name, location, region, price)')
          .order('created_at', { ascending: false })
          .limit(50);
        if (!error && Array.isArray(data)) certs = data;
      } catch {
        certs = [];
      }

      // blockchain_transactions : historique des transactions on-chain
      let txs = [];
      try {
        const { data, error } = await supabase
          .from('blockchain_transactions')
          .select('id, transaction_type, status, amount, transaction_hash, created_at')
          .order('created_at', { ascending: false })
          .limit(50);
        if (!error && Array.isArray(data)) txs = data;
      } catch {
        txs = [];
      }

      // Smart contracts réels = adresses de contrat distinctes présentes dans les certificats
      const contractMap = new Map();
      certs.forEach((c) => {
        if (c.contract_address && !contractMap.has(c.contract_address)) {
          contractMap.set(c.contract_address, {
            address: c.contract_address,
            network: c.blockchain_network || '—',
            count: 0
          });
        }
        if (c.contract_address) {
          contractMap.get(c.contract_address).count += 1;
        }
      });

      setCertificates(certs);
      setTransactions(txs);
      setContracts(Array.from(contractMap.values()));
      setLoading(false);
    };

    loadBlockchainData();
  }, []);

  // Compteurs réels dérivés des données Supabase
  const certifiedCount = certificates.filter(
    (c) => c.status === 'minted' || c.status === 'transferred'
  ).length;
  const pendingTxCount = transactions.filter((t) => t.status === 'pending').length;
  const confirmedTxCount = transactions.filter(
    (t) => t.status === 'completed' || t.status === 'confirmed'
  ).length;

  const blockchainMetrics = [
    {
      title: 'Documents Certifiés',
      value: certificates.length.toLocaleString('fr-FR'),
      icon: Shield,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Transactions Blockchain',
      value: transactions.length.toLocaleString('fr-FR'),
      icon: Activity,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Smart Contracts',
      value: contracts.length.toLocaleString('fr-FR'),
      icon: Cpu,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Certificats Validés',
      value: certifiedCount.toLocaleString('fr-FR'),
      icon: CheckCircle,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
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
            Registre connecté
          </Badge>
        </div>
      </div>

      {/* Métriques Blockchain (réelles) */}
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

      {/* Statistiques Réseau (données réelles dérivées ; le reste sans source) */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Network className="h-5 w-5 mr-2" />
            État du Registre Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{certificates.length.toLocaleString('fr-FR')}</div>
              <div className="text-sm text-gray-600">Certificats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{contracts.length.toLocaleString('fr-FR')}</div>
              <div className="text-sm text-gray-600">Contrats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{confirmedTxCount.toLocaleString('fr-FR')}</div>
              <div className="text-sm text-gray-600">TX confirmées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingTxCount.toLocaleString('fr-FR')}</div>
              <div className="text-sm text-gray-600">TX en attente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">—</div>
              <div className="text-sm text-gray-600">Hash Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">—</div>
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
                {certificates.length === 0 && transactions.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <Activity className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p>Aucune activité blockchain enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {certificates.slice(0, 3).map((cert) => {
                      const meta = certStatusMeta(cert.status);
                      const title = cert.properties?.title || cert.properties?.name || cert.metadata?.name || cert.token_id || 'Certificat';
                      return (
                        <div key={cert.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">{meta.label}</p>
                              <p className="text-sm text-green-700">{title}</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600">{formatDate(cert.minted_at || cert.created_at)}</span>
                        </div>
                      );
                    })}
                    {transactions.slice(0, 2).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">{tx.transaction_type || 'Transaction'}</p>
                            <p className="text-sm text-blue-700">{shortenHash(tx.transaction_hash)}</p>
                          </div>
                        </div>
                        <span className="text-xs text-blue-600">{formatDate(tx.created_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="h-5 w-5 mr-2" />
                  Répartition des Certificats
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certificates.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <HardDrive className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p>Aucun certificat sur le registre</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Certificats validés</span>
                      <span className="text-sm font-medium">{certifiedCount} / {certificates.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Transactions confirmées</span>
                      <span className="text-sm font-medium">{confirmedTxCount} / {transactions.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Transactions en attente</span>
                      <span className="text-sm font-medium">{pendingTxCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Contrats déployés</span>
                      <span className="text-sm font-medium">{contracts.length}</span>
                    </div>
                  </div>
                )}
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
              {certificates.length === 0 ? (
                <div className="text-center py-14 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucun document ancré sur la blockchain</p>
                  <p className="text-sm mt-1">Les certificats apparaîtront ici une fois émis.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert, index) => {
                    const meta = certStatusMeta(cert.status);
                    const title = cert.properties?.title || cert.properties?.name || cert.metadata?.name || cert.token_id || `Certificat ${cert.id.slice(0, 8)}`;
                    const location = cert.properties?.location || cert.properties?.region || '—';
                    const type = cert.metadata?.type || 'Certificat NFT';
                    const value = cert.properties?.price
                      ? `${Number(cert.properties.price).toLocaleString('fr-FR')} XOF`
                      : '—';
                    return (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              meta.key === 'certifié' ? 'bg-green-100' :
                              meta.key === 'en_attente' ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              {meta.key === 'certifié' ? (
                                <CheckCircle className="h-6 w-6 text-green-600" />
                              ) : meta.key === 'en_attente' ? (
                                <Clock className="h-6 w-6 text-yellow-600" />
                              ) : (
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{location}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Type:</span>
                                  <span className="ml-2 font-medium">{type}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Valeur:</span>
                                  <span className="ml-2 font-medium">{value}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Réseau:</span>
                                  <span className="ml-2 font-medium">{cert.blockchain_network || '—'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Token:</span>
                                  <span className="ml-2 font-medium">{cert.token_id || '—'}</span>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                  {shortenHash(cert.transaction_hash)}
                                </code>
                                {cert.transaction_hash && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(cert.transaction_hash)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={
                              meta.key === 'certifié' ? 'bg-green-100 text-green-800' :
                              meta.key === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {meta.label}
                            </Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              {cert.ipfs_url && (
                                <Button variant="ghost" size="sm" onClick={() => window.open(cert.ipfs_url, '_blank')}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
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
              {contracts.length === 0 ? (
                <div className="text-center py-14 text-gray-500">
                  <Cpu className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucun smart contract référencé</p>
                  <p className="text-sm mt-1">Les contrats apparaîtront dès qu'un certificat sera ancré.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((contract, index) => (
                    <motion.div
                      key={contract.address}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-green-100">
                            <Server className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Contrat {contract.network}</h4>
                            <p className="text-sm text-gray-600">Réseau: {contract.network}</p>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">
                              {contract.address}
                            </code>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">actif</Badge>
                          <div className="text-sm text-gray-600 mt-2">
                            <div>{contract.count} certificat{contract.count > 1 ? 's' : ''}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
              {transactions.length === 0 ? (
                <div className="text-center py-14 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucune transaction blockchain</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx, index) => {
                    const confirmed = tx.status === 'completed' || tx.status === 'confirmed';
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${confirmed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <div>
                            <div className="font-medium text-sm">{tx.transaction_type || 'Transaction'}</div>
                            <code className="text-xs text-gray-500 font-mono">{shortenHash(tx.transaction_hash)}</code>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">
                            {tx.amount != null ? `${Number(tx.amount).toLocaleString('fr-FR')} XOF` : '—'}
                          </div>
                          <div className="text-gray-500">{formatDate(tx.created_at)}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
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
                    placeholder="Rechercher par hash de transaction..."
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
                    Certificats
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col justify-center">
                    <Globe className="h-6 w-6 mb-2" />
                    Contrats
                  </Button>
                </div>

                {searchHash && (() => {
                  const q = searchHash.trim().toLowerCase();
                  const matchCert = certificates.filter((c) => (c.transaction_hash || '').toLowerCase().includes(q));
                  const matchTx = transactions.filter((t) => (t.transaction_hash || '').toLowerCase().includes(q));
                  const total = matchCert.length + matchTx.length;
                  return (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Résultats de recherche</h4>
                      {total === 0 ? (
                        <p className="text-sm text-blue-700">
                          Aucun résultat pour <code className="bg-blue-100 px-2 py-1 rounded">{searchHash}</code>
                        </p>
                      ) : (
                        <ul className="text-sm text-blue-800 space-y-1">
                          {matchCert.map((c) => (
                            <li key={`c-${c.id}`}>Certificat — {shortenHash(c.transaction_hash)} ({certStatusMeta(c.status).label})</li>
                          ))}
                          {matchTx.map((t) => (
                            <li key={`t-${t.id}`}>Transaction — {shortenHash(t.transaction_hash)} ({t.transaction_type || '—'})</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AgentFoncierBlockchain;
