import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { 
  Search, 
  UserCheck, 
  Users, 
  Smile, 
  ArrowRight, 
  Settings2, 
  Check, 
  ListChecks, 
  Landmark, 
  FileSignature, 
  ShieldCheck as Shield
} from 'lucide-react';

    const buyerSteps = [
      { icon: Search, title: "1. Explorez les Terrains Vérifiés", description: "Parcourez notre catalogue de parcelles dont les FileTexts ont été pré-vérifiés par nos experts et nos partenaires (notaires, mairies)." },
      { icon: Landmark, title: "2. Ou Demandez un Terrain Communal", description: "Si vous ne trouvez pas votre bonheur, soumettez une demande directement à une mairie partenaire via notre formulaire guidé." },
      { icon: UserCheck, title: "3. Suivi & Accompagnement", description: "Que ce soit pour une acquisition directe ou une demande communale, suivez l'avancement de votre dossier et soyez accompagné par un agent dédié." },
      { icon: Users, title: "4. Finalisation Sécurisée", description: "Nous coordonnons toutes les démarches avec les notaires et l'administration pour une signature et une transaction en toute sérénité." },
    ];

    const verificationSteps = [
      "Vérification de l'identité du vendeur",
      "Contrôle du titre de propriété (TF, Bail, Délibération)",
      "Vérification de la situation au Cadastre",
      "Contrôle de l'état des droits réels (hypothèques, etc.)",
      "Vérification de la conformité au plan d'urbanisme",
      "Recherche de litiges en cours (mairie, tribunaux)",
      "Contrôle des taxes et impôts fonciers",
      "Visite physique et bornage contradictoire du terrain",
      "Validation du mandat de vente",
      "Rapport de synthèse de la diligence raisonnable"
    ];

    const HowItWorksPage = () => {
      const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
      };

      const listVariants = {
         hidden: { opacity: 0 },
         visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
       };

       const itemVariants = {
         hidden: { opacity: 0, y: 25, scale: 0.95 },
         visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
       };


      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-background to-blue-50 dark:from-background dark:to-blue-900/20 min-h-screen"
        >
          <div className="container mx-auto py-16 px-4 space-y-16 md:space-y-24">
            {/* Hero Section */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="text-center pt-8"
            >
              <Settings2 className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-brand-blue" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue mb-4">Comment Ça Marche ?</h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Acquérir un terrain au Sénégal n'a jamais été aussi simple, transparent et sécurisé. Découvrez notre processus optimisé.
              </p>
            </motion.section>

            {/* Buyer Steps Section */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-brand-blue">Les Parcours d'Acquisition</h2>
              <motion.div
                variants={listVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
              >
                {buyerSteps.map((step, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full flex flex-col text-center p-6 border border-border/50 bg-card shadow-lg hover:shadow-primary/15 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="mb-5 inline-block mx-auto p-4 bg-primary/10 text-primary rounded-full ring-4 ring-primary/20">
                          <step.icon className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground text-sm flex-grow leading-relaxed">{step.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            {/* Verification Process Section */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-card/50 dark:via-card/70 dark:to-card/50 rounded-xl p-8 md:p-12 shadow-xl border border-primary/20"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-brand-blue flex items-center justify-center"><ListChecks className="mr-3 h-10 w-10"/>Notre Processus de Vérification des Vendeurs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {verificationSteps.map((step, index) => (
                    <motion.div 
                        key={index} 
                        variants={itemVariants}
                        className="flex items-start p-3"
                    >
                        <Check className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">{step}</p>
                        </div>
                    </motion.div>
                  ))}
              </div>
            </motion.section>

            {/* Call to Action */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="text-center py-10"
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-foreground">Prêt à trouver le terrain de vos rêves ?</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                  Commencez votre recherche dès maintenant et découvrez les meilleures opportunités foncières vérifiées au Sénégal.
              </p>
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button size="xl" asChild className="bg-gradient-to-r from-brand-orange to-brand-red hover:opacity-90 text-white text-lg shadow-lg px-10 py-7">
                    <Link to="/parcelles">Explorer les Terrains <ArrowRight className="ml-2.5 h-5 w-5" /></Link>
                 </Button>
                  <Button size="xl" variant="outline" asChild className="text-lg shadow-lg px-10 py-7">
                    <Link to="/demande-terrain-communal">Découvrir la demande communale <FileSignature className="ml-2.5 h-5 w-5" /></Link>
                 </Button>
              </motion.div>
            </motion.section>

          </div>
        </motion.div>
      );
    };

    export default HowItWorksPage;