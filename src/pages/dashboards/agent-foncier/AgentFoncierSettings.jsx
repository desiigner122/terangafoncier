import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Shield,
  Bell,
  Map,
  Brain,
  Blocks,
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Camera,
  MapPin,
  FileText,
  Calculator,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Clés locales — ces préférences n'ont pas de table dédiée en base.
// Elles sont donc persistées localement (honnête) et non fabriquées.
const NOTIF_STORAGE_KEY = 'agent_foncier_settings_notifications';
const GEO_STORAGE_KEY = 'agent_foncier_settings_geolocalisation';
const AI_STORAGE_KEY = 'agent_foncier_settings_ia_blockchain';

const DEFAULT_NOTIFICATIONS = {
  emailNotifications: true,
  smsNotifications: false,
  evaluationAlerts: true,
  documentAlerts: true,
  clientAlerts: true
};

const DEFAULT_GEO = {
  autoLocation: true,
  precisionGPS: 'high',
  saveTrajectories: false,
  shareLocation: true
};

const DEFAULT_AI = {
  aiAssistance: true,
  predictiveAnalysis: true,
  blockchainValidation: false,
  smartContracts: false
};

const loadLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
};

// Plans commerciaux : contenu marketing statique (pas de la donnée utilisateur fabriquée).
const plans = [
  {
    name: 'Essentiel',
    price: '25,000',
    features: ['50 évaluations/mois', 'Support email', 'Rapports de base'],
  },
  {
    name: 'Professionnel',
    price: '75,000',
    features: ['200 évaluations/mois', 'IA intégrée', 'Support prioritaire', 'Analytics avancés'],
  },
  {
    name: 'Expert',
    price: '150,000',
    features: ['Évaluations illimitées', 'Blockchain', 'API access', 'Support dédié'],
  }
];

const AgentFoncierSettings = () => {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profil : mappé sur la table profiles (colonnes réelles).
  // specialisation / certification n'ont pas de colonne → préférence locale honnête.
  const [profileInfo, setProfileInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialisation: 'Évaluation Foncière',
    certification: ''
  });

  // Préférences sans table → état local honnête.
  const [notifications, setNotifications] = useState(() => loadLocal(NOTIF_STORAGE_KEY, DEFAULT_NOTIFICATIONS));
  const [geo, setGeo] = useState(() => loadLocal(GEO_STORAGE_KEY, DEFAULT_GEO));
  const [ai, setAi] = useState(() => loadLocal(AI_STORAGE_KEY, DEFAULT_AI));

  // Mots de passe
  const [passwords, setPasswords] = useState({ next: '', confirm: '' });

  // Abonnement réel (user_subscriptions) + usage réel dérivé de la base
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({ evaluations: 0, documents: 0, clients: 0 });

  // --- Chargement des données réelles ---
  const loadProfile = useCallback(() => {
    if (!profile && !user) return;
    const localPrefs = loadLocal('agent_foncier_profile_prefs', {
      specialisation: 'Évaluation Foncière',
      certification: ''
    });
    setProfileInfo(prev => ({
      ...prev,
      fullName: profile?.full_name
        || [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')
        || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      specialisation: localPrefs.specialisation,
      certification: localPrefs.certification
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

  // Usage réel : nombre d'évaluations (agent_missions type estimation),
  // documents et clients réellement rattachés à cet agent.
  const loadUsage = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [missionsRes, docsRes, clientsRes] = await Promise.all([
        supabase
          .from('agent_missions')
          .select('id', { count: 'exact', head: true })
          .eq('agent_id', user.id)
          .eq('mission_type', 'estimation'),
        supabase
          .from('documents')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', user.id),
        supabase
          .from('crm_contacts')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', user.id)
      ]);
      setUsage({
        evaluations: missionsRes.count || 0,
        documents: docsRes.count || 0,
        clients: clientsRes.count || 0
      });
    } catch {
      setUsage({ evaluations: 0, documents: 0, clients: 0 });
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
    Promise.all([loadSubscription(), loadUsage()]).finally(() => setLoading(false));
  }, [loadProfile, loadSubscription, loadUsage]);

  // --- Sauvegardes ---
  const handleSaveProfile = async () => {
    if (!user?.id) {
      window.safeGlobalToast?.({ title: 'Non authentifié', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileInfo.fullName || null,
          phone: profileInfo.phone || null
        })
        .eq('id', user.id);
      if (error) throw error;

      // specialisation / certification sans colonne → persistées localement
      try {
        localStorage.setItem('agent_foncier_profile_prefs', JSON.stringify({
          specialisation: profileInfo.specialisation,
          certification: profileInfo.certification
        }));
      } catch { /* noop */ }

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

  const saveNotifications = (next) => {
    setNotifications(next);
    try { localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
  };

  const saveGeo = (next) => {
    setGeo(next);
    try { localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
  };

  const saveAi = (next) => {
    setAi(next);
    try { localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.next || passwords.next.length < 6) {
      window.safeGlobalToast?.({
        title: 'Mot de passe trop court',
        description: 'Le mot de passe doit contenir au moins 6 caractères.',
        variant: 'destructive'
      });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      window.safeGlobalToast?.({
        title: 'Les mots de passe ne correspondent pas',
        variant: 'destructive'
      });
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.next });
      if (error) throw error;
      setPasswords({ next: '', confirm: '' });
      window.safeGlobalToast?.({
        title: 'Mot de passe mis à jour',
        variant: 'success'
      });
    } catch (e) {
      window.safeGlobalToast?.({
        title: 'Erreur',
        description: e.message || 'Impossible de mettre à jour le mot de passe.',
        variant: 'destructive'
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const plan = subscription?.subscription_plans || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres Agent Foncier</h1>
          <p className="text-gray-600">Configuration et préférences</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveProfile} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="geolocalisation">Géolocalisation</TabsTrigger>
          <TabsTrigger value="ia-blockchain">IA & Blockchain</TabsTrigger>
          <TabsTrigger value="securite">Sécurité</TabsTrigger>
          <TabsTrigger value="abonnement">Abonnement</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom Complet
                  </label>
                  <input
                    type="text"
                    value={profileInfo.fullName}
                    onChange={(e) => setProfileInfo({...profileInfo, fullName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Professionnel
                  </label>
                  <input
                    type="email"
                    value={profileInfo.email}
                    readOnly
                    title="L'email est géré par votre compte d'authentification"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={profileInfo.phone}
                    onChange={(e) => setProfileInfo({...profileInfo, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Informations Professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spécialisation
                  </label>
                  <select
                    value={profileInfo.specialisation}
                    onChange={(e) => setProfileInfo({...profileInfo, specialisation: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option>Évaluation Foncière</option>
                    <option>Cadastre et Topographie</option>
                    <option>Gestion Immobilière</option>
                    <option>Expertise Judiciaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification
                  </label>
                  <input
                    type="text"
                    value={profileInfo.certification}
                    onChange={(e) => setProfileInfo({...profileInfo, certification: e.target.value})}
                    placeholder="Ex : Agent Foncier Certifié"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full" disabled>
                    <Camera className="h-4 w-4 mr-2" />
                    Changer la Photo de Profil
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Téléversement de la photo bientôt disponible (bucket Storage « avatars »).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Préférences de Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications par Email</h4>
                  <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => saveNotifications({...notifications, emailNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications SMS</h4>
                  <p className="text-sm text-gray-600">Recevoir les alertes urgentes par SMS</p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => saveNotifications({...notifications, smsNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertes d'Évaluation</h4>
                  <p className="text-sm text-gray-600">Notifications pour nouvelles demandes d'évaluation</p>
                </div>
                <Switch
                  checked={notifications.evaluationAlerts}
                  onCheckedChange={(checked) => saveNotifications({...notifications, evaluationAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertes Documents</h4>
                  <p className="text-sm text-gray-600">Notifications pour documents en attente</p>
                </div>
                <Switch
                  checked={notifications.documentAlerts}
                  onCheckedChange={(checked) => saveNotifications({...notifications, documentAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertes Clients</h4>
                  <p className="text-sm text-gray-600">Notifications pour nouveaux clients</p>
                </div>
                <Switch
                  checked={notifications.clientAlerts}
                  onCheckedChange={(checked) => saveNotifications({...notifications, clientAlerts: checked})}
                />
              </div>

              <p className="text-xs text-gray-400 pt-2 border-t">
                Ces préférences sont enregistrées sur cet appareil.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geolocalisation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Paramètres de Géolocalisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Localisation Automatique</h4>
                  <p className="text-sm text-gray-600">Détecter automatiquement votre position</p>
                </div>
                <Switch
                  checked={geo.autoLocation}
                  onCheckedChange={(checked) => saveGeo({...geo, autoLocation: checked})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Précision GPS
                </label>
                <select
                  value={geo.precisionGPS}
                  onChange={(e) => saveGeo({...geo, precisionGPS: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Basse (100m)</option>
                  <option value="medium">Moyenne (10m)</option>
                  <option value="high">Élevée (1m)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Sauvegarder les Trajets</h4>
                  <p className="text-sm text-gray-600">Enregistrer vos déplacements pour analyse</p>
                </div>
                <Switch
                  checked={geo.saveTrajectories}
                  onCheckedChange={(checked) => saveGeo({...geo, saveTrajectories: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Partager la Position</h4>
                  <p className="text-sm text-gray-600">Permettre aux clients de voir votre position</p>
                </div>
                <Switch
                  checked={geo.shareLocation}
                  onCheckedChange={(checked) => saveGeo({...geo, shareLocation: checked})}
                />
              </div>

              <p className="text-xs text-gray-400 pt-2 border-t">
                Ces préférences sont enregistrées sur cet appareil.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ia-blockchain" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Intelligence Artificielle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Assistant IA</h4>
                    <p className="text-sm text-gray-600">Aide à l'évaluation automatique</p>
                  </div>
                  <Switch
                    checked={ai.aiAssistance}
                    onCheckedChange={(checked) => saveAi({...ai, aiAssistance: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analyse Prédictive</h4>
                    <p className="text-sm text-gray-600">Prédictions de marché IA</p>
                  </div>
                  <Switch
                    checked={ai.predictiveAnalysis}
                    onCheckedChange={(checked) => saveAi({...ai, predictiveAnalysis: checked})}
                  />
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Bientôt :</strong> IA générative pour rédaction automatique de rapports
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Blocks className="h-5 w-5 mr-2" />
                  Blockchain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Validation Blockchain</h4>
                    <p className="text-sm text-gray-600">Sécuriser les documents par blockchain</p>
                  </div>
                  <Switch
                    checked={ai.blockchainValidation}
                    onCheckedChange={(checked) => saveAi({...ai, blockchainValidation: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Smart Contracts</h4>
                    <p className="text-sm text-gray-600">Contrats intelligents automatiques</p>
                  </div>
                  <Switch
                    checked={ai.smartContracts}
                    onCheckedChange={(checked) => saveAi({...ai, smartContracts: checked})}
                  />
                </div>

                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Bêta :</strong> Fonctionnalités blockchain en test
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <p className="text-xs text-gray-400">
            Ces préférences sont enregistrées sur cet appareil.
          </p>
        </TabsContent>

        <TabsContent value="securite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Sécurité du Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau Mot de Passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwords.next}
                    onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le Mot de Passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleUpdatePassword}
                disabled={savingPassword}
              >
                {savingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Mettre à Jour le Mot de Passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abonnement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Abonnement Actuel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Plan:</span>
                  {plan ? (
                    <Badge className="bg-green-100 text-green-800">
                      {plan.name || plan.role_type || 'Actif'}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-500">Aucun abonnement actif</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Prochaine facturation:</span>
                  <span className="text-sm text-gray-600">
                    {subscription?.end_date || subscription?.expires_at
                      ? new Date(subscription.end_date || subscription.expires_at).toLocaleDateString('fr-FR')
                      : '—'}
                  </span>
                </div>

                <div className="space-y-3 pt-4">
                  <p className="text-sm font-medium text-gray-700">Activité (données réelles)</p>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Évaluations réalisées</span>
                    <span className="text-sm font-semibold">{usage.evaluations}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Documents</span>
                    <span className="text-sm font-semibold">{usage.documents}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Clients</span>
                    <span className="text-sm font-semibold">{usage.clients}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Les quotas par plan seront affichés une fois l'abonnement configuré.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plans Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plans.map((p) => {
                    const isCurrent = plan?.name && p.name.toLowerCase() === String(plan.name).toLowerCase();
                    return (
                      <div
                        key={p.name}
                        className={`p-4 border rounded-lg ${isCurrent ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{p.name}</h4>
                          <div className="text-right">
                            <span className="text-lg font-bold">{p.price}</span>
                            <span className="text-sm text-gray-600"> XOF/mois</span>
                          </div>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {p.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                        {isCurrent && (
                          <Badge className="mt-2 bg-green-100 text-green-800">Plan Actuel</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentFoncierSettings;
