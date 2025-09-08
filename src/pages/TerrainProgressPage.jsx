import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  MapPin, 
  ArrowRight, 
  Phone, 
  Shield, 
  Database,
  Lock,
  AlertTriangle,
  Home,
  Calendar,
  Download,
  Eye,
  Building,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TerrainProgressPage = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: Database,
      title: "Suivi Blockchain",
      description: "Chaque étape de votre demande enregistrée sur blockchain pour transparence totale.",
      isNew: true
    },
    {
      icon: FileText,
      title: "Documents Vérifiés",
      description: "Validation automatique et sécurisée de tous vos documents."
    },
    {
      icon: Users,
      title: "Commission Dédiée",
      description: "Suivi par une commission municipale spécialisée."
    },
    {
      icon: Lock,
      title: "Processus Sécurisé",
      description: "Protection contre la corruption et les passe-droits.",
      isNew: true
    },
    {
      icon: Clock,
      title: "Délais Transparents",
      description: "Suivi des étapes avec dates prévisionnelles actualisées."
    },
    {
      icon: Shield,
      title: "Garantie Légale",
      description: "Respect strict des procédures et de la réglementation."
    }
  ];

  const progressSteps = [
    {
      step: 1,
      title: "Dépôt de la demande",
      description: "Soumission du dossier complet avec tous les documents requis",
      status: "completed",
      date: "15 Jan 2024",
      details: [
        "Formulaire de demande rempli",
        "Pièce d'identité validée",
        "Justificatifs de revenus vérifiés",
        "Certificat de résidence fourni"
      ]
    },
    {
      step: 2,
      title: "Examen de recevabilité",
      description: "Vérification des critères d'éligibilité par les services municipaux",
      status: "completed",
      date: "22 Jan 2024",
      details: [
        "Vérification des conditions de revenus",
        "Contrôle de la résidence dans la commune",
        "Validation de l'absence d'autres propriétés",
        "Dossier déclaré recevable"
      ]
    },
    {
      step: 3,
      title: "Étude technique",
      description: "Analyse de la faisabilité et évaluation du terrain demandé",
      status: "in-progress",
      date: "En cours",
      details: [
        "Visite technique du terrain programmée",
        "Étude de viabilisation en cours",
        "Vérification des contraintes urbanistiques",
        "Rapport technique en préparation"
      ]
    },
    {
      step: 4,
      title: "Passage en commission",
      description: "Examen du dossier par la commission d'attribution",
      status: "pending",
      date: "Prévu le 15 Fév 2024",
      details: [
        "Convocation de la commission d'attribution",
        "Présentation du dossier technique",
        "Délibération sur l'attribution",
        "Décision finale de la commission"
      ]
    },
    {
      step: 5,
      title: "Notification et formalités",
      description: "Communication de la décision et finalisation des démarches",
      status: "pending",
      date: "Après décision",
      details: [
        "Notification officielle de la décision",
        "Signature du contrat d'attribution",
        "Paiement des frais de dossier",
        "Remise des documents définitifs"
      ]
    }
  ];

  const mockRequest = {
    id: 'REQ-2024-001',
    type: 'Attribution terrain communal',
    municipality: 'Commune de Guédiawaye',
    location: 'Zone résidentielle Nord',
    area: '300m²',
    status: 'En cours d\'examen',
    submittedDate: '15 Janvier 2024',
    currentStep: 3,
    totalSteps: 5,
    progress: 60,
    estimatedCompletion: '15 Mars 2024'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="w-6 h-6 text-gray-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

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
            🏠 Demande de Terrain Communal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Évolution de Votre Demande
            <span className="block text-primary">de Terrain Communal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Suivez chaque étape de votre demande d'attribution de terrain communal 
            avec notre système de suivi intelligent et transparent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate('/parcelles-communales')}>
              Parcourir les Terrains Disponibles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/municipal-land-request')}>
              <Plus className="mr-2 h-5 w-5" />
              Faire une Nouvelle Demande
            </Button>
          </div>
        </motion.div>

        {/* Statut actuel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-4">
                    <Building className="w-8 h-8 mr-3" />
                    <div>
                      <h2 className="text-2xl font-bold">Demande {mockRequest.id}</h2>
                      <p className="text-blue-100">{mockRequest.municipality}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-blue-100">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{mockRequest.location} - {mockRequest.area}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Soumise le {mockRequest.submittedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Finalisation prévue: {mockRequest.estimatedCompletion}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{mockRequest.progress}%</div>
                  <div className="text-xl mb-4">Progression globale</div>
                  <Progress value={mockRequest.progress} className="mb-4 bg-blue-800" />
                  <div className="text-blue-100">
                    Étape {mockRequest.currentStep} sur {mockRequest.totalSteps}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progression détaillée */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Progression Détaillée</h2>
          <div className="relative">
            {/* Ligne de progression */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-8">
              {progressSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative flex items-start"
                >
                  {/* Icône d'étape */}
                  <div className={`flex-shrink-0 w-16 h-16 ${getStatusColor(step.status)} rounded-full flex items-center justify-center relative z-10`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : step.status === 'in-progress' ? (
                      <Clock className="w-8 h-8 text-white animate-pulse" />
                    ) : (
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    )}
                  </div>

                  {/* Contenu */}
                  <Card className={`ml-8 flex-grow ${step.status === 'in-progress' ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                        <Badge variant={step.status === 'completed' ? 'default' : step.status === 'in-progress' ? 'secondary' : 'outline'}>
                          {step.date}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center text-sm">
                            {step.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : step.status === 'in-progress' ? (
                              <Clock className="w-4 h-4 text-blue-500 mr-2" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                            )}
                            <span className={step.status === 'pending' ? 'text-gray-500' : ''}>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate('/parcelles-communales')}>
              <Home className="mr-2 h-5 w-5" />
              Voir Terrains Disponibles
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/municipal-land-request')}>
              <Download className="mr-2 h-5 w-5" />
              Télécharger le Dossier
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Phone className="mr-2 h-5 w-5" />
              Contacter la Mairie
            </Button>
          </div>
          
          <div className="text-center">
            <a href="/municipal-requests" className="text-primary hover:underline">
              ← Retour à toutes mes demandes
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TerrainProgressPage;
