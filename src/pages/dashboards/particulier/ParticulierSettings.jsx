import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  LogOut,
  HelpCircle,
  MessageSquare,
  CreditCard,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'react-hot-toast';

const ParticulierSettings = () => {
  const { user, profile } = useAuth();
  const outletContext = useOutletContext();
  
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('fr');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [securityLogs, setSecurityLogs] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadUserSettings();
      loadSecurityLogs();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadUserSettings = async () => {
    try {
      setLoading(true);

      // Charger le profil utilisateur depuis Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Construire le profil avec les données disponibles
      const loadedProfile = {
        name: profileData?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Utilisateur',
        email: user?.email || '',
        phone: profileData?.phone || profile?.phone || '',
        avatar: profileData?.avatar_url || user?.user_metadata?.avatar_url || null,
        joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '',
        lastLogin: profileData?.last_sign_in_at ? new Date(profileData.last_sign_in_at).toLocaleDateString('fr-FR') : 'Aujourd\'hui',
        accountType: profileData?.account_type || profile?.role || 'Particulier',
        propertiesViewed: profileData?.properties_viewed || 0,
        favoritesSaved: profileData?.favorites_count || 0,
        messagesExchanged: profileData?.messages_count || 0
      };

      setUserProfile(loadedProfile);

      // Charger les préférences
      const preferences = profileData?.preferences || {};
      setTheme(preferences.theme || 'light');
      setLanguage(preferences.language || 'fr');
      setEmailNotifications(preferences.email_notifications !== false);
      setPushNotifications(preferences.push_notifications !== false);
      setMarketingEmails(preferences.marketing_emails || false);
      setTwoFactorEnabled(profileData?.two_factor_enabled || false);

      // Calculer la complétion du profil
      const completion = calculateProfileCompletion(profileData);
      setProfileCompletion(completion);

      console.log('✅ Paramètres utilisateur chargés');
    } catch (error) {
      console.error('❌ Erreur chargement paramètres:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityLogs = async () => {
    try {
      // Charger les logs de sécurité depuis Supabase
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error && error.code !== 'PGRST116') {
        console.warn('Table security_logs non disponible:', error.message);
        setSecurityLogs([]);
        return;
      }

      const logs = data?.map(log => ({
        id: log.id,
        action: log.action || 'Activité',
        device: log.device || 'Navigateur',
        location: log.location || 'Non spécifié',
        timestamp: new Date(log.created_at).toLocaleString('fr-FR'),
        status: log.status || 'success'
      })) || [];

      setSecurityLogs(logs);
    } catch (error) {
      console.error('❌ Erreur chargement logs:', error);
      setSecurityLogs([]);
    }
  };

  const calculateProfileCompletion = (profileData) => {
    if (!profileData) return 30;
    
    let completion = 30; // Base
    if (profileData.full_name) completion += 15;
    if (profileData.phone) completion += 15;
    if (profileData.avatar_url) completion += 10;
    if (profileData.address) completion += 10;
    if (profileData.birth_date) completion += 10;
    if (profileData.bio) completion += 10;
    
    return Math.min(completion, 100);
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            theme,
            language,
            email_notifications: emailNotifications,
            push_notifications: pushNotifications,
            marketing_emails: marketingEmails
          },
          two_factor_enabled: twoFactorEnabled
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error('❌ Erreur sauvegarde paramètres:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  // Données mockées pour fallback
  const mockUserProfile = {
    name: user?.email?.split('@')[0] || "Utilisateur",
    email: user?.email || "user@email.com",
    phone: "+221 77 000 00 00",
    avatar: null,
    joinDate: "2024-01-15",
    lastLogin: "Aujourd'hui",
    accountType: "Particulier",
    propertiesViewed: 0,
    favoritesSaved: 0,
    messagesExchanged: 0
  };

  const mockSecurityLogs = [
    {
      id: 1,
      action: "Connexion réussie",
      device: "Chrome sur Windows",
      location: "Dakar, Sénégal",
      timestamp: new Date().toLocaleString('fr-FR'),
      status: "success"
    }
  ];

  const subscriptionInfo = {
    plan: "Premium",
    status: "active",
    nextBilling: "2024-04-20",
    price: "15,000 FCFA/mois",
    features: [
      "Recherche avancée illimitée",
      "Contact direct avec agents",
      "Alerte propriétés en temps réel",
      "Assistant IA personnel",
      "Certificats blockchain",
      "Support prioritaire"
    ]
  };

  // Utiliser les données réelles ou le fallback
  const displayProfile = userProfile || mockUserProfile;
  const displayLogs = securityLogs.length > 0 ? securityLogs : mockSecurityLogs;

  const ProfileSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations personnelles
        </CardTitle>
        <CardDescription>
          Gérez vos informations de profil et préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={displayProfile.avatar} />
              <AvatarFallback className="text-xl">{displayProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{displayProfile.name}</h3>
            <p className="text-sm text-slate-600 mb-2">{displayProfile.accountType}</p>
            <Badge variant="secondary">
              Membre depuis {displayProfile.joinDate}
            </Badge>
          </div>
        </div>

        {/* Profile completion */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Profil complété</Label>
            <span className="text-sm text-slate-600">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="mb-2" />
          <p className="text-xs text-slate-500">
            Complétez votre profil pour améliorer vos recommandations
          </p>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <Input id="name" defaultValue={displayProfile.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={displayProfile.email} />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" defaultValue={displayProfile.phone} />
          </div>
          <div>
            <Label htmlFor="location">Localisation</Label>
            <Select defaultValue="dakar">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dakar">Dakar</SelectItem>
                <SelectItem value="thies">Thiès</SelectItem>
                <SelectItem value="saint-louis">Saint-Louis</SelectItem>
                <SelectItem value="kaolack">Kaolack</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SecuritySection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité du compte
          </CardTitle>
          <CardDescription>
            Protégez votre compte avec des paramètres de sécurité avancés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change password */}
          <div>
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <div className="relative">
              <Input 
                id="current-password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" placeholder="••••••••" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input id="confirm-password" type="password" placeholder="••••••••" />
            </div>
          </div>

          {/* Two-factor authentication */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Authentification à deux facteurs</p>
                <p className="text-sm text-slate-600">Sécurisez votre compte avec un code SMS</p>
              </div>
            </div>
            <Switch 
              checked={twoFactorEnabled} 
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Key className="w-4 h-4 mr-2" />
            Mettre à jour le mot de passe
          </Button>
        </CardContent>
      </Card>

      {/* Security logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Historique des connexions et activités de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    log.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {log.status === 'success' ? 
                      <CheckCircle className="w-4 h-4 text-green-600" /> :
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-sm">{log.action}</p>
                    <p className="text-xs text-slate-600">{log.device} • {log.location}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const NotificationsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Gérez vos préférences de notification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications par email</p>
              <p className="text-sm text-slate-600">Recevez des alertes par email</p>
            </div>
            <Switch 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications push</p>
              <p className="text-sm text-slate-600">Notifications sur votre appareil</p>
            </div>
            <Switch 
              checked={pushNotifications} 
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Emails marketing</p>
              <p className="text-sm text-slate-600">Offres spéciales et nouveautés</p>
            </div>
            <Switch 
              checked={marketingEmails} 
              onCheckedChange={setMarketingEmails}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Types de notifications</h4>
          
          {[
            { key: 'new-properties', label: 'Nouvelles propriétés', enabled: true },
            { key: 'price-changes', label: 'Changements de prix', enabled: true },
            { key: 'agent-messages', label: 'Messages d\'agents', enabled: true },
            { key: 'appointment-reminders', label: 'Rappels de rendez-vous', enabled: true },
            { key: 'market-reports', label: 'Rapports de marché', enabled: false },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <p className="text-sm">{item.label}</p>
              <Switch defaultChecked={item.enabled} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const PreferencesSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Préférences
        </CardTitle>
        <CardDescription>
          Personnalisez votre expérience utilisateur
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">Thème</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'light', label: 'Clair', icon: Sun },
              { key: 'dark', label: 'Sombre', icon: Moon },
              { key: 'system', label: 'Système', icon: Monitor }
            ].map((themeOption) => (
              <button
                key={themeOption.key}
                onClick={() => setTheme(themeOption.key)}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  theme === themeOption.key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <themeOption.icon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">{themeOption.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="language">Langue</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="wo">Wolof</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="currency">Devise</Label>
          <Select defaultValue="fcfa">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fcfa">FCFA</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="usd">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timezone">Fuseau horaire</Label>
          <Select defaultValue="gmt">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gmt">GMT (Dakar)</SelectItem>
              <SelectItem value="utc">UTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const SubscriptionSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Abonnement
        </CardTitle>
        <CardDescription>
          Gérez votre abonnement et facturation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">Plan {subscriptionInfo.plan}</h3>
              <p className="text-sm text-slate-600">
                Renouvellement le {new Date(subscriptionInfo.nextBilling).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{subscriptionInfo.price}</p>
              <Badge className="bg-green-100 text-green-800">
                {subscriptionInfo.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {subscriptionInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Changer de plan
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Factures
            </Button>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Votre abonnement se renouvelle automatiquement. Vous pouvez l'annuler à tout moment.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const DataSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Données et confidentialité
        </CardTitle>
        <CardDescription>
          Gérez vos données personnelles et paramètres de confidentialité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Données d'activité</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p>Propriétés vues: {displayProfile.propertiesViewed}</p>
              <p>Favoris sauvegardés: {displayProfile.favoritesSaved}</p>
              <p>Messages échangés: {displayProfile.messagesExchanged}</p>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              <Download className="w-4 h-4 mr-1" />
              Exporter
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Confidentialité</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Profil public</span>
                <Switch defaultChecked={false} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Historique de recherche</span>
                <Switch defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Analytics personnalisés</span>
                <Switch defaultChecked={true} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Télécharger toutes mes données
          </Button>
          
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer mon compte
          </Button>
        </div>

        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            La suppression de votre compte est définitive et ne peut pas être annulée.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-slate-600 mt-1">Gérez votre compte et vos préférences</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={saveSettings} variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="outline">
            <HelpCircle className="w-4 h-4 mr-2" />
            Aide
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Préférences</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Abonnement</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Données</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySection />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsSection />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesSection />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionSection />
        </TabsContent>

        <TabsContent value="data">
          <DataSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierSettings;