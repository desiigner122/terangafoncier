import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Landmark, FileSignature, ArrowRight, CheckCircle, Map, FileSearch, Users, ShieldCheck, MailQuestion } from 'lucide-react';

const benefits = [
    {
        icon: Map,
        title: "Accès Direct et Simplifié",
        description: "Plus besoin de vous déplacer. Soumettez votre demande en ligne à plusieurs mairies partenaires depuis une seule interface."
    },
    {
        icon: FileSearch,
        title: "Dossier Guidé et Complet",
        description: "Notre formulaire intelligent vous aide à constituer un dossier solide, augmentant ainsi vos chances de succès."
    },
    {
        icon: Users,
        title: "Suivi Centralisé",
        description: "Suivez l'état d'avancement de votre demande en temps réel depuis votre tableau de bord personnel."
    },
    {
        icon: ShieldCheck,
        title: "Processus Sécurisé",
        description: "Nous assurons la transmission sécurisée de vos documents et informations aux administrations compétentes."
    },
];

const steps = [
    { title: "1. Créez votre compte", description: "Inscrivez-vous sur Teranga Foncier pour accéder à votre espace personnel." },
    { title: "2. Remplissez le formulaire", description: "Accédez au formulaire de demande, remplissez vos informations et précisez votre projet." },
    { title: "3. Joignez vos documents", description: "Téléchargez les pièces justificatives requises (pièce d'identité, justificatif de projet, etc.)." },
    { title: "4. Soumettez et suivez", description: "Envoyez votre dossier en un clic et suivez son traitement par la mairie concernée." },
];

const MunicipalLandInfoPage = () => {
    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };
    
    return (
        <>
            <Helmet>
                <title>Demander un Terrain Communal - Teranga Foncier</title>
                <meta name="description" content="Découvrez comment soumettre votre demande d'attribution de terrain communal via Teranga Foncier. Un processus simple, guidé et sécurisé pour accéder à la propriété foncière au Sénégal." />
            </Helmet>
            <div className="bg-background">
                {/* Hero */}
                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className="pt-20 pb-16 md:pt-28 md:pb-24 text-center bg-gradient-to-b from-primary/5 via-transparent to-transparent"
                >
                    <div className="container mx-auto px-4">
                        <Landmark className="h-16 w-16 text-primary mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-blue mb-4">
                            Demandez un Terrain Communal
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Teranga Foncier digitalise et simplifie l'accès à la propriété en vous connectant directement aux mairies partenaires.
                        </p>
                    </div>
                </motion.section>

                {/* Benefits */}
                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-16 md:py-24"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-blue mb-12">Pourquoi utiliser notre service ?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {benefits.map((benefit, index) => (
                                <Card key={index} className="text-center p-6 border-border/50 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="inline-block p-4 bg-primary/10 text-primary rounded-full mb-4">
                                        <benefit.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* How it works */}
                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-16 md:py-24 bg-muted/50"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-blue mb-12">Le Processus en 4 Étapes Simples</h2>
                        <div className="relative max-w-4xl mx-auto">
                             <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block"></div>
                            {steps.map((step, index) => (
                                <div key={index} className="relative mb-8 flex items-center md:justify-normal md:odd:flex-row-reverse md:odd:text-right">
                                    <div className="hidden md:block w-1/2"></div>
                                    <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <Card className="w-full md:w-1/2 p-6 shadow-lg">
                                        <h3 className="text-xl font-semibold mb-2 text-primary">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* FAQ */}
                <motion.section
                     variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-16 md:py-24 container mx-auto px-4"
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <MailQuestion className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">Questions Fréquentes</h2>
                        <p className="text-muted-foreground mb-8">
                            Vous avez des questions ? Nous avons les réponses. Pour plus d'informations, n'hésitez pas à consulter notre <Link to="/faq" className="text-primary underline">page FAQ complète</Link>.
                        </p>
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.section
                     variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="pb-16 md:pb-24"
                >
                    <div className="container mx-auto px-4">
                        <Card className="bg-gradient-to-r from-brand-blue via-primary to-brand-orange text-primary-foreground p-8 md:p-12 text-center shadow-xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à devenir propriétaire ?</h2>
                            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-primary-foreground/90">
                                Lancez votre demande dès maintenant. Votre projet foncier commence ici.
                            </p>
                            <Button size="xl" variant="secondary" className="bg-white text-primary hover:bg-gray-100 text-lg shadow-lg" asChild>
                                <Link to="/request-municipal-land">
                                    Commencer ma Demande de Terrain <FileSignature className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </Card>
                    </div>
                </motion.section>
            </div>
        </>
    );
};

export default MunicipalLandInfoPage;