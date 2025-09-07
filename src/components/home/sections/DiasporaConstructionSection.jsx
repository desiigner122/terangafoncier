import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  BarChart3, 
  Clock, 
  Shield, 
  Users, 
  Upload,
  FileCheck,
  MessageSquare,
  MapPin,
  Building,
  ArrowRight,
  CheckCircle,
  Image,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ConstructionProgressBar from '@/components/home/ConstructionProgressBar';
import SimpleProgressTracker from '@/components/home/SimpleProgressTracker';

const DiasporaConstructionSection = () => {
  const diasporaFeatures = [
    {
      icon: BarChart3,
      title: "Barre de Progression",
      description: "Suivez chaque étape avec des barres de progression mises à jour par le promoteur",
      details: ["Progression en temps réel", "Phases détaillées", "Validation des étapes"]
    },
    {
      icon: Upload,
      title: "Preuves Visuelles",
      description: "Images et vidéos quotidiennes uploadées directement par le promoteur",
      details: ["Photos avant/après", "Vidéos d'avancement", "Rapports illustrés"]
    },
    {
      icon: MessageSquare,
      title: "Communication Directe",
      description: "Chat direct avec votre promoteur et l'équipe de construction",
      details: ["Messages instantanés", "Appels vidéo programmés", "Support multilingue"]
    }
  ];

  const constructionSteps = [
    {
      step: "01",
      title: "Achat Terrain",
      description: "Achetez votre terrain vérifié depuis l'étranger",
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      step: "02", 
      title: "Choix Promoteur",
      description: "Sélectionnez un promoteur certifié sur notre plateforme",
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      step: "03",
      title: "Suivi par Progression",
      description: "Suivez la construction avec des barres de progression et preuves visuelles",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      step: "04",
      title: "Réception",
      description: "Réceptionnez votre bien achevé à distance",
      icon: Building,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-emerald-100 text-emerald-700 mb-4 text-lg px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              Spécial Diaspora
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Construisez au Sénégal Depuis N'importe Où
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              La première plateforme permettant à la diaspora sénégalaise de construire 
              en temps réel avec une transparence totale et un contrôle à distance.
            </p>
          </motion.div>
        </div>

        {/* Statistiques Diaspora */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { value: "40%", label: "De la diaspora renonce", desc: "À cause des risques" },
            { value: "6M", label: "Sénégalais à l'étranger", desc: "Marché potentiel énorme" },
            { value: "100%", label: "Transparence garantie", desc: "Sur notre plateforme" },
            { value: "24/7", label: "Mises à jour", desc: "Par les promoteurs" }
          ].map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.desc}</div>
            </Card>
          ))}
        </motion.div>

        {/* Fonctionnalités Diaspora */}
        <div className="mb-16">
          <motion.h3 
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            🌍 Contrôlez Votre Projet à Distance
          </motion.h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {diasporaFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Processus de Construction */}
        <div className="mb-16">
          <motion.h3 
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            🏗️ Processus de Construction Supervisée
          </motion.h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {constructionSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-t-4 border-t-primary">
                  <CardContent className="p-6 text-center">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {step.step}
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 mt-2`}>
                      <step.icon className={`h-6 w-6 ${step.color}`} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Exemple de Suivi Simplifié */}
        <div className="mb-16">
          <motion.h3 
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            📊 Suivi Simplifié de Construction
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <SimpleProgressTracker />
          </motion.div>
        </div>

        {/* Video Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white text-center mb-16"
        >
          <h3 className="text-2xl font-bold mb-4">
            Voyez Comment Ça Marche
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Découvrez en vidéo comment nos clients de la diaspora gèrent leurs projets 
            de construction depuis l'étranger.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Regarder la Démo (3 min)
          </Button>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à Commencer Votre Projet ?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines de membres de la diaspora qui construisent déjà 
            en toute sérénité avec Teranga Foncier.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="/diaspora">
                Commencer Mon Projet
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/promoteurs">
                Trouver un Promoteur
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DiasporaConstructionSection;
