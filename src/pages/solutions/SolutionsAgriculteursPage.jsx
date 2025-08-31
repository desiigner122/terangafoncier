import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, MapPin, Tractor, Sun, Droplets, BarChart3, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CallToActionSection from '@/components/home/sections/CallToActionSection';

const featureList = [
    { icon: MapPin, title: "Gestion de Parcelles", description: "Visualisez et gérez toutes vos terres agricoles sur une carte interactive. Suivez les cultures, les rendements et l'historique de chaque parcelle." },
    { icon: Sun, title: "Météo Agricole", description: "Recevez des prévisions météorologiques précises et des alertes pour planifier vos activités agricoles et protéger vos cultures." },
    { icon: Droplets, title: "Analyse des Sols", description: "Demandez des analyses de sol, recevez des recommandations de fertilisation et optimisez la santé de vos terres pour de meilleurs rendements." },
    { icon: Tractor, title: "Carnet de Bord Numérique", description: "Enregistrez toutes vos opérations culturales (semis, traitements, récoltes) pour un suivi rigoureux et une meilleure traçabilité." },
    { icon: BarChart3, title: "Accès aux Données du Marché", description: "Consultez les prix du marché pour vos produits, identifiez les débouchés et prenez des décisions de vente éclairées." },
    { icon: ShieldCheck, title: "Sécurisation Foncière", description: "Utilisez nos services pour sécuriser vos titres de propriété, prévenir les litiges et valoriser votre patrimoine foncier." },
];

const SolutionsAgriculteursPage = () => {
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
                
                <CallToActionSection />

            </motion.div>
        </>
    );
};

export default SolutionsAgriculteursPage;