import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  Key,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Smartphone,
  Users,
  TrendingUp,
  Database,
  Zap,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Building2,
  MapPin,
  Phone,
  Mail,
  Upload,
  Image,
  CreditCard as CreditCardIcon,
  Crown,
  Gem,
  Star as StarIcon,
  Check,
  X,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  Zap as ZapIcon,
  Infinity,
  ArrowUpCircle,
  ShoppingCart,
  Receipt as ReceiptIcon,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Clé locale pour les préférences d'interface (aucune table dédiée en base)
const PREFS_STORAGE_KEY = 'banque_settings_preferences';
const BANKING_STORAGE_KEY = 'banque_settings_services';

const DEFAULT_PREFERENCES = {
  language: 'fr',
  currency: 'XOF',
  timezone: 'Africa/Dakar',
  theme: 'light'
};

const DEFAULT_BANKING = {
  kycAutomation: true,
  scoringIA: true,
  apiBanking: true,
  diasporaMarket: true,
  nftGuarantees: true,
  realTimeAnalytics: true,
  complianceAuto: true
};

const loadLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
};

const formatMillions = (value) => {
  const n = Number(value) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString('fr-FR');
};

const relativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
};

const dotColor = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'success': case 'approved': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'error': case 'danger': return 'bg-red-500';
    case 'blockchain': return 'bg-purple-500';
    default: return 'bg-blue-500';
  }
};

