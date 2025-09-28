import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Star,
  Eye,
  Heart,
  Phone,
  Mail,
  Filter,
  Search,
  TrendingUp,
  CheckCircle,
  Clock,
  Info,
  Download,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierPromoteurs = () => {
  const [activeTab, setActiveTab] = useState('projets');
  const [filtreType, setFiltreType] = useState('');
  const [filtreBudget, setFiltreBudget] = useState('');

  // Projets de promoteurs disponibles
  const projetsPromoteurs = [
    {
      id: 'PP001',
      nom: 'Résidence Les Almadies',
      promoteur: 'SAHEL Immobilier',
      localisation: 'Ngor-Almadies, Dakar',
      type: 'Résidentiel',
      unites: 45,
      unitesDisponibles: 12,
      prixMin: '35,000,000',
      prixMax: '65,000,000',
      livraison: '2025-12-01',
      avancement: 75,
      rating: 4.8,
      image: '/api/placeholder/400/300',
      services: ['Piscine', 'Sécurité 24h', 'Parking', 'Jardin'],
      description: 'Projet résidentiel haut standing avec vue sur mer'
    },
    {
      id: 'PP002',
      nom: 'Village Teranga',
      promoteur: 'SODIDA Construction',
      localisation: 'Diamniadio, Dakar',
      type: 'Résidentiel',
      unites: 120,
      unitesDisponibles: 67,
      prixMin: '18,000,000',
      prixMax: '45,000,000',
      livraison: '2026-06-01',
      avancement: 40,
      rating: 4.5,
      image: '/api/placeholder/400/300',
      services: ['École', 'Centre commercial', 'Transport', 'Hôpital'],
      description: 'Village moderne avec toutes commodités intégrées'
    },
    {
      id: 'PP003',
      nom: 'Centre Business Dakar',
      promoteur: 'Meridien Group',
      localisation: 'Plateau, Dakar',
      type: 'Commercial',
      unites: 28,
      unitesDisponibles: 5,
      prixMin: '55,000,000',
      prixMax: '120,000,000',
      livraison: '2025-09-01',
      avancement: 85,
      rating: 4.9,
      image: '/api/placeholder/400/300',
      services: ['Fibre optique', 'Climatisation', 'Ascenseurs', 'Parking'],
      description: 'Centre d\'affaires moderne au cœur de Dakar'
    }
  ];

  // Mes candidatures/réservations
  const mesCandidatures = [
    {
      id: 'MC001',
      projet: 'Résidence Les Almadies',
      unite: 'Villa V12 - 4 chambres',
      prix: '52,000,000 CFA',
      statut: 'en_attente',
      dateCandidature: '2024-09-20',
      rang: 3,
      totalCandidats: 15
    },
    {
      id: 'MC002',
      projet: 'Village Teranga',
      unite: 'Maison T3 - Lot 45',
      prix: '28,000,000 CFA',
      statut: 'accepte',
      dateCandidature: '2024-09-10',
      rang: 1,
      totalCandidats: 8
    }
  ];

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-500';
      case 'accepte': return 'bg-green-500';
      case 'refuse': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvancementColor = (avancement) => {
    if (avancement >= 80) return 'from-green-500 to-green-600';
    if (avancement >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projets Promoteurs</h1>
          <p className="text-gray-600">Découvrez et candidatez aux projets immobiliers des promoteurs partenaires</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <Building className="w-4 h-4 mr-2" />
          Mes Candidatures
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projets Actifs</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unités Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mes Candidatures</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux Acceptation</p>
                <p className="text-2xl font-bold text-gray-900">67%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projets">Projets Disponibles</TabsTrigger>
          <TabsTrigger value="candidatures">Mes Candidatures</TabsTrigger>
        </TabsList>

        {/* Projets Disponibles */}
        <TabsContent value="projets" className="space-y-4">
          {/* Filtres */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Rechercher un projet..." className="pl-10" />
            </div>
            <Select value={filtreType} onValueChange={setFiltreType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                <SelectItem value="residentiel">Résidentiel</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="mixte">Mixte</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtreBudget} onValueChange={setFiltreBudget}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous-budgets">Tous budgets</SelectItem>
                <SelectItem value="0-30M">0 - 30M CFA</SelectItem>
                <SelectItem value="30-60M">30 - 60M CFA</SelectItem>
                <SelectItem value="60M+">60M+ CFA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liste des projets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projetsPromoteurs.map((projet) => (
              <motion.div
                key={projet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
              >
                {/* Image du projet */}
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-900">
                      {projet.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button variant="outline" size="sm" className="bg-white/90">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 rounded-lg p-3">
                      <h3 className="font-bold text-white text-lg mb-1">{projet.nom}</h3>
                      <p className="text-white/90 text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {projet.localisation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Informations promoteur */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Promoteur</p>
                      <p className="font-medium text-gray-900">{projet.promoteur}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm font-medium">{projet.rating}</span>
                    </div>
                  </div>

                  {/* Prix et disponibilité */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Prix à partir de</p>
                      <p className="font-bold text-green-600">{projet.prixMin} CFA</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Disponible</p>
                      <p className="font-medium text-gray-900">{projet.unitesDisponibles}/{projet.unites} unités</p>
                    </div>
                  </div>

                  {/* Avancement */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Avancement</span>
                      <span className="font-medium">{projet.avancement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${getAvancementColor(projet.avancement)} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${projet.avancement}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Livraison */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    Livraison prévue: {new Date(projet.livraison).toLocaleDateString('fr-FR')}
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Services inclus:</p>
                    <div className="flex flex-wrap gap-1">
                      {projet.services?.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {projet.services?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{projet.services.length - 3} autres
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Building className="w-4 h-4 mr-2" />
                      Candidater
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Mes Candidatures */}
        <TabsContent value="candidatures" className="space-y-4">
          {mesCandidatures.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
                <p className="text-gray-600 mb-4">Vous n'avez pas encore postulé à des projets de promoteurs</p>
                <Button onClick={() => setActiveTab('projets')}>
                  Découvrir les projets
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mesCandidatures.map((candidature) => (
                <motion.div
                  key={candidature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{candidature.projet}</h3>
                      <p className="text-gray-600">{candidature.unite}</p>
                      <p className="text-sm text-gray-500">Réf: {candidature.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatutColor(candidature.statut)} text-white mb-2`}>
                        {candidature.statut === 'en_attente' && 'En attente'}
                        {candidature.statut === 'accepte' && 'Accepté'}
                        {candidature.statut === 'refuse' && 'Refusé'}
                      </Badge>
                      <p className="font-bold text-xl text-gray-900">{candidature.prix}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Candidature: {candidature.dateCandidature}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      Rang: {candidature.rang}/{candidature.totalCandidats}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {candidature.statut === 'accepte' ? 'Félicitations!' : 'En cours d\'évaluation'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir Détails
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Documents
                    </Button>
                    {candidature.statut === 'accepte' && (
                      <Button size="sm" className="bg-green-600 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Finaliser
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierPromoteurs;