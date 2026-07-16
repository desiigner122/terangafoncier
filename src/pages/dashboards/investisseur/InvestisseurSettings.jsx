import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Database,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Save,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Préférences locales (aucune table dédiée en base) — persistées honnêtement dans le
// localStorage par utilisateur. Ne sont PAS synchronisées côté serveur.
const DEFAULT_LOCAL_PREFS = {
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: false,
    monthlyAnalytics: false,
    opportunityAlerts: true,
    priceChangeAlerts: false,
    newsUpdates: false
  },
  security: {
    loginAlerts: true,
    sessionTimeout: 30
  },
  preferences: {
    language: 'fr',
    currency: 'XOF',
    timezone: 'Africa/Dakar',
    dashboardTheme: 'light',
    autoSave: true
  },
  investment: {
    riskTolerance: 'moderate',
    preferredSectors: ['residential', 'commercial'],
    minInvestmentAmount: 0,
    maxInvestmentAmount: 0,
    autoInvestment: false
  }
};

const InvestisseurSettings = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeInvestments, setActiveInvestments] = useState(null);

  const prefsKey = user?.id ? `investor_prefs_${user.id}` : null;

  const [settings, setSettings] = useState({
    profile: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      registrationDate: null
    },
    ...DEFAULT_LOCAL_PREFS
  });

  // Charge le profil réel (table profiles) + préférences locales
  const loadData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    // Préférences locales honnêtes
    let localPrefs = DEFAULT_LOCAL_PREFS;
    try {
      if (prefsKey) {
        const stored = localStorage.getItem(prefsKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          localPrefs = {
            notifications: { ...DEFAULT_LOCAL_PREFS.notifications, ...(parsed.notifications || {}) },
            security: { ...DEFAULT_LOCAL_PREFS.security, ...(parsed.security || {}) },
            preferences: { ...DEFAULT_LOCAL_PREFS.preferences, ...(parsed.preferences || {}) },
            investment: { ...DEFAULT_LOCAL_PREFS.investment, ...(parsed.investment || {}) }
          };
        }
      }
    } catch (e) {
      localPrefs = DEFAULT_LOCAL_PREFS;
    }

    // Profil réel depuis Supabase (fallback sur le profil du contexte)
    let profileRow = profile || null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, first_name, last_name, phone, city, region, created_at')
        .eq('id', user.id)
        .maybeSingle();
      if (!error && data) profileRow = data;
    } catch (e) {
      // garde le profil du contexte
    }

    const fullName =
      profileRow?.full_name ||
      [profileRow?.first_name, profileRow?.last_name].filter(Boolean).join(' ') ||
      '';
    const address = [profileRow?.city, profileRow?.region].filter(Boolean).join(', ');

    setSettings({
      profile: {
        fullName,
        email: profileRow?.email || user.email || '',
        phone: profileRow?.phone || '',
        address,
        registrationDate: profileRow?.created_at || null
      },
      ...localPrefs
    });

    // Nombre réel d'investissements actifs (table investments, filtré investor_id)
    try {
      const { count } = await supabase
        .from('investments')
        .select('id', { count: 'exact', head: true })
        .eq('investor_id', user.id)
        .eq('status', 'active');
      setActiveInvestments(count ?? 0);
    } catch (e) {
      setActiveInvestments(null);
    }

    setLoading(false);
  }, [user?.id, user?.email, profile, prefsKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const persistLocalPrefs = (next) => {
    if (!prefsKey) return;
    try {
      localStorage.setItem(
        prefsKey,
        JSON.stringify({
          notifications: next.notifications,
          security: next.security,
          preferences: next.preferences,
          investment: next.investment
        })
      );
    } catch (e) {
      // stockage indisponible — les préférences restent en mémoire
    }
  };

  // Sauvegarde du profil → table profiles (données réelles).
  // Les autres sections sont des préférences locales sans table → localStorage honnête.
  const handleSave = async (section) => {
    setSaveStatus('saving');

    if (section === 'profile') {
      if (!user?.id) {
        setSaveStatus(null);
        return;
      }
      // Découpe l'adresse saisie "ville, region"
      const parts = (settings.profile.address || '').split(',').map(s => s.trim());
      const city = parts[0] || null;
      const region = parts[1] || null;
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: settings.profile.fullName || null,
            phone: settings.profile.phone || null,
            city,
            region,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        if (error) throw error;
        setSaveStatus('success');
      } catch (e) {
        setSaveStatus(null);
        return;
      }
      setTimeout(() => setSaveStatus(null), 2000);
      return;
    }

    // Préférences locales
    persistLocalPrefs(settings);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword('');
      setConfirmPassword('');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (e) {
      setPasswordError(e?.message || 'Impossible de changer le mot de passe.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="h-6 w-6 mr-2 text-blue-600" />
              Paramètres du Compte
            </h1>
            <p className="text-gray-600">Gérez vos préférences et paramètres de sécurité</p>
          </div>
          {saveStatus && (
            <div className="flex items-center space-x-2">
              {saveStatus === 'saving' && (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-blue-600">Sauvegarde...</span>
                </>
              )}
              {saveStatus === 'success' && (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Sauvegardé</span>
                </>
              )}
            </div>
          )}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
            <TabsTrigger value="investment">Investissement</TabsTrigger>
            <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nom Complet</label>
                    <input
                      type="text"
                      value={settings.profile.fullName}
                      onChange={(e) => handleInputChange('profile', 'fullName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      readOnly
                      title="L'email est géré via votre compte et ne peut être modifié ici."
                      className="w-full p-3 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ville / Région</label>
                    <input
                      type="text"
                      value={settings.profile.address}
                      onChange={(e) => handleInputChange('profile', 'address', e.target.value)}
                      placeholder="Ex : Dakar, Dakar"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Membre depuis</label>
                    <p className="text-gray-600">
                      {settings.profile.registrationDate
                        ? new Date(settings.profile.registrationDate).toLocaleDateString('fr-FR')
                        : '—'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSave('profile')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder le Profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-green-600" />
                  Préférences de Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-xs text-gray-500">
                  Préférences enregistrées localement sur cet appareil (non synchronisées entre appareils).
                </p>
                {Object.entries(settings.notifications).map(([key, value]) => {
                  const labels = {
                    emailAlerts: 'Alertes par Email',
                    smsAlerts: 'Alertes par SMS',
                    pushNotifications: 'Notifications Push',
                    weeklyReports: 'Rapports Hebdomadaires',
                    monthlyAnalytics: 'Analytics Mensuelles',
                    opportunityAlerts: 'Alertes Opportunités',
                    priceChangeAlerts: 'Alertes Changement de Prix',
                    newsUpdates: 'Actualités du Marché'
                  };

                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{labels[key]}</p>
                        <p className="text-sm text-gray-600">
                          {value ? 'Activé' : 'Désactivé'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => handleInputChange('notifications', key, checked)}
                      />
                    </div>
                  );
                })}

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSave('notifications')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-600" />
                  Paramètres de Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Alertes de connexion (préférence locale) */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Alertes de Connexion</h3>
                    <p className="text-sm text-gray-600">Recevoir des notifications pour les nouvelles connexions</p>
                  </div>
                  <Switch
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) => handleInputChange('security', 'loginAlerts', checked)}
                  />
                </div>

                {/* Session timeout (préférence locale) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Délai d'expiration de session (minutes)</label>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 heure</option>
                    <option value={120}>2 heures</option>
                  </select>
                </div>

                {/* Changement de mot de passe (Supabase Auth réel) */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Changer le Mot de Passe</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Votre mot de passe est mis à jour via votre compte sécurisé.
                  </p>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <input
                      type="password"
                      placeholder="Confirmer le nouveau mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {passwordError && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {passwordError}
                      </p>
                    )}
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleChangePassword}
                      disabled={passwordSaving}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {passwordSaving ? 'Mise à jour...' : 'Changer le Mot de Passe'}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSave('security')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder la Sécurité
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Préférences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-purple-600" />
                  Préférences Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-gray-500">
                  Préférences enregistrées localement sur cet appareil.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Langue</label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="wo">Wolof</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Devise</label>
                    <select
                      value={settings.preferences.currency}
                      onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="XOF">XOF (Franc CFA)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (Dollar)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Fuseau Horaire</label>
                    <select
                      value={settings.preferences.timezone}
                      onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Africa/Dakar">Dakar (UTC+0)</option>
                      <option value="Europe/Paris">Paris (UTC+1)</option>
                      <option value="America/New_York">New York (UTC-5)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Thème</label>
                    <select
                      value={settings.preferences.dashboardTheme}
                      onChange={(e) => handleInputChange('preferences', 'dashboardTheme', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Automatique</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Sauvegarde Automatique</p>
                    <p className="text-sm text-gray-600">Sauvegarder automatiquement vos modifications</p>
                  </div>
                  <Switch
                    checked={settings.preferences.autoSave}
                    onCheckedChange={(checked) => handleInputChange('preferences', 'autoSave', checked)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSave('preferences')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les Préférences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Investissement */}
          <TabsContent value="investment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-orange-600" />
                  Préférences d'Investissement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-gray-500">
                  Critères enregistrés localement pour filtrer vos opportunités.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tolérance au Risque</label>
                  <select
                    value={settings.investment.riskTolerance}
                    onChange={(e) => handleInputChange('investment', 'riskTolerance', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="conservative">Conservateur</option>
                    <option value="moderate">Modéré</option>
                    <option value="aggressive">Agressif</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Secteurs Préférés</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['residential', 'commercial', 'industrial', 'agricultural'].map((sector) => (
                      <label key={sector} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.investment.preferredSectors.includes(sector)}
                          onChange={(e) => {
                            const sectors = settings.investment.preferredSectors;
                            if (e.target.checked) {
                              handleInputChange('investment', 'preferredSectors', [...sectors, sector]);
                            } else {
                              handleInputChange('investment', 'preferredSectors', sectors.filter(s => s !== sector));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="capitalize">{sector === 'residential' ? 'Résidentiel' :
                          sector === 'commercial' ? 'Commercial' :
                          sector === 'industrial' ? 'Industriel' : 'Agricole'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Investissement Minimum (XOF)</label>
                    <input
                      type="number"
                      value={settings.investment.minInvestmentAmount}
                      onChange={(e) => handleInputChange('investment', 'minInvestmentAmount', parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Investissement Maximum (XOF)</label>
                    <input
                      type="number"
                      value={settings.investment.maxInvestmentAmount}
                      onChange={(e) => handleInputChange('investment', 'maxInvestmentAmount', parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Investissement Automatique</p>
                    <p className="text-sm text-gray-600">Investir automatiquement selon vos critères</p>
                  </div>
                  <Switch
                    checked={settings.investment.autoInvestment}
                    onCheckedChange={(checked) => handleInputChange('investment', 'autoInvestment', checked)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSave('investment')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les Préférences d'Investissement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Abonnement */}
          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-yellow-600" />
                  Gestion de l'Abonnement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Résumé réel du compte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50 rounded-lg border text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      {activeInvestments === null ? '—' : activeInvestments}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Investissements actifs</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg border text-center">
                    <p className="text-3xl font-bold text-green-600">Illimité</p>
                    <p className="text-sm text-gray-600 mt-1">Accès aux opportunités</p>
                  </div>
                </div>

                {/* Facturation / plans : pas de système d'abonnement en base */}
                <div className="p-8 border border-dashed rounded-lg text-center">
                  <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Facturation et plans</h3>
                  <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                    La gestion des abonnements, des paiements et de la facturation sera bientôt disponible.
                    Aucune donnée de facturation n'est associée à votre compte pour le moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default InvestisseurSettings;
