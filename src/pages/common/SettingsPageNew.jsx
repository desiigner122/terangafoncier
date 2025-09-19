import React, { useState, useEffect } from 'react';
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
  Trash2
} from 'lucide-react';
import { useUser } from '@/hooks/useUserFixed';

const SettingsPageNew = () => {
  const { user, profile, updateProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);

  // États pour les différentes sections
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatar: null
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    weeklyDigest: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataSharing: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'fr',
    timezone: 'Africa/Dakar'
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || '',
        avatar: profile.avatar_url
      });
    }
  }, [user, profile]);

  // Sauvegarder les modifications du profil
  const saveProfileChanges = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        full_name: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio
      });
      setHasChanges(false);
      // Toast de succès
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Toast d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  // Changer le mot de passe
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const changePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    try {
      // Logique de changement de mot de passe avec Supabase
      setPasswordData({ current: '', new: '', confirm: '' });
      // Toast de succès
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      // Toast d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Paramètres
          </h1>
          <p className="text-gray-600 mt-2">Gérez vos préférences et paramètres de compte</p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setHasChanges(false)}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={saveProfileChanges} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profil
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

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez Ï  jour vos informations de profil et vos coordonnées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-lg">
                      {profileData.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold">{profileData.fullName || 'Nom non défini'}</h3>
                  <p className="text-sm text-gray-600">{profile?.role || 'Rôle non défini'}</p>
                  <Badge variant="outline" className="mt-1">
                    {profile?.status || 'Statut inconnu'}
                  </Badge>
                </div>
              </div>

              {/* Formulaire */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => {
                      setProfileData(prev => ({ ...prev, fullName: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="Votre nom complet"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => {
                      setProfileData(prev => ({ ...prev, phone: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => {
                      setProfileData(prev => ({ ...prev, address: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="Votre adresse"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => {
                    setProfileData(prev => ({ ...prev, bio: e.target.value }));
                    setHasChanges(true);
                  }}
                  placeholder="Parlez-nous de vous..."
                  className="w-full p-3 border rounded-md resize-none h-24"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié des activités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries({
                emailNotifications: { label: 'Notifications par email', icon: Mail },
                smsNotifications: { label: 'Notifications SMS', icon: Smartphone },
                pushNotifications: { label: 'Notifications push', icon: Bell },
                marketingEmails: { label: 'Emails marketing', icon: Mail },
                securityAlerts: { label: 'Alertes de sécurité', icon: Shield },
                weeklyDigest: { label: 'Résumé hebdomadaire', icon: Mail }
              }).map(([key, config]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <config.icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium">{config.label}</h4>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' && 'Recevez des notifications importantes par email'}
                        {key === 'smsNotifications' && 'Recevez des alertes urgentes par SMS'}
                        {key === 'pushNotifications' && 'Notifications en temps réel sur votre appareil'}
                        {key === 'marketingEmails' && 'Nouveautés, offres et conseils'}
                        {key === 'securityAlerts' && 'Connexions suspectes et changements de sécurité'}
                        {key === 'weeklyDigest' && 'Résumé de votre activité chaque semaine'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings[key]}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Confidentialité */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de confidentialité</CardTitle>
              <CardDescription>
                Contrôlez qui peut voir vos informations et comment elles sont utilisées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries({
                profileVisible: { label: 'Profil public', desc: 'Votre profil est visible par les autres utilisateurs' },
                showEmail: { label: 'Afficher l\'email', desc: 'Votre email est visible sur votre profil public' },
                showPhone: { label: 'Afficher le téléphone', desc: 'Votre numéro est visible sur votre profil public' },
                allowMessages: { label: 'Autoriser les messages', desc: 'Les autres utilisateurs peuvent vous envoyer des messages' },
                dataSharing: { label: 'Partage de données', desc: 'Partager des données anonymisées pour améliorer le service' }
              }).map(([key, config]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{config.label}</h4>
                    <p className="text-sm text-gray-600">{config.desc}</p>
                  </div>
                  <Switch
                    checked={privacySettings[key]}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>
                Protégez votre compte avec des paramètres de sécurité avancés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Changement de mot de passe */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <h4 className="font-medium">Changer le mot de passe</h4>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Input
                    type="password"
                    placeholder="Mot de passe actuel"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  />
                  <Input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  />
                  <Input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  />
                </div>
                <Button onClick={changePassword} disabled={!passwordData.current || !passwordData.new}>
                  <Key className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </div>

              {/* Autres paramètres de sécurité */}
              {Object.entries({
                twoFactorEnabled: { label: 'Authentification Ï  deux facteurs', desc: 'Ajouter une couche de sécurité supplémentaire' },
                loginAlerts: { label: 'Alertes de connexion', desc: 'Être notifié des nouvelles connexions Ï  votre compte' }
              }).map(([key, config]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{config.label}</h4>
                    <p className="text-sm text-gray-600">{config.desc}</p>
                  </div>
                  <Switch
                    checked={securitySettings[key]}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Zone de danger
              </CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-medium text-red-800 mb-2">Supprimer le compte</h4>
                <p className="text-sm text-red-600 mb-4">
                  Cette action supprimera définitivement votre compte et toutes vos données. 
                  Cette action ne peut pas être annulée.
                </p>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer le compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Apparence */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences d'affichage</CardTitle>
              <CardDescription>
                Personnalisez l'apparence et la langue de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Thème
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={appearanceSettings.theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'light' }))}
                      className="justify-start"
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Clair
                    </Button>
                    <Button
                      variant={appearanceSettings.theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'dark' }))}
                      className="justify-start"
                    >
                      <Moon className="w-4 h-4 mr-2" />
                      Sombre
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="language">Langue</Label>
                  <select
                    id="language"
                    value={appearanceSettings.language}
                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-2 border rounded-md mt-2"
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
                    value={appearanceSettings.timezone}
                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full p-2 border rounded-md mt-2"
                  >
                    <option value="Africa/Dakar">Dakar (GMT+0)</option>
                    <option value="Europe/Paris">Paris (GMT+1)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPageNew;

