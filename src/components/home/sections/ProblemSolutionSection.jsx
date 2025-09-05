import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  MapPin, 
  FileSearch, 
  Clock,
  Users,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const problems = [
  {
    icon: AlertTriangle,
    title: "Fraude Foncière",
    description: "Plus de 60% des conflits fonciers au Sénégal sont dus à des fraudes et faux titres",
    stats: "60% des conflits",
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    icon: Clock,
    title: "Délais Interminables",
    description: "Les démarches traditionnelles prennent 18 à 36 mois avec de multiples intermédiaires",
    stats: "18-36 mois",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    icon: FileSearch,
    title: "Information Fragmentée",
    description: "Difficile d'obtenir des informations fiables sur les terrains et leur statut juridique",
    stats: "Sources dispersées",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    icon: Globe,
    title: "Diaspora Exclue",
    description: "Les Sénégalais de l'étranger peinent à investir faute de solutions adaptées",
    stats: "3M+ diaspora",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  }
];

const solutions = [
  {
    icon: Shield,
    title: "Vérification Blockchain",
    description: "Chaque terrain est vérifié via blockchain avec notaires et géomètres certifiés",
    benefit: "100% sécurisé",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: CheckCircle,
    title: "Processus Simplifié",
    description: "Achat en 7-14 jours avec accompagnement juridique complet",
    benefit: "10x plus rapide",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: MapPin,
    title: "Plateforme Unifiée",
    description: "Toutes les informations centralisées : cadastre, prix, documents légaux",
    benefit: "Source unique",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    icon: Users,
    title: "Solution Diaspora",
    description: "Investissement et construction à distance avec suivi temps réel",
    benefit: "Accessible 24/7",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  }
];

const ProblemSolutionSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <AlertTriangle className="h-4 w-4" />
            Problèmes majeurs du secteur foncier
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Révolutionner l'Immobilier
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              au Sénégal
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Teranga Foncier résout les défis majeurs du secteur foncier sénégalais grâce à 
            la technologie blockchain et un écosystème d'experts certifiés.
          </motion.p>
        </div>

        {/* Problems Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Les Défis Actuels</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Le secteur foncier sénégalais fait face à des défis majeurs qui freinent les investissements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-red-100 hover:border-red-200 transition-colors">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${problem.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                      <problem.icon className={`h-6 w-6 ${problem.color}`} />
                    </div>
                    <Badge variant="secondary" className="mb-3 text-xs bg-red-100 text-red-700">
                      {problem.stats}
                    </Badge>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {problem.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Solutions Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4" />
              Nos Solutions Innovantes
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Comment Nous Résolvons Ces Défis</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Technologie de pointe et expertise locale pour sécuriser vos investissements fonciers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-green-100 hover:border-green-200 transition-colors">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${solution.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                      <solution.icon className={`h-6 w-6 ${solution.color}`} />
                    </div>
                    <Badge variant="secondary" className="mb-3 text-xs bg-green-100 text-green-700">
                      {solution.benefit}
                    </Badge>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {solution.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {solution.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">
                Prêt à Révolutionner Votre Investissement Foncier ?
              </h4>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Rejoignez des milliers d'investisseurs qui font confiance à Teranga Foncier 
                pour leurs projets immobiliers au Sénégal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-50"
                >
                  Découvrir nos terrains
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  Parler à un expert
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default ProblemSolutionSection;
