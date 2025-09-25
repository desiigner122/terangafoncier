import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Key,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Lock,
  Unlock,
  Check,
  X,
  AlertTriangle,
  Info,
  RefreshCw,
  Zap,
  Star
} from 'lucide-react';

const VendeurSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  const settingsTabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'appearance', name: 'Apparence', icon: Palette },
    { id: 'billing', name: 'Facturation', icon: CreditCard },
    { id: 'preferences', name: 'Préférences', icon: Settings }
  ];

  const profileData = {
    firstName: 'Mamadou',
    lastName: 'Diallo',
    email: 'mamadou.diallo@example.com',
    phone: '+221 77 123 45 67',
    address: 'Almadies, Dakar, Sénégal',
    company: 'Diallo Immobilier',
    bio: 'Expert immobilier spécialisé dans les propriétés de luxe à Dakar.',
    website: 'https://diallo-immobilier.sn',
    language: 'fr',
    timezone: 'Africa/Dakar'
  };

  const securityData = {
    twoFactorEnabled: true,
    lastPasswordChange: '2024-01-15',
    activeDevices: 3,
    loginHistory: [
      { device: 'MacBook Pro', location: 'Dakar, Sénégal', date: '2024-01-20 14:30' },
      { device: 'iPhone 15', location: 'Dakar, Sénégal', date: '2024-01-20 08:15' },
      { device: 'Chrome Windows', location: 'Thiès, Sénégal', date: '2024-01-19 16:45' }
    ]
  };

  const billingData = {
    plan: 'Premium',
    price: '15,000 FCFA/mois',
    nextBilling: '2024-02-20',
    paymentMethod: '**** **** **** 1234',
    usage: {
      properties: { current: 15, limit: 50 },
      photos: { current: 240, limit: 1000 },
      aiAnalysis: { current: 68, limit: 200 }
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Photo de profil */}
            <Card>
              <CardHeader>
                <CardTitle>Photo de Profil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button size="sm" variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Prendre Photo
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      JPG, PNG ou GIF. Taille max: 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      defaultValue={profileData.firstName}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      defaultValue={profileData.lastName}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={profileData.email}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    defaultValue={profileData.phone}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.address}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.company}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={profileData.bio}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries({
                  email: { name: 'Notifications Email', desc: 'Recevez des alertes par email' },
                  sms: { name: 'Notifications SMS', desc: 'Recevez des alertes par SMS' },
                  push: { name: 'Notifications Push', desc: 'Recevez des notifications dans l\'application' },
                  marketing: { name: 'Communications Marketing', desc: 'Recevez nos offres et actualités' }
                }).map(([key, { name, desc }]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{name}</h4>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                    <Button
                      variant={notifications[key] ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                    >
                      {notifications[key] ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Types de Notifications</h4>
                  <div className="space-y-3">
                    {[
                      'Nouvelles demandes de visite',
                      'Messages de prospects',
                      'Alertes de prix du marché',
                      'Mises à jour IA',
                      'Statut des certifications blockchain'
                    ].map((type, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder Préférences
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {/* Authentification à deux facteurs */}
            <Card>
              <CardHeader>
                <CardTitle>Authentification à Deux Facteurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">2FA Activée</h4>
                    <p className="text-sm text-gray-600">Sécurité renforcée pour votre compte</p>
                  </div>
                  <Badge className={securityData.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {securityData.twoFactorEnabled ? 'Activée' : 'Désactivée'}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Configurer 2FA
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Codes de Secours
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mot de passe */}
            <Card>
              <CardHeader>
                <CardTitle>Mot de Passe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Lock className="h-4 w-4 mr-2" />
                  Changer Mot de Passe
                </Button>
              </CardContent>
            </Card>

            {/* Historique des connexions */}
            <Card>
              <CardHeader>
                <CardTitle>Appareils Connectés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityData.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{login.device}</h4>
                        <p className="text-sm text-gray-600">{login.location}</p>
                        <p className="text-xs text-gray-500">{login.date}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <X className="h-4 w-4 mr-1" />
                        Déconnecter
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            {/* Plan actuel */}
            <Card>
              <CardHeader>
                <CardTitle>Plan d'Abonnement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">{billingData.plan}</h3>
                    <p className="text-gray-600">{billingData.price}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    <Star className="h-3 w-3 mr-1" />
                    Plan Actuel
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {Object.entries(billingData.usage).map(([key, { current, limit }]) => (
                    <div key={key} className="text-center">
                      <p className="text-sm text-gray-600 capitalize">{key}</p>
                      <p className="text-lg font-bold">{current} / {limit}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(current / limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrader Plan
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger Facture
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Méthode de paiement */}
            <Card>
              <CardHeader>
                <CardTitle>Méthode de Paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-gray-600" />
                    <div>
                      <p className="font-medium">{billingData.paymentMethod}</p>
                      <p className="text-sm text-gray-600">Expire 12/26</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Modifier
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Prochaine facturation: {billingData.nextBilling}
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences Générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="wo">Wolof</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuseau Horaire
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                    <option value="Africa/Dakar">Dakar (GMT+0)</option>
                    <option value="Europe/Paris">Paris (GMT+1)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Devise
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                    <option value="XOF">Franc CFA (FCFA)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar US ($)</option>
                  </select>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>

            {/* Zone de danger */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Zone de Danger
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Supprimer le Compte</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                  </p>
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer le Compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres du Compte</h1>
          <p className="text-gray-600">Gérez vos préférences et paramètres de sécurité</p>
        </div>
        
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Profil</p>
            <p className="text-lg font-bold">85% Complet</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Sécurité</p>
            <p className="text-lg font-bold">Élevée</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Bell className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Notifications</p>
            <p className="text-lg font-bold">4 Types</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Abonnement</p>
            <p className="text-lg font-bold">Premium</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b">
        {settingsTabs.map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default VendeurSettings;