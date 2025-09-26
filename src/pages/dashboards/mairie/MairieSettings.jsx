import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  User,
  Users,
  Shield,
  Key,
  Bell,
  Mail,
  Globe,
  Palette,
  Database,
  Server,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Info,
  HelpCircle,
  Zap,
  Clock,
  MapPin,
  Phone,
  Building,
  Calendar,
  FileText,
  Languages,
  Smartphone,
  Laptop,
  Monitor,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Contrast,
  QrCode
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const MairieSettings = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    newRequests: true,
    statusUpdates: true,
    deadlines: true,
    systemAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  // Handlers supplémentaires pour les paramètres
  const handleBackupData = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Sauvegarde créée",
        description: "Données municipales sauvegardées avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 3000);
  };

  const handleRestoreData = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Données restaurées",
        description: "Restauration terminée avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 3000);
  };

  const handleAddUser = () => {
    window.safeGlobalToast({
      title: "Nouveau utilisateur",
      description: "Formulaire d'ajout d'utilisateur ouvert",
      variant: "default"
    });
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    window.safeGlobalToast({
      title: "Notification mise à jour",
      description: "Préférences de notification modifiées",
      variant: "default"
    });
  };

  // Paramètres généraux
  const [generalSettings, setGeneralSettings] = useState({
    municipalityName: 'Commune de Teranga',
    mayorName: 'Abdoulaye SARR',
    address: 'Avenue Léopold Sédar Senghor, Dakar',
    phone: '+221 33 123 45 67',
    email: 'mairie@teranga.sn',
    website: 'www.commune-teranga.sn',
    timezone: 'Africa/Dakar',
    language: 'fr',
    currency: 'XOF'
  });

  // Utilisateurs et rôles
  const [users, setUsers] = useState([
    {
      id: 'user-001',
      name: 'Aminata DIOP',
      email: 'aminata.diop@teranga.sn',
      role: 'Chef Service Urbanisme',
      permissions: ['view_all', 'edit_urban_planning', 'approve_permits'],
      status: 'Actif',
      lastLogin: '2024-01-22 09:30',
      avatar: null
    },
    {
      id: 'user-002',
      name: 'Moussa FALL',
      email: 'moussa.fall@teranga.sn',
      role: 'Agent Foncier',
      permissions: ['view_requests', 'edit_land_records', 'create_nft'],
      status: 'Actif',
      lastLogin: '2024-01-22 14:15',
      avatar: null
    },
    {
      id: 'user-003',
      name: 'Fatou NDIAYE',
      email: 'fatou.ndiaye@teranga.sn',
      role: 'Secrétaire Général',
      permissions: ['view_all', 'user_management', 'system_config'],
      status: 'Inactif',
      lastLogin: '2024-01-20 16:45',
      avatar: null
    }
  ]);

  // Paramètres système
  const [systemSettings, setSystemSettings] = useState({
    darkMode: false,
    autoSave: true,
    sessionTimeout: 30,
    backupFrequency: 'daily',
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    cachingEnabled: true
  });

  // Paramètres blockchain
  const [blockchainSettings, setBlockchainSettings] = useState({
    network: 'TerangaChain',
    nodeUrl: 'https://rpc.terangachain.com',
    gasLimit: '200000',
    gasPrice: 'auto',
    confirmations: 12,
    autoSync: true,
    walletBackup: true
  });

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSystemSettingChange = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGeneralSettingChange = (key, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Paramètres sauvegardés",
        description: "Tous les paramètres ont été mis à jour avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleResetSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Paramètres réinitialisés",
        description: "Les paramètres par défaut ont été restaurés",
        variant: "default"
      });
      setIsLoading(false);
    }, 1500);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Chef Service Urbanisme': return 'bg-purple-100 text-purple-800';
      case 'Agent Foncier': return 'bg-blue-100 text-blue-800';
      case 'Secrétaire Général': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Actif' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Paramètres Municipaux</h2>
          <p className="text-gray-600 mt-1">
            Configuration et gestion du système municipal
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Alerte de sauvegarde */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Sauvegarde automatique activée</strong> - Vos modifications sont automatiquement sauvegardées toutes les 5 minutes.
        </AlertDescription>
      </Alert>

      {/* Tabs Paramètres */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* Paramètres Généraux */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations municipales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 text-blue-600 mr-2" />
                  Informations Municipales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="municipalityName">Nom de la commune</Label>
                  <Input
                    id="municipalityName"
                    value={generalSettings.municipalityName}
                    onChange={(e) => handleGeneralSettingChange('municipalityName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mayorName">Nom du maire</Label>
                  <Input
                    id="mayorName"
                    value={generalSettings.mayorName}
                    onChange={(e) => handleGeneralSettingChange('mayorName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) => handleGeneralSettingChange('address', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={generalSettings.phone}
                      onChange={(e) => handleGeneralSettingChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={generalSettings.email}
                      onChange={(e) => handleGeneralSettingChange('email', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={generalSettings.website}
                    onChange={(e) => handleGeneralSettingChange('website', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Préférences régionales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 text-green-600 mr-2" />
                  Préférences Régionales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => handleGeneralSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dakar">Africa/Dakar (GMT+0)</SelectItem>
                      <SelectItem value="Africa/Casablanca">Africa/Casablanca (GMT+1)</SelectItem>
                      <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select value={generalSettings.language} onValueChange={(value) => handleGeneralSettingChange('language', value)}>
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
                  <Label htmlFor="currency">Devise</Label>
                  <Select value={generalSettings.currency} onValueChange={(value) => handleGeneralSettingChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">Dollar US (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Logo municipal */}
                <div className="space-y-2">
                  <Label>Logo municipal</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-3 w-3 mr-2" />
                        Télécharger
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestion des Utilisateurs */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Utilisateurs du Système</h3>
              <p className="text-gray-600">Gestion des comptes et permissions</p>
            </div>
            <Button 
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleAddUser}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Permissions
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Permissions */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 text-yellow-600 mr-2" />
                Paramètres de Notifications
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications système */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Notifications Système</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nouvelles demandes</Label>
                      <p className="text-sm text-gray-600">Recevoir une notification pour chaque nouvelle demande</p>
                    </div>
                    <Switch
                      checked={notifications.newRequests}
                      onCheckedChange={(checked) => handleNotificationChange('newRequests', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mises à jour de statut</Label>
                      <p className="text-sm text-gray-600">Notifications lors des changements de statut</p>
                    </div>
                    <Switch
                      checked={notifications.statusUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('statusUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Échéances importantes</Label>
                      <p className="text-sm text-gray-600">Rappels pour les délais et échéances</p>
                    </div>
                    <Switch
                      checked={notifications.deadlines}
                      onCheckedChange={(checked) => handleNotificationChange('deadlines', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertes système</Label>
                      <p className="text-sm text-gray-600">Notifications pour les problèmes techniques</p>
                    </div>
                    <Switch
                      checked={notifications.systemAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('systemAlerts', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Canaux de notification */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Canaux de Notification</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div className="space-y-0.5">
                        <Label>Notifications email</Label>
                        <p className="text-sm text-gray-600">Recevoir les notifications par email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div className="space-y-0.5">
                        <Label>Notifications SMS</Label>
                        <p className="text-sm text-gray-600">Recevoir les notifications par SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-purple-600" />
                      <div className="space-y-0.5">
                        <Label>Notifications push</Label>
                        <p className="text-sm text-gray-600">Notifications dans le navigateur</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres Système */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 text-purple-600 mr-2" />
                  Interface Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Moon className="h-5 w-5 text-gray-600" />
                    <div className="space-y-0.5">
                      <Label>Mode sombre</Label>
                      <p className="text-sm text-gray-600">Interface en mode sombre</p>
                    </div>
                  </div>
                  <Switch
                    checked={systemSettings.darkMode}
                    onCheckedChange={(checked) => handleSystemSettingChange('darkMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sauvegarde automatique</Label>
                    <p className="text-sm text-gray-600">Sauvegarder automatiquement les modifications</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoSave}
                    onCheckedChange={(checked) => handleSystemSettingChange('autoSave', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Délai d'expiration de session (minutes)</Label>
                  <Input
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => handleSystemSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 text-yellow-600 mr-2" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mise en cache activée</Label>
                    <p className="text-sm text-gray-600">Améliore les performances</p>
                  </div>
                  <Switch
                    checked={systemSettings.cachingEnabled}
                    onCheckedChange={(checked) => handleSystemSettingChange('cachingEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics activés</Label>
                    <p className="text-sm text-gray-600">Collecte des données d'utilisation</p>
                  </div>
                  <Switch
                    checked={systemSettings.analyticsEnabled}
                    onCheckedChange={(checked) => handleSystemSettingChange('analyticsEnabled', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Fréquence de sauvegarde</Label>
                  <Select value={systemSettings.backupFrequency} onValueChange={(value) => handleSystemSettingChange('backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mode maintenance */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Mode maintenance</strong> - Désactive temporairement l'accès public au système
                </div>
                <Switch
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleSystemSettingChange('maintenanceMode', checked)}
                />
              </div>
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Paramètres Blockchain */}
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 text-blue-600 mr-2" />
                Configuration Blockchain
              </CardTitle>
              <CardDescription>
                Paramètres de connexion à TerangaChain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Réseau</Label>
                  <Select value={blockchainSettings.network}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TerangaChain">TerangaChain (Mainnet)</SelectItem>
                      <SelectItem value="TerangaTestnet">TerangaChain (Testnet)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>URL du nœud RPC</Label>
                  <Input value={blockchainSettings.nodeUrl} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Limite de gas</Label>
                  <Input value={blockchainSettings.gasLimit} />
                </div>
                
                <div className="space-y-2">
                  <Label>Prix du gas</Label>
                  <Input value={blockchainSettings.gasPrice} />
                </div>
                
                <div className="space-y-2">
                  <Label>Confirmations requises</Label>
                  <Input value={blockchainSettings.confirmations} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Synchronisation automatique</Label>
                    <p className="text-sm text-gray-600">Synchroniser automatiquement avec la blockchain</p>
                  </div>
                  <Switch checked={blockchainSettings.autoSync} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sauvegarde du portefeuille</Label>
                    <p className="text-sm text-gray-600">Sauvegarder automatiquement les clés privées</p>
                  </div>
                  <Switch checked={blockchainSettings.walletBackup} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sécurité du compte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 text-red-600 mr-2" />
                  Sécurité du Compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" placeholder="Nouveau mot de passe" />
                </div>
                
                <div className="space-y-2">
                  <Label>Confirmer le mot de passe</Label>
                  <Input type="password" placeholder="Confirmer le nouveau mot de passe" />
                </div>
                
                <Button className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>

            {/* Authentification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 text-green-600 mr-2" />
                  Authentification à Deux Facteurs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-800 font-medium">2FA Activé</p>
                  <p className="text-xs text-green-600">Votre compte est sécurisé</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <QrCode className="h-4 w-4 mr-2" />
                    Voir le QR Code
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Régénérer les codes de récupération
                  </Button>
                  
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    <X className="h-4 w-4 mr-2" />
                    Désactiver 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sessions actives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                Sessions Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Laptop className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Session actuelle</p>
                      <p className="text-sm text-gray-600">Windows 11 - Chrome 120.0</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Actuelle</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Mobile</p>
                      <p className="text-sm text-gray-600">Android - Safari</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-red-600">
                    Terminer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieSettings;