﻿import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search,
  Clock, 
  Users,
  Star,
  Download,
  Play,
  CheckCircle,
  Eye,
  Heart,
  Filter,
  TrendingUp,
  Award,
  MessageCircle
} from 'lucide-react';

const GuidesTutorielsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tous les guides', count: 24 },
    { id: 'achat', name: 'Achat de terrain', count: 8 },
    { id: 'vente', name: 'Vente de propriÃ©tÃ©', count: 6 },
    { id: 'juridique', name: 'Aspects juridiques', count: 5 },
    { id: 'financement', name: 'Financement', count: 5 }
  ];

  const guidesPopulaires = [
    {
      id: 1,
      title: "Guide complet pour acheter un terrain au SÃ©nÃ©gal",
      description: "Tout ce qu'il faut savoir pour acheter un terrain en toute sÃ©curitÃ©",
      type: "Guide PDF",
      category: "achat",
      duree: "30 min",
      niveau: "DÃ©butant",
      vues: 15420,
      likes: 1250,
      rating: 4.8,
      image: "/api/YOUR_API_KEY/300/200",
      tags: ["Terrain", "Achat", "SÃ©curitÃ©", "Documents"],
      author: "Me Fatou Diallo",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "VÃ©rification des documents fonciers : Check-list complÃ¨te",
      description: "Comment vÃ©rifier l'authenticitÃ© et la validitÃ© des documents",
      type: "VidÃ©o Tutorial",
      category: "juridique",
      duree: "25 min",
      niveau: "IntermÃ©diaire",
      vues: 12800,
      likes: 980,
      rating: 4.9,
      image: "/api/YOUR_API_KEY/300/200",
      tags: ["Documents", "VÃ©rification", "SÃ©curitÃ©"],
      author: "Dr Moussa Sow",
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "Financement immobilier : Options et stratÃ©gies",
      description: "DÃ©couvrez toutes les options de financement disponibles",
      type: "Guide PDF",
      category: "financement",
      duree: "45 min",
      niveau: "AvancÃ©",
      vues: 9650,
      likes: 720,
      rating: 4.7,
      image: "/api/YOUR_API_KEY/300/200",
      tags: ["Financement", "Banques", "CrÃ©dit"],
      author: "Amadou Ba",
      date: "2024-01-05"
    },
    {
      id: 4,
      title: "NÃ©gociation immobiliÃ¨re : Techniques et conseils",
      description: "MaÃ®trisez l'art de la nÃ©gociation pour obtenir le meilleur prix",
      type: "SÃ©rie VidÃ©o",
      category: "achat",
      duree: "60 min",
      niveau: "IntermÃ©diaire",
      vues: 8900,
      likes: 650,
      rating: 4.6,
      image: "/api/YOUR_API_KEY/300/200",
      tags: ["NÃ©gociation", "Prix", "StratÃ©gie"],
      author: "AÃ¯cha Ndoye",
      date: "2023-12-28"
    },
    {
      id: 5,
      title: "ProcÃ©dures d'immatriculation pas Ã  pas",
      description: "Guide dÃ©taillÃ© pour immatriculer votre terrain",
      type: "Guide Interactif",
      category: "juridique",
      duree: "40 min",
      niveau: "DÃ©butant",
      vues: 11200,
      likes: 890,
      rating: 4.8,
      image: "/api/YOUR_API_KEY/300/200",
      tags: ["Immatriculation", "ProcÃ©dures", "Administration"],
      author: "Service Juridique",
      date: "2023-12-20"
    },
    {
      id: 6,
      title: "Vendre rapidement : Marketing et prÃ©sentation",
      description: "Techniques pour vendre votre propriÃ©tÃ© dans les meilleurs dÃ©lais",
      type: "Webinar",
      category: "vente",
      duree: "35 min",
      niveau: "IntermÃ©diaire",
      vues: 7800,
      likes: 520,
      rating: 4.5,
      image: "/api/YOUR_API_KEY/300/200",
      tags: ["Vente", "Marketing", "PrÃ©sentation"],
      author: "Khadija Tall",
      date: "2023-12-15"
    }
  ];

  const tutorielsVideo = [
    {
      title: "Comment utiliser la plateforme Teranga Foncier",
      duree: "12 min",
      vues: 25600,
      type: "Tutorial de base"
    },
    {
      title: "Recherche avancÃ©e de terrains",
      duree: "8 min",
      vues: 18900,
      type: "FonctionnalitÃ©"
    },
    {
      title: "SystÃ¨me de paiement intelligent",
      duree: "15 min",
      vues: 14200,
      type: "FonctionnalitÃ©"
    },
    {
      title: "VÃ©rification blockchain des documents",
      duree: "10 min",
      vues: 11800,
      type: "Technologie"
    }
  ];

  const filteredGuides = guidesPopulaires.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Guide PDF': return FileText;
      case 'VidÃ©o Tutorial': return Video;
      case 'SÃ©rie VidÃ©o': return Video;
      case 'Guide Interactif': return BookOpen;
      case 'Webinar': return Video;
      default: return FileText;
    }
  };

  const getNiveauColor = (niveau) => {
    switch(niveau) {
      case 'DÃ©butant': return 'green';
      case 'IntermÃ©diaire': return 'orange';
      case 'AvancÃ©': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24">
      <Helmet>
        <title>Guides et Tutoriels - Apprenez l'Immobilier | Teranga Foncier</title>
        <meta name="description" content="Guides complets, tutoriels vidÃ©o et ressources pour maÃ®triser l'immobilier au SÃ©nÃ©gal. Formation gratuite par des experts." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-green-100 text-green-700">
            ðŸ“š Centre d'Apprentissage
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Guides & Tutoriels
            <span className="block text-green-600">Immobiliers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            MaÃ®trisez tous les aspects de l'immobilier sÃ©nÃ©galais avec nos guides experts, 
            tutoriels vidÃ©o et formations pratiques.
          </p>
        </motion.div>

        {/* Recherche et Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    YOUR_API_KEY="Rechercher un guide ou tutorial..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap"
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-gray-600">Guides Complets</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">16</div>
              <div className="text-sm text-gray-600">Tutoriels VidÃ©o</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">8.5K</div>
              <div className="text-sm text-gray-600">Apprenants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm text-gray-600">Note Moyenne</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guides Populaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Guides Populaires</h2>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              {filteredGuides.length} rÃ©sultat(s)
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide, index) => {
              const TypeIcon = getTypeIcon(guide.type);
              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <div className="relative">
                      <img 
                        src={guide.image} 
                        alt={guide.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white text-gray-800">
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {guide.type}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className={`bg-white text-${getNiveauColor(guide.niveau)}-600`}>
                          {guide.niveau}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{guide.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guide.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {guide.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {guide.duree}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {guide.vues.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(guide.rating) ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{guide.rating}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Heart className="w-4 h-4 mr-1" />
                          {guide.likes}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        Par {guide.author} â€¢ {new Date(guide.date).toLocaleDateString('fr-FR')}
                      </div>

                      <Button className="w-full">
                        {guide.type.includes('VidÃ©o') ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Regarder
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            TÃ©lÃ©charger
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tutoriels VidÃ©o */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Tutoriels VidÃ©o de la Plateforme</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tutorielsVideo.map((tutorial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                        <Video className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{tutorial.title}</h3>
                        <Badge variant="outline" className="text-xs">{tutorial.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {tutorial.duree}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {tutorial.vues.toLocaleString()} vues
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Regarder le Tutoriel
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Formation PersonnalisÃ©e */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Award className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">Formation PersonnalisÃ©e</h2>
                  </div>
                  <p className="text-green-100 mb-4">
                    BÃ©nÃ©ficiez d'un accompagnement personnalisÃ© avec nos experts pour 
                    maÃ®triser parfaitement tous les aspects de l'immobilier sÃ©nÃ©galais.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Session 1-Ã -1 avec un expert</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Plan de formation sur mesure</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Suivi personnalisÃ©</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 mb-4">
                    Demander une Formation
                    <MessageCircle className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-sm text-green-200">PremiÃ¨re consultation gratuite</p>
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
              <h2 className="text-2xl font-bold mb-4">Contribuez Ã  la CommunautÃ©</h2>
              <p className="text-gray-600 mb-6">
                Partagez votre expertise et aidez d'autres utilisateurs en crÃ©ant vos propres guides
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <BookOpen className="mr-2 h-4 w-4" />
                  CrÃ©er un Guide
                </Button>
                <Button size="lg" variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Proposer un Tutoriel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GuidesTutorielsPage;
