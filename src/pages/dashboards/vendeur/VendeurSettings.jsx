import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  User, 
  Bell, 
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Key,
  Database,
  Download,
  Upload,
  Trash2,
  Link2,
  Palette,
  Languages,
  Volume2,
  VolumeX,
  Wifi,
  Bluetooth,
  Monitor,
  HelpCircle,
  ExternalLink,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Building,
  Crown,
  Gem,
  StarIcon,
  Check,
  X,
  CalendarIcon,
  CreditCardIcon,
  UsersIcon,
  ZapIcon
} from 'lucide-react';

const VendeurSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: true,
    newMessages: true,
    propertyUpdates: true,
    priceAlerts: false
  });
  
  const [profileData, setProfileData] = useState({
    firstName: 'Mamadou',
    lastName: 'Diallo',
    email: 'mamadou.diallo@terangafoncier.sn',
    phone: '+221 77 123 45 67',
    company: 'TerangaFoncier Pro',
    address: 'Dakar, Sénégal',
    bio: 'Agent immobilier spécialisé dans les propriétés haut de gamme à Dakar.',
    avatar: '/api/placeholder/100/100',
    website: 'https://mamadou-immobilier.sn',
    license: 'AGT-2024-001'
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    currency: 'XOF',
    timezone: 'Africa/Dakar',
    dateFormat: 'dd/mm/yyyy',
    measureUnit: 'metric'
  });

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Simulation de sauvegarde
    console.log('Paramètres sauvegardés');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 h-8 w-8 text-blue-600" />
            Paramètres du Compte
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="abonnement">Abonnement</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
        </TabsList>

        {/* Profil */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Photo de profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileData.avatar} />
                      <AvatarFallback className="text-2xl">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Changer la photo
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Entreprise</Label>
                      <Input 
                        id="company"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input 
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input 
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea 
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations professionnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="license">Licence professionnelle</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="license"
                        value={profileData.license}
                        onChange={(e) => setProfileData({...profileData, license: e.target.value})}
                      />
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Vérifiée
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Abonnement */}
        <TabsContent value="abonnement" className="space-y-6">
          {/* Statut d'abonnement actuel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Mon abonnement actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Plan Professional</h3>
                    <p className="text-gray-600">Outils avancés pour la vente immobilière</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Renouvelé le 15 décembre 2024
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">1.2M XOF</p>
                    <p className="text-sm text-gray-500">/mois</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plans d'abonnement */}
          <Card>
            <CardHeader>
              <CardTitle>Plans d'abonnement disponibles</CardTitle>
              <CardDescription>
                Choisissez le plan adapté à votre activité de vente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Plan Starter */}
                <div className="border rounded-lg p-6 relative">
                  <div className="text-center mb-4">
                    <Gem className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h3 className="text-xl font-semibold">Starter</h3>
                    <p className="text-gray-600">Pour débuter dans la vente</p>
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold">600K XOF</div>
                    <div className="text-gray-500">/mois</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Jusqu'à 20 annonces</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Gestion des contacts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Outils de base</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Support email</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-400">Rapports avancés</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Changer de plan
                  </Button>
                </div>

                {/* Plan Professional */}
                <div className="border-2 border-green-500 rounded-lg p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Actuel
                    </span>
                  </div>
                  <div className="text-center mb-4">
                    <Crown className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h3 className="text-xl font-semibold">Professional</h3>
                    <p className="text-gray-600">Le plus populaire</p>
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold">1.2M XOF</div>
                    <div className="text-gray-500">/mois</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Annonces illimitées</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">CRM complet</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Outils marketing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Rapports détaillés</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Visite virtuelle</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Support prioritaire</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    Plan actuel
                  </Button>
                </div>

                {/* Plan Enterprise */}
                <div className="border rounded-lg p-6 relative">
                  <div className="text-center mb-4">
                    <StarIcon className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <h3 className="text-xl font-semibold">Enterprise</h3>
                    <p className="text-gray-600">Pour les agences</p>
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold">2.5M XOF</div>
                    <div className="text-gray-500">/mois</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Tout du Professional</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Multi-utilisateurs (15)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">API personnalisée</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">White-label</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Formation équipe</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Support dédié 24/7</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Passer à Enterprise
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique de facturation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5" />
                Historique de facturation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Décembre 2024</p>
                      <p className="text-sm text-gray-500">Plan Professional</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">1.2M XOF</p>
                    <p className="text-sm text-green-600">Payé</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Novembre 2024</p>
                      <p className="text-sm text-gray-500">Plan Professional</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">1.2M XOF</p>
                    <p className="text-sm text-green-600">Payé</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Octobre 2024</p>
                      <p className="text-sm text-gray-500">Plan Starter</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">600K XOF</p>
                    <p className="text-sm text-green-600">Payé</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prochaine facturation :</span>
                  <span className="font-medium">15 janvier 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Méthodes de paiement */}
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Visa • Expire 12/26</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Modifier</Button>
                    <Button variant="outline" size="sm">Supprimer</Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Ajouter une méthode de paiement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compte */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email de connexion</span>
                    <span className="font-medium">{profileData.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type de compte</span>
                    <Badge className="bg-blue-100 text-blue-800">Vendeur Pro</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date de création</span>
                    <span className="font-medium">15 janvier 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dernière connexion</span>
                    <span className="font-medium">Aujourd'hui à 14:30</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Propriétés actives</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ventes réalisées</span>
                    <span className="font-medium">34</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Note moyenne</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">4.8</span>
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(i => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Statut de vérification</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Vérifié
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Exporter mes données</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Database className="w-6 h-6 mb-2" />
                  <span>Sauvegarde</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="w-6 h-6 mb-2" />
                  <span>Supprimer le compte</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Préférences de notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications par email</h4>
                    <p className="text-sm text-gray-600">Recevez des notifications par email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(value) => handleNotificationChange('email', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications push</h4>
                    <p className="text-sm text-gray-600">Notifications sur votre navigateur</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(value) => handleNotificationChange('push', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS</h4>
                    <p className="text-sm text-gray-600">Notifications par SMS (frais appliqués)</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(value) => handleNotificationChange('sms', value)}
                  />
                </div>
              </div>

              <hr />

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Types de notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Nouveaux messages</h5>
                    <p className="text-sm text-gray-600">Quand vous recevez un message</p>
                  </div>
                  <Switch 
                    checked={notifications.newMessages}
                    onCheckedChange={(value) => handleNotificationChange('newMessages', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Mises à jour de propriétés</h5>
                    <p className="text-sm text-gray-600">Changements sur vos annonces</p>
                  </div>
                  <Switch 
                    checked={notifications.propertyUpdates}
                    onCheckedChange={(value) => handleNotificationChange('propertyUpdates', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Alertes de prix</h5>
                    <p className="text-sm text-gray-600">Changements de prix du marché</p>
                  </div>
                  <Switch 
                    checked={notifications.priceAlerts}
                    onCheckedChange={(value) => handleNotificationChange('priceAlerts', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Communications marketing</h5>
                    <p className="text-sm text-gray-600">Nouvelles fonctionnalités et offres</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing}
                    onCheckedChange={(value) => handleNotificationChange('marketing', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Préférences */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Localisation et langue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
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

                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dakar">Dakar (GMT+0)</SelectItem>
                      <SelectItem value="Africa/Casablanca">Casablanca (GMT+1)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format de date</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Mode sombre</h4>
                    <p className="text-sm text-gray-600">Interface en thème sombre</p>
                  </div>
                  <Switch 
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Devise</Label>
                  <Select value={preferences.currency} onValueChange={(value) => setPreferences({...preferences, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">CFA (XOF)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">Dollar US (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Unités de mesure</Label>
                  <Select value={preferences.measureUnit} onValueChange={(value) => setPreferences({...preferences, measureUnit: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Métrique (m², km)</SelectItem>
                      <SelectItem value="imperial">Impérial (ft², mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Sécurité du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-4">Changer le mot de passe</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Mot de passe actuel</Label>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Mot de passe actuel"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    <Button>Changer le mot de passe</Button>
                  </div>
                </div>

                <hr />

                <div>
                  <h4 className="font-medium mb-4">Authentification à deux facteurs</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">2FA par SMS</h5>
                      <p className="text-sm text-gray-600">Code de vérification par SMS</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Activé
                    </Badge>
                  </div>
                  <Button variant="outline" className="mt-2">
                    <Key className="w-4 h-4 mr-2" />
                    Configurer l'authentificateur
                  </Button>
                </div>

                <hr />

                <div>
                  <h4 className="font-medium mb-4">Sessions actives</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Monitor className="w-5 h-5 text-gray-400" />
                        <div>
                          <h5 className="font-medium">Chrome sur Windows</h5>
                          <p className="text-sm text-gray-600">Dakar, Sénégal • Session actuelle</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Actuelle</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-gray-400" />
                        <div>
                          <h5 className="font-medium">iPhone Safari</h5>
                          <p className="text-sm text-gray-600">Dakar, Sénégal • Il y a 2 heures</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Déconnecter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facturation */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Informations de facturation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Plan TerangaFoncier Pro</h4>
                    <p className="text-sm text-blue-800">Abonnement mensuel • Renouvelé le 15 de chaque mois</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">25 000 FCFA</div>
                    <p className="text-sm text-blue-800">par mois</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Méthodes de paiement</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <h5 className="font-medium">**** **** **** 1234</h5>
                        <p className="text-sm text-gray-600">Visa • Expire 12/26</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Principale</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Ajouter une méthode de paiement
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Historique des factures</h4>
                <div className="space-y-2">
                  {[
                    { date: '15 Jan 2024', amount: '25 000 FCFA', status: 'Payée' },
                    { date: '15 Déc 2023', amount: '25 000 FCFA', status: 'Payée' },
                    { date: '15 Nov 2023', amount: '25 000 FCFA', status: 'Payée' }
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{invoice.date}</h5>
                        <p className="text-sm text-gray-600">Abonnement TerangaFoncier Pro</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{invoice.amount}</span>
                        <Badge className="bg-green-100 text-green-800">{invoice.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurSettings;