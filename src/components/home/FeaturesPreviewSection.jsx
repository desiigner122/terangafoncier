import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Hammer, Eye, Camera, Blocks, Brain, Shield, Users, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const FeaturesPreviewSection = () => {
  const projectsPreview = [
    {
      id: 1,
      title: "Résidence Almadies Premium",
      promoter: "SOGERIM Construction",
      location: "Almadies, Dakar",
      price: "125M FCFA",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      progress: 75,
      status: "En construction",
      type: "Villa moderne",
      isNFT: true
    },
    {
      id: 2,
      title: "Complexe Les Palmiers",
      promoter: "Delta Construction",
      location: "Saly, Mbour", 
      price: "85M FCFA",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      progress: 45,
      status: "Démarrage",
      type: "Appartements",
      isNFT: true
    },
    {
      id: 3,
      title: "Villas Teranga",
      promoter: "Immobilier Plus",
      location: "Toubab Dialaw",
      price: "95M FCFA", 
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      progress: 90,
      status: "Finition",
      type: "Villa familiale",
      isNFT: true
    }
  ];

  const requestsPreview = [
    {
      id: 1,
      type: "Villa Moderne",
      budget: "180M FCFA",
      location: "Almadies",
      deadline: "12 mois",
      status: "Recherche promoteur",
      matches: 3,
      icon: Building2
    },
    {
      id: 2,
      type: "Immeuble R+4",
      budget: "850M FCFA", 
      location: "Plateau",
      deadline: "18 mois",
      status: "Propositions reçues",
      matches: 5,
      icon: Building2
    },
    {
      id: 3,
      type: "Centre Commercial",
      budget: "2.5Md FCFA",
      location: "Pikine",
      deadline: "24 mois", 
      status: "En négociation",
      matches: 2,
      icon: Building2
    }
  ];

  const platformFeatures = [
    {
      icon: Blocks,
      title: "NFT Propriétés",
      description: "Chaque bien tokenisé sur blockchain Ethereum",
      stats: "2,847 NFT créés",
      color: "from-blue-500 to-purple-500",
      href: "/nft-properties"
    },
    {
      icon: Brain,
      title: "IA de Surveillance",
      description: "Suivi construction par satellite et IA",
      stats: "97.8% précision",
      color: "from-emerald-500 to-teal-500", 
      href: "/guide-projets"
    },
    {
      icon: Shield,
      title: "Smart Contracts",
      description: "Paiements automatisés et sécurisés",
      stats: "892 contrats actifs",
      color: "from-purple-500 to-pink-500",
      href: "/smart-contracts"
    },
    {
      icon: Users,
      title: "Matching IA",
      description: "Connexion intelligente clients-promoteurs",
      stats: "98% satisfaction",
      color: "from-orange-500 to-red-500",
      href: "/guide-demandes"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Projets Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Projets Construction <span className="text-blue-600">Blockchain</span>
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez les projets immobiliers avec suivi IA et NFT
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/promoters-projects">
                Voir tous les projets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectsPreview.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      {project.isNFT && (
                        <Badge className="bg-purple-600 text-white">
                          <Blocks className="w-3 h-3 mr-1" />
                          NFT
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        <Camera className="w-3 h-3 mr-1" />
                        IA
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{project.promoter}</p>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.location}
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        {project.price}
                      </span>
                      <Badge variant={project.status === "En construction" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demandes Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Demandes de <span className="text-emerald-600">Construction</span>
              </h2>
              <p className="text-xl text-gray-600">
                Trouvez le promoteur idéal avec notre IA de matching
              </p>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/promoter-requests">
                Faire une demande
                <Hammer className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {requestsPreview.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <request.icon className="w-8 h-8 text-emerald-600" />
                      <Badge variant="outline" className="text-emerald-600">
                        {request.matches} matchs
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{request.type}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-semibold">{request.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Localisation:</span>
                        <span className="font-semibold">{request.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Délai:</span>
                        <span className="font-semibold">{request.deadline}</span>
                      </div>
                      <div className="pt-2">
                        <Badge className="w-full justify-center bg-emerald-100 text-emerald-800">
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités <span className="text-purple-600">Innovantes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme révolutionnaire qui combine blockchain, IA et immobilier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={feature.href}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color} mb-4`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-3">{feature.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {feature.stats}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesPreviewSection;
