import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import {
  User,
  Bell,
  Shield,
  Eye,
  Lock,
  Globe,
  Moon,
  Sun,
  Save,
  X,
  Check,
  Crown,
  Gem,
  StarIcon,
  CreditCardIcon,
  Loader2,
  Inbox
} from 'lucide-react';

const GeometreSettings = () => {
  const { user, profile } = useAuth();
  const geometreId = user?.id;

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  // Profil réel (table profiles). PAS de champs sans colonne (bio/licence/spécialités
  // n'existent pas dans le schéma → non affichés pour ne pas fabriquer de donnée).
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    region: '',
    avatar_url: ''
  });

  // Préférences locales (aucune table dédiée → non persistées côté serveur, honnête).
  const [notificationSettings, setNotificationSettings] = useState({
    emailMissions: true,
    pushDeadlines: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true
  });

  useEffect(() => {
    if (!geometreId) {
      setLoading(false);
      return;
    }
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name, first_name, last_name, phone, city, region, avatar_url')
          .eq('id', geometreId)
          .maybeSingle();

        if (error) throw error;
        if (!active) return;

        const fullName =
          data?.full_name ||
          [data?.first_name, data?.last_name].filter(Boolean).join(' ') ||
          profile?.full_name ||
          '';

        setProfileData({
          full_name: fullName,
          email: data?.email || user?.email || '',
          phone: data?.phone || '',
          city: data?.city || '',
          region: data?.region || '',
          avatar_url: data?.avatar_url || ''
        });
      } catch (err) {
        console.error('Erreur chargement profil géomètre:', err);
        if (active) {
          toast.error('Impossible de charger votre profil.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [geometreId, user?.email, profile?.full_name]);

  const handleSaveProfile = async () => {
    if (!geometreId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name?.trim() || null,
          phone: profileData.phone?.trim() || null,
          city: profileData.city?.trim() || null,
          region: profileData.region?.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', geometreId);

      if (error) throw error;
      toast.success('Profil mis à jour.');
    } catch (err) {
      console.error('Erreur sauvegarde profil géomètre:', err);
      toast.error('La sauvegarde a échoué.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = profileData.email || user?.email;
    if (!email) {
      toast.error('Aucune adresse email associée au compte.');
      return;
    }
    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      toast.success(`Un email de réinitialisation a été envoyé à ${email}.`);
    } catch (err) {
      console.error('Erreur réinitialisation mot de passe:', err);
      toast.error("Impossible d'envoyer l'email de réinitialisation.");
    } finally {
      setSendingReset(false);
    }
  };

  const initials =
    (profileData.full_name || profileData.email || 'G')
      .split(' ')
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

  // Catalogue statique d'offres (contenu marketing, aucune donnée utilisateur réelle).
  const subscriptionPlans = [
    {
      name: 'Starter',
      subtitle: 'Pour débuter',
      price: '750K XOF',
      icon: Gem,
      iconColor: 'text-green-500',
      highlight: false,
      features: [
        { label: "Jusqu'à 20 missions", included: true },
        { label: 'Outils de base GPS', included: true },
        { label: 'Rapports standards', included: true },
        { label: 'Support email', included: true },
        { label: 'SIG avancé', included: false }
      ]
    },
    {
      name: 'Professional',
      subtitle: 'Le plus populaire',
      price: '1.5M XOF',
      icon: Crown,
      iconColor: 'text-green-500',
      highlight: true,
      features: [
        { label: 'Missions illimitées', included: true },
        { label: 'SIG complet', included: true },
        { label: 'Blockchain intégrée', included: true },
        { label: 'Assistant IA', included: true },
        { label: 'Support prioritaire', included: true }
      ]
    },
    {
      name: 'Enterprise',
      subtitle: 'Pour grandes équipes',
      price: '3M XOF',
      icon: StarIcon,
      iconColor: 'text-purple-500',
      highlight: false,
      features: [
        { label: 'Tout du Professional', included: true },
        { label: 'Multi-utilisateurs (10)', included: true },
        { label: 'API personnalisée', included: true },
        { label: 'Formation équipe', included: true },
        { label: 'Support dédié 24/7', included: true }
      ]
    }
  ];

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
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-gray-500">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Chargement du profil...
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profileData.full_name || '—'}</p>
                        <p className="text-sm text-gray-500">{profileData.email || '—'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="fullName">Nom complet</Label>
                          <Input
                            id="fullName"
                            value={profileData.full_name}
                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Email professionnel</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            disabled
                            title="L'email est géré par votre compte et ne peut pas être modifié ici."
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="city">Ville</Label>
                          <Input
                            id="city"
                            value={profileData.city}
                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="region">Région</Label>
                          <Input
                            id="region"
                            value={profileData.region}
                            onChange={(e) => setProfileData({ ...profileData, region: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Sauvegarder les modifications
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Abonnement */}
          <TabsContent value="abonnement" className="space-y-6">
            {/* Statut d'abonnement actuel — aucune table d'abonnement/facturation dans
                le schéma → état honnête (pas de plan fabriqué). */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Mon abonnement actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Inbox className="h-10 w-10 mb-3 text-gray-300" />
                  <p className="font-medium text-gray-600">Aucun abonnement actif</p>
                  <p className="text-sm mt-1">
                    La gestion des abonnements sera bientôt disponible.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Plans d'abonnement — catalogue d'offres statique (contenu marketing). */}
            <Card>
              <CardHeader>
                <CardTitle>Plans d'abonnement disponibles</CardTitle>
                <CardDescription>
                  Choisissez le plan adapté à votre activité de géomètre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => {
                    const PlanIcon = plan.icon;
                    return (
                      <div
                        key={plan.name}
                        className={`border rounded-lg p-6 relative ${
                          plan.highlight ? 'border-2 border-green-500' : ''
                        }`}
                      >
                        <div className="text-center mb-4">
                          <PlanIcon className={`h-8 w-8 mx-auto mb-2 ${plan.iconColor}`} />
                          <h3 className="text-xl font-semibold">{plan.name}</h3>
                          <p className="text-gray-600">{plan.subtitle}</p>
                        </div>
                        <div className="text-center mb-6">
                          <div className="text-3xl font-bold">{plan.price}</div>
                          <div className="text-gray-500">/mois</div>
                        </div>
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              {feature.included ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span
                                className={`text-sm ${feature.included ? '' : 'text-gray-400'}`}
                              >
                                {feature.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant={plan.highlight ? 'default' : 'outline'}
                          className={`w-full ${
                            plan.highlight ? 'bg-green-500 hover:bg-green-600' : ''
                          }`}
                          disabled
                        >
                          Bientôt disponible
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Historique de facturation — aucune table de facturation → état honnête. */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5" />
                  Historique de facturation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <CreditCardIcon className="h-10 w-10 mb-3 text-gray-300" />
                  <p className="font-medium text-gray-600">Aucune facture disponible</p>
                  <p className="text-sm mt-1">
                    Vos factures apparaîtront ici une fois la facturation activée.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications — préférences locales (aucune table dédiée). */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Préférences locales à cet appareil (non synchronisées pour le moment)
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
                        setNotificationSettings({ ...notificationSettings, emailMissions: checked })
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
                        setNotificationSettings({ ...notificationSettings, pushDeadlines: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Confidentialité — préférence locale. */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de confidentialité</CardTitle>
                <CardDescription>
                  Préférences locales à cet appareil (non synchronisées pour le moment)
                </CardDescription>
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
                      setPrivacySettings({ ...privacySettings, profilePublic: checked })
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
                <CardDescription>
                  Recevez un email pour réinitialiser votre mot de passe en toute sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" onClick={handlePasswordReset} disabled={sendingReset}>
                  {sendingReset ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apparence — préférence UI locale (aucune persistance serveur). */}
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
