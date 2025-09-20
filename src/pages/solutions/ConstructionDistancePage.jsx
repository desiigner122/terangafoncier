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
  TrendingUp,
  Database,
  Lock,
  Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ConstructionDistancePage = () => {
  const features = [
    {
      icon: Database,
      title: "Suivi Blockchain",
      description: "Chaque étape de construction enregistrée sur blockchain pour transparence totale.",
      isNew: true
    },
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
      icon: Lock,
      title: "Paiements Sécurisés",
      description: "Smart contracts pour déblocage automatique selon avancement.",
      isNew: true
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
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/solutions/construction-request">
                Démarrer Mon Projet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow relative">
              {feature.isNew && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 animate-pulse">
                    🆕 Nouveau
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${feature.isNew ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : 'bg-primary/10'} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.isNew ? 'text-orange-600' : 'text-primary'}`} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Section Blockchain pour Construction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-4">
                🚀 Construction Blockchain
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                Suivi <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Blockchain</span> de Construction
              </h2>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                Première plateforme au monde à intégrer la blockchain pour le suivi de construction à distance
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Database className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Progression Immutable</h3>
                <p className="text-indigo-100 mb-4">Chaque étape de construction est horodatée et enregistrée sur blockchain.</p>
                <ul className="space-y-2 text-sm text-indigo-200">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Photos géolocalisées et horodatées</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Impossible de falsifier l'avancement</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Audit trail complet et permanent</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Lock className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Paiements Automatisés</h3>
                <p className="text-indigo-100 mb-4">Smart contracts qui débloquent les paiements selon l'avancement réel.</p>
                <ul className="space-y-2 text-sm text-indigo-200">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Paiement conditionnel aux étapes</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Protection contre les retards</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Transparence totale des coûts</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">🎯 Révolution du Suivi Chantier</h3>
                  <p className="text-yellow-100">Fini les entreprises qui traînent ou gonflent les factures. La blockchain garantit un suivi honnête et transparent.</p>
                </div>
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 ml-4">
                  <Link to="/blockchain" className="flex items-center">
                    En Savoir Plus
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
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
