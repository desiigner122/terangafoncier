import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Landmark, ShieldCheck } from 'lucide-react';
const HeroSection = () => {
  return <div className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center text-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img alt="Paysage sénégalais avec un baobab majestueux au coucher du soleil" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1553103637-20a04655e468" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-white max-w-4xl p-6 rounded-lg">
        <motion.h1 initial={{
        y: 30,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2,
        duration: 0.7,
        type: "spring",
        stiffness: 100
      }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-shadow-lg">
          Investissez en Toute Sécurité. Vendez en Toute Confiance.
        </motion.h1>
        <motion.p initial={{
        y: 30,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.4,
        duration: 0.7,
        type: "spring",
        stiffness: 100
      }} className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-100 text-shadow-md">Teranga Foncier est votre bouclier contre la fraude foncière. 
Explorez nos terrains vérifiés ou soumettez une demande communale en toute simplicité.</motion.p>
        <motion.div initial={{
        y: 30,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.6,
        duration: 0.7,
        type: "spring",
        stiffness: 100
      }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-brand-orange text-white hover:bg-brand-orange/90 font-bold shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out">
            <Link to="/parcelles"><ShieldCheck className="mr-2 h-5 w-5" /> Explorer les Terrains Vérifiés</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/60 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out" asChild>
            <Link to="/demande-terrain-communal"><Landmark className="mr-2 h-5 w-5" />Demander un Terrain Communal</Link>
          </Button>
        </motion.div>

         <motion.div initial={{
        y: 30,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.7,
        duration: 0.7,
        type: "spring",
        stiffness: 100
      }} className="mt-12">
            <Button variant="link" className="text-white/80 hover:text-white" asChild>
                <Link to="/how-it-works">Comment ça marche ?</Link>
            </Button>
         </motion.div>
      </div>
    </div>;
};
export default HeroSection;