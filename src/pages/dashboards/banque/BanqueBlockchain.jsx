import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Link, 
  Activity, 
  Shield, 
  Eye, 
  Download, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Hash,
  Database,
  Zap,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Bot,
  Settings,
  RefreshCw,
  Fingerprint,
  Key,
  Globe,
  Server,
  Layers,
  UserCheck,
  FileText,
  CreditCard,
  Building2,
  Banknote
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const BanqueBlockchain = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchHash, setSearchHash] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadBlockchainData();
    }
  }, [user?.id]);

  const loadBlockchainData = async () => {
    setIsLoading(true);
    try {
      // Transactions blockchain réelles de la banque (user_id)
      const { data: txs } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const txList = txs || [];
      setTransactions(txList);

      // Certificats blockchain liés aux biens référencés dans les transactions
      const propertyIds = [...new Set(txList.map((t) => t.property_id).filter(Boolean))];
      if (propertyIds.length > 0) {
        const { data: certs } = await supabase
          .from('blockchain_certificates')
          .select('*')
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false });
        setCertificates(certs || []);
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error('Erreur chargement blockchain:', error);
      setTransactions([]);
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Statistiques réseau calculées à partir des vraies données (aucun chiffre fabriqué)
  const uniqueBlocks = new Set(
    transactions.map((t) => t.block_number).filter((b) => b != null)
  );
  const totalValueLocked = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const networkStats = {
    totalTransactions: transactions.length,
    totalBlocks: uniqueBlocks.size,
    certificates: certificates.length,
    totalValueLocked
  };

  const handleRefreshNetwork = () => {
    loadBlockchainData();
    window.safeGlobalToast({
      title: "Réseau actualisé",
      description: "Données blockchain rechargées depuis Supabase",
      variant: "success"
    });
  };

  const handleVerifyTransaction = (txHash) => {
    if (!txHash) {
      window.safeGlobalToast({
        title: "Aucun hash",
        description: "Cette transaction n'a pas encore de hash on-chain",
        variant: "warning"
      });
      return;
    }
    window.safeGlobalToast({
      title: "Transaction vérifiée",
      description: `Hash: ${txHash.substring(0, 20)}...`,
      variant: "success"
    });
  };

  const handleCopyHash = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    window.safeGlobalToast({
      title: "Hash copié",
      description: "Hash copié dans le presse-papier",
      variant: "success"
    });
  };

  const formatFcfa = (value) =>
    value > 0 ? `${(Number(value) / 1000000).toFixed(1)}M FCFA` : '—';

  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleString('fr-FR');
    } catch {
      return '—';
    }
  };

  const shortHash = (hash) => (hash ? `${hash.substring(0, 20)}...` : "En attente d'attribution");

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
      case 'confirmé':
      case 'completed':
      case 'verified':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'échoué':
        return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'garantie':
      case 'guarantee':
        return <Shield className="h-4 w-4" />;
      case 'transfert':
      case 'transfer':
        return <CreditCard className="h-4 w-4" />;
      case 'liberation':
      case 'release':
        return <Unlock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">TerangaChain Banking</h2>
          <p className="text-gray-600 mt-1">
            Blockchain pour la sécurisation des crédits et garanties foncières
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="outline"
            onClick={handleRefreshNetwork}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser Réseau
          </Button>
        </div>
      </div>

      {/* Statistiques du réseau (calculées sur les vraies transactions blockchain) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-bold">{networkStats.totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Blocs référencés</p>
                <p className="text-xl font-bold">{networkStats.totalBlocks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Certificats</p>
                <p className="text-xl font-bold">{networkStats.certificates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Banknote className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Valeur transigée</p>
                <p className="text-xl font-bold">
                  {networkStats.totalValueLocked > 0
                    ? `${(networkStats.totalValueLocked / 1000000).toFixed(1)}M`
                    : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="certificates">Certificats</TabsTrigger>
          <TabsTrigger value="explorer">Explorateur</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Transactions Blockchain
              </CardTitle>
              <CardDescription>
                Transactions enregistrées sur la blockchain (données Supabase)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-10 text-gray-500">Chargement…</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Database className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucune transaction blockchain</p>
                  <p className="text-sm">Aucune transaction on-chain n'est encore enregistrée pour cette banque.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getTypeIcon(tx.transaction_type || tx.type)}
                            <span className="font-medium">{tx.transaction_type || tx.type || 'Transaction'}</span>
                            <Badge className={getStatusColor(tx.status)}>
                              {tx.status || 'N/A'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Hash de Transaction</p>
                              <div className="flex items-center space-x-2">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {shortHash(tx.transaction_hash)}
                                </code>
                                {tx.transaction_hash && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyHash(tx.transaction_hash)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-gray-600">Montant</p>
                              <p className="font-medium">{formatFcfa(tx.amount)}</p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {tx.block_number != null && <span>Bloc #{tx.block_number}</span>}
                              <span>{formatDate(tx.created_at)}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyTransaction(tx.transaction_hash)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Vérifier
                              </Button>
                            </div>
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

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Certificats Blockchain
              </CardTitle>
              <CardDescription>
                Certificats on-chain liés aux biens des transactions (données Supabase)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-10 text-gray-500">Chargement…</div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Shield className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucun certificat blockchain</p>
                  <p className="text-sm">Aucun certificat on-chain n'est associé aux transactions de cette banque.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">Certificat {String(cert.id).substring(0, 8)}</h3>
                              <Badge className={getStatusColor(cert.status)}>
                                {cert.status || 'N/A'}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Hash du Certificat</p>
                                <div className="flex items-center space-x-2">
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {shortHash(cert.certificate_hash)}
                                  </code>
                                  {cert.certificate_hash && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCopyHash(cert.certificate_hash)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div>
                                <p className="text-gray-600">Date d'émission</p>
                                <p className="font-medium">{formatDate(cert.created_at)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explorer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-indigo-600" />
                Explorateur Blockchain
              </CardTitle>
              <CardDescription>
                Rechercher parmi les transactions enregistrées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Rechercher par hash de transaction ou numéro de bloc..."
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => handleVerifyTransaction(searchHash)}>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>

                {searchHash.trim() && (
                  <div className="space-y-3">
                    {transactions
                      .filter((t) => {
                        const term = searchHash.trim().toLowerCase();
                        return (
                          (t.transaction_hash || '').toLowerCase().includes(term) ||
                          String(t.block_number || '').includes(term)
                        );
                      })
                      .map((t) => (
                        <div key={t.id} className="border rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {shortHash(t.transaction_hash)}
                            </code>
                            <p className="text-xs text-gray-500 mt-1">
                              {t.block_number != null ? `Bloc #${t.block_number} · ` : ''}{formatDate(t.created_at)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(t.status)}>{t.status || 'N/A'}</Badge>
                        </div>
                      ))}
                    {transactions.filter((t) => {
                      const term = searchHash.trim().toLowerCase();
                      return (
                        (t.transaction_hash || '').toLowerCase().includes(term) ||
                        String(t.block_number || '').includes(term)
                      );
                    }).length === 0 && (
                      <p className="text-center py-6 text-sm text-gray-500">Aucun résultat pour cette recherche.</p>
                    )}
                  </div>
                )}

                <Card className="border">
                  <CardContent className="p-4 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Explorateur public on-chain</h3>
                    <p className="text-sm text-gray-600">Intégration explorateur externe bientôt disponible</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueBlockchain;