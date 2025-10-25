import React, { useState, useEffect, useCallback } from 'react';
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
  Save,
  X,
  Check,
  AlertTriangle,
  Key,
  Trash2,
  Crown,
  CreditCardIcon,
  CalendarIcon
} from 'lucide-react';
import { useUser } from '@/hooks/useUserFixed';
import { supabase } from '@/lib/supabaseClient';
import SubscriptionService from '@/services/SubscriptionService';

const SettingsPageNew = () => {
  const { user, profile, updateProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);

  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);

  const [billingHistory, setBillingHistory] = useState([]);
  const [billingError, setBillingError] = useState(null);
  const [isBillingLoading, setIsBillingLoading] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentError, setPaymentError] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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

  const formatCurrency = useCallback((value, currency = 'XOF') => {
    try {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency
      }).format(Number(value || 0));
    } catch (error) {
      return `${Number(value || 0).toLocaleString('fr-FR')} ${currency}`;
    }
  }, []);

  const formatDate = useCallback((value) => {
    if (!value) return 'Non défini';
    try {
      return new Date(value).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return value;
    }
  }, []);

  const parseFeatures = useCallback((features) => {
    if (!features) {
      return [];
    }

    if (Array.isArray(features)) {
      return features;
    }

    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed) ? parsed : [features];
      } catch (error) {
        return [features];
      }
    }

    return [];
  }, []);

  useEffect(() => {
    if (profile) {
      const metadataFromProfile = profile || {};
      const notificationPrefs = metadataFromProfile.notification_preferences || metadataFromProfile.notificationSettings;
      const privacyPrefs = metadataFromProfile.privacy_settings || metadataFromProfile.privacySettings;
      const securityPrefs = metadataFromProfile.security_settings || metadataFromProfile.securitySettings;
      const appearancePrefs = metadataFromProfile.appearance_settings || metadataFromProfile.appearanceSettings;

      setProfileData({
        fullName: metadataFromProfile.full_name || metadataFromProfile.name || '',
        email: user?.email || '',
        phone: metadataFromProfile.phone || metadataFromProfile.tel || '',
        address: metadataFromProfile.address || '',
        bio: metadataFromProfile.bio || metadataFromProfile.description || '',
        avatar: metadataFromProfile.avatar_url || metadataFromProfile.avatar || null
      });

      if (notificationPrefs && typeof notificationPrefs === 'object') {
        setNotificationSettings(prev => ({
          ...prev,
          ...notificationPrefs
        }));
      }

      if (privacyPrefs && typeof privacyPrefs === 'object') {
        setPrivacySettings(prev => ({
          ...prev,
          ...privacyPrefs
        }));
      }

      if (securityPrefs && typeof securityPrefs === 'object') {
        setSecuritySettings(prev => ({
          ...prev,
          ...securityPrefs
        }));
      }

      if (appearancePrefs && typeof appearancePrefs === 'object') {
        setAppearanceSettings(prev => ({
          ...prev,
          ...appearancePrefs
        }));
      }

      setHasChanges(false);
    }
  }, [user, profile]);

  const loadSubscriptionData = useCallback(async () => {
    if (!user) return;
    setIsSubscriptionLoading(true);
    setSubscriptionError(null);

    try {
      const [subscriptionResult, plansResult] = await Promise.all([
        SubscriptionService.getUserSubscription(user.id),
        SubscriptionService.getSubscriptionPlans(profile?.role)
      ]);

      if (subscriptionResult.success) {
        setSubscriptionInfo(subscriptionResult.data || null);
      } else {
        setSubscriptionInfo(null);
        setSubscriptionError(subscriptionResult.error || "Impossible de charger l'abonnement");
      }

      if (plansResult.success) {
        setAvailablePlans(plansResult.data || []);
      } else {
        setAvailablePlans([]);
        setSubscriptionError(prev => prev || plansResult.error || 'Plans indisponibles.');
      }
    } catch (error) {
      console.error('Erreur chargement abonnement:', error);
      setSubscriptionInfo(null);
      setAvailablePlans([]);
      setSubscriptionError(error.message || "Erreur lors du chargement de l'abonnement");
    } finally {
      setIsSubscriptionLoading(false);
    }
  }, [user, profile?.role]);

  const loadBillingHistory = useCallback(async () => {
    if (!user) return;
    setIsBillingLoading(true);
    setBillingError(null);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, amount, status, type, description, created_at, payment_method, currency')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        throw error;
      }

      setBillingHistory(data || []);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      setBillingHistory([]);
      setBillingError(error.message || 'Transactions indisponibles');
    } finally {
      setIsBillingLoading(false);
    }
  }, [user]);

  const loadPaymentMethods = useCallback(async () => {
    if (!user) return;
    setIsPaymentLoading(true);
    setPaymentError(null);

    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Gestion des tables manquantes côté Supabase
        const missingRelation = error.message && error.message.toLowerCase().includes('does not exist');
        if (missingRelation) {
          setPaymentMethods([]);
          setPaymentError("Aucune méthode de paiement enregistrée");
          return;
        }
        throw error;
      }

      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Erreur chargement moyens paiement:', error);
      setPaymentMethods([]);
      setPaymentError(error.message || 'Méthodes de paiement indisponibles');
    } finally {
      setIsPaymentLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadSubscriptionData();
    loadBillingHistory();
    loadPaymentMethods();
  }, [user, loadSubscriptionData, loadBillingHistory, loadPaymentMethods]);

  // Sauvegarder les modifications du profil
  const saveProfileChanges = async () => {
    setIsLoading(true);
    try {
      const payload = {
        full_name: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio,
        avatar_url: profileData.avatar || null,
        notification_preferences: notificationSettings,
        privacy_settings: privacySettings,
        security_settings: securitySettings,
        appearance_settings: appearanceSettings
      };
      await updateProfile(payload);
      setHasChanges(false);
      // Toast de succès
      window.safeGlobalToast?.({ title: 'Profil mis à jour' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Toast d'erreur
      window.safeGlobalToast?.({ variant: 'destructive', title: 'Échec mise à jour', description: error.message });
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
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new
      });

      if (error) {
        throw error;
      }

      setPasswordData({ current: '', new: '', confirm: '' });
      window.safeGlobalToast?.({
        title: 'Mot de passe mis à jour',
        description: 'Votre mot de passe a été modifié avec succès.'
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      window.safeGlobalToast?.({
        variant: 'destructive',
        title: 'Échec changement mot de passe',
        description: error.message
      });
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

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil et vos coordonnées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-lg">
                      {(profileData.fullName && profileData.fullName.split(' ').map(n => n[0]).join('')) || profileData.email?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 cursor-pointer flex items-center justify-center bg-primary text-white">
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !user) return;
                      setIsLoading(true);
                      try {
                        const ext = file.name.split('.').pop();
                        const path = `${user.id}/${Date.now()}.${ext}`;
                        const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
                        if (upErr) throw upErr;
                        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
                        setProfileData(prev => ({ ...prev, avatar: publicUrl }));
                        setHasChanges(true);
                        window.safeGlobalToast?.({ title: 'Photo téléchargée' });
                      } catch (err) {
                        console.error('Upload avatar error', err);
                        window.safeGlobalToast?.({ variant: 'destructive', title: 'Échec upload avatar', description: err.message });
                      } finally {
                        setIsLoading(false);
                      }
                    }} />
                    <Camera className="w-4 h-4" />
                  </label>
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

        {/* Onglet Abonnement */}
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
              {isSubscriptionLoading ? (
                <p className="text-sm text-gray-500">Chargement des informations d'abonnement...</p>
              ) : (
                <>
                  {subscriptionError && (
                    <p className="text-sm text-red-600 mb-3">{subscriptionError}</p>
                  )}

                  {subscriptionInfo ? (
                    (() => {
                      const linkedPlan = subscriptionInfo.subscription_plans || availablePlans.find(plan => plan.id === subscriptionInfo.plan_id);
                      const planName = linkedPlan?.name || 'Plan personnalisé';
                      const planDescription = linkedPlan?.description || 'Abonnement actif Teranga Foncier';
                      const planPrice = linkedPlan?.price;
                      const planCurrency = linkedPlan?.currency || 'XOF';
                      const durationLabel = linkedPlan?.duration_days ? `${linkedPlan.duration_days} jours` : 'Durée flexible';

                      return (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg text-gray-900">{planName}</h3>
                                <Badge variant="secondary" className="uppercase tracking-wide">
                                  {subscriptionInfo.status || 'actif'}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm max-w-xl">{planDescription}</p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span>Durée&nbsp;: <strong className="text-gray-900">{durationLabel}</strong></span>
                                <span>Renouvellement&nbsp;: <strong className="text-gray-900">{subscriptionInfo.end_date ? formatDate(subscriptionInfo.end_date) : 'Non défini'}</strong></span>
                                <span>Renouvellement auto&nbsp;: <strong className="text-gray-900">{subscriptionInfo.auto_renew ? 'Activé' : 'Désactivé'}</strong></span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                {planPrice !== undefined ? formatCurrency(planPrice, planCurrency) : '—'}
                              </p>
                              <p className="text-sm text-gray-500">{linkedPlan?.duration_days ? `par ${linkedPlan.duration_days} jours` : 'Facturation en fonction de votre contrat'}</p>
                              {subscriptionInfo.updated_at && (
                                <p className="text-xs text-gray-500 mt-2">Mis à jour le {formatDate(subscriptionInfo.updated_at)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="p-4 border rounded-lg bg-gray-50 text-sm text-gray-600">
                      Aucun abonnement actif détecté. Consultez les plans disponibles ci-dessous pour activer votre abonnement.
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Plans d'abonnement */}
          <Card>
            <CardHeader>
              <CardTitle>Plans d'abonnement disponibles</CardTitle>
              <CardDescription>
                Choisissez le plan qui correspond à vos besoins
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubscriptionLoading ? (
                <p className="text-sm text-gray-500">Chargement des plans...</p>
              ) : availablePlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {availablePlans.map(plan => {
                    const isCurrent = subscriptionInfo?.plan_id === plan.id || subscriptionInfo?.subscription_plans?.id === plan.id;
                    const features = parseFeatures(plan.features);

                    return (
                      <div
                        key={plan.id}
                        className={`border rounded-lg p-6 flex flex-col justify-between gap-4 ${isCurrent ? 'border-blue-500 shadow-sm' : 'border-gray-200'} bg-white`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{plan.description || 'Plan personnalisé pour votre profil Teranga Foncier'}</p>
                            </div>
                            {isCurrent && <Badge variant="secondary">Plan actuel</Badge>}
                          </div>

                          <div>
                            <div className="text-3xl font-bold text-gray-900">{formatCurrency(plan.price, plan.currency || 'XOF')}</div>
                            <p className="text-sm text-gray-500">{plan.duration_days ? `Pour ${plan.duration_days} jours` : 'Durée personnalisée'}</p>
                          </div>

                          {features.length > 0 && (
                            <ul className="space-y-2 text-sm text-gray-700">
                              {features.map((feature, index) => (
                                <li key={`${plan.id}-feature-${index}`} className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <Button
                          className="w-full"
                          variant={isCurrent ? 'default' : 'outline'}
                          disabled
                          title="La modification de plan sera bientôt disponible"
                        >
                          {isCurrent ? 'Plan actuel' : 'Disponible prochainement'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun plan disponible pour votre profil utilisateur. Contactez le support pour activer un abonnement.</p>
              )}
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
              {isBillingLoading ? (
                <p className="text-sm text-gray-500">Chargement de l'historique...</p>
              ) : (
                <>
                  {billingError && (
                    <p className="text-sm text-red-600 mb-3">{billingError}</p>
                  )}

                  {billingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {billingHistory.map((transaction) => {
                        const status = (transaction.status || '').toLowerCase();
                        const statusStyles = (() => {
                          switch (status) {
                            case 'completed':
                            case 'paid':
                              return 'bg-green-100 text-green-700';
                            case 'failed':
                            case 'cancelled':
                              return 'bg-red-100 text-red-700';
                            case 'pending':
                              return 'bg-amber-100 text-amber-700';
                            default:
                              return 'bg-gray-100 text-gray-700';
                          }
                        })();

                        return (
                          <div key={transaction.id} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <CalendarIcon className="h-4 w-4 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {transaction.description || `Transaction ${transaction.type || ''}`.trim() || 'Paiement Teranga Foncier'}
                                </p>
                                <p className="text-sm text-gray-500">{formatDate(transaction.created_at)}</p>
                                {transaction.payment_method && (
                                  <p className="text-xs text-gray-500 mt-1">Méthode&nbsp;: {transaction.payment_method}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount, transaction.currency || 'XOF')}</p>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded ${statusStyles}`}>
                                {status === 'completed' || status === 'paid' ? 'Payé' : status === 'pending' ? 'En attente' : status === 'failed' ? 'Échec' : status || 'Inconnu'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Aucune transaction trouvée pour le moment.</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Méthodes de paiement */}
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              {isPaymentLoading ? (
                <p className="text-sm text-gray-500">Chargement des méthodes de paiement...</p>
              ) : (
                <>
                  {paymentError && (
                    <p className="text-sm text-amber-600 mb-3">{paymentError}</p>
                  )}

                  {paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => {
                        const label = method.card_last4
                          ? `${method.card_brand || 'Carte'} •••• ${method.card_last4}`
                          : method.label || method.type || 'Méthode de paiement';
                        const expiry = method.expiry_month && method.expiry_year
                          ? `${String(method.expiry_month).padStart(2, '0')}/${method.expiry_year}`
                          : null;

                        return (
                          <div key={method.id || `${label}-${expiry}`} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <CreditCardIcon className="h-8 w-8 text-blue-500" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {label}
                                  {method.is_default && (
                                    <Badge variant="outline" className="ml-2 text-xs">Par défaut</Badge>
                                  )}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {(method.provider && `${method.provider} • `) || ''}
                                  {expiry ? `Expire ${expiry}` : "Aucune date d'expiration disponible"}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" disabled>Modifier</Button>
                              <Button variant="outline" size="sm" disabled>Supprimer</Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Vous n'avez pas encore enregistré de méthode de paiement.</p>
                  )}

                  <Button variant="outline" className="w-full mt-4" disabled>
                    Ajouter une méthode de paiement (bientôt disponible)
                  </Button>
                </>
              )}
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
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, [key]: checked }));
                      setHasChanges(true);
                    }}
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
                    onCheckedChange={(checked) => {
                      setPrivacySettings(prev => ({ ...prev, [key]: checked }));
                      setHasChanges(true);
                    }}
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
                twoFactorEnabled: { label: 'Authentification à deux facteurs', desc: 'Ajouter une couche de sécurité supplémentaire' },
                loginAlerts: { label: 'Alertes de connexion', desc: 'Être notifié des nouvelles connexions à votre compte' }
              }).map(([key, config]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{config.label}</h4>
                    <p className="text-sm text-gray-600">{config.desc}</p>
                  </div>
                  <Switch
                    checked={securitySettings[key]}
                    onCheckedChange={(checked) => {
                      setSecuritySettings(prev => ({ ...prev, [key]: checked }));
                      setHasChanges(true);
                    }}
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
                      onClick={() => {
                        setAppearanceSettings(prev => ({ ...prev, theme: 'light' }));
                        setHasChanges(true);
                      }}
                      className="justify-start"
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Clair
                    </Button>
                    <Button
                      variant={appearanceSettings.theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => {
                        setAppearanceSettings(prev => ({ ...prev, theme: 'dark' }));
                        setHasChanges(true);
                      }}
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
                    onChange={(e) => {
                      setAppearanceSettings(prev => ({ ...prev, language: e.target.value }));
                      setHasChanges(true);
                    }}
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
                    onChange={(e) => {
                      setAppearanceSettings(prev => ({ ...prev, timezone: e.target.value }));
                      setHasChanges(true);
                    }}
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

