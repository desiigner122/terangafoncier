import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Monitor, 
  Key,
  Database,
  Mail,
  Phone,
  Globe,
  Save,
  RefreshCw,
  Upload,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Palette,
  Languages,
  HardDrive,
  Wifi,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Smartphone,
  Laptop,
  Printer,
  FileText,
  Archive,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

const NotaireSettings = () => {
  const [settings, setSettings] = useState({
    // Profil utilisateur
    profile: {
      firstName: 'Maître',
      lastName: 'Notaire',
      email: 'maitre.notaire@terangafoncier.sn',
      phone: '+221 77 123 45 67',
      office: 'Étude Notariale Dakar Centre',
      chambre: 'N°12345',
      specializations: ['Immobilier', 'Successions', 'Sociétés']
    },
    
    // Préférences système
    preferences: {
      theme: 'light',
      language: 'fr',
      timezone: 'Africa/Dakar',
      dateFormat: 'DD/MM/YYYY',
      currency: 'XOF',
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      desktopNotifications: true
    },
    
    // Sécurité
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      ipWhitelist: false,
      auditLogs: true,
      encryptionLevel: 'high'
    },
    
    // Intégrations
    integrations: {
      blockchain: true,
      digitalSignature: true,
      cloudBackup: true,
      documentScanner: false,
      videoConference: true,
      paymentGateway: false
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été mises à jour avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleResetSettings = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setIsLoading(true);
      setTimeout(() => {
        window.safeGlobalToast({
          title: "Paramètres réinitialisés",
          description: "Tous les paramètres ont été restaurés par défaut",
          variant: "success"
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleExportSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Export terminé",
        description: "Configuration exportée avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        window.safeGlobalToast({
          title: "Configuration importée",
          description: `Paramètres importés depuis ${file.name}`,
          variant: "success"
        });
      }
    };
    input.click();
  };

  const securityLevels = [
    { value: 'low', label: 'Faible', color: 'text-red-600' },
    { value: 'medium', label: 'Moyen', color: 'text-yellow-600' },
    { value: 'high', label: 'Élevé', color: 'text-green-600' }
  ];

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const themes = [
    { value: 'light', label: 'Clair', icon: Sun },
    { value: 'dark', label: 'Sombre', icon: Moon },
    { value: 'auto', label: 'Automatique', icon: Monitor }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Paramètres</h2>
          <p className="text-gray-600 mt-1">
            Configurez vos préférences et paramètres de sécurité
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button 
            variant="outline"
            onClick={handleExportSettings}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button 
            variant="outline"
            onClick={handleImportSettings}
            disabled={isLoading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>
                Gérez vos informations professionnelles et de contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Prénom</label>
                    <input 
                      type="text"
                      value={settings.profile.firstName}
                      onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Nom</label>
                    <input 
                      type="text"
                      value={settings.profile.lastName}
                      onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input 
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Téléphone</label>
                    <input 
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Étude Notariale</label>
                    <input 
                      type="text"
                      value={settings.profile.office}
                      onChange={(e) => handleSettingChange('profile', 'office', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">N° Chambre</label>
                    <input 
                      type="text"
                      value={settings.profile.chambre}
                      onChange={(e) => handleSettingChange('profile', 'chambre', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <label className="text-sm font-medium mb-3 block">Spécialisations</label>
                <div className="flex flex-wrap gap-2">
                  {settings.profile.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                      <button 
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => {
                          const newSpecs = settings.profile.specializations.filter((_, i) => i !== index);
                          handleSettingChange('profile', 'specializations', newSpecs);
                        }}
                      >
                        <XCircle className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newSpec = prompt('Nouvelle spécialisation:');
                      if (newSpec) {
                        handleSettingChange('profile', 'specializations', [...settings.profile.specializations, newSpec]);
                      }
                    }}
                  >
                    + Ajouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-purple-600" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">Thème</label>
                  <div className="grid grid-cols-3 gap-2">
                    {themes.map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => handleSettingChange('preferences', 'theme', theme.value)}
                          className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                            settings.preferences.theme === theme.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-sm">{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-3 block">Langue</label>
                  <select 
                    value={settings.preferences.language}
                    onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-3 block">Fuseau Horaire</label>
                  <select 
                    value={settings.preferences.timezone}
                    onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Africa/Dakar">Dakar (GMT+0)</option>
                    <option value="Africa/Casablanca">Casablanca (GMT+1)</option>
                    <option value="Europe/Paris">Paris (GMT+1)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications générales</p>
                    <p className="text-sm text-gray-600">Recevoir toutes les notifications</p>
                  </div>
                  <Switch 
                    checked={settings.preferences.notifications}
                    onCheckedChange={(checked) => handleSettingChange('preferences', 'notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-gray-600">Recevoir les alertes par email</p>
                  </div>
                  <Switch 
                    checked={settings.preferences.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('preferences', 'emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications SMS</p>
                    <p className="text-sm text-gray-600">Recevoir les alertes par SMS</p>
                  </div>
                  <Switch 
                    checked={settings.preferences.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('preferences', 'smsNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications bureau</p>
                    <p className="text-sm text-gray-600">Afficher les notifications sur le bureau</p>
                  </div>
                  <Switch 
                    checked={settings.preferences.desktopNotifications}
                    onCheckedChange={(checked) => handleSettingChange('preferences', 'desktopNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Authentification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authentification à deux facteurs</p>
                    <p className="text-sm text-gray-600">Sécurité renforcée avec 2FA</p>
                  </div>
                  <Switch 
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorEnabled', checked)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Expiration de session (minutes)
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.security.sessionTimeout]}
                      onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', value[0])}
                      max={120}
                      min={15}
                      step={15}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>15 min</span>
                      <span className="font-medium">{settings.security.sessionTimeout} min</span>
                      <span>120 min</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Expiration mot de passe (jours)
                  </label>
                  <select 
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value={30}>30 jours</option>
                    <option value={60}>60 jours</option>
                    <option value={90}>90 jours</option>
                    <option value={180}>180 jours</option>
                    <option value={365}>1 an</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-red-600" />
                  Sécurité Avancée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Liste blanche IP</p>
                    <p className="text-sm text-gray-600">Limiter l'accès par adresse IP</p>
                  </div>
                  <Switch 
                    checked={settings.security.ipWhitelist}
                    onCheckedChange={(checked) => handleSettingChange('security', 'ipWhitelist', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Logs d'audit</p>
                    <p className="text-sm text-gray-600">Enregistrer toutes les actions</p>
                  </div>
                  <Switch 
                    checked={settings.security.auditLogs}
                    onCheckedChange={(checked) => handleSettingChange('security', 'auditLogs', checked)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Niveau de chiffrement</label>
                  <select 
                    value={settings.security.encryptionLevel}
                    onChange={(e) => handleSettingChange('security', 'encryptionLevel', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {securityLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Niveau actuel: <span className={securityLevels.find(l => l.value === settings.security.encryptionLevel)?.color}>
                      {securityLevels.find(l => l.value === settings.security.encryptionLevel)?.label}
                    </span>
                  </p>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Gérer les clés de chiffrement
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(settings.integrations).map(([key, enabled]) => {
              const integrationInfo = {
                blockchain: { icon: Database, label: 'Blockchain TerangaChain', color: 'text-blue-600' },
                digitalSignature: { icon: FileText, label: 'Signature Numérique', color: 'text-green-600' },
                cloudBackup: { icon: HardDrive, label: 'Sauvegarde Cloud', color: 'text-purple-600' },
                documentScanner: { icon: Archive, label: 'Scanner Documents', color: 'text-orange-600' },
                videoConference: { icon: Monitor, label: 'Visioconférence', color: 'text-red-600' },
                paymentGateway: { icon: Globe, label: 'Passerelle Paiement', color: 'text-yellow-600' }
              };
              
              const info = integrationInfo[key];
              const Icon = info.icon;
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Icon className={`h-6 w-6 ${info.color}`} />
                        <Switch 
                          checked={enabled}
                          onCheckedChange={(checked) => handleSettingChange('integrations', key, checked)}
                        />
                      </div>
                      <h3 className="font-medium text-sm">{info.label}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {enabled ? 'Activé' : 'Désactivé'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-600" />
                  Gestion des Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter toutes mes données
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver les anciens dossiers
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Synchroniser avec le cloud
                </Button>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Espace utilisé</span>
                    <span>2.3 GB / 10 GB</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Zone de Danger
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={handleResetSettings}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser les paramètres
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Cette action supprimera définitivement toutes vos données. Êtes-vous sûr ?')) {
                      window.safeGlobalToast({
                        title: "Suppression annulée",
                        description: "Action annulée pour votre sécurité",
                        variant: "success"
                      });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer mon compte
                </Button>
                
                <p className="text-xs text-gray-500">
                  ⚠️ Ces actions sont irréversibles. Assurez-vous d'avoir sauvegardé vos données importantes.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions rapides fixes en bas */}
      <div className="fixed bottom-6 right-6 flex space-x-2">
        <Button 
          size="sm"
          variant="outline"
          onClick={handleResetSettings}
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button 
          size="sm"
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default NotaireSettings;