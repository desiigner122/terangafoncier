import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Smartphone, 
  Mail, 
  Lock, 
  Globe, 
  Moon, 
  Sun,
  Camera,
  Edit,
  Save,
  X,
  Check,
  AlertTriangle,
  Key,
  Trash2,
  Crown,
  Gem,
  StarIcon,
  CreditCardIcon,
  CalendarIcon,
  UsersIcon,
  ZapIcon
} from 'lucide-react';

const GeometreSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // États pour les différentes sections
  const [profileData, setProfileData] = useState({
    fullName: 'Mamadou Aly Ndiaye',
    email: 'mamadou.aly@geometre-expert.sn',
    phone: '+221 77 234 56 78',
    address: 'Mermoz, Dakar',
    bio: 'Géomètre expert avec 15 ans d\'expérience en levés topographiques et cadastraux.',
    license: 'GE-SN-2010-0157',
    specialities: ['Topographie', 'Cadastre', 'SIG', 'GPS/GNSS']
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailMissions: true,
    emailReports: false,
    pushMissions: true,
    pushDeadlines: true,
    smsImportant: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showPhone: false,
    showEmail: true,
    allowMessages: true
  });

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600 mt-1">Gérez votre profil et préférences</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="abonnement" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Abonnement
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Confidentialité
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Apparence
            </TabsTrigger>
          </TabsList>

          {/* Profil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Informations Professionnelles
                </CardTitle>
                <CardDescription>
                  Gérez vos informations de géomètre expert
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input 
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email professionnel</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="license">Numéro de licence</Label>
                      <Input 
                        id="license"
                        value={profileData.license}
                        onChange={(e) => setProfileData({...profileData, license: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input 
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Biographie professionnelle</Label>
                      <textarea 
                        id="bio"
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label>Spécialités</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.specialities.map((spec, index) => (
                          <Badge key={index} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                      <p className="text-gray-600">Outils avancés pour géomètres experts</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Renouvelé le 15 décembre 2024
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">1.5M XOF</p>
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
                  Choisissez le plan adapté à votre activité de géomètre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Plan Starter */}
                  <div className="border rounded-lg p-6 relative">
                    <div className="text-center mb-4">
                      <Gem className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <h3 className="text-xl font-semibold">Starter</h3>
                      <p className="text-gray-600">Pour débuter</p>
                    </div>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold">750K XOF</div>
                      <div className="text-gray-500">/mois</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Jusqu'à 20 missions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Outils de base GPS</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Rapports standards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Support email</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-400">SIG avancé</span>
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
                      <div className="text-3xl font-bold">1.5M XOF</div>
                      <div className="text-gray-500">/mois</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Missions illimitées</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">SIG complet</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Blockchain intégrée</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Assistant IA</span>
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
                      <p className="text-gray-600">Pour grandes équipes</p>
                    </div>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold">3M XOF</div>
                      <div className="text-gray-500">/mois</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Tout du Professional</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Multi-utilisateurs (10)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">API personnalisée</span>
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
                      <p className="font-medium">1.5M XOF</p>
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
                      <p className="font-medium">1.5M XOF</p>
                      <p className="text-sm text-green-600">Payé</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Choisissez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nouvelles missions</p>
                      <p className="text-sm text-gray-600">Notifications email pour les nouvelles missions</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailMissions}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailMissions: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rapprochement d'échéances</p>
                      <p className="text-sm text-gray-600">Notifications push pour les deadlines</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.pushDeadlines}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, pushDeadlines: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Confidentialité */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de confidentialité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profil public</p>
                    <p className="text-sm text-gray-600">Votre profil est visible par les autres utilisateurs</p>
                  </div>
                  <Switch 
                    checked={privacySettings.profilePublic}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, profilePublic: checked})
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline">
                  <Lock className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apparence */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences d'affichage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Thème</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                        <Sun className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">Clair</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                        <Moon className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">Sombre</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                        <Globe className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">Auto</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GeometreSettings;