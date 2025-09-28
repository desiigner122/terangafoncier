import React, { useState } from 'react';
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

const ParticulierSettings = () => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('fr');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(85);

  // Données utilisateur
  const userProfile = {
    name: "Amadou Diallo",
    email: "amadou.diallo@email.com",
    phone: "+221 77 123 45 67",
    avatar: "/api/placeholder/100/100",
    joinDate: "2024-01-15",
    lastLogin: "2024-03-20 10:30",
    accountType: "Particulier Premium",
    propertiesViewed: 127,
    favoritesSaved: 23,
    messagesExchanged: 156
  };

  const securityLogs = [
    {
      id: 1,
      action: "Connexion réussie",
      device: "Chrome sur Windows",
      location: "Dakar, Sénégal",
      timestamp: "2024-03-20 10:30",
      status: "success"
    },
    {
      id: 2,
      action: "Modification du profil",
      device: "Mobile App",
      location: "Dakar, Sénégal",
      timestamp: "2024-03-19 15:22",
      status: "success"
    },
    {
      id: 3,
      action: "Tentative de connexion",
      device: "Firefox sur Mac",
      location: "Thiès, Sénégal",
      timestamp: "2024-03-18 08:45",
      status: "failed"
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
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback className="text-xl">{userProfile.name.charAt(0)}</AvatarFallback>
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
            <h3 className="font-semibold text-lg">{userProfile.name}</h3>
            <p className="text-sm text-slate-600 mb-2">{userProfile.accountType}</p>
            <Badge variant="secondary">
              Membre depuis {new Date(userProfile.joinDate).toLocaleDateString('fr-FR')}
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
            <Input id="name" defaultValue={userProfile.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={userProfile.email} />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" defaultValue={userProfile.phone} />
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
            {securityLogs.map((log) => (
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
              <p>Propriétés vues: {userProfile.propertiesViewed}</p>
              <p>Favoris sauvegardés: {userProfile.favoritesSaved}</p>
              <p>Messages échangés: {userProfile.messagesExchanged}</p>
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-slate-600 mt-1">Gérez votre compte et vos préférences</p>
        </div>
        
        <div className="flex items-center gap-2">
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