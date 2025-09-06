import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  MapPin, 
  Tractor, 
  Sun, 
  Droplets, 
  BarChart3, 
  ShieldCheck,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CallToActionSection from '@/components/home/sections/CallToActionSection';
import { useUser } from '@/hooks/useUser';
import { ROLES_CONFIG } from '@/lib/enhancedRbacConfig';

const featureList = [
    { icon: MapPin, title: "Gestion de Parcelles", description: "Visualisez et gérez toutes vos terres agricoles sur une carte interactive. Suivez les cultures, les rendements et l'historique de chaque parcelle." },
    { icon: Sun, title: "Météo Agricole", description: "Recevez des prévisions météorologiques précises et des alertes pour planifier vos activités agricoles et protéger vos cultures." },
    { icon: Droplets, title: "Analyse des Sols", description: "Demandez des analyses de sol, recevez des recommandations de fertilisation et optimisez la santé de vos terres pour de meilleurs rendements." },
    { icon: Tractor, title: "Carnet de Bord Numérique", description: "Enregistrez toutes vos opérations culturales (semis, traitements, récoltes) pour un suivi rigoureux et une meilleure traçabilité." },
    { icon: BarChart3, title: "Accès aux Données du Marché", description: "Consultez les prix du marché pour vos produits, identifiez les débouchés et prenez des décisions de vente éclairées." },
    { icon: ShieldCheck, title: "Sécurisation Foncière", description: "Utilisez nos services pour sécuriser vos titres de propriété, prévenir les litiges et valoriser votre patrimoine foncier." },
];

const SolutionsAgriculteursPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleDashboardAccess = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login', { state: { from: { pathname: '/dashboard' } } });
        }
    };

    return (
        <>
            <Helmet>
                <title>Solutions pour Agriculteurs - Optimisez Votre Exploitation | Teranga Foncier</title>
                <meta name="description" content="Découvrez nos outils dédiés aux agriculteurs pour la gestion de parcelles, l'analyse des sols, la météo agricole et la sécurisation foncière." />
            </Helmet>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 text-center bg-gradient-to-br from-green-600 to-lime-800 text-white">
                    <div className="container mx-auto px-4">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <Leaf className="h-20 w-20 mx-auto mb-6 opacity-80" />
                            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">La Terre, Votre Avenir. Nous le Sécurisons.</h1>
                            <p className="mt-4 text-lg lg:text-xl max-w-3xl mx-auto opacity-90">
                                Teranga Foncier propose des outils numériques innovants pour aider les agriculteurs sénégalais à optimiser leur exploitation, améliorer leurs rendements et sécuriser leur patrimoine foncier.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-200">
                                    <Link to="/register?role=Agriculteur">Créer mon compte Agriculteur</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="text-white border-white/80 hover:bg-white/10" asChild>
                                    <Link to="/contact">Contacter un expert agricole</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section id="features" className="py-16 lg:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-primary">Des Outils Conçus pour Votre Réussite</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Gérez votre exploitation plus efficacement avec notre suite d'outils digitaux.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featureList.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full text-center p-6 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                                        <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                                            <feature.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl font-semibold mb-2">{feature.title}</CardTitle>
                                        <CardContent className="text-muted-foreground text-sm leading-relaxed p-0">
                                            {feature.description}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Tarification */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-green-50 to-yellow-50">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-700">
                                Tarification Agriculteurs
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Un plan spécialement conçu pour optimiser votre exploitation agricole
                            </p>
                        </motion.div>

                        <div className="max-w-md mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <Card className="relative p-8 border-2 border-green-200 hover:border-green-300 transition-all bg-white shadow-lg">
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                                            RECOMMANDÉ
                                        </span>
                                    </div>
                                    <CardContent className="p-0">
                                        <div className="text-center mb-6">
                                            <div className="p-4 bg-green-100 rounded-full inline-block mb-4">
                                                <Leaf className="h-8 w-8 text-green-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-green-700 mb-2">Plan Agriculteur</h3>
                                            <div className="text-4xl font-bold text-green-600 mb-2">
                                                45,000 XOF
                                            </div>
                                            <p className="text-muted-foreground">par mois</p>
                                        </div>
                                        <ul className="space-y-3 mb-8">
                                            <li className="flex items-center text-sm">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                                Gestion illimitée de parcelles
                                            </li>
                                            <li className="flex items-center text-sm">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                                Météo agricole en temps réel
                                            </li>
                                            <li className="flex items-center text-sm">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                                Analyses de sols détaillées
                                            </li>
                                            <li className="flex items-center text-sm">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                                Carnet de bord numérique
                                            </li>
                                            <li className="flex items-center text-sm">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                                Prix du marché en temps réel
                                            </li>
                                            <li className="flex items-center text-sm">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                                Sécurisation foncière
                                            </li>
                                            <li className="flex items-center text-sm">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                                Support technique spécialisé
                                            </li>
                                        </ul>
                                        <Button 
                                            onClick={handleDashboardAccess}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Commencer mon exploitation numérique
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </section>
                
                <CallToActionSection />

            </motion.div>
        </>
    );
};

export default SolutionsAgriculteursPage;