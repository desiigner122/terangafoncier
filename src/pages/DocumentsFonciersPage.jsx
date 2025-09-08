import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  Download, 
  Clock, 
  Users,
  AlertTriangle,
  Info,
  Bookmark,
  Database,
  Lock,
  Globe
} from 'lucide-react';

const DocumentsFonciersPage = () => {
  const documentsTypes = [
    {
      title: "Titre Foncier (TF)",
      description: "Document officiel qui atteste de la propriété d'un terrain immatriculé",
      icon: FileText,
      color: "blue",
      importance: "Essentiel",
      details: [
        "Délivré par la Conservation Foncière",
        "Garantit la propriété exclusive",
        "Incontestable et définitif",
        "Numéroté et géolocalisé"
      ]
    },
    {
      title: "Délibération",
      description: "Acte par lequel une collectivité locale attribue un terrain communal",
      icon: Users,
      color: "green",
      importance: "Obligatoire",
      details: [
        "Émise par le Conseil Municipal",
        "Autorise l'occupation du terrain",
        "Précède l'immatriculation",
        "Valable 2 ans renouvelables"
      ]
    },
    {
      title: "Bail Emphytéotique",
      description: "Contrat de location de très longue durée (18-99 ans)",
      icon: Clock,
      color: "purple",
      importance: "Spécifique",
      details: [
        "Durée minimale de 18 ans",
        "Droit de construire inclus",
        "Transmissible aux héritiers",
        "Redevance annuelle symbolique"
      ]
    },
    {
      title: "Acte de Vente Notarié",
      description: "Document authentique établi par un notaire pour les transactions",
      icon: Shield,
      color: "orange",
      importance: "Sécurisé",
      details: [
        "Authentifié par un notaire",
        "Force exécutoire immédiate",
        "Publié au Bureau des Hypothèques",
        "Opposable aux tiers"
      ]
    }
  ];

  const processusImmatriculation = [
    {
      step: 1,
      title: "Demande d'Immatriculation",
      description: "Dépôt du dossier au Service de la Conservation Foncière",
      documents: ["Plan topographique", "Bornage contradictoire", "Justificatifs d'occupation"]
    },
    {
      step: 2,
      title: "Enquête Administrative",
      description: "Vérification de la régularité de l'occupation",
      documents: ["Enquête de commodo", "Avis des services techniques", "Consultation des riverains"]
    },
    {
      step: 3,
      title: "Décision d'Immatriculation",
      description: "Délivrance du titre foncier définitif",
      documents: ["Titre foncier numéroté", "Plan cadastral", "Fiche signalétique"]
    }
  ];

  const documentsComplementaires = [
    {
      name: "Certificat d'Urbanisme",
      usage: "Construction et aménagement",
      duree: "2 ans",
      delivrant: "Mairie ou Services Techniques"
    },
    {
      name: "Permis de Construire",
      usage: "Autorisation de construire",
      duree: "3 ans",
      delivrant: "Mairie compétente"
    },
    {
      name: "Certificat de Conformité",
      usage: "Réception des travaux",
      duree: "Permanent",
      delivrant: "Services Techniques"
    },
    {
      name: "Attestation de Non-Gage",
      usage: "Vérification des hypothèques",
      duree: "3 mois",
      delivrant: "Bureau des Hypothèques"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-24">
      <Helmet>
        <title>Documents Fonciers - Guide Complet | Teranga Foncier</title>
        <meta name="description" content="Comprendre les documents fonciers au Sénégal : titre foncier, délibération, bail, processus d'immatriculation et documents complémentaires." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-700">
            📋 Documentation Foncière
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Guide des Documents
            <span className="block text-blue-600">Fonciers au Sénégal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Tout savoir sur les documents fonciers, leur importance juridique 
            et les procédures d'obtention pour sécuriser vos transactions immobilières.
          </p>
        </motion.div>

        {/* Types de Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Types de Documents Fonciers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {documentsTypes.map((doc, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-${doc.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                        <doc.icon className={`w-6 h-6 text-${doc.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{doc.title}</CardTitle>
                        <Badge variant="outline" className={`text-${doc.color}-600 border-${doc.color}-200`}>
                          {doc.importance}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{doc.description}</p>
                  <div className="space-y-2">
                    {doc.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Processus d'Immatriculation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Processus d'Immatriculation</h2>
          <div className="relative">
            {/* Ligne de progression */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block"></div>
            
            <div className="space-y-8">
              {processusImmatriculation.map((step, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Numéro d'étape */}
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center relative z-10">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>

                  {/* Contenu */}
                  <Card className="ml-8 flex-grow">
                    <CardHeader>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <p className="text-gray-600">{step.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-2">
                        {step.documents.map((doc, docIndex) => (
                          <div key={docIndex} className="flex items-center text-sm bg-blue-50 p-2 rounded">
                            <FileText className="w-4 h-4 text-blue-600 mr-2" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Documents Complémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Documents Complémentaires</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {documentsComplementaires.map((doc, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{doc.name}</h3>
                    <Badge variant="outline">{doc.duree}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Bookmark className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-gray-600">Usage: {doc.usage}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-gray-600">Délivrant: {doc.delivrant}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Section Blockchain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Database className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">Vérification Blockchain</h2>
                  </div>
                  <p className="text-blue-100 mb-4">
                    Teranga Foncier révolutionne la gestion des documents fonciers avec la blockchain. 
                    Tous les documents sont vérifiés, horodatés et stockés de manière immuable.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Immutabilité garantie</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="text-sm">Vérification automatique</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <span className="text-sm">Accès 24h/7j</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Vérifier un Document
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Besoin d'Aide ?</h2>
              <p className="text-gray-600 mb-6">
                Nos experts sont là pour vous accompagner dans vos démarches foncières
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Consulter un Expert
                </Button>
                <Button size="lg" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentsFonciersPage;
