
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Palette, Shield, Bot, Mail, Percent, Save } from 'lucide-react';
// useToast import supprimÃ© - utilisation window.safeGlobalToast

const AdminSettingsPage = () => {
    // toast remplacÃ© par window.safeGlobalToast

    const handleSave = (e) => {
        e.preventDefault();
        window.safeGlobalToast({
            title: "Paramètres sauvegardés (Simulation)",
            description: "Vos modifications des paramètres système ont été enregistrées.",
        });
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-12 px-4"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Paramètres Système</h1>
                <p className="text-muted-foreground">Configurez les paramètres globaux de la plateforme Teranga Foncier.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Bell className="mr-2" /> Notifications</CardTitle>
                        <CardDescription>Gérez les notifications automatiques envoyées aux utilisateurs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                                <span>Notifications par email</span>
                                <span className="font-normal leading-snug text-muted-foreground">Activer l'envoi d'emails pour les actions importantes (nouveau message, changement de statut, etc.).</span>
                            </Label>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="admin-email">Email de l'administrateur</Label>
                             <Input type="email" id="admin-email" placeholder="admin@teranga-foncier.sn" defaultValue="notifications@teranga-foncier.sn" />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Percent className="mr-2" /> Frais & Commissions</CardTitle>
                        <CardDescription>Définissez les frais de service et commissions de la plateforme.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="service-fee">Frais de service (pour les acheteurs) en %</Label>
                             <Input type="number" id="service-fee" placeholder="Ex: 2.5" defaultValue="2.5" />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="seller-commission">Commission vendeur (pour les annonces) en %</Label>
                             <Input type="number" id="seller-commission" placeholder="Ex: 5" defaultValue="5" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Bot className="mr-2" /> Intelligence Artificielle</CardTitle>
                        <CardDescription>Paramètres pour l'assistant IA et la vérification de documents.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="ai-review" className="flex flex-col space-y-1">
                                <span>Vérification IA des documents</span>
                                <span className="font-normal leading-snug text-muted-foreground">Activer l'analyse automatique des documents soumis pour détection de fraude.</span>
                            </Label>
                            <Switch id="ai-review" defaultChecked />
                        </div>
                    </CardContent>
                </Card>
                
                <div className="flex justify-end">
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Sauvegarder les modifications
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

export default AdminSettingsPage;

