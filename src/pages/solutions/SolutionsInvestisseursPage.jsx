import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ShieldCheck, 
  Briefcase, 
  BarChartHorizontalBig, 
  ArrowRight, 
  LayoutDashboard
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { Helmet } from 'react-helmet-async';
import { ROLES_CONFIG } from '@/lib/enhancedRbacConfig';
import { Card, CardContent } from '@/components/ui/card';

const SolutionsInvestisseursPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
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
      title: "Opportunités d'Investissement Vérifiées",
      description: "Investissez en toute confiance dans des terrains au statut juridique clair et au potentiel de valorisation. Chaque bien est rigoureusement vérifié par nos experts.",
    },
    {
      icon: BarChartHorizontalBig,
      title: "Analyse de Rendement Potentiel (Simulée)",
      description: "Visualisez les perspectives de plus-value basées sur les tendances du marché, les projets de développement urbain et les analyses comparatives de zones similaires.",
    },
    {
      icon: Briefcase,
      title: "Portefeuille Foncier Diversifié",
      description: "Accédez à une large gamme de terrains : résidentiels, commerciaux, industriels ou agricoles. Diversifiez vos actifs fonciers en fonction de votre stratégie.",
    },
    {
      icon: TrendingUp,
      title: "Accompagnement Stratégique Personnalisé",
      description: "Bénéficiez des conseils de nos experts pour identifier les meilleures opportunités, structurer vos acquisitions et optimiser votre stratégie d'investissement foncier.",
    }
  ];

  return (
    <>
      <Helmet>
        <title>Solutions Investisseurs - Teranga Foncier</title>
        <meta name="description" content="Solutions d'investissement foncier au Sénégal. Découvrez des opportunités vérifiées, analysez le rendement potentiel et diversifiez votre portefeuille en toute sécurité." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-background"
      >
        <section className="relative pt-32 pb-20 text-center bg-red-600/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-10" alt="Fond abstrait de graphiques financiers" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 relative z-10"
          >
            <TrendingUp className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-red-600" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 mb-4">
              Investir dans le Foncier, l'Avenir du Sénégal
            </h1>
            <p className="text-lg md:text-xl text-red-800/80 max-w-3xl mx-auto">
              Teranga Foncier guide les investisseurs vers des opportunités foncières sécurisées et à fort potentiel de croissance.
            </p>
          </motion.div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-red-700">Maximisez Votre Retour sur Investissement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.custom
                  key={index}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={index}
                  className="bg-card p-6 rounded-xl shadow-lg border border-red-200 hover:shadow-red-100 transition-shadow flex flex-col items-center text-center"
                >
                  <div className="p-4 bg-red-500/10 rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.custom>
              ))}
            </div>
          </div>
        </section>

        {/* Section Tarification */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-red-50 to-pink-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-700">
                Tarification Investisseurs
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des plans adaptés à votre stratégie d'investissement
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plan Investisseur Immobilier */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative p-8 h-full border-2 border-red-200 hover:border-red-300 transition-all bg-white rounded-xl shadow-lg">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                      POPULAIRE
                    </span>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-red-700 mb-2">Investisseur Immobilier</h3>
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      {ROLES_CONFIG.INVESTISSEUR_IMMOBILIER?.subscription?.investor?.price?.toLocaleString() || '100,000'} XOF
                    </div>
                    <p className="text-muted-foreground">par mois</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Analyse de rentabilité immobilière
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Alertes opportunités exclusives
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Portfolio tracking avancé
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Rapports de performance
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Support expert dédié
                    </li>
                  </ul>
                  <Button 
                    onClick={handleDashboardAccess}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Commencer
                  </Button>
                </div>
              </motion.div>

              {/* Plan Investisseur Agricole */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative p-8 h-full border-2 border-green-200 hover:border-green-300 transition-all bg-white rounded-xl shadow-lg">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-green-700 mb-2">Investisseur Agricole</h3>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {ROLES_CONFIG.INVESTISSEUR_AGRICOLE?.subscription?.agri_investor?.price?.toLocaleString() || '80,000'} XOF
                    </div>
                    <p className="text-muted-foreground">par mois</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Analyse sols et rendements
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Terrains agricoles certifiés
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Suivi météo et climatique
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Connexion avec agriculteurs
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        ✓
                      </div>
                      Outils de gestion agricole
                    </li>
                  </ul>
                  <Button 
                    onClick={handleDashboardAccess}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Commencer
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-red-700">Faites Fructifier Votre Capital en Toute Confiance</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Explorez notre tableau de bord dédié aux investisseurs pour suivre vos actifs, analyser les performances et découvrir de nouvelles opportunités exclusives.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" onClick={handleDashboardAccess} className="bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg">
                Accéder au Dashboard Investisseur <LayoutDashboard className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
             <p className="text-sm text-muted-foreground mt-4">Ou <Link to="/parcelles-vendeurs?type=investissement" className="underline hover:text-primary">consultez les terrains à potentiel d'investissement</Link>.</p>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default SolutionsInvestisseursPage;