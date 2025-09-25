import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Shield,
  Database,
  Mail,
  Bell,
  Globe,
  Palette,
  Key,
  Upload,
  Download,
  RefreshCw,
  Save,
  AlertTriangle,
  Check,
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Brain,
  Zap,
  Server,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { OpenAIService } from '../../../services/ai/OpenAIService';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  // États pour les différentes sections de configuration
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'TerangaFoncier',
    siteDescription: 'Plateforme immobilière intelligente du Sénégal',
    contactEmail: 'contact@terangafoncier.sn',
    supportPhone: '+221 33 123 45 67',
    address: 'Dakar, Sénégal',
    language: 'fr',
    timezone: 'Africa/Dakar',
    currency: 'XOF'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordPolicy: 'strong',
    sessionTimeout: 30,
    loginAttempts: 5,
    emailVerification: true,
    phoneVerification: false,
    gdprCompliance: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    securityAlerts: true,
    marketingEmails: false,
    systemMaintenance: true
  });

  const [iaSettings, setIaSettings] = useState({
    enabled: true,
    provider: 'openai',
    model: 'gpt-4-turbo',
    apiKey: '••••••••••••••••••••••••••••sk-1234',
    maxTokens: 2000,
    temperature: 0.7,
    autoInsights: true,
    priceAnalysis: true,
    contentGeneration: false
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: 'daily',
    logLevel: 'info',
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ia', label: 'Intelligence Artificielle', icon: Brain },
    { id: 'system', label: 'Système', icon: Server }
  ];

  const handleSave = async () => {
    setLoading(true);
    // Simulation de sauvegarde
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const handleReset = () => {
    // Reset aux valeurs par défaut selon l'onglet actif
    console.log('Reset settings for:', activeTab);
  };

  const handleExport = () => {
    const settings = {
      general: generalSettings,
      security: securitySettings,
      notifications: notificationSettings,
      ia: iaSettings,
      system: systemSettings
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'terangafoncier-settings.json';
    link.click();
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="siteName">Nom du site</Label>
          <Input
            id="siteName"
            value={generalSettings.siteName}
            onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="contactEmail">Email de contact</Label>
          <Input
            id="contactEmail"
            type="email"
            value={generalSettings.contactEmail}
            onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="supportPhone">Téléphone support</Label>
          <Input
            id="supportPhone"
            value={generalSettings.supportPhone}
            onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="language">Langue</Label>
          <select
            id="language"
            value={generalSettings.language}
            onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="wo">Wolof</option>
          </select>
        </div>
        <div>
          <Label htmlFor="timezone">Fuseau horaire</Label>
          <select
            id="timezone"
            value={generalSettings.timezone}
            onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Africa/Dakar">Africa/Dakar</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div>
          <Label htmlFor="currency">Devise</Label>
          <select
            id="currency"
            value={generalSettings.currency}
            onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="XOF">XOF (Franc CFA)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="USD">USD (Dollar)</option>
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="siteDescription">Description du site</Label>
        <Textarea
          id="siteDescription"
          value={generalSettings.siteDescription}
          onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Textarea
          id="address"
          value={generalSettings.address}
          onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
          className="mt-1"
          rows={2}
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Authentification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Double authentification</Label>
                <p className="text-sm text-gray-600">Protection supplémentaire des comptes</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Vérification email</Label>
                <p className="text-sm text-gray-600">Email requis pour l'inscription</p>
              </div>
              <Switch
                checked={securitySettings.emailVerification}
                onCheckedChange={(checked) => setSecuritySettings({...securitySettings, emailVerification: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Vérification téléphone</Label>
                <p className="text-sm text-gray-600">SMS requis pour l'inscription</p>
              </div>
              <Switch
                checked={securitySettings.phoneVerification}
                onCheckedChange={(checked) => setSecuritySettings({...securitySettings, phoneVerification: checked})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Politique de sécurité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="passwordPolicy">Politique des mots de passe</Label>
              <select
                id="passwordPolicy"
                value={securitySettings.passwordPolicy}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordPolicy: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weak">Faible (6+ caractères)</option>
                <option value="medium">Moyen (8+ caractères, chiffres)</option>
                <option value="strong">Fort (12+ caractères, mixte)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="loginAttempts">Tentatives de connexion max</Label>
              <Input
                id="loginAttempts"
                type="number"
                value={securitySettings.loginAttempts}
                onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conformité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Conformité RGPD</Label>
              <p className="text-sm text-gray-600">Respect des règles de protection des données</p>
            </div>
            <Switch
              checked={securitySettings.gdprCompliance}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, gdprCompliance: checked})}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notifications email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications générales</Label>
                <p className="text-sm text-gray-600">Alertes et updates système</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Rapports hebdomadaires</Label>
                <p className="text-sm text-gray-600">Résumé des activités</p>
              </div>
              <Switch
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Emails marketing</Label>
                <p className="text-sm text-gray-600">Promotions et nouveautés</p>
              </div>
              <Switch
                checked={notificationSettings.marketingEmails}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Autres notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications SMS</Label>
                <p className="text-sm text-gray-600">Alertes importantes par SMS</p>
              </div>
              <Switch
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications push</Label>
                <p className="text-sm text-gray-600">Alertes dans le navigateur</p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes sécurité</Label>
                <p className="text-sm text-gray-600">Notifications de sécurité critiques</p>
              </div>
              <Switch
                checked={notificationSettings.securityAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, securityAlerts: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance système</Label>
                <p className="text-sm text-gray-600">Alertes de maintenance</p>
              </div>
              <Switch
                checked={notificationSettings.systemMaintenance}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemMaintenance: checked})}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderIASettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Configuration IA
          </CardTitle>
          <CardDescription>
            Paramètres de l'intelligence artificielle intégrée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>IA activée</Label>
              <p className="text-sm text-gray-600">Activer les fonctionnalités d'intelligence artificielle</p>
            </div>
            <Switch
              checked={iaSettings.enabled}
              onCheckedChange={(checked) => setIaSettings({...iaSettings, enabled: checked})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="iaProvider">Fournisseur IA</Label>
              <select
                id="iaProvider"
                value={iaSettings.provider}
                onChange={(e) => setIaSettings({...iaSettings, provider: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google AI</option>
              </select>
            </div>
            <div>
              <Label htmlFor="iaModel">Modèle</Label>
              <select
                id="iaModel"
                value={iaSettings.model}
                onChange={(e) => setIaSettings({...iaSettings, model: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="apiKey">Clé API</Label>
            <div className="mt-1 relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={iaSettings.apiKey}
                onChange={(e) => setIaSettings({...iaSettings, apiKey: e.target.value})}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Votre clé API sera chiffrée et stockée de manière sécurisée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="maxTokens">Tokens maximum</Label>
              <Input
                id="maxTokens"
                type="number"
                value={iaSettings.maxTokens}
                onChange={(e) => setIaSettings({...iaSettings, maxTokens: parseInt(e.target.value)})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="temperature">Température (créativité)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={iaSettings.temperature}
                onChange={(e) => setIaSettings({...iaSettings, temperature: parseFloat(e.target.value)})}
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Fonctionnalités IA</h4>
            <div className="flex items-center justify-between">
              <div>
                <Label>Insights automatiques</Label>
                <p className="text-sm text-gray-600">Génération automatique d'analyses</p>
              </div>
              <Switch
                checked={iaSettings.autoInsights}
                onCheckedChange={(checked) => setIaSettings({...iaSettings, autoInsights: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Analyse des prix</Label>
                <p className="text-sm text-gray-600">Évaluation automatique des prix immobiliers</p>
              </div>
              <Switch
                checked={iaSettings.priceAnalysis}
                onCheckedChange={(checked) => setIaSettings({...iaSettings, priceAnalysis: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Génération de contenu</Label>
                <p className="text-sm text-gray-600">Création automatique de descriptions</p>
              </div>
              <Switch
                checked={iaSettings.contentGeneration}
                onCheckedChange={(checked) => setIaSettings({...iaSettings, contentGeneration: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5" />
              Système
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Mode maintenance</Label>
                <p className="text-sm text-gray-600">Désactiver temporairement le site</p>
              </div>
              <Switch
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Mode debug</Label>
                <p className="text-sm text-gray-600">Afficher les erreurs détaillées</p>
              </div>
              <Switch
                checked={systemSettings.debugMode}
                onCheckedChange={(checked) => setSystemSettings({...systemSettings, debugMode: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Cache activé</Label>
                <p className="text-sm text-gray-600">Améliorer les performances</p>
              </div>
              <Switch
                checked={systemSettings.cacheEnabled}
                onCheckedChange={(checked) => setSystemSettings({...systemSettings, cacheEnabled: checked})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Base de données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
              <select
                id="backupFrequency"
                value={systemSettings.backupFrequency}
                onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hourly">Toutes les heures</option>
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
              </select>
            </div>
            <div>
              <Label htmlFor="logLevel">Niveau de logs</Label>
              <select
                id="logLevel"
                value={systemSettings.logLevel}
                onChange={(e) => setSystemSettings({...systemSettings, logLevel: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="error">Erreurs seulement</option>
                <option value="warn">Avertissements</option>
                <option value="info">Informations</option>
                <option value="debug">Debug complet</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Fichiers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxFileSize">Taille max des fichiers (MB)</Label>
            <Input
              id="maxFileSize"
              type="number"
              value={systemSettings.maxFileSize}
              onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: parseInt(e.target.value)})}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Types de fichiers autorisés</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {systemSettings.allowedFileTypes.map((type, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  .{type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Settings className="h-8 w-8 text-gray-700" />
                Paramètres Système
              </h1>
              <p className="text-gray-600">
                Configuration complète de la plateforme TerangaFoncier
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading ? 'Sauvegarde...' : saved ? 'Sauvegardé!' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation des onglets */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-none transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contenu des onglets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <Card>
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'general' && renderGeneralSettings()}
                    {activeTab === 'security' && renderSecuritySettings()}
                    {activeTab === 'notifications' && renderNotificationSettings()}
                    {activeTab === 'ia' && renderIASettings()}
                    {activeTab === 'system' && renderSystemSettings()}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;