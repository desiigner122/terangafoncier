
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useToast } from "@/components/ui/use-toast-simple";
import { motion } from 'framer-motion';
import { User, Mail, Phone, KeyRound, Save, LogOut, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/customSupabaseClient';

const ProfilePage = () => {
  const { user, profile, signOut, revalidate } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setProfileImage(profile.avatar_url || null);
    }
    if (user) {
      setEmail(user.email || '');
    }
  }, [user, profile]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast({ variant: "destructive", title: "Erreur", description: "Le nom ne peut pas être vide." });
      return;
    }
    setIsUpdatingProfile(true);
    try {
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, {
            upsert: true,
        });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = publicUrl;
      }

        const { error } = await supabase
          .from('users')
        .update({ full_name: fullName, phone: phone, avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;
      
      await revalidate();
      toast({ title: "Profil mis à jour", description: "Vos informations ont été sauvegardées." });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({ variant: "destructive", title: "Erreur", description: "Les nouveaux mots de passe ne correspondent pas." });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
       toast({ variant: "destructive", title: "Erreur", description: "Le mot de passe doit contenir au moins 6 caractères." });
       return;
    }
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Mot de passe mis à jour", description: "Votre mot de passe a été changé." });
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error("Error updating password:", error);
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    toast({ title: "Déconnexion réussie" });
    navigate('/');
  };
  
  const handleDeleteAccount = () => {
     toast({
        title: "Suppression de Compte (Simulation)",
        description: "Cette action sera bientôt disponible.",
        variant: "default",
        duration: 5000,
     });
  }

  if (!user || !profile) {
    return <div className="container mx-auto py-12 flex justify-center items-center"><LoadingSpinner /></div>;
  }
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const getAvatarFallback = () => {
    const name = fullName || 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
      className="space-y-8 max-w-4xl mx-auto py-8 px-4"
    >
      <motion.h1 variants={cardVariants} className="text-3xl md:text-4xl font-bold text-primary text-center">Mon Espace Personnel</motion.h1>

      <motion.div variants={cardVariants}>
        <Card className="shadow-lg hover:shadow-primary/10 transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><User className="mr-2 h-5 w-5 text-primary"/>Informations du Profil</CardTitle>
            <CardDescription>Mettez à jour vos informations et votre image de profil.</CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileUpdate}>
            <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center justify-center space-y-4 pt-4">
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarImage src={profileImage} alt="Photo de profil" />
                      <AvatarFallback className="text-4xl">{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                  <Input type="file" ref={fileInputRef} onChange={handleProfileImageChange} accept="image/*" className="hidden"/>
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()}><Upload className="mr-2 h-4 w-4" /> Changer</Button>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="profile-name">Nom Complet / Raison Sociale</Label>
                    <Input id="profile-name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isUpdatingProfile} placeholder="Votre nom complet" className="h-10"/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-email">Adresse Email</Label>
                    <Input id="profile-email" type="email" value={email} disabled placeholder="Votre adresse email"/>
                    <p className="text-xs text-muted-foreground">Pour changer d'email, veuillez contacter le support.</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-phone">Numéro de Téléphone</Label>
                    <Input id="profile-phone" type="tel" value={phone || ''} onChange={(e) => setPhone(e.target.value)} disabled={isUpdatingProfile} placeholder="+221 XX XXX XX XX" className="h-10"/>
                  </div>
              </div>
            </CardContent>
            <CardFooter>
               <Button type="submit" disabled={isUpdatingProfile} className="w-full sm:w-auto ml-auto">
                  <Save className="mr-2 h-4 w-4" /> {isUpdatingProfile ? 'Mise à jour...' : 'Sauvegarder le Profil'}
                </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="shadow-lg hover:shadow-primary/10 transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary"/>Changer le Mot de Passe</CardTitle>
            <CardDescription>Pour votre sécurité, choisissez un mot de passe fort.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">Nouveau Mot de Passe</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isUpdatingPassword} required className="h-10" placeholder="Minimum 6 caractères"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-new-password">Confirmer le Nouveau Mot de Passe</Label>
                <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={isUpdatingPassword} required className="h-10" placeholder="Retapez votre nouveau mot de passe"/>
              </div>
              <Button type="submit" disabled={isUpdatingPassword} className="w-full sm:w-auto">
                <ShieldCheck className="mr-2 h-4 w-4" /> {isUpdatingPassword ? 'Mise à jour...' : 'Changer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

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

export default ProfilePage;