import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Zap, 
  Target, 
  BarChart2, 
  ShieldCheck, 
  ArrowRight, 
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';

const SolutionsVendeursPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user) {
      if (user.profile?.role.includes('Vendeur')) {
        navigate('/solutions/vendeur/dashboard');
      } else {
        navigate('/dashboard'); 
      }
    } else {
      navigate('/login', { state: { from: { pathname: '/solutions/vendeur/dashboard' } } });
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
      icon: Target,
      title: "Visibilité Maximale",
      description: "Exposez votre bien à des milliers d'acheteurs potentiels, au Sénégal et dans la diaspora, activement à la recherche de terrains.",
    },
    {
      icon: Users,
      title: "Accès à des Acheteurs Qualifiés",
      description: "Nos outils de vérification et nos partenariats bancaires attirent des acheteurs sérieux et finançables, vous faisant gagner un temps précieux.",
    },
    {
      icon: ShieldCheck,
      title: "Transactions Sécurisées",
      description: "Profitez d'un cadre qui valorise les biens au statut juridique clair. La transparence rassure les acheteurs et accélère les ventes.",
    },
    {
      icon: BarChart2,
      title: "Outils de Suivi Performants",
      description: "Depuis votre tableau de bord, suivez les statistiques de vues de votre annonce, gérez les demandes et communiquez facilement avec les prospects.",
    }
  ];

  return (
    <>
      <Helmet>
        <title>Vendez Votre Terrain - Solutions Vendeurs | Teranga Foncier</title>
        <meta name="description" content="Vendez votre terrain rapidement et au meilleur prix. Profitez d'une visibilité maximale, d'acheteurs qualifiés et d'un processus sécurisé." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-background"
      >
        <section className="relative pt-32 pb-20 text-center bg-green-600/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1627940398066-512a87a2c7b5?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-10" alt="Poignée de main concluant une affaire" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 relative z-10"
          >
            <Users className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-green-600" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
              Vendez Votre Terrain. Simplement. Rapidement.
            </h1>
            <p className="text-lg md:text-xl text-green-800/80 max-w-3xl mx-auto">
              Que vous soyez un particulier ou un professionnel, Teranga Foncier est votre meilleur allié pour une vente réussie.
            </p>
             <motion.div className="mt-8" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" asChild className="bg-gradient-to-r from-green-600 to-primary text-white shadow-lg">
                    <Link to="/add-parcel">Publier une annonce gratuitement <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </motion.div>
          </motion.div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-green-700">Pourquoi Vendre sur Teranga Foncier ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.custom
                  key={index}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={index}
                  className="bg-card p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-green-100 transition-shadow flex flex-col items-center text-center"
                >
                  <div className="p-4 bg-green-500/10 rounded-full mb-4">
                      <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.custom>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-muted/50">
          <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div initial={{opacity: 0, x: -50}} whileInView={{opacity: 1, x: 0}} transition={{duration: 0.7}} viewport={{once: true}}>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-700">Un Tableau de Bord à Votre Service</h2>
                      <p className="text-muted-foreground mb-6">Notre plateforme met à votre disposition un espace personnel intuitif pour gérer vos annonces, consulter les statistiques, interagir avec les acheteurs et suivre l'avancement de vos transactions, le tout au même endroit.</p>
                      <Button size="lg" onClick={handleDashboardAccess} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                        Accéder à mon Espace Vendeur <LayoutDashboard className="ml-2 h-5 w-5" />
                      </Button>
                  </motion.div>
                  <motion.div initial={{opacity: 0, scale: 0.8}} whileInView={{opacity: 1, scale: 1}} transition={{duration: 0.7}} viewport={{once: true}}>
                      <Card className="p-2 bg-white shadow-xl">
                          <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop" class="rounded-lg object-cover w-full h-auto" alt="Tableau de bord vendeur montrant des annonces et des statistiques de performance" />
                      </Card>
                  </motion.div>
              </div>
          </div>
        </section>

      </motion.div>
    </>
  );
};

export default SolutionsVendeursPage;