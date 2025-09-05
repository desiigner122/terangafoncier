
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  ShieldCheck, 
  FileCheck2, 
  UserCheck2, 
  Gavel
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const preventionItems = [
  {
    icon: UserCheck2,
    title: "Vendeurs Vérifiés",
    description: "Chaque vendeur professionnel et particulier est soumis à une procédure de vérification d'identité pour garantir la fiabilité des annonces."
  },
  {
    icon: FileCheck2,
    title: "FileTexts Contrôlés",
    description: "Nous encourageons et facilitons la vérification des FileTexts juridiques (titre foncier, bail, etc.) pour certifier l'authenticité des parcelles."
  },
  {
    icon: ShieldCheck,
    title: "Plateforme Sécurisée",
    description: "Vos données et transactions sont protégées par les meilleures technologies de sécurité pour une expérience en toute sérénité."
  },
  {
    icon: Gavel,
    title: "Validation Notariale",
    description: "Pour les transactions entre particuliers, nous intégrons un processus de validation par un notaire partenaire pour sécuriser et authentifier chaque étape de votre acquisition."
  }
];

const FraudPreventionSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
          <img  className="w-full h-full object-cover opacity-5" alt="Abstract background security shield pattern" src="https://images.unsplash.com/photo-1693349215728-a07e968ae462" />
          <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-muted/20"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <ShieldCheck className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Votre Sécurité, Notre Priorité
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Teranga Foncier s'engage à créer un environnement de confiance pour tous vos projets fonciers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {preventionItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full text-center p-6 border-transparent bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link to="/how-it-works">Découvrir notre processus sécurisé</Link>
            </Button>
        </div>
      </div>
    </section>
  );
};

export default FraudPreventionSection;
