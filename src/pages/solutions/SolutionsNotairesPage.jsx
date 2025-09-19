import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  Gavel, 
  ArrowRight, 
  LayoutDashboard, 
  Users,
  Lock,
  Stamp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthProvider';
import { Helmet } from 'react-helmet-async';

const SolutionsNotairesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user) {
      navigate('/solutions/notaires/dashboard');
    } else {
      navigate('/login', { state: { from: { pathname: '/solutions/notaires/dashboard' } } });
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
      title: "Vérification Authentique des Titres",
      description: "Accédez Ï  une base de données centralisée et sécurisée pour vérifier l'authenticité des titres fonciers et éviter les fraudes documentaires.",
    },
    {
      icon: FileText,
      title: "Rédaction d'Actes Sécurisée",
      description: "Bénéficiez d'un environnement numérique sécurisé pour la rédaction et la conservation de vos actes notariés avec traçabilité complète.",
    },
    {
      icon: Users,
      title: "Réseau de Confiance",
      description: "Connectez-vous avec un écosystème vérifié d'acheteurs, vendeurs, promoteurs et institutions financières pour faciliter vos transactions.",
    },
    {
      icon: Gavel,
      title: "Gestion Efficace des Successions",
      description: "Simplifiez le traitement des successions avec des outils d'évaluation automatisée et de répartition équitable des biens.",
    },
    {
      icon: Lock,
      title: "ðŸ†• Actes Blockchain Infalsifiables",
      description: "Créez des actes notariés stockés sur blockchain, garantissant leur authenticité et leur intégrité pour l'éternité. Signatures électroniques légales avec certificats cryptographiques.",
      isNew: true
    },
    {
      icon: Stamp,
      title: "ðŸ†• Archivage Décentralisé",
      description: "Conservez tous vos documents dans un système d'archivage décentralisé accessible partout dans le monde. Plus de risque de perte ou destruction d'archives.",
      isNew: true
    }
  ];

  return (
    <>
      <Helmet>
        <title>Solutions Notaires - Teranga Foncier</title>
        <meta name="description" content="Solutions pour notaires : vérification de titres, rédaction sécurisée, gestion de successions et actes blockchain infalsifiables." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-background"
      >
        <section className="relative pt-32 pb-20 text-center bg-purple-600/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-10" alt="Cabinet notarial moderne" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 relative z-10"
          >
            <Scale className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-4">
              La Modernisation du Notariat Sénégalais
            </h1>
            <p className="text-lg md:text-xl text-purple-800/80 max-w-3xl mx-auto">
              Teranga Foncier révolutionne la pratique notariale avec des outils numériques sécurisés et la technologie blockchain.
            </p>
          </motion.div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-purple-700">Nos Solutions pour Votre Étude</h2>
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
                    feature.isNew ? 'border-purple-200 hover:shadow-purple-100 bg-gradient-to-br from-purple-50 to-blue-50' : 'border-purple-200 hover:shadow-purple-100'
                  }`}
                >
                  <div className={`p-4 rounded-full mb-4 ${
                    feature.isNew ? 'bg-blue-500/10' : 'bg-purple-500/10'
                  }`}>
                    <feature.icon className={`h-8 w-8 ${
                      feature.isNew ? 'text-blue-600' : 'text-purple-600'
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
        
        {/* Section avantages blockchain */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-700">Révolution Blockchain du Notariat</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-purple-900">Sécurité Absolue</h3>
                <p className="text-purple-700">
                  Actes infalsifiables stockés sur blockchain avec signatures cryptographiques. 
                  Aucun risque de fraude ou d'altération documentaire.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-900">Accès Universel</h3>
                <p className="text-blue-700">
                  Archives accessibles depuis n'importe où dans le monde. 
                  Vérification instantanée d'authenticité pour tous les acteurs.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-green-900">Confiance Renforcée</h3>
                <p className="text-green-700">
                  Transparence totale des processus notariaux. 
                  Renforcement de la confiance du public dans l'institution notariale.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-700">Modernisez Votre Pratique Notariale</h2>
            <p className="text-lg text-purple-800/80 mb-8 max-w-2xl mx-auto">
              Rejoignez la révolution numérique du notariat sénégalais et offrez Ï  vos clients des services d'exception.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" onClick={handleDashboardAccess} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
                Accéder au Dashboard Notaires <LayoutDashboard className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
             <p className="text-sm text-muted-foreground mt-4">Ou <Link to="/contact?subject=SolutionsNotaires" className="underline hover:text-primary">contactez-nous pour une démonstration</Link>.</p>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default SolutionsNotairesPage;


