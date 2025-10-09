import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings,
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
  Lock,
  Unlock,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Palette,
  Languages,
  Wifi,
  Moon,
  Sun,
  Smartphone,
  Laptop,
  Printer,
  FileText,
  Archive,
  RotateCcw,
  CreditCard,
  Crown,
  Star,
  HelpCircle,
  MapPin,
  Building2,
  Activity,
  Zap,
  ShieldCheck,
  Fingerprint,
  LogOut,
  User,
  Plus,
  PenTool,
  Scale,
  MessageSquare,
  Users as UsersIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotaireTickets from '@/components/notaire/NotaireTickets';
import NotaireSubscription from '@/components/notaire/NotaireSubscription';

const NotaireSettingsModernized = () => {
  const { dashboardStats } = useOutletContext() || {};
  const { user } = useAuth();

  const [settings, setSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const defaultSettings = useMemo(() => ({
    profile: {
      firstName: user?.first_name || 'Maître',
      lastName: user?.last_name || 'Notaire',
      email: user?.email || 'maitre.notaire@terangafoncier.sn',
      phone: '+221 77 123 45 67',
      office: 'Étude Notariale Dakar Centre',
      chambre: 'N°12345',
      specializations: ['Immobilier', 'Successions', 'Sociétés'],
      bio: "Référent national en actes immobiliers et successions complexes."
    },
    preferences: {
      theme: 'light',
      language: 'fr',
      timezone: 'Africa/Dakar',
      dateFormat: 'DD/MM/YYYY',
      currency: 'XOF',
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      desktopNotifications: true,
      dailyDigest: true
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      ipWhitelist: false,
      auditLogs: true,
      encryptionLevel: 'high',
      biometricAuth: true
    },
    integrations: {
      blockchain: true,
      digitalSignature: true,
      cloudBackup: true,
      documentScanner: false,
      videoConference: true,
      paymentGateway: false,
      crmSync: true
    },
    notifications: {
      legalAlerts: true,
      transactionUpdates: true,
      teamReminders: true,
      marketingEmails: false,
      weeklyReport: true
    }
  }), [user]);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const result = await NotaireSupabaseService.getNotaireSettings(user.id);
        if (result.success && result.data) {
          setSettings(prev => ({ ...defaultSettings, ...result.data }));
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Erreur chargement paramètres:', error);
        setSettings(defaultSettings);
        window.safeGlobalToast?.({
          title: 'Mode hors ligne',
          description: "Impossible de charger vos paramètres. Utilisation des valeurs locales.",
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [user, defaultSettings]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const handleToggleChange = (category, key) => {
    handleSettingChange(category, key, !settings?.[category]?.[key]);
  };

  const handleSave = async () => {
    if (!user || !settings || isSaving) return;
    setIsSaving(true);
    try {
      const result = await NotaireSupabaseService.updateNotaireSettings(user.id, settings);
      if (!result.success) throw new Error(result.error || 'Erreur sauvegarde');
      setUnsavedChanges(false);
      window.safeGlobalToast?.({
        title: 'Paramètres sauvegardés',
        description: 'Vos préférences ont bien été mises à jour.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Erreur sauvegarde paramètres:', error);
      window.safeGlobalToast?.({
        title: 'Sauvegarde échouée',
        description: "Nous n'avons pas pu mettre à jour vos paramètres.",
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!user || !settings) return;
    if (!confirm('Réinitialiser tous les paramètres aux valeurs recommandées ?')) return;
    setIsSaving(true);
    try {
      setSettings(defaultSettings);
      const result = await NotaireSupabaseService.updateNotaireSettings(user.id, defaultSettings);
      if (!result.success) throw new Error(result.error || 'Erreur réinitialisation');
      setUnsavedChanges(false);
      window.safeGlobalToast?.({
        title: 'Réinitialisation effectuée',
        description: 'Vos paramètres ont été rétablis avec succès.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Erreur reset paramètres:', error);
      window.safeGlobalToast?.({
        title: 'Réinitialisation impossible',
        description: "Une erreur est survenue pendant la réinitialisation.",
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const securityScore = useMemo(() => {
    if (!settings) return 0;
    const { security } = settings;
    const base = security?.twoFactorEnabled ? 30 : 10;
    const audit = security?.auditLogs ? 25 : 10;
    const encryption = security?.encryptionLevel === 'high' ? 25 : 15;
    const biometric = security?.biometricAuth ? 20 : 10;
    return Math.min(base + audit + encryption + biometric, 100);
  }, [settings]);

  const notificationChannels = useMemo(() => {
    if (!settings) return 0;
    const { notifications } = settings;
    return Object.values(notifications || {}).filter(Boolean).length;
  }, [settings]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (!settings || isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-12 h-12 mx-auto border-4 border-amber-200 border-t-amber-600 rounded-full"
          />
          <p className="text-gray-600">Chargement de vos paramètres personnalisés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-amber-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Centre de configuration avancée</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Personnalisez chaque aspect de votre étude notariale : sécurité, notifications, intégrations et automatisations.
          </p>
          {unsavedChanges && (
            <Badge className="bg-amber-100 text-amber-800">Modifications non sauvegardées</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !unsavedChanges} className="bg-amber-600 hover:bg-amber-700">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Enregistrer' }
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Indice de sécurité</p>
              <p className="text-2xl font-semibold text-gray-900">{securityScore}%</p>
              <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">{securityScore > 80 ? 'Excellente' : 'Élevée'}</Badge>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Canaux actifs</p>
              <p className="text-2xl font-semibold text-gray-900">{notificationChannels}/5</p>
              <p className="text-xs text-gray-500">Notifications personnalisées</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Sessions actives</p>
              <p className="text-2xl font-semibold text-gray-900">{settings?.security?.sessionTimeout || 30} min</p>
              <p className="text-xs text-gray-500">Expiration automatique</p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Dernière sauvegarde</p>
              <p className="text-2xl font-semibold text-gray-900">{formatDate(dashboardStats?.lastSettingsBackup)}</p>
              <p className="text-xs text-gray-500">Synchronisé avec Supabase</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="overview">Synthèse</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="tickets">
            <MessageSquare className="h-4 w-4 mr-2" />
            Support
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <Crown className="h-4 w-4 mr-2" />
            Abonnement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-600" />
                  Activité récente
                </CardTitle>
                <CardDescription>Suivi des opérations récentes sur vos paramètres</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: 'Modification des paramètres de sécurité',
                    date: 'Il y a 2 heures',
                    icon: Shield,
                    color: 'text-emerald-600'
                  },
                  {
                    label: 'Activation des notifications d\'audience',
                    date: 'Hier',
                    icon: Bell,
                    color: 'text-blue-600'
                  },
                  {
                    label: 'Synchronisation Supabase réussie',
                    date: '25 septembre',
                    icon: Database,
                    color: 'text-purple-600'
                  }
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-amber-200 transition">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center ${event.color}`}>
                        <event.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{event.label}</p>
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Voir détails
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Check-list sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Double authentification', value: settings.security?.twoFactorEnabled },
                  { label: 'Journalisation des actions', value: settings.security?.auditLogs },
                  { label: 'Chiffrement avancé', value: settings.security?.encryptionLevel === 'high' },
                  { label: 'Biométrie activée', value: settings.security?.biometricAuth }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    {item.value ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" /> Actif
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-600 border-red-200" variant="outline">
                        <AlertTriangle className="h-3 w-3 mr-1" /> À activer
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  Automatisations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p><strong>Signature numérique :</strong> déclenchement automatique des validations blockchain.</p>
                <p><strong>Backups sécurisés :</strong> export quotidien vers coffre-fort cloud.</p>
                <p><strong>Newsletter clients VIP :</strong> résumé hebdomadaire des actes en cours.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Assistance intelligente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>Configuration guidée par IA selon votre profil d'étude notariale.</p>
                <p>Suggestions proactives basées sur vos actes récents.</p>
                <p>Monitoring permanent de la conformité numérique.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Historique sauvegardes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Dernière exportation : 25 septembre 2024</p>
                  <p>Suivant planifié : 02 octobre 2024</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le journal
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-amber-600" />
                Informations du notaire
              </CardTitle>
              <CardDescription>Mettez à jour les informations visibles par vos clients et partenaires</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <Input
                  value={settings.profile?.firstName || ''}
                  onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                />
              </div>
              <div>
                <Label>Nom</Label>
                <Input
                  value={settings.profile?.lastName || ''}
                  onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                />
              </div>
              <div>
                <Label>Email professionnel</Label>
                <Input
                  type="email"
                  value={settings.profile?.email || ''}
                  onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input
                  value={settings.profile?.phone || ''}
                  onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                />
              </div>
              <div>
                <Label>Étude notariale</Label>
                <Input
                  value={settings.profile?.office || ''}
                  onChange={(e) => handleSettingChange('profile', 'office', e.target.value)}
                />
              </div>
              <div>
                <Label>Chambre</Label>
                <Input
                  value={settings.profile?.chambre || ''}
                  onChange={(e) => handleSettingChange('profile', 'chambre', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Biographie courte</Label>
                <Textarea
                  rows={3}
                  value={settings.profile?.bio || ''}
                  onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-600" />
                Spécialisations notariales
              </CardTitle>
              <CardDescription>Présentez vos domaines d'expertise à vos clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(settings.profile?.specializations || []).map((speciality, index) => (
                  <Badge key={index} variant="outline" className="bg-amber-50 border-amber-200 text-amber-800">
                    {speciality}
                  </Badge>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Immobilier complexe
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  Financement bancaire
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  Domaine foncier
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-amber-600" />
                Interface & thème
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Thème de l'application</Label>
                  <Select
                    value={settings.preferences?.theme || 'light'}
                    onValueChange={(value) => handleSettingChange('preferences', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Langue</Label>
                  <Select
                    value={settings.preferences?.language || 'fr'}
                    onValueChange={(value) => handleSettingChange('preferences', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">Anglais</SelectItem>
                      <SelectItem value="pt">Portugais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fuseau horaire</Label>
                  <Select
                    value={settings.preferences?.timezone || 'Africa/Dakar'}
                    onValueChange={(value) => handleSettingChange('preferences', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dakar">Dakar (UTC+0)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (UTC+1)</SelectItem>
                      <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Format de date</Label>
                  <Select
                    value={settings.preferences?.dateFormat || 'DD/MM/YYYY'}
                    onValueChange={(value) => handleSettingChange('preferences', 'dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">JJ/MM/AAAA</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/JJ/AAAA</SelectItem>
                      <SelectItem value="YYYY-MM-DD">ISO 8601</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Résumé quotidien</p>
                    <p className="text-xs text-gray-500">Envoyer un rapport des actes tous les matins</p>
                  </div>
                  <Switch
                    checked={settings.preferences?.dailyDigest}
                    onCheckedChange={() => handleToggleChange('preferences', 'dailyDigest')}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Notifications desktop</p>
                    <p className="text-xs text-gray-500">Alerte lors des nouvelles validations</p>
                  </div>
                  <Switch
                    checked={settings.preferences?.desktopNotifications}
                    onCheckedChange={() => handleToggleChange('preferences', 'desktopNotifications')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                Prévisualisation
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Mode clair', icon: Sun, active: settings.preferences?.theme === 'light' },
                { title: 'Mode sombre', icon: Moon, active: settings.preferences?.theme === 'dark' },
                { title: 'Mode auto', icon: Monitor, active: settings.preferences?.theme === 'system' }
              ].map((mode, index) => (
                <div key={index} className={`p-4 border rounded-lg ${mode.active ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}>
                  <mode.icon className={`h-6 w-6 mb-3 ${mode.active ? 'text-amber-600' : 'text-gray-400'}`} />
                  <p className="font-medium text-gray-900">{mode.title}</p>
                  <p className="text-xs text-gray-500">Interface optimisée</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Contrôles d'accès
              </CardTitle>
              <CardDescription>Renforcez la protection de vos procédures sensibles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[{
                label: 'Double authentification',
                description: 'Code SMS sécurisé requis à chaque connexion',
                key: 'twoFactorEnabled',
                icon: Lock
              }, {
                label: 'Biométrie sur appareils homologués',
                description: 'Reconnaissance FaceID / TouchID sur vos terminaux',
                key: 'biometricAuth',
                icon: Fingerprint
              }, {
                label: 'Journal des actions',
                description: 'Traçabilité complète de la rédaction à la signature',
                key: 'auditLogs',
                icon: ShieldCheck
              }, {
                label: 'Liste blanche IP',
                description: 'Restreindre l’accès aux réseaux de l’étude',
                key: 'ipWhitelist',
                icon: Wifi
              }].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4 p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={Boolean(settings.security?.[item.key])}
                    onCheckedChange={() => handleToggleChange('security', item.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-600" />
                Gestion des sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">Durée maximale d'inactivité</p>
                  <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                    {settings.security?.sessionTimeout || 30} minutes
                  </Badge>
                </div>
                <Slider
                  value={[settings.security?.sessionTimeout || 30]}
                  min={5}
                  max={120}
                  step={5}
                  onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', value[0])}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">Renouvellement du mot de passe</p>
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                    Tous les {settings.security?.passwordExpiry || 90} jours
                  </Badge>
                </div>
                <Slider
                  value={[settings.security?.passwordExpiry || 90]}
                  min={30}
                  max={365}
                  step={15}
                  onValueChange={(value) => handleSettingChange('security', 'passwordExpiry', value[0])}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="h-4 w-4" />
                  Vigilance anti espionnage activée
                </div>
                <div className="flex items-center gap-2">
                  <Unlock className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs text-gray-500">Alertes en temps réel</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-600" />
                Sessions actives
              </CardTitle>
              <CardDescription>Déconnectez à distance les appareils non reconnus</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-52 pr-3">
                {[{
                  id: 1,
                  device: 'MacBook Pro',
                  type: 'desktop',
                  location: 'Dakar, Sénégal',
                  lastSeen: 'Il y a 12 min'
                }, {
                  id: 2,
                  device: 'iPhone 15 Pro',
                  type: 'mobile',
                  location: 'Thiès, Sénégal',
                  lastSeen: 'Il y a 1h'
                }, {
                  id: 3,
                  device: 'PC Étude notariale',
                  type: 'desktop',
                  location: 'Saint-Louis, Sénégal',
                  lastSeen: 'Il y a 3h'
                }].map((session) => {
                  const Icon = session.type === 'mobile' ? Smartphone : Laptop;
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg mb-3 last:mb-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{session.device}</p>
                          <p className="text-xs text-gray-500">{session.location} • {session.lastSeen}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnecter
                      </Button>
                    </div>
                  );
                })}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-amber-600" />
                Connecteurs actifs
              </CardTitle>
              <CardDescription>Synchronisez vos outils métiers et partenaires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[{
                key: 'blockchain',
                label: 'Blockchain notariale',
                description: 'Validation et horodatage automatiques des actes',
                icon: Zap
              }, {
                key: 'digitalSignature',
                label: 'Signature numérique',
                description: 'DocuSign, Yousign et TerangaSign',
                icon: PenTool
              }, {
                key: 'cloudBackup',
                label: 'Sauvegarde cloud chiffrée',
                description: 'Sauvegarde sur coffre-fort numérique',
                icon: Upload
              }, {
                key: 'documentScanner',
                label: 'Scanner intelligent',
                description: 'Numérisation avec OCR sécurisé',
                icon: Printer
              }, {
                key: 'videoConference',
                label: 'Visio notariée',
                description: 'Liaisons sécurisées clients / banques',
                icon: Wifi
              }, {
                key: 'paymentGateway',
                label: 'Passerelle de paiement',
                description: 'Encaissement sécurisé des honoraires',
                icon: CreditCard
              }, {
                key: 'crmSync',
                label: 'Synchronisation CRM',
                description: 'Mise à jour automatique des fiches clients',
                icon: Crown
              }].map((integration) => (
                <div key={integration.key} className="flex items-start justify-between gap-4 p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <integration.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{integration.label}</p>
                      <p className="text-xs text-gray-500">{integration.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={Boolean(settings.integrations?.[integration.key])}
                    onCheckedChange={() => handleToggleChange('integrations', integration.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-purple-600" />
                Synchronisations programmées
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="p-4 border rounded-lg">
                <p className="font-medium text-gray-900">Export Supabase</p>
                <p className="text-xs text-gray-500">Chaque nuit à 02h00</p>
                <p className="mt-2 text-xs text-emerald-600">Statut : opérationnel</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium text-gray-900">Synchronisation CRM</p>
                <p className="text-xs text-gray-500">Toutes les 2 heures</p>
                <p className="mt-2 text-xs text-blue-600">Dernière sync : 09:15</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                Préférences d'alertes
              </CardTitle>
              <CardDescription>Personnalisez la façon dont vous recevez les alertes critiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[{
                key: 'legalAlerts',
                label: 'Alertes juridiques',
                description: 'Changements législatifs, obligations réglementaires',
                icon: Scale
              }, {
                key: 'transactionUpdates',
                label: 'Mises à jour transactions',
                description: 'Signature, versements, interventions bancaires',
                icon: FileText
              }, {
                key: 'teamReminders',
                label: 'Rappels équipe',
                description: 'Réunions internes, tâches urgentes',
                icon: UsersIcon
              }, {
                key: 'weeklyReport',
                label: 'Rapport hebdomadaire',
                description: 'Résumé IA des dossiers prioritaires',
                icon: Calendar
              }, {
                key: 'marketingEmails',
                label: 'Emails marketing',
                description: 'Campagnes clients (désactivé par défaut)',
                icon: XCircle
              }].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4 p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={Boolean(settings.notifications?.[item.key])}
                    onCheckedChange={() => handleToggleChange('notifications', item.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Canaux privilégiés
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{
                title: 'Email sécurisé',
                description: 'Chiffrement TLS & archivage automatique',
                icon: Mail,
                active: settings.preferences?.emailNotifications
              }, {
                title: 'SMS prioritaire',
                description: 'Alertes instantanées sur mobile',
                icon: Phone,
                active: settings.preferences?.smsNotifications
              }, {
                title: 'Notifications bureau',
                description: 'Pop-up en temps réel sur l\'app desktop',
                icon: Monitor,
                active: settings.preferences?.desktopNotifications
              }].map((channel, index) => (
                <div key={index} className={`p-4 border rounded-lg ${channel.active ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}>
                  <channel.icon className={`h-6 w-6 mb-3 ${channel.active ? 'text-amber-600' : 'text-gray-400'}`} />
                  <p className="font-medium text-gray-900">{channel.title}</p>
                  <p className="text-xs text-gray-500">{channel.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Tickets/Support */}
        <TabsContent value="tickets" className="space-y-6">
          <NotaireTickets />
        </TabsContent>

        {/* Tab Abonnement */}
        <TabsContent value="subscription" className="space-y-6">
          <NotaireSubscription />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotaireSettingsModernized;