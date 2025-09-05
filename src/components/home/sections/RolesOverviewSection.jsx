import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Landmark, 
  TrendingUp, 
  Users, 
  Banknote, 
  Scale, 
  UserCheck, 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  FileText, 
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RolesOverviewSection = () => {
  const roles = [
    {
      title: "Banques & Finances",
      icon: Banknote,
      description: "Évaluez les garanties foncières et analysez les risques avec précision.",
      features: [
        "Vérification automatique des titres",
        "Évaluation des garanties",
        "Analyse des risques fonciers",
        "Rapports détaillés"
      ],
      href: "/solutions/banques",
      previewHref: "/solutions/banques/apercu",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Promoteurs Immobiliers",
      icon: Building,
      description: "Identifiez des opportunités et gérez vos projets de développement.",
      features: [
        "Recherche de terrains viabilisés",
        "Analyse de faisabilité",
        "Suivi de projets",
        "Gestion des équipes"
      ],
      href: "/solutions/promoteurs",
      previewHref: "/solutions/promoteurs/apercu",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Investisseurs",
      icon: TrendingUp,
      description: "Suivez votre portefeuille et détectez les meilleures opportunités.",
      features: [
        "Dashboard de performance",
        "Alertes d'opportunités",
        "Analyse ROI",
        "Diversification conseillée"
      ],
      href: "/solutions/investisseurs",
      previewHref: "/solutions/investisseurs/apercu",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Mairies & Collectivités",
      icon: Landmark,
      description: "Gérez le cadastre et les permis de votre commune efficacement.",
      features: [
        "Gestion cadastrale digitale",
        "Suivi des permis",
        "Base de données centralisée",
        "Reporting automatique"
      ],
      href: "/login?role=Mairie",
      previewHref: "/solutions/mairies/apercu",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      title: "Notaires",
      icon: Scale,
      description: "Authentifiez les actes et consultez les archives juridiques.",
      features: [
        "Vérification d'authenticité",
        "Archives numérisées",
        "Processus dématérialisé",
        "Sécurité renforcée"
      ],
      href: "/login?role=Notaire",
      previewHref: "/solutions/notaires/apercu",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      title: "Particuliers",
      icon: Users,
      description: "Trouvez et achetez le terrain de vos rêves en toute sécurité.",
      features: [
        "Recherche personnalisée",
        "Vérification complète",
        "Accompagnement juridique",
        "Financement facilité"
      ],
      href: "/parcelles",
      previewHref: "/register",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            Solutions pour Tous les Acteurs
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Une Plateforme, Tous les Métiers
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez comment Teranga Foncier révolutionne chaque métier de l'immobilier 
            avec des solutions sur-mesure pour chaque acteur du secteur.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${role.bgColor}`}>
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <CardHeader className="relative">
                    <div className={`w-14 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-7 w-7 ${role.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-gray-900 transition-colors">
                      {role.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {role.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Buttons */}
                    <div className="space-y-3">
                      <Button 
                        asChild 
                        className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 text-white border-0`}
                      >
                        <Link to={role.previewHref}>
                          Voir l'Aperçu
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full group-hover:border-gray-300">
                        <Link to={role.href}>
                          En Savoir Plus
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à Rejoindre l'Écosystème ?
            </h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Que vous soyez professionnel ou particulier, Teranga Foncier a la solution 
              adaptée à vos besoins. Créez votre compte et découvrez toutes nos fonctionnalités.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/register">
                  Créer Mon Compte
                  <Users className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/contact">
                  Demander une Démo
                  <FileText className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default RolesOverviewSection;
