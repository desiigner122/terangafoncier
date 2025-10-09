import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart,
  Building2,
  MapPin,
  Eye,
  Loader2,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const ParticulierFavoris = () => {
  // Hooks - toujours dans le même ordre
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favoris, setFavoris] = useState([]);

  // Extraction du user après tous les hooks
  const { user } = outletContext || {};

  // Effect après tous les hooks de state
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
      // Simulation de chargement pour l'instant
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données mockées pour éviter les erreurs Supabase
      setFavoris([
        {
          id: 1,
          type: 'terrain_prive',
          libelle: 'Terrain résidentiel Almadies',
          superficie: '500m²',
          prix: 85000000,
          localisation: 'Almadies, Dakar',
          statut: 'Disponible'
        },
        {
          id: 2,
          type: 'zone_communale',
          libelle: 'Zone résidentielle Guédiawaye',
          superficie: '300m²',
          prix: 45000000,
          localisation: 'Guédiawaye',
          statut: 'Disponible'
        }
      ]);
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vérification du contexte après tous les hooks
  if (!outletContext) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Chargement du contexte...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Chargement des favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Favoris</h1>
          <p className="text-gray-600 mt-1">Gérez vos propriétés favorites</p>
        </div>
        <Badge variant="secondary" className="bg-red-50 text-red-700">
          {favoris.length} favori{favoris.length !== 1 ? 's' : ''}
        </Badge>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher dans vos favoris..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Favoris Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {favoris.map((favori, index) => (
          <motion.div
            key={favori.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {favori.type === 'terrain_prive' ? (
                        <Building2 className="h-4 w-4 text-blue-600" />
                      ) : (
                        <MapPin className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {favori.statut}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{favori.libelle}</CardTitle>
                <CardDescription className="flex items-center space-x-4 text-sm">
                  <span>{favori.superficie}</span>
                  <span>{(favori.prix / 1000000).toFixed(1)}M FCFA</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {favori.localisation}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {favoris.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun favori</h3>
          <p className="text-gray-600 mb-4">Vous n'avez pas encore ajouté de propriétés à vos favoris</p>
          <Button onClick={() => navigate('/acheteur/recherche')}>
            Parcourir les propriétés
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ParticulierFavoris;