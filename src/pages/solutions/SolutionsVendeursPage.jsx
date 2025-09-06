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
import { useUser } from '@/hooks/useUser';
import { Helmet } from 'react-helmet-async';
import { ROLES_CONFIG } from '@/lib/enhancedRbacConfig';
import { Card, CardContent } from '@/components/ui/card';

const SolutionsVendeursPage = () => {
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

        {/* Section Tarification */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-700">
                Tarification Vendeurs
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choisissez le plan qui correspond à votre profil de vendeur
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plan Vendeur Particulier */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="relative p-8 h-full border-2 border-green-200 hover:border-green-300 transition-all">
                  <CardContent className="p-0">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-green-700 mb-2">Vendeur Particulier</h3>
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {ROLES_CONFIG.VENDEUR_PARTICULIER.subscription.price.toLocaleString()} XOF
                      </div>
                      <p className="text-muted-foreground">par mois</p>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          ✓
                        </div>
                        Jusqu'à 5 annonces actives
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          ✓
                        </div>
                        Outils de gestion basiques
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          ✓
                        </div>
                        Support client standard
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          ✓
                        </div>
                        Statistiques de base
                      </li>
                    </ul>
                    <Button 
                      onClick={handleDashboardAccess}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Plan Vendeur Professionnel */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="relative p-8 h-full border-2 border-blue-200 hover:border-blue-300 transition-all">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                      POPULAIRE
                    </span>
                  </div>
                  <CardContent className="p-0">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-blue-700 mb-2">Vendeur Professionnel</h3>
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {ROLES_CONFIG.VENDEUR_PROFESSIONNEL.subscription.price.toLocaleString()} XOF
                      </div>
                      <p className="text-muted-foreground">par mois</p>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          ✓
                        </div>
                        Annonces illimitées
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          ✓
                        </div>
                        Outils avancés de gestion
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          ✓
                        </div>
                        Support prioritaire 24/7
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          ✓
                        </div>
                        Analytics avancées
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          ✓
                        </div>
                        API intégration
                      </li>
                    </ul>
                    <Button 
                      onClick={handleDashboardAccess}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
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