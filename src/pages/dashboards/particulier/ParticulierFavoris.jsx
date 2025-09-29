import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart,
  FileText,
  Building2,
  MapPin,
  Eye,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Star,
  Trash2,
  Plus,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const ParticulierFavoris = ({ dashboardStats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [activeTab, setActiveTab] = useState('tous');

  // Éléments marqués comme favoris - TERRAINS PRIVÉS, ZONES COMMUNALES, PROJETS PROMOTEURS
  const [favoris] = useState([
    // Terrains privés favoris
    {
      id: 'TP-2024-001',
      type: 'terrain_prive',
      libelle: 'Terrain Résidentiel - Almadies',
      proprietaire: 'Société SÉNÉGAL IMMOBILIER',
      superficie: '500m²',
      prix: 75000000,
      localisation: 'Almadies, Dakar',
      statut: 'Disponible',
      dateAjoutFavori: '2024-01-20',
      description: 'Terrain viabilisé avec vue sur mer, idéal pour villa de standing',
      caracteristiques: ['Viabilisé', 'Vue mer', 'Titre foncier', 'Accès bitumé'],
      icon: Building2,
      color: 'blue'
    },
    {
      id: 'TP-2024-002',
      type: 'terrain_prive',
      libelle: 'Terrain Commercial - Plateau',
      proprietaire: 'IMMOBILIER DU PLATEAU SARL',
      superficie: '300m²',
      prix: 120000000,
      localisation: 'Plateau, Dakar',
      statut: 'Disponible',
      dateAjoutFavori: '2024-02-05',
      description: 'Terrain commercial en plein centre-ville, très bien situé',
      caracteristiques: ['Commercial', 'Centre-ville', 'Fort passage', 'Transport'],
      icon: Building2,
      color: 'blue'
    },
    
    // Zones communales favorites
    {
      id: 'ZC-2024-001',
      type: 'zone_communale',
      libelle: 'Zone d\'Extension Urbaine - Rufisque',
      commune: 'Rufisque',
      superficie: '400m²',
      prix: 8000000,
      statut: 'Lots disponibles',
      dateAjoutFavori: '2024-01-18',
      description: 'Zone résidentielle en développement avec toutes commodités',
      caracteristiques: ['Résidentielle', 'Proche commodités', 'Transport', 'École'],
      lotsDisponibles: 15,
      icon: MapPin,
      color: 'green'
    },
    {
      id: 'ZC-2024-002',
      type: 'zone_communale',
      libelle: 'Zone Mixte - Pikine Nord',
      commune: 'Pikine',
      superficie: '350m²',
      prix: 6500000,
      statut: 'En attribution',
      dateAjoutFavori: '2024-02-10',
      description: 'Zone mixte permettant habitation et commerce de proximité',
      caracteristiques: ['Mixte', 'Commerce autorisé', 'Desserte', 'Marché proche'],
      lotsDisponibles: 8,
      icon: MapPin,
      color: 'green'
    },
    
    // Projets promoteurs favoris
    {
      id: 'PP-2024-001',
      type: 'projet_promoteur',
      libelle: 'Villa Moderne - Cité Keur Gorgui',
      promoteur: 'TERANGA DEVELOPMENT',
      superficie: '250m²',
      prix: 45000000,
      localisation: 'Cité Keur Gorgui, Dakar',
      statut: 'En construction',
      dateAjoutFavori: '2024-01-22',
      description: 'Villa R+1 moderne avec finitions haut de gamme',
      caracteristiques: ['3 chambres', 'Salon', 'Cuisine équipée', 'Jardin', 'Garage'],
      progression: 65,
      dateLivraison: '2024-06-30',
      icon: Award,
      color: 'purple'
    },
    {
      id: 'PP-2024-002',
      type: 'projet_promoteur',
      libelle: 'Résidence Les Palmiers - Almadies',
      promoteur: 'SÉNÉGAL HABITAT',
      superficie: '180m²',
      prix: 38000000,
      localisation: 'Almadies, Dakar',
      statut: 'Pré-commercialisation',
      dateAjoutFavori: '2024-02-15',
      description: 'Appartement F4 dans résidence sécurisée avec piscine',
      caracteristiques: ['F4', '2 salles de bain', 'Balcon', 'Piscine', 'Sécurité 24h'],
      progression: 20,
      dateLivraison: '2024-12-31',
      icon: Award,
      color: 'purple'
    }
  ]);

  const getStatusColor = (statut) => {
    const colors = {
      'En instruction': 'bg-blue-100 text-blue-800',
      'Documents manquants': 'bg-orange-100 text-orange-800',
      'Pré-sélectionné': 'bg-yellow-100 text-yellow-800',
      'Accepté': 'bg-green-100 text-green-800',
      'Approuvé': 'bg-green-100 text-green-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getPrioriteColor = (priorite) => {
    const colors = {
      'Élevée': 'bg-red-100 text-red-800',
      'Normale': 'bg-blue-100 text-blue-800',
      'Faible': 'bg-gray-100 text-gray-800'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'terrain_prive': 'Terrain Privé',
      'zone_communale': 'Zone Communale',
      'projet_promoteur': 'Projet Promoteur'
    };
    return labels[type] || type;
  };

  const filteredDossiers = favoris.filter(dossier => {
    const matchesSearch = dossier.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'tous' || dossier.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const DossierFavoriCard = ({ dossier }) => {
    const IconComponent = dossier.icon;

    return (
      <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-red-400">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-lg bg-${dossier.color}-100`}>
                <IconComponent className={`w-5 h-5 text-${dossier.color}-600`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(dossier.type)}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{dossier.libelle}</h3>
                
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  {dossier.commune && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {dossier.commune}
                    </div>
                  )}
                  {dossier.adresse && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {dossier.adresse}
                    </div>
                  )}
                  {dossier.localisation && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {dossier.localisation}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {dossier.id}
                    </span>
                    {dossier.superficie && <span>{dossier.superficie}</span>}
                    {dossier.typeLogement && <span>{dossier.typeLogement}</span>}
                  </div>
                  {dossier.promoteur && (
                    <div className="font-medium text-blue-600">{dossier.promoteur}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(dossier.statut)}>
                {dossier.statut}
              </Badge>
              {dossier.priorite && (
                <Badge className={getPrioriteColor(dossier.priorite)} variant="outline">
                  {dossier.priorite}
                </Badge>
              )}
            </div>
          </div>

          {/* Progression */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression</span>
              <span>{dossier.progression}%</span>
            </div>
            <Progress value={dossier.progression} className="h-2" />
          </div>

          {/* Prochaine étape */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Prochaine étape:</span>
            <span>{dossier.prochainEtape}</span>
          </div>

          {/* Échéance */}
          {dossier.echeance && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Échéance:</span>
              <span>{dossier.echeance}</span>
            </div>
          )}

          {dossier.dateAcceptation && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium">Accepté le:</span>
              <span>{dossier.dateAcceptation}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xs text-gray-500">
              Ajouté aux favoris le {dossier.dateAjoutFavori}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Voir
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Contact
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500" />
          Mes Dossiers Favoris
        </h1>
        <p className="text-gray-600">
          Retrouvez rapidement vos dossiers administratifs les plus importants
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {favoris.length}
            </div>
            <div className="text-sm text-gray-600">Total favoris</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {favoris.filter(d => d.type === 'terrain_prive').length}
            </div>
            <div className="text-sm text-gray-600">Demandes terrains</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {favoris.filter(d => d.type === 'projet_promoteur').length}
            </div>
            <div className="text-sm text-gray-600">Permis construire</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {favoris.filter(d => d.type === 'zone_communale').length}
            </div>
            <div className="text-sm text-gray-600">Candidatures</div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans vos favoris..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'tous' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('tous')}
          >
            Tous
          </Button>
          <Button
            variant={filterType === 'terrain_prive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('terrain_prive')}
          >
            Terrains Privés
          </Button>
          <Button
            variant={filterType === 'zone_communale' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('zone_communale')}
          >
            Zones Communales
          </Button>
          <Button
            variant={filterType === 'projet_promoteur' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('projet_promoteur')}
          >
            Projets Promoteurs
          </Button>
        </div>
      </div>

      {/* Liste des dossiers favoris */}
      <div className="space-y-4">
        {filteredDossiers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun dossier favori trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Aucun résultat pour votre recherche' : 'Vous n\'avez pas encore de dossiers favoris'}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un favori
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDossiers.map((dossier) => (
            <DossierFavoriCard key={dossier.id} dossier={dossier} />
          ))
        )}
      </div>
    </div>
  );
};

export default ParticulierFavoris;