import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  FileText, 
  Clock, 
  CheckCircle, 
  Eye, 
  Users,
  Building,
  ArrowRight,
  Calendar,
  Euro,
  Shield,
  Award,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const CommunalLandSection = () => {
  const communalBenefits = [
    {
      icon: Euro,
      title: "Prix Accessibles",
      description: "Terrains communaux jusqu'à 70% moins chers que le marché privé",
      highlight: "Économies moyennes: 15M FCFA"
    },
    {
      icon: Shield,
      title: "Sécurité Juridique",
      description: "Titres fonciers délivrés directement par les autorités compétentes",
      highlight: "100% légal et sécurisé"
    },
    {
      icon: Eye,
      title: "Processus Transparent",
      description: "Suivi en temps réel de votre demande avec notre plateforme",
      highlight: "Transparence totale"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Dépôt de Demande",
      description: "Soumettez votre demande en ligne avec les documents requis",
      duration: "1 jour",
      icon: FileText,
      status: "active"
    },
    {
      step: 2,
      title: "Vérification",
      description: "La mairie vérifie votre éligibilité et vos documents",
      duration: "7-14 jours",
      icon: CheckCircle,
      status: "active"
    },
    {
      step: 3,
      title: "Attribution",
      description: "Attribution du terrain selon les critères de la commune",
      duration: "30-60 jours",
      icon: Award,
      status: "active"
    },
    {
      step: 4,
      title: "Formalisation",
      description: "Signature du contrat et obtention du titre foncier",
      duration: "15-30 jours",
      icon: Building,
      status: "active"
    }
  ];

  const availableCities = [
    {
      name: "Dakar",
      availablePlots: 45,
      averagePrice: "2.5M",
      processingTime: "2-3 mois",
      image: "/api/placeholder/300/200",
      status: "Disponible"
    },
    {
      name: "Thiès", 
      availablePlots: 78,
      averagePrice: "1.8M",
      processingTime: "2-4 mois",
      image: "/api/placeholder/300/200",
      status: "Disponible"
    },
    {
      name: "Saint-Louis",
      availablePlots: 32,
      averagePrice: "1.2M",
      processingTime: "1-2 mois",
      image: "/api/placeholder/300/200",
      status: "Disponible"
    },
    {
      name: "Mbour",
      availablePlots: 56,
      averagePrice: "2.1M",
      processingTime: "2-3 mois",
      image: "/api/placeholder/300/200",
      status: "Disponible"
    }
  ];

  const requirements = [
    "Carte d'identité nationale sénégalaise",
    "Justificatif de domicile",
    "Certificat de revenus",
    "Extrait de casier judiciaire",
    "Projet d'utilisation du terrain"
  ];

  const stats = [
    { value: "1,200+", label: "Demandes traitées", subtext: "Cette année" },
    { value: "89%", label: "Taux d'approbation", subtext: "Dossiers complets" },
    { value: "45 jours", label: "Délai moyen", subtext: "Traitement complet" },
    { value: "15M FCFA", label: "Économie moyenne", subtext: "vs marché privé" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-green-100 text-green-700 mb-4 text-lg px-4 py-2">
              <MapPin className="h-4 w-4 mr-2" />
              Terrains Communaux
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Accédez aux Terrains Communaux en Toute Transparence
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Notre plateforme révolutionne l'accès aux terrains communaux avec un processus 
              transparent, rapide et sécurisé. Obtenez votre terrain à prix social.
            </p>
          </motion.div>
        </div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
              <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.subtext}</div>
            </Card>
          ))}
        </motion.div>

        {/* Avantages */}
        <div className="mb-16">
          <motion.h3 
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            💰 Pourquoi Choisir les Terrains Communaux ?
          </motion.h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {communalBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-t-4 border-t-green-500">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h4>
                    <p className="text-gray-600 mb-4">{benefit.description}</p>
                    <Badge className="bg-green-100 text-green-700">
                      {benefit.highlight}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Processus */}
        <div className="mb-16">
          <motion.h3 
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            📋 Processus Simplifié
          </motion.h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-green-200 z-0">
                    <div className="h-full bg-green-500 w-3/4"></div>
                  </div>
                )}
                <Card className="relative z-10 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-sm font-bold text-green-600 mb-2">ÉTAPE {step.step}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.duration}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Villes Disponibles */}
        <div className="mb-16">
          <motion.h3 
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            🏙️ Villes Participantes
          </motion.h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableCities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-2 left-3 text-white">
                      <h4 className="font-bold text-lg">{city.name}</h4>
                      <Badge className="bg-green-500 text-white text-xs">
                        {city.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Parcelles:</span>
                        <span className="font-semibold">{city.availablePlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix moyen:</span>
                        <span className="font-semibold text-green-600">{city.averagePrice} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Délai:</span>
                        <span className="font-semibold">{city.processingTime}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm" variant="outline">
                      Voir les Offres
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Conditions d'Éligibilité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                📄 Documents Requis
              </h3>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                ⚡ Processus Accéléré
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-700">Dématérialisation complète</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">Suivi en temps réel</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Notifications automatiques</span>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm text-gray-600 mb-2">Progression moyenne</div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">75% plus rapide qu'avant</div>
              </div>
            </div>
          </div>
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
            Prêt à Faire Votre Demande ?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez les centaines de Sénégalais qui ont déjà obtenu leur terrain 
            communal grâce à notre plateforme transparente.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="/villes">
                Commencer Ma Demande
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/how-it-works">
                En Savoir Plus
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunalLandSection;
