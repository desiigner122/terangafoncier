import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit,
  Save,
  X,
  Shield,
  Eye,
  EyeOff,
  Key,
  Bell,
  Globe,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Settings,
  Trash2,
  Upload,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierProfil = () => {
  const { user, profile, refreshProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState({});
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    bio: '',
    avatar_url: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: true,
    language: 'fr',
    timezone: 'Africa/Dakar',
    currency: 'XOF'
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        date_of_birth: profile.date_of_birth || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile, user]);

  const toggleEditMode = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfileUpdate = async (field, value) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      if (error) throw error;

      setProfileData(prev => ({ ...prev, [field]: value }));
      setEditMode(prev => ({ ...prev, [field]: false }));
      
      await refreshProfile();
      toast.success('Profil mis à jour');

    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('Mot de passe mis à jour');

    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceUpdate = async (key, value) => {
    try {
      setPreferences(prev => ({ ...prev, [key]: value }));
      
      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: { ...preferences, [key]: value }
        });

      if (error) throw error;

      toast.success('Préférences mises à jour');

    } catch (error) {
      console.error('Erreur mise à jour préférences:', error);
      toast.error('Erreur lors de la mise à jour des préférences');
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Le fichier ne doit pas dépasser 2MB');
      return;
    }

    try {
      setLoading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await handleProfileUpdate('avatar_url', data.publicUrl);

    } catch (error) {
      console.error('Erreur upload avatar:', error);
      toast.error('Erreur lors du téléchargement de l\'avatar');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    try {
      setLoading(true);

      // Marquer le compte comme supprimé
      const { error } = await supabase
        .from('profiles')
        .update({ 
          deleted_at: new Date().toISOString(),
          status: 'deleted'
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Compte supprimé');
      
      // Déconnexion
      await supabase.auth.signOut();

    } catch (error) {
      console.error('Erreur suppression compte:', error);
      toast.error('Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
    }
  };

  const ProfileField = ({ label, field, value, type = 'text', multiline = false }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {editMode[field] ? (
        <div className="flex gap-2">
          {multiline ? (
            <Textarea
              value={value}
              onChange={(e) => setProfileData(prev => ({ ...prev, [field]: e.target.value }))}
              className="flex-1"
            />
          ) : (
            <Input
              type={type}
              value={value}
              onChange={(e) => setProfileData(prev => ({ ...prev, [field]: e.target.value }))}
              className="flex-1"
            />
          )}
          <Button
            size="sm"
            onClick={() => handleProfileUpdate(field, value)}
            disabled={loading}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleEditMode(field)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className={value ? 'text-slate-900' : 'text-slate-400'}>
            {value || `Ajouter ${label.toLowerCase()}`}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleEditMode(field)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  const PasswordField = ({ label, field, value, placeholder }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <Input
          type={showPasswords[field] ? 'text' : 'password'}
          value={value}
          onChange={(e) => setPasswordData(prev => ({ ...prev, [field]: e.target.value }))}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))}
        >
          {showPasswords[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mon Profil</h1>
          <p className="text-slate-600 mt-1">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
            Compte vérifié
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full lg:w-auto">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Photo de profil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Photo de profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {profileData.avatar_url ? (
                      <img 
                        src={profileData.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {profileData.full_name || 'Nom non défini'}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Cliquez sur l'image pour changer votre photo
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    JPG, PNG ou GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileField
                label="Nom complet"
                field="full_name"
                value={profileData.full_name}
              />
              
              <ProfileField
                label="Email"
                field="email"
                value={profileData.email}
                type="email"
              />
              
              <ProfileField
                label="Téléphone"
                field="phone"
                value={profileData.phone}
                type="tel"
              />
              
              <ProfileField
                label="Adresse"
                field="address"
                value={profileData.address}
              />
              
              <ProfileField
                label="Date de naissance"
                field="date_of_birth"
                value={profileData.date_of_birth}
                type="date"
              />
              
              <ProfileField
                label="Biographie"
                field="bio"
                value={profileData.bio}
                multiline
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Changement de mot de passe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Changer le mot de passe
              </CardTitle>
              <CardDescription>
                Utilisez un mot de passe fort avec au moins 6 caractères
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <PasswordField
                  label="Mot de passe actuel"
                  field="current"
                  value={passwordData.currentPassword}
                  placeholder="Entrez votre mot de passe actuel"
                />
                
                <PasswordField
                  label="Nouveau mot de passe"
                  field="new"
                  value={passwordData.newPassword}
                  placeholder="Entrez votre nouveau mot de passe"
                />
                
                <PasswordField
                  label="Confirmer le nouveau mot de passe"
                  field="confirm"
                  value={passwordData.confirmPassword}
                  placeholder="Confirmez votre nouveau mot de passe"
                />

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    'Changer le mot de passe'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Authentification à deux facteurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Authentification à deux facteurs
              </CardTitle>
              <CardDescription>
                Renforcez la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">2FA par SMS</h4>
                  <p className="text-sm text-slate-600">
                    Recevez un code par SMS lors de la connexion
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Notifications par email</h4>
                  <p className="text-sm text-slate-600">
                    Recevez des notifications par email
                  </p>
                </div>
                <Switch
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => handlePreferenceUpdate('email_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Notifications SMS</h4>
                  <p className="text-sm text-slate-600">
                    Recevez des notifications par SMS
                  </p>
                </div>
                <Switch
                  checked={preferences.sms_notifications}
                  onCheckedChange={(checked) => handlePreferenceUpdate('sms_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Emails marketing</h4>
                  <p className="text-sm text-slate-600">
                    Recevez nos offres et nouveautés
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing_emails}
                  onCheckedChange={(checked) => handlePreferenceUpdate('marketing_emails', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Paramètres régionaux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Paramètres régionaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Langue
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceUpdate('language', e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="wo">Wolof</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fuseau horaire
                </label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceUpdate('timezone', e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="Africa/Dakar">Dakar (GMT+0)</option>
                  <option value="Africa/Abidjan">Abidjan (GMT+0)</option>
                  <option value="Africa/Lagos">Lagos (GMT+1)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Devise
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) => handlePreferenceUpdate('currency', e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="XOF">Franc CFA (XOF)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar US (USD)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          {/* Statistiques du compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Statistiques du compte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-slate-600">Demandes soumises</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-slate-600">Demandes approuvées</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">28</div>
                  <div className="text-sm text-slate-600">Jours d'activité</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations du compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">ID utilisateur</span>
                <span className="text-sm text-slate-900 font-mono">{user?.id?.slice(0, 8)}...</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Date de création</span>
                <span className="text-sm text-slate-900">
                  {new Date(user?.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Dernière connexion</span>
                <span className="text-sm text-slate-900">
                  {new Date().toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Type de compte</span>
                <Badge>Particulier</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Zone de danger */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                Zone de danger
              </CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">
                    Supprimer mon compte
                  </h4>
                  <p className="text-sm text-red-700 mb-4">
                    Cette action supprimera définitivement votre compte et toutes vos données. 
                    Cette action ne peut pas être annulée.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={deleteAccount}
                    disabled={loading}
                  >
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

export default ParticulierProfil;