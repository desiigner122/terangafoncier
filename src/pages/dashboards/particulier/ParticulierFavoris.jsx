import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
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
  Award,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierFavoris = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [favoris, setFavoris] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    properties: 0,
    zones: 0,
    projects: 0
  });

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      // Récupérer tous les favoris avec JOINs
      const { data: favoritesData, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          property_id,
          communal_zone_id,
          developer_project_id,
          property:properties (
            id, title, city, price, surface_area, address, images, status,
            owner:profiles!owner_id (id, full_name)
          ),
          zone:communal_zones (
            id, name, commune, zone_type, lot_size, price_per_lot, 
            lots_available, status, address
          ),
          project:developer_projects (
            id, title, developer_name, city, project_type, price_min, 
            price_max, available_units, status, images, estimated_completion
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformer les données pour le format de l'interface
      const transformedFavorites = favoritesData.map(fav => {
        if (fav.property_id && fav.property) {
          return {
            id: fav.id,
            favoriteId: fav.id,
            itemId: fav.property.id,
            type: 'terrain_prive',
            libelle: fav.property.title,
            proprietaire: fav.property.owner?.full_name || 'Propriétaire',
            superficie: fav.property.surface_area ? `${fav.property.surface_area}m²` : 'N/A',
            prix: fav.property.price,
            localisation: `${fav.property.city}${fav.property.address ? ', ' + fav.property.address : ''}`,
            statut: fav.property.status === 'available' ? 'Disponible' : 'Non disponible',
            dateAjoutFavori: new Date(fav.created_at).toLocaleDateString('fr-FR'),
            images: fav.property.images || [],
            icon: Building2,
            color: 'blue'
          };
        } else if (fav.communal_zone_id && fav.zone) {
          return {
            id: fav.id,
            favoriteId: fav.id,
            itemId: fav.zone.id,
            type: 'zone_communale',
            libelle: fav.zone.name,
            commune: fav.zone.commune,
            superficie: fav.zone.lot_size ? `${fav.zone.lot_size}m²` : 'N/A',
            prix: fav.zone.price_per_lot,
            statut: fav.zone.lots_available > 0 ? 'Lots disponibles' : 'Complet',
            dateAjoutFavori: new Date(fav.created_at).toLocaleDateString('fr-FR'),
            lotsDisponibles: fav.zone.lots_available,
            icon: MapPin,
            color: 'green'
          };
        } else if (fav.developer_project_id && fav.project) {
          return {
            id: fav.id,
            favoriteId: fav.id,
            itemId: fav.project.id,
            type: 'projet_promoteur',
            libelle: fav.project.title,
            promoteur: fav.project.developer_name,
            localisation: fav.project.city,
            prix: fav.project.price_min,
            prixMax: fav.project.price_max,
            statut: fav.project.status === 'active' ? 'En construction' : 'Pré-commercialisation',
            dateAjoutFavori: new Date(fav.created_at).toLocaleDateString('fr-FR'),
            unitsDisponibles: fav.project.available_units,
            dateLivraison: fav.project.estimated_completion,
            images: fav.project.images || [],
            icon: Award,
            color: 'purple'
          };
        }
        return null;
      }).filter(Boolean);

      setFavoris(transformedFavorites);

      // Calculer les statistiques
      setStats({
        total: transformedFavorites.length,
        properties: transformedFavorites.filter(f => f.type === 'terrain_prive').length,
        zones: transformedFavorites.filter(f => f.type === 'zone_communale').length,
        projects: transformedFavorites.filter(f => f.type === 'projet_promoteur').length
      });

    } catch (error) {
      console.error('Erreur chargement favoris:', error);
      toast.error('Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      toast.success('Retiré des favoris');
      loadFavorites(); // Recharger la liste
    } catch (error) {
      console.error('Erreur suppression favori:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleNavigateToItem = (favorite) => {
    if (favorite.type === 'terrain_prive') {
      navigate(`/proprietes/${favorite.itemId}`);
    } else if (favorite.type === 'zone_communale') {
      navigate('/acheteur/zones-communales');
    } else if (favorite.type === 'projet_promoteur') {
      navigate('/acheteur/promoteurs');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  const [favoris_mock_removed] = useState([
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
                         (dossier.id && dossier.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'tous' || dossier.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price) => {
    if (!price) return 'Prix non communiqué';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

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
                  {dossier.localisation && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {dossier.localisation}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {dossier.superficie && <span>Surface: {dossier.superficie}</span>}
                    {dossier.prix && <span className="font-semibold text-amber-600">{formatPrice(dossier.prix)}</span>}
                    {dossier.prixMax && dossier.prixMax !== dossier.prix && (
                      <span className="text-xs text-gray-500">à {formatPrice(dossier.prixMax)}</span>
                    )}
                  </div>
                  {dossier.proprietaire && (
                    <div className="font-medium text-blue-600">{dossier.proprietaire}</div>
                  )}
                  {dossier.promoteur && (
                    <div className="font-medium text-purple-600">{dossier.promoteur}</div>
                  )}
                  {dossier.lotsDisponibles !== undefined && (
                    <div className="text-green-600">{dossier.lotsDisponibles} lots disponibles</div>
                  )}
                  {dossier.unitsDisponibles !== undefined && (
                    <div className="text-green-600">{dossier.unitsDisponibles} unités disponibles</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(dossier.statut)}>
                {dossier.statut}
              </Badge>
            </div>
          </div>

          {dossier.dateLivraison && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Livraison prévue:</span>
              <span>{new Date(dossier.dateLivraison).toLocaleDateString('fr-FR')}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xs text-gray-500">
              Ajouté le {dossier.dateAjoutFavori}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleNavigateToItem(dossier)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Voir
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={() => handleRemoveFavorite(dossier.favoriteId)}
              >
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
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total favoris</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.properties}
            </div>
            <div className="text-sm text-gray-600">Terrains privés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.zones}
            </div>
            <div className="text-sm text-gray-600">Zones communales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.projects}
            </div>
            <div className="text-sm text-gray-600">Projets promoteurs</div>
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