const BanqueSettings = ({ dashboardStats = {} }) => {
  const { user, profile } = useAuth();

  // Informations institution : mappées sur la table profiles (colonnes réelles).
  // Les champs sans colonne en base (licence, capital, agences...) restent locaux/honnêtes.
  const [bankInfo, setBankInfo] = useState({
    name: '',
    fullName: '',
    registrationNumber: '',
    licence: '',
    address: '',
    city: '',
    region: '',
    country: 'Sénégal',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    logo: null,
    director: '',
    foundedYear: '',
    capital: '',
    employees: '',
    branches: ''
  });

  const [preferences, setPreferences] = useState(() => loadLocal(PREFS_STORAGE_KEY, DEFAULT_PREFERENCES));
  const [banking, setBanking] = useState(() => loadLocal(BANKING_STORAGE_KEY, DEFAULT_BANKING));

  const [subscription, setSubscription] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Chargement des données réelles ---
  const loadProfile = useCallback(() => {
    if (!profile && !user) return;
    setBankInfo(prev => ({
      ...prev,
      director: profile?.full_name || [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || '',
      name: profile?.full_name || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
      region: profile?.region || ''
    }));
  }, [profile, user]);

  const loadSubscription = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setSubscription(data || null);
    } catch {
      setSubscription(null);
    }
  }, [user]);

  const loadLogs = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('notifications')
        .select('id, title, message, type, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(15);
      setLogs(data || []);
    } catch {
      setLogs([]);
    }
  }, [user]);

  const loadLoans = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('loans')
        .select('id, amount, type, client_name, status, created_at')
        .eq('bank_id', user.id);
      setLoans(data || []);
    } catch {
      setLoans([]);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
    Promise.all([loadSubscription(), loadLogs(), loadLoans()]).finally(() => setLoading(false));
  }, [loadProfile, loadSubscription, loadLogs, loadLoans]);

  // --- Sauvegardes ---
  const handleSaveSettings = async () => {
    if (!user?.id) {
      window.safeGlobalToast?.({ title: 'Non authentifié', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: bankInfo.director || bankInfo.name || null,
          phone: bankInfo.phone || null,
          city: bankInfo.city || null,
          region: bankInfo.region || null
        })
        .eq('id', user.id);
      if (error) throw error;
      window.safeGlobalToast?.({
        title: 'Paramètres sauvegardés',
        description: 'Vos informations de profil ont été mises à jour.',
        variant: 'success'
      });
    } catch (e) {
      window.safeGlobalToast?.({
        title: 'Erreur de sauvegarde',
        description: e.message || 'Impossible de mettre à jour le profil.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = (next) => {
    setPreferences(next);
    try { localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
  };

  const saveBanking = (next) => {
    setBanking(next);
    try { localStorage.setItem(BANKING_STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
  };

  const handleUpgradePlan = (planName, price) => {
    window.safeGlobalToast?.({
      title: "Demande d'upgrade envoyée",
      description: `Votre demande d'upgrade vers ${planName} (${price}K XOF/mois) a été transmise à notre équipe commerciale.`,
      variant: "success"
    });
  };

  // --- Agrégats portefeuille (réels, dérivés de loans) ---
  const activeLoans = loans.filter(l => ['approved', 'disbursed'].includes(l.status));
  const encoursTotal = activeLoans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const decidedLoans = loans.filter(l => ['approved', 'disbursed', 'rejected'].includes(l.status));
  const approvedCount = loans.filter(l => ['approved', 'disbursed'].includes(l.status)).length;
  const approvalRate = decidedLoans.length ? ((approvedCount / decidedLoans.length) * 100).toFixed(1) : null;
  const avgAmount = activeLoans.length ? encoursTotal / activeLoans.length : 0;

  // Répartition par type
  const byType = activeLoans.reduce((acc, l) => {
    const key = l.type || 'Autre';
    acc[key] = (acc[key] || 0) + (Number(l.amount) || 0);
    return acc;
  }, {});
  const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1]);
  const typeColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'];

  // Top clients
  const byClient = activeLoans.reduce((acc, l) => {
    const key = l.client_name || 'Client inconnu';
    acc[key] = (acc[key] || 0) + (Number(l.amount) || 0);
    return acc;
  }, {});
  const topClients = Object.entries(byClient).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const plan = subscription?.subscription_plans || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Paramètres Bancaires</h2>
          <p className="text-gray-600 mt-1">
            Configuration et préférences du système bancaire avancé
          </p>
        </div>

        <Button onClick={handleSaveSettings} disabled={saving} className="mt-4 lg:mt-0">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Sauvegarder
        </Button>
      </div>

      {/* Statut système (indicateurs de configuration des services locaux) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Banking</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className={`h-4 w-4 mr-1 ${banking.apiBanking ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-sm font-medium">{banking.apiBanking ? 'Activé' : 'Désactivé'}</span>
                </div>
              </div>
              <div className="text-green-500">
                <Database className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">KYC Automatisé</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className={`h-4 w-4 mr-1 ${banking.kycAutomation ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-sm font-medium">{banking.kycAutomation ? 'Activé' : 'Désactivé'}</span>
                </div>
              </div>
              <div className="text-blue-500">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scoring IA</p>
                <div className="flex items-center mt-1">
                  <Zap className={`h-4 w-4 mr-1 ${banking.scoringIA ? 'text-yellow-500' : 'text-gray-300'}`} />
                  <span className="text-sm font-medium">{banking.scoringIA ? 'Activé' : 'Désactivé'}</span>
                </div>
              </div>
              <div className="text-yellow-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dossiers de crédit</p>
                <div className="flex items-center mt-1">
                  <FileText className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm font-medium">{loading ? '—' : `${loans.length} enregistrés`}</span>
                </div>
              </div>
              <div className="text-purple-500">
                <Shield className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="banking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="bankinfo">Informations Banque</TabsTrigger>
          <TabsTrigger value="abonnement">Abonnement</TabsTrigger>
          <TabsTrigger value="banking">Services Banking</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="api">API & Intégrations</TabsTrigger>
          <TabsTrigger value="team">Équipe & Rôles</TabsTrigger>
          <TabsTrigger value="logs">Logs & Audit</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="bankinfo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Informations Générales
                </CardTitle>
                <CardDescription>
                  Informations de base de votre profil bancaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="bankName">Nom de la banque</Label>
                    <Input
                      id="bankName"
                      value={bankInfo.name}
                      placeholder="Nom de l'institution"
                      onChange={(e) => setBankInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fullName">Dénomination complète</Label>
                    <Input
                      id="fullName"
                      value={bankInfo.fullName}
                      placeholder="Dénomination officielle complète"
                      onChange={(e) => setBankInfo(prev => ({ ...prev, fullName: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="regNumber">N° d'enregistrement</Label>
                      <Input
                        id="regNumber"
                        value={bankInfo.registrationNumber}
                        placeholder="—"
                        onChange={(e) => setBankInfo(prev => ({ ...prev, registrationNumber: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="licence">Licence bancaire</Label>
                      <Input
                        id="licence"
                        value={bankInfo.licence}
                        placeholder="—"
                        onChange={(e) => setBankInfo(prev => ({ ...prev, licence: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="director">Directeur Général / Contact</Label>
                    <Input
                      id="director"
                      value={bankInfo.director}
                      placeholder="Nom du responsable"
                      onChange={(e) => setBankInfo(prev => ({ ...prev, director: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="foundedYear">Année de création</Label>
                      <Input
                        id="foundedYear"
                        value={bankInfo.foundedYear}
                        placeholder="—"
                        onChange={(e) => setBankInfo(prev => ({ ...prev, foundedYear: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="employees">Employés</Label>
                      <Input
                        id="employees"
                        type="number"
                        value={bankInfo.employees}
                        placeholder="—"
                        onChange={(e) => setBankInfo(prev => ({ ...prev, employees: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="branches">Agences</Label>
                      <Input
                        id="branches"
                        type="number"
                        value={bankInfo.branches}
                        placeholder="—"
                        onChange={(e) => setBankInfo(prev => ({ ...prev, branches: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="capital">Capital social</Label>
                    <Input
                      id="capital"
                      value={bankInfo.capital}
                      placeholder="—"
                      onChange={(e) => setBankInfo(prev => ({ ...prev, capital: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Les champs sans colonne dédiée (licence, capital, agences...) ne sont pas encore persistés en base.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Coordonnées et contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Coordonnées & Contact
                </CardTitle>
                <CardDescription>
                  Informations de contact et localisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    value={bankInfo.address}
                    placeholder="Adresse"
                    onChange={(e) => setBankInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={bankInfo.city}
                      placeholder="Ville"
                      onChange={(e) => setBankInfo(prev => ({ ...prev, city: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="region">Région</Label>
                    <Input
                      id="region"
                      value={bankInfo.region}
                      placeholder="Région"
                      onChange={(e) => setBankInfo(prev => ({ ...prev, region: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Select
                    value={bankInfo.country}
                    onValueChange={(value) => setBankInfo(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sénégal">Sénégal</SelectItem>
                      <SelectItem value="Mali">Mali</SelectItem>
                      <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                      <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Togo">Togo</SelectItem>
                      <SelectItem value="Bénin">Bénin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Téléphone principal
                  </Label>
                  <Input
                    id="phone"
                    value={bankInfo.phone}
                    placeholder="+221 ..."
                    onChange={(e) => setBankInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email officiel
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={bankInfo.email}
                    disabled
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-400 mt-1">L'email est géré par le compte et non modifiable ici.</p>
                </div>

                <div>
                  <Label htmlFor="website" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Site web
                  </Label>
                  <Input
                    id="website"
                    value={bankInfo.website}
                    placeholder="www.exemple.sn"
                    onChange={(e) => setBankInfo(prev => ({ ...prev, website: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logo de la banque */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Logo et Identité Visuelle
              </CardTitle>
              <CardDescription>
                Gérez le logo et l'identité visuelle de votre banque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Logo banque"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="space-y-2">
                    <Label>Logo de la banque</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" className="flex items-center" disabled>
                        <Upload className="h-4 w-4 mr-2" />
                        Télécharger un logo
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Téléversement du logo bientôt disponible (bucket Storage « avatars »).
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abonnement" className="space-y-6">
          {/* Statut abonnement actuel (réel via user_subscriptions) */}
          {subscription && plan ? (
            <Card className="border-l-4 border-l-green-500 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-green-800">
                      <Crown className="h-6 w-6 mr-2" />
                      Plan {plan.name || plan.role_type || 'Actif'}
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      {subscription.end_date || subscription.expires_at
                        ? `Abonnement valide jusqu'au ${new Date(subscription.end_date || subscription.expires_at).toLocaleDateString('fr-FR')}`
                        : 'Abonnement actif'}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {(subscription.status || 'actif').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <CreditCardIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{plan.price ? formatMillions(plan.price) : '—'}</p>
                    <p className="text-sm text-gray-600">XOF{plan.duration_days ? ` / ${plan.duration_days}j` : ''}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <CalendarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {(subscription.end_date || subscription.expires_at)
                        ? Math.max(0, Math.ceil((new Date(subscription.end_date || subscription.expires_at) - new Date()) / (1000 * 60 * 60 * 24)))
                        : '—'}
                    </p>
                    <p className="text-sm text-gray-600">jours restants</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{(subscription.payment_status || 'actif').toUpperCase()}</p>
                    <p className="text-sm text-gray-600">paiement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Crown className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-700">Aucun abonnement actif</p>
                <p className="text-sm">Choisissez un plan ci-dessous pour activer votre abonnement.</p>
              </CardContent>
            </Card>
          )}

          {/* Plans d'abonnement disponibles (contenu commercial statique) */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Plans d'Abonnement Disponibles
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plan Starter */}
              <Card className="relative">
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Starter</CardTitle>
                  <CardDescription>Parfait pour débuter</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">750K</span>
                    <span className="text-gray-600 ml-1">XOF/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Jusqu'à 10 utilisateurs</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Gestion de base des crédits</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>KYC manuel</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Support par email</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span>TerangaChain Banking</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span>IA Scoring</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleUpgradePlan('Starter', '750')}
                  >
                    Sélectionner Starter
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Professional */}
              <Card className="relative border-2 border-blue-500">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">POPULAIRE</Badge>
                </div>
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gem className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Professional</CardTitle>
                  <CardDescription>Pour banques en croissance</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">1.5M</span>
                    <span className="text-gray-600 ml-1">XOF/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Jusqu'à 25 utilisateurs</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Gestion avancée des crédits</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>KYC automatisé</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>TerangaChain Banking</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Analytics de base</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Support téléphonique</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleUpgradePlan('Professional', '1500')}
                  >
                    Passer à Professional
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Enterprise */}
              <Card className="relative border-2 border-green-500 bg-green-50/30">
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Enterprise</CardTitle>
                  <CardDescription>Solution complète</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">2.5M</span>
                    <span className="text-gray-600 ml-1">XOF/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Jusqu'à 50 utilisateurs</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Toutes les fonctionnalités</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>IA Scoring Crédit</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Analytics avancées</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Support premium 24/7</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Formation personnalisée</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleUpgradePlan('Enterprise', '2500')}
                  >
                    Passer à Enterprise
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Paramètres d'abonnement + Support */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Paramètres d'Abonnement
                </CardTitle>
                <CardDescription>
                  Gérez vos préférences de facturation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Méthode de paiement</Label>
                  <Select defaultValue="mobile">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                      <SelectItem value="bank">Virement bancaire</SelectItem>
                      <SelectItem value="card">Carte bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fréquence de facturation</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="quarterly">Trimestriel (-5%)</SelectItem>
                      <SelectItem value="yearly">Annuel (-15%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-400">
                  La gestion de la facturation en libre-service sera bientôt disponible.
                </p>
              </CardContent>
            </Card>

            {/* Historique des factures (réel via user_subscriptions) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ReceiptIcon className="h-5 w-5 mr-2" />
                  Détails de l'abonnement
                </CardTitle>
                <CardDescription>
                  Informations sur votre abonnement en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Statut</span>
                      <Badge className="bg-green-100 text-green-800">{subscription.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Souscrit le</span>
                      <span className="text-sm font-medium">
                        {subscription.created_at ? new Date(subscription.created_at).toLocaleDateString('fr-FR') : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Paiement</span>
                      <span className="text-sm font-medium">{subscription.payment_status || '—'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ReceiptIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Aucune facture disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Support et assistance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Support Abonnement
              </CardTitle>
              <CardDescription>
                Besoin d'aide avec votre abonnement ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contacter le support
                </Button>
                <Button variant="outline" className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email commercial
                </Button>
                <Button variant="outline" className="flex items-center justify-center">
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Demander upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Services Bancaires Avancés
              </CardTitle>
              <CardDescription>
                Activez ou désactivez les modules (préférences enregistrées localement)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        KYC Automatisé
                      </Label>
                      <p className="text-sm text-gray-500">
                        Vérification d'identité automatique
                      </p>
                    </div>
                    <Switch
                      checked={banking.kycAutomation}
                      onCheckedChange={(checked) => saveBanking({ ...banking, kycAutomation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Scoring Crédit IA
                      </Label>
                      <p className="text-sm text-gray-500">
                        Évaluation intelligente des risques de crédit
                      </p>
                    </div>
                    <Switch
                      checked={banking.scoringIA}
                      onCheckedChange={(checked) => saveBanking({ ...banking, scoringIA: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Marché Diaspora
                      </Label>
                      <p className="text-sm text-gray-500">
                        Services spécialisés pour la diaspora sénégalaise
                      </p>
                    </div>
                    <Switch
                      checked={banking.diasporaMarket}
                      onCheckedChange={(checked) => saveBanking({ ...banking, diasporaMarket: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Garanties NFT
                      </Label>
                      <p className="text-sm text-gray-500">
                        Garanties tokenisées sur TerangaChain
                      </p>
                    </div>
                    <Switch
                      checked={banking.nftGuarantees}
                      onCheckedChange={(checked) => saveBanking({ ...banking, nftGuarantees: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        API Banking
                      </Label>
                      <p className="text-sm text-gray-500">
                        Interface de programmation bancaire
                      </p>
                    </div>
                    <Switch
                      checked={banking.apiBanking}
                      onCheckedChange={(checked) => saveBanking({ ...banking, apiBanking: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Analytics Temps Réel
                      </Label>
                      <p className="text-sm text-gray-500">
                        Tableau de bord et métriques en direct
                      </p>
                    </div>
                    <Switch
                      checked={banking.realTimeAnalytics}
                      onCheckedChange={(checked) => saveBanking({ ...banking, realTimeAnalytics: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Conformité Automatique
                      </Label>
                      <p className="text-sm text-gray-500">
                        Vérification réglementaire automatisée
                      </p>
                    </div>
                    <Switch
                      checked={banking.complianceAuto}
                      onCheckedChange={(checked) => saveBanking({ ...banking, complianceAuto: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Préférences Générales
              </CardTitle>
              <CardDescription>
                Configuration de base (enregistrée localement sur cet appareil)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select value={preferences.language} onValueChange={(v) => savePreferences({ ...preferences, language: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="wo">Wolof</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Devise principale</Label>
                  <Select value={preferences.currency} onValueChange={(v) => savePreferences({ ...preferences, currency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">FCFA (XOF)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">Dollar US (USD)</SelectItem>
                      <SelectItem value="GBP">Livre Sterling (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select value={preferences.timezone} onValueChange={(v) => savePreferences({ ...preferences, timezone: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dakar">Dakar (GMT+0)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Africa/Casablanca">Casablanca (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Thème d'interface</Label>
                  <Select value={preferences.theme} onValueChange={(v) => savePreferences({ ...preferences, theme: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                      <SelectItem value="high-contrast">Contraste élevé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                API Banking & Intégrations
              </CardTitle>
              <CardDescription>
                Configuration des API et intégrations avec les partenaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">Point de terminaison API</Label>
                  <Input
                    id="apiEndpoint"
                    placeholder="https://api.votre-banque.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">Clé API de production</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Votre clé API sécurisée"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">URL Webhook</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://votre-site.com/webhooks"
                  />
                </div>

                <p className="text-xs text-gray-400">
                  La gestion des clés API sera bientôt disponible.
                </p>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Intégrations Partenaires</h4>
                <div className="p-6 border rounded-lg text-center text-gray-500">
                  <Database className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Aucune intégration partenaire configurée pour le moment.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Équipe & Rôles */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gestion de l'Équipe Bancaire
              </CardTitle>
              <CardDescription>
                Membres de l'équipe, rôles et permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 border rounded-lg text-center text-gray-500">
                <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-700">Gestion d'équipe bientôt disponible</p>
                <p className="text-sm">La gestion des membres et des rôles internes n'est pas encore reliée à une source de données.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs & Audit (réel via notifications) */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Logs & Audit Trail
              </CardTitle>
              <CardDescription>
                Historique des notifications et événements récents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button variant="outline" disabled={logs.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export logs
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-8 text-gray-400">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="p-8 border rounded-lg text-center text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Aucun événement enregistré</p>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${dotColor(log.type)}`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{log.title || 'Événement'}</p>
                              {log.message && <p className="text-sm text-gray-500">{log.message}</p>}
                            </div>
                          </div>
                          <span className="text-sm text-gray-400">{relativeTime(log.created_at)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio (réel via loans) */}
        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Portfolio Bancaire
              </CardTitle>
              <CardDescription>
                Vue d'ensemble du portefeuille de crédits (données réelles)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="text-center py-8 text-gray-400">
                  <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                </div>
              ) : loans.length === 0 ? (
                <div className="p-8 border rounded-lg text-center text-gray-500">
                  <CreditCard className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-700">Aucun crédit au portefeuille</p>
                  <p className="text-sm">Les dossiers de crédit apparaîtront ici une fois créés.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Encours Total</p>
                          <p className="text-2xl font-bold text-blue-900">{formatMillions(encoursTotal)} FCFA</p>
                          <p className="text-sm text-blue-600">{activeLoans.length} crédits actifs</p>
                        </div>
                        <CreditCard className="h-10 w-10 text-blue-600" />
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Montant Moyen</p>
                          <p className="text-2xl font-bold text-green-900">{formatMillions(avgAmount)} FCFA</p>
                          <p className="text-sm text-green-600">par crédit actif</p>
                        </div>
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600 font-medium">Taux d'approbation</p>
                          <p className="text-2xl font-bold text-orange-900">{approvalRate !== null ? `${approvalRate}%` : '—'}</p>
                          <p className="text-sm text-orange-600">{loans.length} dossiers au total</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {typeEntries.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Répartition par Type de Crédit</h4>
                      <div className="space-y-3">
                        {typeEntries.map(([type, amount], idx) => {
                          const pct = encoursTotal ? Math.round((amount / encoursTotal) * 100) : 0;
                          return (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded ${typeColors[idx % typeColors.length]}`}></div>
                                <span className="text-sm font-medium">{type}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <Progress value={pct} className="w-24" />
                                <span className="text-sm text-gray-600 whitespace-nowrap">{formatMillions(amount)} FCFA ({pct}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Top Clients</h4>
                      <div className="space-y-2">
                        {topClients.length === 0 ? (
                          <p className="text-sm text-gray-400">Aucun client</p>
                        ) : topClients.map(([name, amount]) => (
                          <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">{name}</span>
                            <span className="text-sm text-gray-600">{formatMillions(amount)} FCFA</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Métriques Clés</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Taux d'approbation</span>
                          <span className="text-sm text-green-600 font-semibold">{approvalRate !== null ? `${approvalRate}%` : '—'}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Dossiers actifs</span>
                          <span className="text-sm text-blue-600 font-semibold">{activeLoans.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Dossiers en attente</span>
                          <span className="text-sm text-yellow-600 font-semibold">
                            {loans.filter(l => ['pending', 'evaluating', 'pre_approved'].includes(l.status)).length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Dossiers rejetés</span>
                          <span className="text-sm text-red-600 font-semibold">
                            {loans.filter(l => l.status === 'rejected').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueSettings;
