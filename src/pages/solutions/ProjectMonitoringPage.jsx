import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Camera, 
  Clock, 
  Bell, 
  FileText, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Play, 
  Download, 
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectMonitoringPage = () => {
  const features = [
    {
      icon: Camera,
      title: "Photos HD Quotidiennes",
      description: "Images haute définition de votre chantier chaque jour."
    },
    {
      icon: Video,
      title: "Visites Virtuelles",
      description: "Tours vidéo immersifs de l'avancement des travaux."
    },
    {
      icon: Bell,
      title: "Alertes Temps Réel",
      description: "Notifications instantanées des étapes importantes."
    },
    {
      icon: FileText,
      title: "Rapports Détaillés",
      description: "FileTexts techniques et financiers réguliers."
    }
  ];

  const monitoringTools = [
    "Caméras de surveillance installées",
    "Application mobile dédiée",
    "Rapports hebdomadaires automatiques",
    "Validation d'étapes par QR code",
    "Géolocalisation des équipes",
    "Suivi budgétaire en temps réel"
  ];

  const testimonial = {
    text: "Grâce au suivi en temps réel, j'ai pu surveiller ma construction depuis Paris. Les rapports quotidiens m'ont donné une tranquillité d'esprit totale.",
    author: "Aminata Diop",
    location: "Paris, France",
    project: "Villa 4 pièces à Almadies"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-24">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700">
            📹 Suivi Projet Live
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Surveillez Vos Travaux
            <span className="block text-purple-600">en Temps Réel</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gardez un œil sur votre projet de construction 24h/24 avec notre système 
            de monitoring avancé conçu pour la diaspora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-purple-600 hover:bg-purple-700">
              <Play className="mr-2 h-5 w-5" />
              Voir Démo Live
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
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Monitoring Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          <div>
            <h2 className="text-2xl font-bold mb-6">Outils de Surveillance</h2>
            <div className="space-y-3">
              {monitoringTools.map((tool, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">{tool}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <Video className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Interface de Monitoring</h3>
              <p className="text-sm text-gray-600 mb-4">
                Dashboard intuitif pour suivre votre projet en temps réel
              </p>
              <Button size="sm" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Voir l'Interface
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl italic mb-4">"{testimonial.text}"</blockquote>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-purple-200">{testimonial.location}</div>
                <div className="text-sm text-purple-300">{testimonial.project}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">Tarification Transparente</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <div className="text-2xl font-bold">500K FCFA</div>
                <div className="text-sm text-gray-500">Par projet</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Photos quotidiennes</li>
                  <li>• Rapports hebdomadaires</li>
                  <li>• Support email</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-purple-200 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                Populaire
              </Badge>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <div className="text-2xl font-bold">850K FCFA</div>
                <div className="text-sm text-gray-500">Par projet</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Tout du Basic</li>
                  <li>• Visites vidéo</li>
                  <li>• Alertes temps réel</li>
                  <li>• Support téléphonique</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-2xl font-bold">1.2M FCFA</div>
                <div className="text-sm text-gray-500">Par projet</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Tout du Premium</li>
                  <li>• Caméras de surveillance</li>
                  <li>• Coordinateur dédié</li>
                  <li>• Reporting personnalisé</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Prêt à Surveiller Votre Projet ?</h2>
            <p className="mb-6 opacity-90">
              Commencez le suivi professionnel de votre construction dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Play className="mr-2 h-5 w-5" />
                Démarrer le Suivi
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Download className="mr-2 h-5 w-5" />
                Télécharger l'App
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectMonitoringPage;
