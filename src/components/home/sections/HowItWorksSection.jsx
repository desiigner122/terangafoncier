import React from 'react';
    import { motion } from 'framer-motion';
    import { 
  Map, 
  FileSearch, 
  CheckCircle, 
  Smile, 
  Landmark, 
  FileSignature, 
  Users, 
  ShieldCheck
} from 'lucide-react';

    const steps = [
        { icon: Map, title: "1. Explorez les Offres", description: "Trouvez le terrain idéal parmi des parcelles vérifiées par nos vendeurs certifiés, ou soumettez une demande à une mairie.", color: "text-brand-blue" },
        { icon: ShieldCheck, title: "2. Vérification Renforcée", description: "Chaque parcelle listée par un vendeur subit un contrôle FileTextaire rigoureux par nos équipes pour garantir sa validité.", color: "text-brand-red" },
        { icon: FileSearch, title: "3. Suivez Votre Dossier", description: "Suivez l'avancement de votre acquisition ou de votre demande communale en toute transparence depuis votre tableau de bord.", color: "text-brand-orange" },
        { icon: Smile, title: "4. Finalisez en Toute Sérénité", description: "Devenez propriétaire en toute sécurité, accompagné par nos experts et nos partenaires notaires.", color: "text-green-600" },
    ];

    const HowItWorksSection = () => {
      return (
        <section className="container mx-auto px-4">
            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-10 text-center text-brand-blue"
            >
                Un Achat Foncier Simple, Sûr et Transparent
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {steps.map((step, index) => (
                  <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-6 bg-card rounded-xl border shadow-sm text-center h-full flex flex-col items-center hover:shadow-md transition-shadow"
                  >
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={`mb-4 p-3 bg-primary/10 rounded-full inline-block ${step.color}`}>
                       <step.icon size={32} strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-sm flex-grow">{step.description}</p>
                  </motion.div>
              ))}
            </div>
        </section>
      );
    };

    export default HowItWorksSection;