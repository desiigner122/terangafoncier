import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Scan, FileCheck, AlertTriangle, CheckCircle,
  Upload, Eye, Download, Clock, MapPin, Database, Lock,
  Zap, Camera, FileText, Search, Filter, Award, Activity,
  Brain, XCircle, Info, RefreshCw, TrendingUp, TrendingDown,
  Image as ImageIcon, MapPinned, DollarSign, Hash, User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';
import { toast } from 'sonner';

const VendeurAntiFraudeRealData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // États
  const [disputes, setDisputes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  // Charger données anti-fraude (litiges réels + propriétés)
  useEffect(() => {
    if (user) {
      (async () => {
        setLoading(true);
        await Promise.all([loadProperties(), loadDisputes()]);
        setLoading(false);
      })();
    }
  }, [user]);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties').select('id, title, location, price, surface, status').eq('owner_id', user.id)
        .order('created_at', { ascending: false});

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
    }
  };

  const loadDisputes = async () => {
    try {
      const result = await VendeurSupabaseService.getDisputes(user.id);
      if (!result.success) throw new Error(result.error || 'Erreur inconnue');
      setDisputes(result.data || []);
    } catch (error) {
      console.error('Erreur chargement litiges:', error);
      toast.error('Erreur lors du chargement des litiges');
      setDisputes([]);
    }
  };

  // Statistiques réelles calculées à partir des propriétés et des litiges du vendeur
  // (aucun score IA n'est fabriqué : uniquement des comptages dérivés de données réelles)
  const stats = useMemo(() => {
    const totalProperties = properties.length;
    const openDisputes = disputes.filter(d => d.status === 'open');
    const resolvedDisputes = disputes.filter(d => d.status === 'resolved');
    const propertiesAtRiskIds = new Set(openDisputes.map(d => d.property_id));
    const propertiesClean = Math.max(totalProperties - propertiesAtRiskIds.size, 0);
    const confidenceRate = totalProperties > 0
      ? Math.round((propertiesClean / totalProperties) * 100)
      : null;

    return {
      totalProperties,
      propertiesClean,
      openDisputesCount: openDisputes.length,
      resolvedDisputesCount: resolvedDisputes.length,
      confidenceRate
    };
  }, [properties, disputes]);

  // Vérification en direct d'une propriété : statut de vérification réel,
  // présence de coordonnées GPS réelles, et litiges réels associés.
  // Ne produit aucun score inventé et n'écrit dans aucune table fictive.
  const runPropertyCheck = async (propertyId) => {
    if (!propertyId) {
      toast.error('Veuillez sélectionner une propriété');
      return;
    }

    setIsScanning(true);
    try {
      const { data: property, error: propError } = await supabase
        .from('properties')
        .select('id, title, location, price, surface, status, verification_status, latitude, longitude')
        .eq('id', propertyId)
        .single();

      if (propError) throw propError;

      const propertyDisputes = disputes.filter(d => d.property_id === propertyId);
      const openCount = propertyDisputes.filter(d => d.status === 'open').length;
      const resolvedCount = propertyDisputes.filter(d => d.status === 'resolved').length;
      const hasGps = property.latitude != null && property.longitude != null;

      setScanResult({
        property,
        openCount,
        resolvedCount,
        hasGps,
        checkedAt: new Date().toISOString()
      });

      toast.success(
        openCount > 0
          ? `Vérification terminée : ${openCount} litige(s) ouvert(s) détecté(s)`
          : 'Vérification terminée : aucun litige ouvert sur cette propriété'
      );
    } catch (error) {
      console.error('Erreur vérification propriété:', error);
      toast.error('Erreur lors de la vérification');
    } finally {
      setIsScanning(false);
    }
  };

  const handleRefreshDisputes = async () => {
    await loadDisputes();
    toast.success('Litiges actualisés');
  };

  const handleExportReport = async (disputeId) => {
    try {
      const dispute = disputes.find(d => d.id === disputeId);
      if (!dispute) {
        toast.error('Litige introuvable');
        return;
      }

      const partiesText = Array.isArray(dispute.parties)
        ? dispute.parties.map((p, i) => `  ${i + 1}. ${typeof p === 'string' ? p : (p?.name || JSON.stringify(p))}`).join('\n')
        : (dispute.parties ? JSON.stringify(dispute.parties, null, 2) : 'Aucune partie enregistrée');

      const report = `RAPPORT DE SUIVI ANTI-FRAUDE
=====================================================
Généré le: ${new Date().toLocaleString('fr-FR')}
Propriété: ${dispute.property?.title || 'Sans titre'}

RÉSUMÉ
------
Litige: ${dispute.title || 'N/A'}
Statut: ${dispute.status === 'open' ? 'Ouvert' : dispute.status === 'resolved' ? 'Résolu' : (dispute.status || 'N/A')}
Ouvert le: ${dispute.created_at ? new Date(dispute.created_at).toLocaleString('fr-FR') : 'N/A'}
Dernière mise à jour: ${dispute.updated_at ? new Date(dispute.updated_at).toLocaleString('fr-FR') : 'N/A'}

PARTIES IMPLIQUÉES
-------------------
${partiesText}

---
Rapport généré par Teranga Foncier
Pour toute question, contactez: support@terangafoncier.sn
`;

      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-litige-${(dispute.property?.title || 'propriete').replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Rapport téléchargé');
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      resolved: 'bg-green-100 text-green-800 border-green-200',
      open: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (status) => {
    if (status === 'open') return 'Ouvert';
    if (status === 'resolved') return 'Résolu';
    return status || 'N/A';
  };

  const partiesCount = (parties) => {
    if (Array.isArray(parties)) return parties.length;
    if (parties && typeof parties === 'object') return Object.keys(parties).length;
    return null;
  };

  const filteredDisputes = disputes.filter(d =>
    d.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Chargement des vérifications anti-fraude...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            Vérification Anti-Fraude
          </h1>
          <p className="text-gray-600 mt-2">
            Surveillance des litiges et vérification de vos annonces
          </p>
        </div>
        <Button
          onClick={() => setActiveTab('scan')}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
        >
          <Scan className="h-4 w-4 mr-2" />
          Nouvelle Vérification
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Propriétés Suivies',
            value: stats.totalProperties,
            icon: Scan,
            color: 'blue',
            trend: null
          },
          {
            label: 'Sans Litige',
            value: stats.propertiesClean,
            icon: CheckCircle,
            color: 'green',
            trend: stats.totalProperties > 0
              ? `${Math.round((stats.propertiesClean / stats.totalProperties) * 100)}%`
              : null
          },
          {
            label: 'Litiges Ouverts',
            value: stats.openDisputesCount,
            icon: AlertTriangle,
            color: 'yellow',
            trend: null
          },
          {
            label: 'Litiges Résolus',
            value: stats.resolvedDisputesCount,
            icon: Clock,
            color: 'purple',
            trend: null
          },
          {
            label: 'Taux de Confiance',
            value: stats.confidenceRate !== null ? `${stats.confidenceRate}%` : '—',
            icon: Award,
            color: (stats.confidenceRate ?? 0) >= 80 ? 'green' : 'yellow',
            trend: null
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4" style={{ borderLeftColor: `var(--${stat.color}-500)` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <Badge variant="outline" className="mt-2 text-green-700 bg-green-50">
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Eye className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="scan">
            <Scan className="h-4 w-4 mr-2" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alertes
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confidence Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Taux de Confiance Global
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-6xl font-bold text-green-600 mb-2">
                    {stats.confidenceRate !== null ? `${stats.confidenceRate}%` : '—'}
                  </div>
                  <p className="text-gray-600 mb-4">Propriétés sans litige ouvert</p>
                  <Progress value={stats.confidenceRate ?? 0} className="h-3" />
                  <p className="text-sm text-gray-500 mt-2">
                    Basé sur {stats.totalProperties} propriété(s) suivie(s)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Distribution des Risques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Sans Litige</span>
                    </div>
                    <span className="font-semibold">{stats.propertiesClean}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Litiges Ouverts</span>
                    </div>
                    <span className="font-semibold">{stats.openDisputesCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Litiges Résolus</span>
                    </div>
                    <span className="font-semibold">{stats.resolvedDisputesCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Disputes */}
          <Card>
            <CardHeader>
              <CardTitle>Litiges Récents</CardTitle>
              <CardDescription>Derniers litiges enregistrés sur vos annonces</CardDescription>
            </CardHeader>
            <CardContent>
              {disputes.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">Aucun litige enregistré pour le moment</p>
                </div>
              ) : (
                disputes.slice(0, 5).map((dispute, index) => (
                  <motion.div
                    key={dispute.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg mb-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        dispute.status === 'resolved' ? 'bg-green-100' :
                        dispute.status === 'open' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {dispute.status === 'resolved' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : dispute.status === 'open' ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{dispute.property?.title || dispute.title}</p>
                        <p className="text-sm text-gray-600">
                          {dispute.created_at ? new Date(dispute.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(dispute.status)}>
                        {getStatusLabel(dispute.status)}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scanner */}
        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-red-600" />
                Lancer une Vérification
              </CardTitle>
              <CardDescription>
                Consultez l'état réel d'une propriété : statut de vérification, coordonnées GPS et litiges en cours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  La vérification consulte les informations enregistrées sur la propriété
                  (statut, coordonnées GPS) et recherche les litiges réellement associés à cette annonce.
                </AlertDescription>
              </Alert>

              {/* Formulaire Scan */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Propriété à vérifier</label>
                  {properties.length > 0 ? (
                    <select
                      className="w-full p-2 border rounded-lg"
                      onChange={(e) => setSelectedProperty({ id: e.target.value })}
                      defaultValue=""
                    >
                      <option value="" disabled>Sélectionner une propriété...</option>
                      {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>
                          {prop.title} - {prop.location} ({prop.price?.toLocaleString('fr-FR')} FCFA)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-center py-4 border rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600">
                        Aucune propriété disponible. Ajoutez une propriété d'abord.
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => runPropertyCheck(selectedProperty?.id)}
                  disabled={isScanning || !selectedProperty?.id}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Vérification en cours...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4 mr-2" />
                      Démarrer la Vérification
                    </>
                  )}
                </Button>
              </div>

              {/* Process Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Étapes de Vérification</h4>
                <div className="space-y-2">
                  {[
                    { label: '1. Récupération des informations de la propriété', icon: FileText },
                    { label: '2. Vérification du statut de la propriété', icon: Shield },
                    { label: '3. Vérification des coordonnées GPS enregistrées', icon: MapPin },
                    { label: '4. Recherche des litiges associés', icon: AlertTriangle },
                    { label: '5. Génération du récapitulatif', icon: Award }
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résultat de la vérification (données réelles) */}
              {scanResult && (
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-600" />
                    Résultat de la Vérification — {scanResult.property.title}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">Statut</p>
                      <p className="text-sm font-semibold">
                        {scanResult.property.verification_status || scanResult.property.status || 'N/A'}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                      <p className="text-xs text-gray-600">GPS</p>
                      <p className={`text-sm font-semibold ${scanResult.hasGps ? 'text-green-600' : 'text-red-600'}`}>
                        {scanResult.hasGps ? 'Renseigné' : 'Manquant'}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                      <p className="text-xs text-gray-600">Litiges Ouverts</p>
                      <p className={`text-sm font-semibold ${scanResult.openCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {scanResult.openCount}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <CheckCircle className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                      <p className="text-xs text-gray-600">Litiges Résolus</p>
                      <p className="text-sm font-semibold text-gray-900">{scanResult.resolvedCount}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Vérifié le {new Date(scanResult.checkedAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historique des Litiges</CardTitle>
                  <CardDescription>
                    Tous les litiges liés à vos annonces
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" onClick={handleRefreshDisputes}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredDisputes.length === 0 ? (
                <div className="text-center py-12">
                  <Scan className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucun litige trouvé</p>
                  <Button
                    onClick={() => setActiveTab('scan')}
                    className="bg-gradient-to-r from-red-500 to-red-600"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Vérifier une Propriété
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDisputes.map((dispute, index) => (
                    <motion.div
                      key={dispute.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {dispute.property?.title || 'Propriété'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {dispute.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${dispute.status === 'open' ? 'text-red-600' : 'text-green-600'}`}>
                            {getStatusLabel(dispute.status)}
                          </div>
                          <p className="text-xs text-gray-600">Statut</p>
                        </div>
                      </div>

                      {/* Détails du litige */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <Shield className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                          <p className="text-xs text-gray-600">Statut</p>
                          <p className="text-sm font-semibold">
                            {getStatusLabel(dispute.status)}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <Clock className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                          <p className="text-xs text-gray-600">Ouvert le</p>
                          <p className="text-sm font-semibold">
                            {dispute.created_at ? new Date(dispute.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <User className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                          <p className="text-xs text-gray-600">Parties</p>
                          <p className="text-sm font-semibold">
                            {partiesCount(dispute.parties) ?? '—'}
                          </p>
                        </div>
                      </div>

                      {/* Alerte pour litige ouvert */}
                      {dispute.status === 'open' && (
                        <Alert variant="destructive" className="mb-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {dispute.title || 'Litige en cours nécessitant une attention'}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(dispute.status)}>
                            {getStatusLabel(dispute.status)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {dispute.created_at ? new Date(dispute.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefreshDisputes}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportReport(dispute.id)}
                          >
                            <Download className="h-4 w-4" />
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

        {/* Alertes */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Alertes et Litiges Ouverts
              </CardTitle>
              <CardDescription>
                Propriétés nécessitant une attention particulière
              </CardDescription>
            </CardHeader>
            <CardContent>
              {disputes.filter(d => d.status === 'open').length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune alerte détectée</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Aucun litige ouvert sur vos propriétés
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {disputes
                    .filter(d => d.status === 'open')
                    .map((dispute, index) => (
                      <motion.div
                        key={dispute.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {dispute.property?.title || 'Propriété'}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Litige ouvert le {dispute.created_at ? new Date(dispute.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                            </p>
                            {dispute.title && (
                              <p className="text-sm text-yellow-800 mt-1">
                                • {dispute.title}
                              </p>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3"
                              onClick={handleRefreshDisputes}
                            >
                              Actualiser
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
      </Tabs>
    </div>
  );
};

export default VendeurAntiFraudeRealData;
