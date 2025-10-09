import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ParticulierRechercheTerrain = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recherche de Terrain</h1>
          <p className="text-gray-600 mt-2">Explorez notre marketplace de terrains disponibles</p>
        </div>
      </motion.div>

      {/* Redirection Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Marketplace Teranga Foncier</CardTitle>
                <CardDescription className="text-base">
                  Accédez à notre plateforme complète de recherche de terrains
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Carte Interactive</h3>
                  <p className="text-sm text-gray-600">Visualisez tous les terrains sur une carte</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Search className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Filtres Avancés</h3>
                  <p className="text-sm text-gray-600">Prix, superficie, ville, type de terrain</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <ArrowRight className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Actions Rapides</h3>
                  <p className="text-sm text-gray-600">Favoris, offres, visites en un clic</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <ArrowRight className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Zones Communales</h3>
                  <p className="text-sm text-gray-600">Terrains municipaux disponibles</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/terrain-marketplace')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Search className="h-5 w-5 mr-2" />
                Accéder à la Marketplace
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/zones-communales')}
                className="border-2 border-green-500 text-green-700 hover:bg-green-50"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Zones Communales
              </Button>
            </div>

            {/* Info */}
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                💡 <strong>Astuce :</strong> Les terrains que vous ajouterez en favoris apparaîtront automatiquement 
                dans votre section "Mes Favoris" pour un suivi facile.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParticulierRechercheTerrain;
