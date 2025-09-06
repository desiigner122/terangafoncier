import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  BarChart3, 
  FileSearch, 
  ArrowRight, 
  LayoutDashboard, 
  Users,
  CheckCircle,
  Hammer,
  Camera,
  Calculator,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/hooks/useUser';
import { Helmet } from 'react-helmet-async';
import { ROLES_CONFIG } from '@/lib/enhancedRbacConfig';

const SolutionsPromoteursPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user) {
      navigate('/dashboard'); // Notre nouveau système de redirection intelligente
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
          icon: Search,
          title: "Identification de Terrains Stratégiques",
          description: "Accédez à un catalogue exclusif de terrains vérifiés, adaptés à vos projets résidentiels, commerciaux ou mixtes. Filtrez par zone, superficie, statut juridique et potentiel de développement.",
        },
        {
          icon: FileCheck,
          title: "Études de Faisabilité Accélérées (Simulées)",
          description: "Obtenez des informations clés sur la réglementation d'urbanisme, les contraintes techniques et le potentiel de marché pour chaque parcelle. Prenez des décisions éclairées plus rapidement.",
        },
        {
          icon: TrendingUp,
          title: "Analyse de Potentiel et de Rentabilité",
          description: "Utilisez nos outils d'analyse (simulés) pour évaluer le potentiel de plus-value et la rentabilité de vos futurs projets en fonction des tendances du marché.",
        },
        {
          icon: Users,
          title: "Connexion Directe avec les Acheteurs",
          description: "Identifiez les particuliers ayant récemment acquis un terrain nu dans vos zones d'intervention et proposez-leur vos services de construction. Un canal direct pour trouver vos prochains clients.",
        }
      ];

      return (
        <>
          <Helmet>
            <title>Solutions Promoteurs Immobiliers - Teranga Foncier</title>
            <meta name="description" content="Solutions pour promoteurs immobiliers au Sénégal. Identifiez des terrains stratégiques, analysez le potentiel et connectez-vous avec de futurs clients." />
          </Helmet>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-background"
          >
            <section className="relative pt-32 pb-20 text-center bg-purple-600/10 overflow-hidden">
              <div className="absolute inset-0 z-0">
                 <img  class="w-full h-full object-cover opacity-10" alt="Fond abstrait de plan architectural" src="https://images.unsplash.com/photo-1698461979080-fd82567cb379" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 relative z-10"
              >
                <Building2 className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-purple-600" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-4">
                  La Plateforme des Promoteurs Visionnaires
                </h1>
                <p className="text-lg md:text-xl text-purple-800/80 max-w-3xl mx-auto">
                  De l'identification du terrain à la rencontre de votre futur client, Teranga Foncier est votre partenaire de croissance.
                </p>
              </motion.div>
            </section>

            <section className="py-16 md:py-20">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-purple-700">Un Écosystème Complet pour Vos Projets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <motion.custom
                      key={index}
                      variants={featureVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      custom={index}
                      className="bg-card p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-purple-100 transition-shadow flex flex-col items-center text-center"
                    >
                      <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                          <feature.icon className="h-8 w-8 text-purple-600" />
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
                          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-700">Trouvez Vos Prochains Chantiers</h2>
                          <p className="text-muted-foreground mb-6">Notre innovation majeure : un outil de veille (simulé) qui vous alerte lorsqu'un particulier achète un terrain nu dans votre zone d'activité. C'est une opportunité unique de proposer vos services de construction au moment exact où le besoin naît.</p>
                          <ul className="space-y-3 text-muted-foreground">
                              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" />Accès à un flux de prospects qualifiés.</li>
                              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" />Réduction des coûts de prospection.</li>
                              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" />Cycle de vente considérablement raccourci.</li>
                          </ul>
                      </motion.div>
                      <motion.div initial={{opacity: 0, scale: 0.8}} whileInView={{opacity: 1, scale: 1}} transition={{duration: 0.7}} viewport={{once: true}}>
                          <Card className="p-6 bg-white shadow-xl">
                              <img  class="rounded-lg object-cover w-full h-auto" alt="Interface montrant une carte avec des acheteurs de terrains et des options de contact pour promoteurs" src="https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0" />
                          </Card>
                      </motion.div>
                  </div>
              </div>
            </section>

            {/* Section Tarification */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-700">Plans Professionnels</h2>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Solutions complètes pour les professionnels de la construction
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* Plan Promoteur */}
                  <Card className="border-2 border-purple-200 shadow-xl">
                    <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                      <CardTitle className="text-xl flex items-center justify-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Promoteur
                      </CardTitle>
                      <div className="text-2xl font-bold mt-2">
                        {ROLES_CONFIG.PROMOTEUR?.subscription?.price?.toLocaleString()} XOF
                        <span className="text-sm font-normal opacity-90">/mois</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3 mb-6 text-sm">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          <span>Gestion projets complets</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          <span>Matching acheteurs-projets</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          <span>Timeline avec photos</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          <span>Gestion devis</span>
                        </li>
                      </ul>
                      <Button 
                        onClick={handleDashboardAccess} 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        Choisir ce plan
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Plan Architecte */}
                  <Card className="border-2 border-blue-200 shadow-xl">
                    <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-t-lg">
                      <CardTitle className="text-xl flex items-center justify-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Architecte
                      </CardTitle>
                      <div className="text-2xl font-bold mt-2">
                        {ROLES_CONFIG.ARCHITECTE?.subscription?.price?.toLocaleString()} XOF
                        <span className="text-sm font-normal opacity-90">/mois</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3 mb-6 text-sm">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span>Portfolio projets</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span>Outils conception</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span>Collaboration équipes</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span>Validation plans</span>
                        </li>
                      </ul>
                      <Button 
                        onClick={handleDashboardAccess} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        Choisir ce plan
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Plan Constructeur */}
                  <Card className="border-2 border-orange-200 shadow-xl">
                    <CardHeader className="text-center bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                      <CardTitle className="text-xl flex items-center justify-center gap-2">
                        <Hammer className="w-5 h-5" />
                        Constructeur
                      </CardTitle>
                      <div className="text-2xl font-bold mt-2">
                        {ROLES_CONFIG.CONSTRUCTEUR?.subscription?.price?.toLocaleString()} XOF
                        <span className="text-sm font-normal opacity-90">/mois</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3 mb-6 text-sm">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                          <span>Suivi chantiers</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                          <span>Photos progression</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                          <span>Gestion équipes</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                          <span>Reporting client</span>
                        </li>
                      </ul>
                      <Button 
                        onClick={handleDashboardAccess} 
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        size="sm"
                      >
                        Choisir ce plan
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            <section className="py-16 md:py-20 bg-primary/5">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-700">Pilotez Vos Projets avec Efficacité</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Accédez à votre tableau de bord promoteur pour suivre vos acquisitions, gérer vos projets en cours et analyser les données de marché pertinentes.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" onClick={handleDashboardAccess} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                    Accéder au Dashboard Promoteur <LayoutDashboard className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                 <p className="text-sm text-muted-foreground mt-4">Ou <Link to="/contact?subject=SolutionsPromoteurs" className="underline hover:text-primary">contactez-nous pour une démo</Link>.</p>
              </div>
            </section>
          </motion.div>
        </>
      );
    };

    export default SolutionsPromoteursPage;