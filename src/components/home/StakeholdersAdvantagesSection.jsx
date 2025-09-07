import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Landmark, Scale, Banknote, MapPin, Globe, Shield, Zap, Target, Award, CheckCircle, TrendingUp, Clock, Eye, Heart, Star, Briefcase, Home, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const StakeholdersAdvantagesSection = () => {
  // Parties prenantes de l'écosystème
  const stakeholders = [
    {
      title: "Particuliers & Diaspora",
      description: "Acheteurs et vendeurs individuels, y compris la diaspora sénégalaise",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      stats: "8,200+ utilisateurs",
      benefits: [
        "Achat à distance sécurisé",
        "Suivi construction en temps réel",
        "Paiements échelonnés blockchain",
        "Support multidevise"
      ],
      solutions: [
        "Visite virtuelle 360°",
        "Surveillance satellite IA",
        "Smart contracts automatisés",
        "Support 24/7 multilingue"
      ],
      href: "/solutions/particuliers"
    },
    {
      title: "Promoteurs & Constructeurs",
      description: "Entreprises de construction et développement immobilier",
      icon: Building2,
      color: "from-emerald-500 to-teal-500",
      stats: "45 promoteurs certifiés",
      benefits: [
        "Visibilité maximale projets",
        "Financement facilité",
        "Suivi automatisé chantiers",
        "Certification blockchain"
      ],
      solutions: [
        "Dashboard analytics avancé",
        "Outils marketing intégrés",
        "Suivi progression IA",
        "Réputation vérifiable"
      ],
      href: "/solutions/promoteurs"
    },
    {
      title: "Banques & Institutions",
      description: "Établissements financiers et organismes de crédit",
      icon: Banknote,
      color: "from-purple-500 to-pink-500",
      stats: "12 banques partenaires",
      benefits: [
        "Évaluation précise garanties",
        "Réduction risques crédit",
        "Automatisation processus",
        "Conformité réglementaire"
      ],
      solutions: [
        "Scoring blockchain propriétés",
        "API d'évaluation temps réel",
        "Rapports de risque IA",
        "Intégration système bancaire"
      ],
      href: "/solutions/banques"
    },
    {
      title: "Mairies & Collectivités",
      description: "Autorités locales et administrations territoriales",
      icon: Landmark,
      color: "from-orange-500 to-red-500",
      stats: "23 communes connectées",
      benefits: [
        "Gestion transparente terrains",
        "Augmentation revenus fonciers",
        "Réduction bureaucratie",
        "Traçabilité complète"
      ],
      solutions: [
        "Cadastre numérique blockchain",
        "Portail demandes en ligne",
        "Système de paiement intégré",
        "Tableau de bord analytique"
      ],
      href: "/solutions/mairies"
    },
    {
      title: "Notaires & Juristes",
      description: "Professionnels du droit et officiers publics",
      icon: Scale,
      color: "from-indigo-500 to-purple-500",
      stats: "34 notaires actifs",
      benefits: [
        "Actes authentifiés blockchain",
        "Processus dématérialisé",
        "Sécurité juridique renforcée",
        "Archivage permanent"
      ],
      solutions: [
        "Signature électronique sécurisée",
        "Contrats intelligents",
        "Vérification identité IA",
        "Coffre-fort numérique"
      ],
      href: "/solutions/notaires"
    },
    {
      title: "Agents & Géomètres",
      description: "Professionnels de l'immobilier et de la topographie",
      icon: MapPin,
      color: "from-teal-500 to-green-500",
      stats: "156 professionnels",
      benefits: [
        "Outils avancés cartographie",
        "Commissions transparentes",
        "Réseau clients élargi",
        "Certification compétences"
      ],
      solutions: [
        "Système CRM intégré",
        "Cartographie satellitaire",
        "Outils de prospection IA",
        "Formation continue"
      ],
      href: "/solutions/agents"
    }
  ];

  // Avantages clés de la plateforme
  const keyAdvantages = [
    {
      icon: Shield,
      title: "Sécurité Blockchain",
      description: "Chaque transaction est sécurisée et vérifiable sur la blockchain",
      stats: "100% des transactions sécurisées",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Intelligence Artificielle",
      description: "IA pour la détection de fraudes et le suivi de construction",
      stats: "97.8% de précision",
      color: "text-purple-600"
    },
    {
      icon: Globe,
      title: "Accès Global",
      description: "Plateforme accessible depuis 50+ pays pour la diaspora",
      stats: "50+ pays couverts",
      color: "text-green-600"
    },
    {
      icon: Clock,
      title: "Délais Réduits",
      description: "Processus accélérés grâce à l'automatisation",
      stats: "72h vs 3 mois traditionnels",
      color: "text-orange-600"
    },
    {
      icon: Target,
      title: "Transparence Totale",
      description: "Toutes les données sont vérifiables et traçables",
      stats: "0% d'opacité",
      color: "text-red-600"
    },
    {
      icon: Award,
      title: "Conformité Garantie",
      description: "Respect total de la réglementation sénégalaise",
      stats: "100% conforme",
      color: "text-indigo-600"
    }
  ];

  // Problèmes du marché traditionnel
  const traditionalProblems = [
    {
      problem: "Fraude foncière généralisée",
      impact: "Milliards de FCFA perdus annuellement",
      solution: "Blockchain NFT + Vérification IA",
      icon: Shield,
      color: "bg-red-50 border-red-200"
    },
    {
      problem: "Doubles ventes de terrains",
      impact: "Conflits juridiques sans fin",
      solution: "Smart contracts + Registre unique",
      icon: CheckCircle,
      color: "bg-orange-50 border-orange-200"
    },
    {
      problem: "Accès limité pour la diaspora",
      impact: "Opportunités d'investissement perdues",
      solution: "Plateforme globale + Support 24/7",
      icon: Globe,
      color: "bg-blue-50 border-blue-200"
    },
    {
      problem: "Processus lents et bureaucratiques",
      impact: "Délais de 3-6 mois pour transactions",
      solution: "Automatisation + Dématérialisation",
      icon: Clock,
      color: "bg-purple-50 border-purple-200"
    },
    {
      problem: "Manque de transparence",
      impact: "Méfiance et corruption",
      solution: "Blockchain publique + Auditabilité",
      icon: Eye,
      color: "bg-green-50 border-green-200"
    },
    {
      problem: "Suivi construction impossible",
      impact: "Retards et malfaçons",
      solution: "Surveillance satellite + IA",
      icon: Building2,
      color: "bg-yellow-50 border-yellow-200"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Parties prenantes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Écosystème <span className="text-blue-600">Complet</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme qui connecte tous les acteurs de l'immobilier sénégalais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stakeholders.map((stakeholder, index) => (
              <motion.div
                key={stakeholder.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader>
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${stakeholder.color} mb-4`}>
                      <stakeholder.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{stakeholder.title}</CardTitle>
                    <p className="text-gray-600">{stakeholder.description}</p>
                    <Badge variant="secondary" className="mt-2 w-fit">
                      {stakeholder.stats}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Bénéfices:</h4>
                        <ul className="space-y-1">
                          {stakeholder.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Solutions:</h4>
                        <ul className="space-y-1">
                          {stakeholder.solutions.map((solution, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button asChild className={`w-full bg-gradient-to-r ${stakeholder.color} text-white`}>
                        <Link to={stakeholder.href}>
                          Découvrir les solutions
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Avantages clés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Avantages <span className="text-green-600">Révolutionnaires</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pourquoi choisir notre plateforme blockchain pour l'immobilier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyAdvantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <advantage.icon className={`w-12 h-12 ${advantage.color} mx-auto mb-4`} />
                    <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                    <p className="text-gray-600 mb-4">{advantage.description}</p>
                    <Badge className={`${advantage.color.replace('text-', 'bg-').replace('-600', '-100')} ${advantage.color.replace('-600', '-700')} border-0`}>
                      {advantage.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Problèmes résolus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Problèmes <span className="text-red-600">Traditionnels</span> Résolus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comment notre technologie blockchain révolutionne le marché immobilier sénégalais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {traditionalProblems.map((item, index) => (
              <motion.div
                key={item.problem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`${item.color} border-2 hover:shadow-lg transition-shadow h-full`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <item.icon className="w-8 h-8 text-gray-700 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                          {item.problem}
                        </h3>
                        <p className="text-red-600 text-sm mb-3 font-medium">
                          Impact: {item.impact}
                        </p>
                        <div className="bg-white p-3 rounded-lg border">
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Notre solution:</strong>
                          </p>
                          <p className="text-green-700 font-medium">
                            {item.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez la Révolution Blockchain
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Découvrez comment notre plateforme peut transformer votre expérience immobilière
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/register">
                Créer un compte
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/how-it-works">
                Voir la démo
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StakeholdersAdvantagesSection;
