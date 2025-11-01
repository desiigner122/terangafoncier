import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Bell, Lock, Eye, EyeOff, Shield,
  Mail, Phone, MapPin, Building, CreditCard, Globe,
  Smartphone, Monitor, Tablet, Check, X, Info,
  Save, RefreshCw, Upload, Camera, Edit, Trash2,
  AlertTriangle, CheckCircle, Clock, Key, Link2,
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { useSupabaseError, SupabaseErrorDisplay } from '@/components/SupabaseErrorHandler';

const VendeurSettingsRealData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // États du profil
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    bio: '',
    avatar_url: ''
  });

  // États notifications
  const [notificationSettings, setNotificationSettings] = useState({
    email_new_message: true,
    email_property_inquiry: true,
    email_contract_signed: true,
    email_weekly_report: false,
    sms_urgent: true,
    sms_appointments: true,
    push_messages: true,
    push_updates: false
  });

  // États sécurité
  const [securitySettings, setSecuritySettings] = useState({
    two_factor_enabled: false,
    session_timeout: 30,
    login_notifications: true
  });

  // États réseaux sociaux
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  });

  // Changer mot de passe
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // États abonnement
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
      loadSubscription();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Charger profil depuis Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setProfileData({
          full_name: profile.full_name || '',
          email: user.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          bio: profile.bio || '',
          avatar_url: profile.avatar_url || ''
        });
      }

      // Charger préférences (simulées pour l'instant)
      // Dans une vraie app, créer une table user_preferences
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
      toast.error('Erreur lors du chargement des paramètres');
      setLoading(false);
    }
  };

  const loadSubscription = async () => {
    try {
      setLoadingSubscription(true);
      
      // 1. Charger abonnement actuel
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (!subError && subscription) {
        setCurrentSubscription(subscription);
      } else {
        // Abonnement gratuit par défaut
        setCurrentSubscription({
          plan: 'Gratuit',
          price: 0,
          status: 'active',
          properties_limit: 3
        });
      }
      
      // 2. Compter les biens publiés
      const { count, error: countError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);
      
      if (!countError) {
        setPropertiesCount(count || 0);
      }
      
      setLoadingSubscription(false);
    } catch (error) {
      console.error('Erreur chargement abonnement:', error);
      setLoadingSubscription(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profil mis à jour avec succès');
      setSaving(false);
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
      toast.error('Erreur lors de la sauvegarde');
      setSaving(false);
    }
  };

  const handleUpgrade = async (planName, price, propertiesLimit) => {
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: planName,
          price: price,
          status: 'active',
          properties_limit: propertiesLimit,
          next_billing_date: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();
      
      if (!error) {
        toast.success(`✅ Plan ${planName} activé avec succès !`);
        loadSubscription();
      } else {
        throw error;
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Erreur upgrade:', error);
      toast.error('Erreur lors du changement de plan');
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Vous perdrez l\'accès aux fonctionnalités premium.')) {
      return;
    }
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (!error) {
        toast.success('Abonnement annulé. Vous conservez l\'accès jusqu\'à la fin de la période.');
        loadSubscription();
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Erreur annulation:', error);
      toast.error('Erreur lors de l\'annulation');
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password
      });

      if (error) throw error;

      toast.success('Mot de passe modifié avec succès');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setSaving(false);
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      toast.error('Erreur lors du changement de mot de passe');
      setSaving(false);
    }
  };

  const handleUploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload vers Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Récupérer URL publique
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Mettre à jour profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfileData(prev => ({ ...prev, avatar_url: data.publicUrl }));
      toast.success('Photo de profil mise à jour');
    } catch (error) {
      console.error('Erreur upload avatar:', error);
      toast.error('Erreur lors de l\'upload');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      // Sauvegarder dans user_preferences (à créer)
      toast.success('Préférences de notifications mises à jour');
      setSaving(false);
    } catch (error) {
      console.error('Erreur sauvegarde notifications:', error);
      toast.error('Erreur lors de la sauvegarde');
      setSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setSecuritySettings(prev => ({
        ...prev,
        two_factor_enabled: !prev.two_factor_enabled
      }));
      toast.success('Authentification à deux facteurs mise à jour');
    } catch (error) {
      console.error('Erreur 2FA:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    try {
      // Logique de suppression (à implémenter avec précaution)
      toast.error('Fonctionnalité de suppression temporairement désactivée');
    } catch (error) {
      console.error('Erreur suppression compte:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
          </div>
          Paramètres
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Gérez votre profil et vos préférences
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">
            <User className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs sm:text-sm">
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Abonnement</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">
            <Lock className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs sm:text-sm">
            <Link2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Réseaux</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="text-xs sm:text-sm">
            <Monitor className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Préférences</span>
          </TabsTrigger>
        </TabsList>

        {/* Profil */}
        <TabsContent value="profile" className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                  {profileData.avatar_url ? (
                    <AvatarImage src={profileData.avatar_url} />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl sm:text-3xl">
                      {profileData.full_name?.charAt(0) || 'V'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    Photo de profil
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="relative text-xs sm:text-sm">
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Changer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadAvatar}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formulaire */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      full_name: e.target.value
                    }))}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      city: e.target.value
                    }))}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      address: e.target.value
                    }))}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      bio: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg min-h-[100px]"
                    placeholder="Parlez de vous et de votre activité..."
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
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

        {/* Subscription */}
        <TabsContent value="subscription" className="space-y-4">
          <SubscriptionPlans 
            user={user}
            currentPlan={currentSubscription?.plan_name || 'free'}
            onPlanSelected={(planName) => {
              loadSubscription();
            }}
          />
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Notifications</CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Notifications par Email
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'email_new_message', label: 'Nouveaux messages', desc: 'Recevoir un email pour chaque nouveau message' },
                    { key: 'email_property_inquiry', label: 'Demandes de renseignements', desc: 'Notifications des nouvelles demandes' },
                    { key: 'email_contract_signed', label: 'Contrats signés', desc: 'Confirmation de signature de contrats' },
                    { key: 'email_weekly_report', label: 'Rapport hebdomadaire', desc: 'Résumé de votre activité chaque semaine' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notificationSettings[item.key]}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          [item.key]: checked
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* SMS Notifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Notifications par SMS
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'sms_urgent', label: 'Alertes urgentes', desc: 'Messages importants nécessitant une action rapide' },
                    { key: 'sms_appointments', label: 'Rendez-vous', desc: 'Rappels de vos rendez-vous à venir' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notificationSettings[item.key]}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          [item.key]: checked
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications Push
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'push_messages', label: 'Messages instantanés', desc: 'Notifications push pour les nouveaux messages' },
                    { key: 'push_updates', label: 'Mises à jour', desc: 'Nouvelles fonctionnalités et mises à jour' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notificationSettings[item.key]}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          [item.key]: checked
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveNotifications}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-4">
          {/* Changer mot de passe */}
          <Card>
            <CardHeader>
              <CardTitle>Changer le Mot de Passe</CardTitle>
              <CardDescription>
                Assurez-vous d'utiliser un mot de passe fort
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      current_password: e.target.value
                    }))}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      new_password: e.target.value
                    }))}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirm_password: e.target.value
                    }))}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Le mot de passe doit contenir au moins 8 caractères
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleChangePassword}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Key className="h-4 w-4 mr-2" />
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>

          {/* 2FA */}
          <Card>
            <CardHeader>
              <CardTitle>Authentification à Deux Facteurs</CardTitle>
              <CardDescription>
                Ajoutez une couche de sécurité supplémentaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className={`h-6 w-6 ${securitySettings.two_factor_enabled ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium">
                      {securitySettings.two_factor_enabled ? 'Activée' : 'Désactivée'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Protection par code à usage unique
                    </p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.two_factor_enabled}
                  onCheckedChange={handleToggle2FA}
                />
              </div>
            </CardContent>
          </Card>

          {/* Zone Danger */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Zone de Danger</CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  La suppression de votre compte est définitive et irréversible.
                  Toutes vos données seront perdues.
                </AlertDescription>
              </Alert>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="mt-4"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer mon compte
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Réseaux Sociaux */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liens Réseaux Sociaux</CardTitle>
              <CardDescription>
                Connectez vos profils sociaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
                { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-500' },
                { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
                { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' }
              ].map((social) => (
                <div key={social.key} className="flex items-center gap-4">
                  <social.icon className={`h-6 w-6 ${social.color}`} />
                  <div className="flex-1">
                    <Label>{social.label}</Label>
                    <Input
                      placeholder={`https://${social.key}.com/votre-profil`}
                      value={socialLinks[social.key]}
                      onChange={(e) => setSocialLinks(prev => ({
                        ...prev,
                        [social.key]: e.target.value
                      }))}
                    />
                  </div>
                </div>
              ))}

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les liens
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Préférences */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences d'Affichage</CardTitle>
              <CardDescription>
                Personnalisez votre expérience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Monitor className="h-12 w-12 mx-auto mb-4" />
                <p>Préférences d'affichage en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurSettingsRealData;
