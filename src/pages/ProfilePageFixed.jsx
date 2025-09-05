import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Trash2, 
  Upload, 
  Edit, 
  ShieldCheck, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { avatarManager } from '@/lib/avatarManager';
import { LoadingSpinner } from '@/components/ui/spinner';

const ProfilePageFixed = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatarPreview(user.avatar_url);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        window.safeGlobalToast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 5MB."
        });
        return;
      }

      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        window.safeGlobalToast({
          variant: "destructive",
          title: "Format non supporté",
          description: "Veuillez sélectionner une image."
        });
        return;
      }

      setAvatarFile(file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      window.safeGlobalToast({ 
        variant: "destructive", 
        title: "Erreur", 
        description: "Le nom ne peut pas être vide." 
      });
      return;
    }

    setIsUpdatingProfile(true);
    try {
      let updateData = {
        full_name: fullName,
        phone: phone
      };

      // Upload avatar si un fichier a été sélectionné
      if (avatarFile) {
        console.log('🔄 Upload avatar en cours...');
        const uploadResult = await avatarManager.uploadAvatar(avatarFile, user.id);
        
        if (uploadResult.success) {
          updateData.avatar_url = uploadResult.avatarUrl;
          console.log('✅ Avatar uploadé avec succès');
          window.safeGlobalToast({ 
            title: "Avatar mis à jour", 
            description: "Votre photo de profil a été mise à jour.",
            className: "bg-green-500 text-white"
          });
        } else {
          console.error('❌ Erreur upload avatar:', uploadResult.error);
          window.safeGlobalToast({
            variant: "destructive",
            title: "Erreur upload avatar",
            description: uploadResult.error
          });
          // Continuer sans avatar si l'upload échoue
        }
      }

      // Mettre à jour le profil
      const updatedUser = await updateUserProfile(updateData);
      
      window.safeGlobalToast({ 
        title: "Profil mis à jour", 
        description: "Vos informations ont été sauvegardées.",
        className: "bg-green-500 text-white"
      });
      
      setAvatarFile(null);
      
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      window.safeGlobalToast({ 
        variant: "destructive", 
        title: "Erreur de mise à jour", 
        description: error.message || "Impossible de mettre à jour votre profil."
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      window.safeGlobalToast({ 
        variant: "destructive", 
        title: "Erreur", 
        description: "Les nouveaux mots de passe ne correspondent pas." 
      });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
       window.safeGlobalToast({ 
         variant: "destructive", 
         title: "Erreur", 
         description: "Le mot de passe doit contenir au moins 6 caractères." 
       });
       return;
    }
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      window.safeGlobalToast({ 
        title: "Mot de passe mis à jour", 
        description: "Votre mot de passe a été changé." 
      });
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error("Error updating password:", error);
      window.safeGlobalToast({ 
        variant: "destructive", 
        title: "Erreur de mise à jour", 
        description: error.message 
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    window.safeGlobalToast({ title: "Déconnexion réussie" });
    navigate('/');
  };
  
  const handleDeleteAccount = () => {
     window.safeGlobalToast({
        title: "Suppression de Compte (Simulation)",
        description: "Cette action sera bientôt disponible.",
        variant: "default",
        duration: 5000,
     });
  };

  if (!user) {
    return <div className="container mx-auto py-12 flex justify-center items-center"><LoadingSpinner /></div>;
  }
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const getAvatarFallback = () => {
    const name = fullName || user.email || 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const displayAvatar = avatarPreview || avatarManager.getDefaultAvatar(user.email, fullName);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="container mx-auto p-4 lg:p-8 max-w-4xl space-y-6"
    >
      {/* En-tête du profil */}
      <motion.div variants={cardVariants} className="text-center space-y-4">
        <div className="relative inline-block">
          <Avatar className="w-32 h-32 mx-auto border-4 border-primary/20">
            <AvatarImage src={displayAvatar} alt={fullName} />
            <AvatarFallback className="text-2xl">{getAvatarFallback()}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-background"
            onClick={() => fileInputRef.current?.click()}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{fullName || 'Profil Utilisateur'}</h1>
          <p className="text-muted-foreground">{user.role || user.user_type || 'Utilisateur'}</p>
        </div>
      </motion.div>

      {/* Informations du profil */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Informations du Profil
            </CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et préférences de compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Nom complet</Label>
                  <Input 
                    id="full-name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    disabled={isUpdatingProfile}
                    required 
                    className="h-10"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    disabled 
                    className="h-10 bg-muted"
                    placeholder="Votre adresse email"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    disabled={isUpdatingProfile}
                    className="h-10"
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isUpdatingProfile} className="w-full sm:w-auto">
                <ShieldCheck className="mr-2 h-4 w-4" /> 
                {isUpdatingProfile ? 'Mise à jour...' : 'Sauvegarder'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Changement de mot de passe */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Changer le Mot de Passe
            </CardTitle>
            <CardDescription>
              Assurez-vous que votre compte reste sécurisé avec un mot de passe fort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    disabled={isUpdatingPassword} 
                    className="h-10" 
                    placeholder="Nouveau mot de passe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirmer le mot de passe</Label>
                  <Input 
                    id="confirm-new-password" 
                    type="password" 
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)} 
                    disabled={isUpdatingPassword} 
                    className="h-10" 
                    placeholder="Retapez votre nouveau mot de passe"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isUpdatingPassword} className="w-full sm:w-auto">
                <ShieldCheck className="mr-2 h-4 w-4" /> 
                {isUpdatingPassword ? 'Mise à jour...' : 'Changer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions du compte */}
      <motion.div variants={cardVariants} className="space-y-4 pt-6 border-t flex flex-wrap gap-2">
         <Button onClick={handleLogout} variant="outline" className="w-full sm:w-auto">
           <LogOut className="mr-2 h-4 w-4" /> Se Déconnecter
         </Button>
         
         <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer mon Compte
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible et supprimera définitivement votre compte et toutes vos données associées de Teranga Foncier.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Oui, Supprimer mon Compte
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePageFixed;
