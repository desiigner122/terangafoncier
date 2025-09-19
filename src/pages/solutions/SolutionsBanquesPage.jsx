import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Banknote, 
  ShieldCheck, 
  BarChart3, 
  FileSearch, 
  ArrowRight, 
  LayoutDashboard, 
  Users,
  Lock,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { Helmet } from 'react-helmet-async';

const SolutionsBanquesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user) {
      navigate('/solutions/banques/dashboard');
    } else {
      navigate('/login', { state: { from: { pathname: '/solutions/banques/dashboard' } } });
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Évaluation Fiable des Garanties Foncières",
      description: "Accédez à des données vérifiées et à des analyses de marché pour évaluer avec précision la valeur des terrains proposés en garantie. Réduisez vos risques et optimisez vos décisions de crédit.",
    },
    {
      icon: Users,
      title: "Faciliter l'Accès au Financement",
      description: "Proposez à vos clients des parcours de financement simplifiés pour l'acquisition de biens vérifiés sur notre plateforme. Un gage de sécurité qui accélère les décisions.",
    },
    {
      icon: Users,
      title: "Acquisition de Nouveaux Clients",
      description: "Captez une nouvelle clientèle d'acheteurs et de promoteurs ayant besoin de financement pour leurs projets immobiliers identifiés sur Teranga Foncier.",
    },
    {
      icon: BarChart3,
      title: "Suivi de Portefeuille et Analyse de Risque",
      description: "Utilisez notre dashboard pour surveiller l'évolution des zones géographiques où se situent vos actifs et anticiper les tendances pour gérer proactivement votre portefeuille.",
    },
    {
      icon: Lock,
      title: "🆕 Smart Contracts Bancaires",
      description: "Automatisez vos prêts immobiliers avec des contrats intelligents blockchain. Déblocage automatique des fonds selon l'avancement des projets, garanties décentralisées et réduction des risques de 60%.",
      isNew: true
    },
    {
      icon: Coins,
      title: "🆕 Tokenisation d'Actifs",
      description: "Proposez à vos clients la tokenisation de leurs biens immobiliers pour une liquidité accrue et de nouveaux produits d'investissement. Fractionner la propriété pour démocratiser l'accès à l'immobilier.",
      isNew: true
    }
  ];

  return (
    <>
      <Helmet>
        <title>Solutions Banques & Finances - Teranga Foncier</title>
        <meta name="description" content="Solutions pour banques : évaluation de garanties, acquisition de clients, facilitation de financements et analyse de portefeuille foncier." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-background"
      >
        <section className="relative pt-32 pb-20 text-center bg-blue-600/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1553897386-ff94bf1dfff6?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-10" alt="Fond abstrait architectural moderne" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 relative z-10"
          >
            <Banknote className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
              Partenaire de Croissance du Secteur Financier
            </h1>
            <p className="text-lg md:text-xl text-blue-800/80 max-w-3xl mx-auto">
              Teranga Foncier crée des synergies entre le foncier et la finance pour des opérations sécurisées, rentables et fluides.
            </p>
          </motion.div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-blue-700">Nos Solutions pour Votre Institution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={index}
                  className={`bg-card p-6 rounded-xl shadow-lg border transition-shadow flex flex-col items-center text-center ${
                    feature.isNew ? 'border-purple-200 hover:shadow-purple-100 bg-gradient-to-br from-purple-50 to-blue-50' : 'border-blue-200 hover:shadow-blue-100'
                  }`}
                >
                  <div className={`p-4 rounded-full mb-4 ${
                    feature.isNew ? 'bg-purple-500/10' : 'bg-blue-500/10'
                  }`}>
                    <feature.icon className={`h-8 w-8 ${
                      feature.isNew ? 'text-purple-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  {feature.isNew && (
                    <div className="mt-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Blockchain
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700">Renforcez Votre Expertise Foncière</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Accédez à un tableau de bord dédié pour visualiser les évaluations, suivre les portefeuilles et gérer les risques liés aux garanties foncières.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" onClick={handleDashboardAccess} className="bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg">
                Accéder au Dashboard Banques <LayoutDashboard className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
             <p className="text-sm text-muted-foreground mt-4">Ou <Link to="/contact?subject=SolutionsBanques" className="underline hover:text-primary">contactez-nous pour un partenariat</Link>.</p>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default SolutionsBanquesPage;



