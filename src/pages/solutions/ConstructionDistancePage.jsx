import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Camera, 
  Video, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Shield, 
  FileText, 
  Hammer, 
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ConstructionDistancePage = () => {
  const features = [
    {
      icon: Camera,
      title: "Suivi Photo Quotidien",
      description: "Photos haute qualité de l'avancement des travaux chaque jour."
    },
    {
      icon: Video,
      title: "Rapports Vidéo",
      description: "Visites virtuelles hebdomadaires de votre chantier."
    },
    {
      icon: Clock,
      title: "Planning en Temps Réel",
      description: "Suivi des étapes avec dates prévisionnelles actualisées."
    },
    {
      icon: Users,
      title: "Équipe Dédiée",
      description: "Coordinateur local et équipe technique à votre service."
    }
  ];

  const steps = [
    "Définition du projet et budget",
    "Sélection terrain et permis",
    "Choix architecte et entreprises",
    "Suivi construction à distance",
    "Réception et livraison clés"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-24">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            🏗️ Construction à Distance
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Construisez Votre Maison
            <span className="block text-primary">Depuis l'Étranger</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Pilotez votre projet de construction au Sénégal depuis n'importe où dans le monde 
            avec un suivi professionnel en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Démarrer Mon Projet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Phone className="mr-2 h-5 w-5" />
              Consultation Gratuite
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Processus Simple en 5 Étapes</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Prêt à Commencer ?</h2>
            <p className="mb-6 opacity-90">
              Contactez nos experts pour une consultation gratuite sur votre projet.
            </p>
            <Button size="lg" variant="secondary">
              Consultation Gratuite
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ConstructionDistancePage;
