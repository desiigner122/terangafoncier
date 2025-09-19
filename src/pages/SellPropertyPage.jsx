
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  FilePlus, 
  Landmark, 
  UserCheck, 
  Ban
} from 'lucide-react';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { Can } from '@/components/auth/RoleBasedGuard';

const SellPropertyPage = () => {
    const { user } = useAuth();
    
    const sellerSteps = [
        { icon: UserCheck, title: "Vérification du Vendeur", description: "Assurez-vous que votre profil est complet et vérifié par nos équipes pour gagner la confiance des acheteurs." },
        { icon: FilePlus, title: "Préparation des FileTexts", description: "Rassemblez tous les FileTexts nécessaires : titre foncier, bail, plan cadastral, etc." },
        { icon: CheckCircle, title: "Soumission de la Parcelle", description: "Utilisez notre formulaire guidé pour ajouter votre terrain. Il sera publié après une vérification rapide." },
    ];

    const mairieSteps = [
        { icon: Landmark, title: "Identifier les Terrains", description: "Identifiez les parcelles du patrimoine communal disponibles pour l'attribution." },
        { icon: FilePlus, title: "Définir les Conditions", description: "Précisez les critères d'éligibilité et les FileTexts requis pour les demandeurs." },
        { icon: CheckCircle, title: "Publier l'Offre", description: "Ajoutez le terrain sur la plateforme pour le rendre visible aux citoyens et recevoir les demandes." },
    ];

    const NotAllowedContent = () => (
        <div className="text-center max-w-2xl mx-auto py-16">
            <Ban className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h1 className="text-3xl font-bold text-destructive">Accès non autorisé</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Seuls les vendeurs et les mairies peuvent publier des parcelles. Si vous souhaitez devenir vendeur, veuillez en faire la demande depuis votre profil.
            </p>
            <Button asChild className="mt-6">
                <Link to="/dashboard">Retour au Tableau de Bord</Link>
            </Button>
        </div>
    );

    const SellerContent = ({ steps }) => (
        <>
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-primary">
                    Vendez Votre Terrain en Toute Confiance
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Rejoignez notre réseau de vendeurs certifiés et accédez à des milliers d'acheteurs potentiels, au Sénégal et dans la diaspora.
                </p>
            </div>
            <StepsGrid steps={steps} />
             <div className="text-center mt-12">
                <Button size="lg" asChild className="bg-gradient-to-r from-green-500 to-primary text-white shadow-lg hover:opacity-90">
                    <Link to="/add-parcel">Commencer à Vendre</Link>
                </Button>
            </div>
        </>
    );
    
    const MairieContent = ({ steps }) => (
        <>
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-primary">
                    Gérer le Patrimoine Foncier Communal
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                     Mettez à disposition les terrains de votre commune pour des projets de développement et répondez aux besoins de vos administrés.
                </p>
            </div>
            <StepsGrid steps={steps} />
            <div className="text-center mt-12">
                <Button size="lg" asChild className="bg-gradient-to-r from-green-500 to-primary text-white shadow-lg hover:opacity-90">
                    <Link to="/add-parcel">Ajouter un Terrain Communal</Link>
                </Button>
            </div>
        </>
    );

    const StepsGrid = ({ steps }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {steps.map((step, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card className="h-full text-center">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <step.icon className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{step.description}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-12 px-4"
        >
            <Can allowedRoles={['Mairie']} fallback={null}>
                <MairieContent steps={mairieSteps} />
            </Can>
            <Can allowedRoles={['Vendeur Particulier', 'Vendeur Pro']} fallback={null}>
                <SellerContent steps={sellerSteps} />
            </Can>
             <Can allowedRoles={['Particulier', 'Banque', 'Notaire', 'Agent Foncier', 'Investisseur', 'Promoteur', 'Agriculteur']} fallback={null}>
                <NotAllowedContent />
            </Can>
        </motion.div>
    );
};

export default SellPropertyPage;




