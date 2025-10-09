import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings,
  User,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/services/supabaseClient';

const ParticulierSettings = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [notifications, setNotifications] = useState({
    email_messages: true,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadNotificationSettings();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      console.log('📊 Chargement du profil utilisateur...');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setProfile(data || {
        nom: '',
        prenom: '',
        telephone: '',
        adresse: '',
        ville: '',
        date_naissance: '',
        profession: '',
        bio: ''
      });

      console.log('✅ Profil chargé');
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      console.log('📊 Chargement des paramètres de notification...');

      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Si pas de paramètres, utiliser les valeurs par défaut
        return;
      }

      if (data) {
        setNotifications({
          email_messages: data.email_messages ?? true,
          email_notifications: data.email_notifications ?? true,
          sms_notifications: data.sms_notifications ?? false,
          push_notifications: data.push_notifications ?? true
        });
      }

      console.log('✅ Paramètres notifications chargés');
    } catch (error) {
      console.error('❌ Erreur chargement paramètres notifications:', error);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      console.log('💾 Mise à jour du profil...');

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log('✅ Profil mis à jour avec succès');
    } catch (error) {
      console.error('❌ Erreur mise à jour profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSettings = async () => {
    try {
      setLoading(true);
      console.log('💾 Mise à jour des paramètres de notification...');

      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: user.id,
          ...notifications,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log('✅ Paramètres notifications mis à jour');
    } catch (error) {
      console.error('❌ Erreur mise à jour paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      console.error('❌ Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      console.log('🔐 Mise à jour du mot de passe...');

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      console.log('✅ Mot de passe mis à jour avec succès');
    } catch (error) {
      console.error('❌ Erreur mise à jour mot de passe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paramètres du Compte</h1>
        <p className="text-slate-600 mt-1">
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={profile.prenom || ''}
                    onChange={(e) => setProfile(prev => ({...prev, prenom: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={profile.nom || ''}
                    onChange={(e) => setProfile(prev => ({...prev, nom: e.target.value}))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-slate-50"
                  />
                  <p className="text-xs text-slate-500">L'email ne peut pas être modifié</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={profile.telephone || ''}
                    onChange={(e) => setProfile(prev => ({...prev, telephone: e.target.value}))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={profile.adresse || ''}
                  onChange={(e) => setProfile(prev => ({...prev, adresse: e.target.value}))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={profile.ville || ''}
                    onChange={(e) => setProfile(prev => ({...prev, ville: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={profile.profession || ''}
                    onChange={(e) => setProfile(prev => ({...prev, profession: e.target.value}))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => setProfile(prev => ({...prev, bio: e.target.value}))}
                  rows={3}
                />
              </div>

              <Button onClick={updateProfile} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Préférences de Notification
              </CardTitle>
              <CardDescription>
                Contrôlez comment vous recevez les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-slate-500">
                    Recevoir les notifications importantes par email
                  </p>
                </div>
                <Switch
                  checked={notifications.email_notifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({...prev, email_notifications: checked}))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Messages par email</Label>
                  <p className="text-sm text-slate-500">
                    Recevoir les nouveaux messages par email
                  </p>
                </div>
                <Switch
                  checked={notifications.email_messages}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({...prev, email_messages: checked}))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications SMS</Label>
                  <p className="text-sm text-slate-500">
                    Recevoir des notifications par SMS (sous réserve d'activation)
                  </p>
                </div>
                <Switch
                  checked={notifications.sms_notifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({...prev, sms_notifications: checked}))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications push</Label>
                  <p className="text-sm text-slate-500">
                    Recevoir des notifications push dans le navigateur
                  </p>
                </div>
                <Switch
                  checked={notifications.push_notifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({...prev, push_notifications: checked}))
                  }
                />
              </div>

              <Button onClick={updateNotificationSettings} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les préférences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Sécurité du Compte
              </CardTitle>
              <CardDescription>
                Gérez votre mot de passe et la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={updatePassword} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Confidentialité */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Confidentialité et Données
              </CardTitle>
              <CardDescription>
                Contrôlez vos données personnelles et leur utilisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Exportation des données</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Téléchargez une copie de toutes vos données personnelles
                  </p>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter mes données
                  </Button>
                </div>

                <div className="p-4 border rounded-lg border-red-200 bg-red-50">
                  <h4 className="font-medium mb-2 text-red-800">Zone de danger</h4>
                  <p className="text-sm text-red-600 mb-3">
                    La suppression de votre compte est irréversible et supprimera toutes vos données
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer mon compte
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

export default ParticulierSettings;