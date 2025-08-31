import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, UploadCloud } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-brand-blue via-primary to-brand-orange text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Prêt à Sécuriser Votre Avenir Foncier ?
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto"
        >
          Que vous soyez acheteur, vendeur ou professionnel, rejoignez la plateforme qui redéfinit la confiance dans l'immobilier sénégalais.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" asChild variant="secondary" className="bg-white text-primary hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-transform">
            <Link to="/parcelles">Acheter un Terrain Vérifié <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/80 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-transform" asChild>
            <Link to="/sell-property">Vendre Votre Bien <UploadCloud className="ml-2 h-5 w-5"/></Link>
          </Button>
        </motion.div>
         <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6"
        >
          <Button variant="link" asChild className="text-white/80 hover:text-white">
            <Link to="/register">Ou créer un compte gratuit <UserPlus className="ml-2 h-4 w-4"/></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;