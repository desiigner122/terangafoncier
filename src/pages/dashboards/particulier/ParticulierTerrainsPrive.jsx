import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  DollarSign,
  Filter,
  Search,
  Plus,
  Heart,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import PropertyService from '@/services/PropertyService';
import ParticulierSupabaseService from '@/services/ParticulierSupabaseService';

const ParticulierTerrainsPrive = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [loading, setLoading] = useState(true);

  // Terrains privés = catalogue réel (properties actives/vérifiées) — table `properties`
  const [terrains, setTerrains] = useState([]);
  // Favoris réels de l'utilisateur — table `favorites` (map property_id -> favorite.id)
  const [favorites, setFavorites] = useState({});
  const [favBusy, setFavBusy] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [propsRes, favRes] = await Promise.all([
        PropertyService.getProperties({ verifiedOnly: true }),
        user?.id ? ParticulierSupabaseService.getFavorites(user.id) : Promise.resolve({ success: true, data: [] })
      ]);

      if (propsRes.success) {
        setTerrains(propsRes.properties || []);
      }

      if (favRes.success) {
        const map = {};
        (favRes.data || []).forEach((f) => {
          if (f.property?.id) map[f.property.id] = f.id;
        });
        setFavorites(map);
      }
    } catch (error) {
      console.error('Erreur chargement terrains privés:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleFavorite = async (propertyId) => {
    if (!user?.id) {
      toast.error('Connectez-vous pour gérer vos favoris');
      return;
    }
    setFavBusy(propertyId);
    try {
      const existing = favorites[propertyId];
      if (existing) {
        const res = await ParticulierSupabaseService.removeFavorite(existing);
        if (res.success) {
          setFavorites((prev) => {
            const next = { ...prev };
            delete next[propertyId];
            return next;
          });
          toast.success('Retiré des favoris');
        } else {
          toast.error('Impossible de retirer le favori');
        }
      } else {
        const res = await ParticulierSupabaseService.addFavorite(user.id, propertyId);
        if (res.success) {
          setFavorites((prev) => ({ ...prev, [propertyId]: res.data.id }));
          toast.success('Ajouté aux favoris');
        } else {
          toast.error("Impossible d'ajouter aux favoris");
        }
      }
    } finally {
      setFavBusy(null);
    }
  };

  const getStatutLabel = (status) => {
    switch (status) {
      case 'active': return 'Disponible';
      case 'reserved': return 'Réservé';
      case 'pending': return 'En cours';
      case 'sold': return 'Vendu';
      default: return status || 'Disponible';
    }
  };

  const getStatutColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sold': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return null;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getLocation = (t) =>
    t.location || [t.city, t.region].filter(Boolean).join(', ') || 'Localisation non précisée';

  // Types réellement présents dans le catalogue (pour le filtre)
  const availableTypes = Array.from(
    new Set(terrains.map((t) => t.type).filter(Boolean))
  );

  const filteredTerrains = terrains.filter((t) => {
    const title = (t.title || t.name || '').toLowerCase();
    const location = getLocation(t).toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch = title.includes(term) || location.includes(term);
    const matchesFilter = filterType === 'tous' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Statistiques dérivées de données réelles (aucun chiffre fabriqué)
  const prices = terrains.map((t) => Number(t.price)).filter((p) => p > 0);
  const statsTerrains = {
    total: terrains.length,
    verifies: terrains.filter((t) => t.verification_status === 'verified').length,
    favoris: Object.keys(favorites).length,
    prixMoyen: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
  };

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
            Catalogue des terrains privés vérifiés disponibles à l'achat
          </p>
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
                <p className="text-sm font-medium text-blue-600">Terrains Disponibles</p>
                <p className="text-2xl font-bold text-blue-900">{statsTerrains.total}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Vérifiés</p>
                <p className="text-2xl font-bold text-green-900">{statsTerrains.verifies}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Mes Favoris</p>
                <p className="text-2xl font-bold text-red-900">{statsTerrains.favoris}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Prix Moyen</p>
                <p className="text-lg font-bold text-purple-900">
                  {statsTerrains.prixMoyen
                    ? formatPrice(statsTerrains.prixMoyen).replace('XOF', 'FCFA')
                    : '—'}
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
            <option value="tous">Tous les types</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Liste des terrains */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          className="space-y-4"
        >
          {filteredTerrains.map((terrain) => {
            const isFav = Boolean(favorites[terrain.id]);
            const priceLabel = formatPrice(terrain.price);
            return (
              <Card key={terrain.id} className="hover:shadow-lg transition-all duration-200">
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
                              {terrain.title || terrain.name || 'Terrain privé'}
                            </h3>
                            {terrain.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{terrain.description}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {getLocation(terrain)}
                              </div>
                              {terrain.surface && (
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  {Number(terrain.surface).toLocaleString('fr-FR')} m²
                                </div>
                              )}
                              {priceLabel && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {priceLabel.replace('XOF', 'FCFA')}
                                </div>
                              )}
                            </div>
                          </div>

                          <Badge className={`${getStatutColor(terrain.status)} whitespace-nowrap`}>
                            {getStatutLabel(terrain.status)}
                          </Badge>
                        </div>

                        {/* Type + vérification (données réelles) */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {terrain.type && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200">
                              {terrain.type}
                            </span>
                          )}
                          {terrain.verification_status === 'verified' && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-200 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Vérifié
                            </span>
                          )}
                          {terrain.region && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-md border border-gray-200">
                              {terrain.region}
                            </span>
                          )}
                        </div>

                        {/* Métadonnées réelles */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {typeof terrain.views_count === 'number' && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {terrain.views_count} vues
                            </span>
                          )}
                          {terrain.created_at && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(terrain.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          )}
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
                      <Button
                        variant={isFav ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleFavorite(terrain.id)}
                        disabled={favBusy === terrain.id}
                        className={isFav ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                      >
                        {favBusy === terrain.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Heart className={`w-4 h-4 mr-1 ${isFav ? 'fill-current' : ''}`} />
                        )}
                        {isFav ? 'Favori' : 'Favoris'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredTerrains.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun terrain trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== 'tous'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Aucun terrain privé vérifié n\'est disponible pour le moment'}
              </p>
              {(searchTerm || filterType !== 'tous') && (
                <Button
                  variant="outline"
                  onClick={() => { setSearchTerm(''); setFilterType('tous'); }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ParticulierTerrainsPrive;
