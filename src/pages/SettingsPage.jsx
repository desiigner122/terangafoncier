
import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Switch } from '@/components/ui/switch';
    import { motion } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast-simple";
    import { Save, Bell, Shield, Palette, Trash2, Globe } from 'lucide-react';
    import { useAuth } from '@/context/SupabaseAuthContext';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
    import { Link } from 'react-router-dom';
    import { Label } from '@/components/ui/label';

    const GeneralSettings = ({ preferences, handlePreferenceChange }) => (
        <Card className="mb-6 shadow-lg hover:shadow-primary/10 transition-shadow">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Palette className="mr-2 h-5 w-5 text-primary"/>Préférences Générales</CardTitle>
                <CardDescription>Personnalisez l'apparence de la plateforme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="theme-select">Thème Visuel</Label>
                    <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                        <SelectTrigger id="theme-select" className="w-full sm:w-[200px]"><SelectValue placeholder="Choisir un thème" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Clair</SelectItem>
                            <SelectItem value="dark">Sombre</SelectItem>
                            <SelectItem value="system">Système</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="language-select">Langue</Label>
                    <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                        <SelectTrigger id="language-select" className="w-full sm:w-[200px]"><SelectValue placeholder="Choisir une langue" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English (Simulation)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="currency-select">Devise par Défaut</Label>
                    <Select value={preferences.defaultCurrency} onValueChange={(value) => handlePreferenceChange('defaultCurrency', value)}>
                        <SelectTrigger id="currency-select" className="w-full sm:w-[200px]"><SelectValue placeholder="Choisir une devise" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="XOF">FCFA (XOF)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR) - Indicatif</SelectItem>
                            <SelectItem value="USD">Dollar US (USD) - Indicatif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );

    const MairieNotificationSettings = ({ settings, handleChange }) => (
        <Card className="mb-6 shadow-lg hover:shadow-primary/10 transition-shadow">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Bell className="mr-2 h-5 w-5 text-primary"/>Notifications Mairie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {Object.entries({
                    emailNewAttributionRequest: "Nouvelle demande d'attribution de parcelle",
                    emailNewPermitRequest: "Nouvelle demande de permis de construire",
                    emailDisputeReported: "Nouveau litige foncier signalé dans la commune",
                }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between space-x-2 border p-3 rounded-md hover:bg-muted/30 transition-colors">
                        <Label htmlFor={key} className="font-medium text-sm">{label}</Label>
                        <Switch id={key} checked={settings[key]} onCheckedChange={() => handleChange(key)} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );


    const UserNotificationSettings = ({ settings, handleChange }) => (
        <Card className="mb-6 shadow-lg hover:shadow-primary/10 transition-shadow">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Bell className="mr-2 h-5 w-5 text-primary"/>Notifications Utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {Object.entries({
                    emailNewParcel: "Nouvelles parcelles correspondant à mes recherches",
                    emailPriceChange: "Changements de prix sur mes parcelles favorites",
                    emailRequestUpdate: "Mises à jour sur mes demandes en cours",
                }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between space-x-2 border p-3 rounded-md hover:bg-muted/30 transition-colors">
                        <Label htmlFor={key} className="font-medium text-sm">{label}</Label>
                        <Switch id={key} checked={settings[key]} onCheckedChange={() => handleChange(key)} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );

    const AdminNotificationSettings = ({ settings, handleChange }) => (
         <Card className="mb-6 shadow-lg hover:shadow-primary/10 transition-shadow">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Bell className="mr-2 h-5 w-5 text-primary"/>Notifications Administrateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {Object.entries({
                    emailNewUser: "Nouveau compte utilisateur créé",
                    emailNewParcelForApproval: "Nouvelle parcelle en attente d'approbation",
                    emailSystemAlerts: "Alertes critiques du système (ex: pannes)",
                }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between space-x-2 border p-3 rounded-md hover:bg-muted/30 transition-colors">
                        <Label htmlFor={key} className="font-medium text-sm">{label}</Label>
                        <Switch id={key} checked={settings[key]} onCheckedChange={() => handleChange(key)} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );


    const UserSecuritySettings = ({ handleAccountDeletionRequest }) => (
        <Card className="mb-6 shadow-lg hover:shadow-primary/10 transition-shadow">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Shield className="mr-2 h-5 w-5 text-primary"/>Sécurité & Confidentialité</CardTitle>
                <CardDescription>Gérez la sécurité de votre compte et vos données.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Pour changer votre mot de passe, veuillez vous rendre sur votre <Link to="/profile" className="text-primary underline hover:text-primary/80">page de profil</Link>.
                </p>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive" className="w-full sm:w-auto">
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer mon Compte
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>Cette action est irréversible et supprimera définitivement votre compte.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={handleAccountDeletionRequest} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Oui, Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );

    const SettingsPage = () => {
        const { toast } = useToast();
        const { user } = useAuth();
        
        const [settings, setSettings] = useState({
            // User settings
            emailNewParcel: true,
            emailPriceChange: false,
            emailRequestUpdate: true,
            // Admin settings
            emailNewUser: true,
            emailNewParcelForApproval: true,
            emailSystemAlerts: true,
            // Mairie settings
            emailNewAttributionRequest: true,
            emailNewPermitRequest: true,
            emailDisputeReported: false,
            // General preferences
            theme: 'system',
            language: 'fr',
            defaultCurrency: 'XOF',
        });
        const [isSaving, setIsSaving] = useState(false);

        useEffect(() => {
            const savedTheme = localStorage.getItem('appTheme') || 'system';
            const savedLang = localStorage.getItem('appLang') || 'fr';
            setSettings(prev => ({ ...prev, theme: savedTheme, language: savedLang }));
        }, []);

        const handleSettingChange = (key, value) => {
            setSettings(prev => ({ ...prev, [key]: value !== undefined ? value : !prev[key] }));

            if (key === 'theme') {
                localStorage.setItem('appTheme', value);
                document.documentElement.classList.remove('light', 'dark');
                if (value === 'light') document.documentElement.classList.add('light');
                else if (value === 'dark') document.documentElement.classList.add('dark');
            }
            if (key === 'language') {
                localStorage.setItem('appLang', value);
                toast({ title: "Langue (Simulation)", description: `La langue est passée à : ${value.toUpperCase()}.` });
            }
        };
        
        const handleSaveChanges = async (e) => {
            e.preventDefault();
            setIsSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Paramètres sauvegardés:", settings);
            toast({ title: "Paramètres Sauvegardés", description: "Vos préférences ont été mises à jour.", className: "bg-green-500 text-white" });
            setIsSaving(false);
        };
        
        const handleAccountDeletionRequest = () => toast({ title: "Demande de Suppression de Compte", description: "Contactez le support pour supprimer votre compte.", variant: "default" });

        const renderNotificationSettings = () => {
            switch (user?.role) {
                case 'Admin':
                    return <AdminNotificationSettings settings={settings} handleChange={(key) => handleSettingChange(key)} />;
                case 'Mairie':
                    return <MairieNotificationSettings settings={settings} handleChange={(key) => handleSettingChange(key)} />;
                default:
                    return <UserNotificationSettings settings={settings} handleChange={(key) => handleSettingChange(key)} />;
            }
        }

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, staggerChildren: 0.1 }} className="space-y-8 max-w-3xl mx-auto py-8 px-4">
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-primary text-center">Paramètres</motion.h1>

                <form onSubmit={handleSaveChanges}>
                    <GeneralSettings preferences={settings} handlePreferenceChange={(key, value) => handleSettingChange(key, value)} />

                    {renderNotificationSettings()}
                    
                    {user?.role !== 'Admin' && (
                        <UserSecuritySettings handleAccountDeletionRequest={handleAccountDeletionRequest} />
                    )}

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-end pt-6 border-t">
                        <Button type="submit" size="lg" disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" /> {isSaving ? "Sauvegarde..." : "Sauvegarder les Paramètres"}
                        </Button>
                    </motion.div>
                </form>
            </motion.div>
        );
    };

    export default SettingsPage;
