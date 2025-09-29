import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2,
  MapPin,
  Eye,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Phone,
  Mail,
  Star,
  Filter,
  Search,
  Plus,
  Heart,
  Share2,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierTerrainsPrive = ({ dashboardStats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [activeTab, setActiveTab] = useState('demandes');

  // Demandes d'achat de terrains privés
  const [demandesTerrains] = useState([
    {
      id: 'DTP-2024-001',
      titre: 'Terrain Résidentiel - Almadies',
      proprietaire: 'Société SENEGAL IMMOBILIER',
      superficie: '500m²',
      prix: 75000000, // 75M FCFA
      localisation: 'Almadies, Dakar',
      statut: 'Négociation',
      dateOffre: '2024-01-15',
      dernierContact: '2024-01-28',
      progression: 60,
      description: 'Terrain viabilisé avec vue sur mer, idéal pour villa haut standing',
      caracteristiques: ['Viabilisé', 'Vue mer', 'Titre foncier', 'Accès goudronné'],
      contact: {
        nom: 'Amadou DIALLO',
        telephone: '+221 77 123 45 67',
        email: 'a.diallo@senegalimmobilier.sn'
      },
      documents: ['Titre foncier', 'Plan de bornage', 'Certificat viabilisation'],
      prochainEtape: 'Visite avec géomètre',
      echeance: '2024-02-10'
    },
    {
      id: 'DTP-2024-002',
      titre: 'Terrain Commercial - Plateau',
      proprietaire: 'M. Cheikh NDIAYE',
      superficie: '800m²',
      prix: 120000000, // 120M FCFA
      localisation: 'Plateau, Dakar',
      statut: 'En attente réponse',
      dateOffre: '2024-01-20',
      dernierContact: '2024-01-25',
      progression: 30,
      description: 'Terrain commercial au cœur du Plateau, parfait pour immeuble',
      caracteristiques: ['Zone commerciale', 'Proche métro', 'Services publics', 'Parking'],
      contact: {
        nom: 'Cheikh NDIAYE',
        telephone: '+221 76 987 65 43',
        email: 'cheikh.ndiaye@gmail.com'
      },
      documents: ['Titre foncier', 'Autorisation commerciale'],
      prochainEtape: 'Réponse propriétaire',
      echeance: '2024-02-05'
    },
    {
      id: 'DTP-2024-003',
      titre: 'Terrain Agricole - Thiès',
      proprietaire: 'Coopérative BOKK JËKK',
      superficie: '2000m²',
      prix: 25000000, // 25M FCFA
      localisation: 'Thiès, Thiès',
      statut: 'Approuvé',
      dateOffre: '2024-01-10',
      dernierContact: '2024-01-30',
      progression: 90,
      description: 'Grand terrain agricole fertile, idéal pour projet agro-pastoral',
      caracteristiques: ['Sol fertile', 'Point d\'eau', 'Accès route', 'Électricité proche'],
      contact: {
        nom: 'Fatou SARR',
        telephone: '+221 78 234 56 78',
        email: 'fatou.sarr@bokkjekk.sn'
      },
      documents: ['Titre foncier', 'Étude sol', 'Autorisation agricole'],
      prochainEtape: 'Signature acte',
      echeance: '2024-02-08'
    }
  ]);

  // Statistiques des demandes
  const statsTerrains = {
    totalDemandes: demandesTerrains.length,
    enNegociation: demandesTerrains.filter(d => d.statut === 'Négociation').length,
    approuvees: demandesTerrains.filter(d => d.statut === 'Approuvé').length,
    enAttente: demandesTerrains.filter(d => d.statut === 'En attente réponse').length,
    budgetTotal: demandesTerrains.reduce((sum, d) => sum + d.prix, 0)
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Approuvé': return 'bg-green-100 text-green-800 border-green-200';
      case 'Négociation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En attente réponse': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressionColor = (progression) => {
    if (progression >= 80) return 'text-green-600';
    if (progression >= 50) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredDemandes = demandesTerrains.filter(demande => {
    const matchesSearch = demande.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.localisation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'tous' || demande.statut === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Terrains Privés</h1>
          <p className="text-gray-600 mt-2">
            Demandes d'achat et négociations de terrains privés
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Demandes</p>
                <p className="text-2xl font-bold text-blue-900">{statsTerrains.totalDemandes}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">En Négociation</p>
                <p className="text-2xl font-bold text-yellow-900">{statsTerrains.enNegociation}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approuvées</p>
                <p className="text-2xl font-bold text-green-900">{statsTerrains.approuvees}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Budget Total</p>
                <p className="text-lg font-bold text-purple-900">
                  {formatPrice(statsTerrains.budgetTotal).replace('XOF', 'FCFA')}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtres et Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher par titre, localisation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="tous">Tous les statuts</option>
            <option value="Négociation">En négociation</option>
            <option value="Approuvé">Approuvé</option>
            <option value="En attente réponse">En attente</option>
          </select>
        </div>
      </motion.div>

      {/* Liste des demandes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        className="space-y-4"
      >
        {filteredDemandes.map((demande, index) => (
          <Card key={demande.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {demande.titre}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{demande.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {demande.localisation}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {demande.superficie}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatPrice(demande.prix).replace('XOF', 'FCFA')}
                          </div>
                        </div>
                      </div>
                      
                      <Badge className={`${getStatutColor(demande.statut)} whitespace-nowrap`}>
                        {demande.statut}
                      </Badge>
                    </div>

                    {/* Caractéristiques */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {demande.caracteristiques.map((carac, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
                        >
                          {carac}
                        </span>
                      ))}
                    </div>

                    {/* Progression */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progression</span>
                        <span className={`text-sm font-bold ${getProgressionColor(demande.progression)}`}>
                          {demande.progression}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            demande.progression >= 80 ? 'bg-green-500' :
                            demande.progression >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${demande.progression}%` }}
                        />
                      </div>
                    </div>

                    {/* Prochaine étape */}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Prochaine étape:</span>
                      <span className="font-medium text-blue-600">{demande.prochainEtape}</span>
                      <span className="text-gray-500">({demande.echeance})</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-1" />
                    Favoris
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {filteredDemandes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune demande trouvée
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterType !== 'tous' 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Vous n\'avez pas encore fait de demande d\'achat de terrain privé'
            }
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Créer une nouvelle demande
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ParticulierTerrainsPrive;