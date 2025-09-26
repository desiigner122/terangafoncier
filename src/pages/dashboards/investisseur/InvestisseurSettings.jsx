import React, { useState, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';

const InvestisseurSettings = () => {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [settings, setSettings] = useState({
    profile: {
      fullName: 'Jean-Baptiste Senghor',
      email: 'jb.senghor@investpro.sn',
      phone: '+221 77 123 45 67',
      address: 'Almadies, Dakar',
      investorType: 'Premium',
      registrationDate: '2023-03-15'
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: true,
      pushNotifications: true,
      weeklyReports: true,
      monthlyAnalytics: true,
      opportunityAlerts: true,
      priceChangeAlerts: false,
      newsUpdates: true
    },
    security: {
      twoFactorAuth: true,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordLastChanged: '2024-01-15',
      trustedDevices: 3
    },
    preferences: {
      language: 'fr',
      currency: 'XOF',
      timezone: 'Africa/Dakar',
      dashboardTheme: 'light',
      autoSave: true,
      analyticsLevel: 'advanced'
    },
    investment: {
      riskTolerance: 'moderate',
      preferredSectors: ['residential', 'commercial'],
      minInvestmentAmount: 50000000,
      maxInvestmentAmount: 500000000,
      autoInvestment: false,
      investmentAlerts: true
    }
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleSave = async (section) => {
    setSaveStatus('saving');
    // Simulation d'une sauvegarde
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1500);
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
                      onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="text-sm font-medium text-gray-700">Adresse</label>
                    <input
                      type="text"
                      value={settings.profile.address}
                      onChange={(e) => handleInputChange('profile', 'address', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Type d'Investisseur</label>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gold-100 text-gold-800 px-3 py-1">
                        {settings.profile.investorType}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Membre depuis</label>
                    <p className="text-gray-600">
                      {new Date(settings.profile.registrationDate).toLocaleDateString('fr-FR')}
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
                {/* Authentification à deux facteurs */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Authentification à Deux Facteurs</h3>
                    <p className="text-sm text-gray-600">Sécurité renforcée pour votre compte</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {settings.security.twoFactorAuth ? (
                      <Badge className="bg-green-100 text-green-800">Activé</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Désactivé</Badge>
                    )}
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => handleInputChange('security', 'twoFactorAuth', checked)}
                    />
                  </div>
                </div>

                {/* Alertes de connexion */}
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

                {/* Session timeout */}
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

                {/* Changement de mot de passe */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Changer le Mot de Passe</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Dernier changement: {new Date(settings.security.passwordLastChanged).toLocaleDateString('fr-FR')}
                  </p>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nouveau mot de passe"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Lock className="h-4 w-4 mr-2" />
                      Changer le Mot de Passe
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
                      onChange={(e) => handleInputChange('investment', 'minInvestmentAmount', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Investissement Maximum (XOF)</label>
                    <input
                      type="number"
                      value={settings.investment.maxInvestmentAmount}
                      onChange={(e) => handleInputChange('investment', 'maxInvestmentAmount', parseInt(e.target.value))}
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
                {/* Plan actuel */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Plan Investisseur Premium</h3>
                      <p className="text-gray-600">Abonnement mensuel actuel</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 px-4 py-2">
                      ✓ Actif
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">100,000 XOF</p>
                      <p className="text-sm text-gray-600">par mois</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">12</p>
                      <p className="text-sm text-gray-600">investissements actifs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">Illimité</p>
                      <p className="text-sm text-gray-600">opportunités</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        <span>Analyse IA avancée</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        <span>Blockchain & smart contracts</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        <span>Support expert dédié</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        <span>Rapports personnalisés</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        <span>API d'intégration</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        <span>Accès prioritaire</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations facturation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Informations de Facturation</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prochain paiement</span>
                        <span className="font-semibold">20 Février 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Méthode de paiement</span>
                        <span className="font-semibold">**** 1234 (Visa)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut</span>
                        <Badge className="bg-green-100 text-green-800">À jour</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Modifier le mode de paiement
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Utilisation du Mois</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Analyses IA utilisées</span>
                          <span className="text-sm font-semibold">47/100</span>
                        </div>
                        <Progress value={47} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Rapports générés</span>
                          <span className="text-sm font-semibold">12/50</span>
                        </div>
                        <Progress value={24} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Appels API</span>
                          <span className="text-sm font-semibold">2,847/10,000</span>
                        </div>
                        <Progress value={28} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Passer au plan Entreprise
                  </Button>
                  <Button variant="outline">
                    Télécharger la facture
                  </Button>
                  <Button variant="outline">
                    Historique des paiements
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Annuler l'abonnement
                  </Button>
                </div>

                {/* Plans disponibles */}
                <div className="pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-4">Autres Plans Disponibles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-center mb-4">
                        <h5 className="font-bold text-lg">Plan Entreprise</h5>
                        <p className="text-2xl font-bold text-purple-600">250,000 XOF</p>
                        <p className="text-sm text-gray-600">par mois</p>
                      </div>
                      <ul className="space-y-2 text-sm mb-4">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                          Tout du plan Premium
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                          Multi-utilisateurs (5)
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                          API avancée
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                          Support 24/7
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full">
                        Passer à Entreprise
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="text-center mb-4">
                        <h5 className="font-bold text-lg">Plan Institutional</h5>
                        <p className="text-2xl font-bold text-gold-600">Sur mesure</p>
                        <p className="text-sm text-gray-600">contact requis</p>
                      </div>
                      <ul className="space-y-2 text-sm mb-4">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                          Solution sur mesure
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                          Intégrations personnalisées
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                          Formation incluse
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                          Manager dédié
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full">
                        Nous contacter
                      </Button>
                    </div>
                  </div>
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