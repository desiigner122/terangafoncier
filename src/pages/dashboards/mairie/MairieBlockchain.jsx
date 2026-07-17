import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Key,
  Lock,
  Database,
  Globe,
  Link,
  QrCode,
  FileCheck,
  Zap,
  TrendingUp,
  Users,
  Building,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Copy,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Server,
  Coins,
  Wallet,
  ArrowUpDown,
  Hash,
  Award,
  Fingerprint,
  Plus,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';

const MairieBlockchain = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Données réelles Supabase
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const loadBlockchainData = async () => {
    setLoading(true);
    try {
      const [certRes, txRes] = await Promise.all([
        supabase
          .from('blockchain_certificates')
          .select('*, properties(title, name, city, region, surface, estimated_value, price)')
          .order('created_at', { ascending: false }),
        supabase
          .from('blockchain_transactions')
          .select('*, properties(title, name)')
          .order('created_at', { ascending: false })
          .limit(50)
      ]);

      if (certRes.error) throw certRes.error;
      if (txRes.error) throw txRes.error;

      setCertificates(certRes.data || []);
      setTransactions(txRes.data || []);
    } catch (error) {
      console.error('Erreur chargement blockchain:', error);
      setCertificates([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  // Statistiques dérivées des vraies données
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const transactions24h = transactions.filter(
    (tx) => tx.created_at && new Date(tx.created_at).getTime() >= oneDayAgo
  ).length;

  const portfolioValue = certificates.reduce((sum, cert) => {
    const val = cert.properties?.estimated_value ?? cert.properties?.price ?? 0;
    return sum + (Number(val) || 0);
  }, 0);

  const lastBlock = transactions.reduce((max, tx) => {
    const b = Number(tx.block_number) || 0;
    return b > max ? b : max;
  }, 0);

  const formatNumber = (n) =>
    (Number(n) || 0).toLocaleString('fr-FR');

  const formatCurrency = (n) =>
    `${(Number(n) || 0).toLocaleString('fr-FR')} FCFA`;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('fr-FR') : '—';

  const formatDateTime = (d) =>
    d
      ? new Date(d).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : '—';

  const getStatusColor = (status) => {
    const s = (status || '').toString().toLowerCase();
    switch (s) {
      case 'actif':
      case 'active':
      case 'valid':
      case 'valide':
      case 'confirmé':
      case 'confirmed':
      case 'déployé':
      case 'deployed':
        return 'bg-green-100 text-green-800';
      case 'en cours':
      case 'pending':
      case 'test':
        return 'bg-yellow-100 text-yellow-800';
      case 'échec':
      case 'failed':
      case 'revoked':
      case 'révoqué':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text) => {
    if (text) navigator.clipboard.writeText(text);
  };

  const truncateHash = (hash, start = 6, end = 4) => {
    if (!hash) return '—';
    if (hash.length <= start + end) return hash;
    return `${hash.slice(0, start)}...${hash.slice(-end)}`;
  };

  const propertyLabel = (p) => p?.title || p?.name || 'Bien non renseigné';

  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-10 w-10 text-gray-300 mb-3" />
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-1 max-w-sm">{description}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blockchain Municipal</h2>
          <p className="text-gray-600 mt-1">
            Certificats et transactions foncières enregistrés sur la blockchain
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" onClick={loadBlockchainData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Indicateurs Blockchain (données réelles) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificats émis</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? '—' : formatNumber(certificates.length)}
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions 24h</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? '—' : formatNumber(transactions24h)}
                </p>
              </div>
              <ArrowUpDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur certifiée</p>
                <p className="text-2xl font-bold text-purple-600">
                  {loading || certificates.length === 0 ? '—' : formatCurrency(portfolioValue)}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dernier bloc</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading || lastBlock === 0 ? '—' : `#${formatNumber(lastBlock)}`}
                </p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* État du réseau */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Registre foncier blockchain</strong> — {formatNumber(certificates.length)} certificat(s) et{' '}
          {formatNumber(transactions.length)} transaction(s) enregistré(s).
        </AlertDescription>
      </Alert>

      {/* Tabs Blockchain */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="nfts">Certificats</TabsTrigger>
          <TabsTrigger value="wallet">Portefeuille</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
        </TabsList>

        {/* Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Statistiques réseau */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 text-blue-600 mr-2" />
                  Registre foncier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Certificats émis</span>
                    <span className="font-medium">{formatNumber(certificates.length)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transactions totales</span>
                    <span className="font-medium">{formatNumber(transactions.length)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dernier bloc</span>
                    <span className="font-medium">{lastBlock === 0 ? '—' : `#${formatNumber(lastBlock)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Santé réseau</span>
                    <span className="font-medium text-gray-400">Bientôt disponible</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Prix du gas</span>
                    <span className="font-medium text-gray-400">Bientôt disponible</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                  </div>
                ) : transactions.length === 0 ? (
                  <EmptyState
                    icon={TrendingUp}
                    title="Aucune activité récente"
                    description="Les transactions blockchain apparaîtront ici dès leur enregistrement."
                  />
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 4).map((tx) => (
                      <div key={tx.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Hash className="h-5 w-5 text-blue-600 mr-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{propertyLabel(tx.properties)}</p>
                          <p className="text-xs text-gray-600">{formatDateTime(tx.created_at)}</p>
                        </div>
                        <Badge className={getStatusColor(tx.status)}>{tx.status || '—'}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Certificats (ex-NFTs) */}
        <TabsContent value="nfts" className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            </div>
          ) : certificates.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={Award}
                  title="Aucun certificat émis"
                  description="Les certificats fonciers enregistrés sur la blockchain apparaîtront ici."
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedNFT(cert)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-2">Certificat</Badge>
                        <CardTitle className="text-lg">{propertyLabel(cert.properties)}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(cert.status)}>
                        {cert.status || '—'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {cert.properties?.city || cert.properties?.region || 'Localisation non renseignée'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Surface</span>
                        <p className="font-medium">
                          {cert.properties?.surface ? `${cert.properties.surface} m²` : '—'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Émis le</span>
                        <p className="font-medium">{formatDate(cert.created_at)}</p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Hash certificat</span>
                      <p className="font-mono text-xs bg-gray-100 p-1 rounded">
                        {truncateHash(cert.certificate_hash, 8, 6)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">
                        {cert.properties?.estimated_value ?? cert.properties?.price
                          ? formatCurrency(cert.properties.estimated_value ?? cert.properties.price)
                          : '—'}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1"
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(cert.certificate_hash); }}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copier le hash
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Portefeuille (aucune source réelle) */}
        <TabsContent value="wallet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 text-purple-600 mr-2" />
                Portefeuille Municipal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Wallet}
                title="Portefeuille non configuré"
                description="La gestion des portefeuilles et jetons municipaux sera bientôt disponible."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions (données réelles) */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpDown className="h-5 w-5 text-blue-600 mr-2" />
                Transactions Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                </div>
              ) : transactions.length === 0 ? (
                <EmptyState
                  icon={ArrowUpDown}
                  title="Aucune transaction"
                  description="Les transactions foncières enregistrées sur la blockchain apparaîtront ici."
                />
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Hash className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{propertyLabel(tx.properties)}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{formatDateTime(tx.created_at)}</span>
                            <span>Bloc: {tx.block_number ? `#${formatNumber(tx.block_number)}` : '—'}</span>
                          </div>
                          <p className="font-mono text-xs text-gray-500 mt-1">
                            {truncateHash(tx.transaction_hash, 10, 8)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge className={getStatusColor(tx.status)}>
                          {tx.status || '—'}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          {tx.amount != null ? formatCurrency(tx.amount) : '—'}
                        </p>
                        {tx.transaction_hash && (
                          <Button size="sm" variant="outline" className="mt-2"
                                  onClick={() => copyToClipboard(tx.transaction_hash)}>
                            <Copy className="h-3 w-3 mr-1" />
                            Copier
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Contracts (aucune source réelle) */}
        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 text-blue-600 mr-2" />
                Smart Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Server}
                title="Aucun smart contract"
                description="Le déploiement et le suivi des smart contracts municipaux seront bientôt disponibles."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieBlockchain;
