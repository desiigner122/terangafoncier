import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Map,
  MapPin,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Building2,
  Ruler
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AgentFoncierTerrains = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const terrains = [
    {
      id: 'TF-2024-001',
      nom: 'Terrain Almadies Vue Mer',
      superficie: '500 m²',
      valeur: '850M XOF',
      statut: 'évalué',
      proprietaire: 'M. Amadou Diallo',
      localisation: 'Almadies, Dakar',
      dateEvaluation: '15/09/2024',
      type: 'Résidentiel'
    },
    {
      id: 'TF-2024-002',
      nom: 'Parcelle Commerciale Rufisque',
      superficie: '1,200 m²',
      valeur: '420M XOF',
      statut: 'en_cours',
      proprietaire: 'Société IMMOGO',
      localisation: 'Rufisque',
      dateEvaluation: '20/09/2024',
      type: 'Commercial'
    },
    {
      id: 'TF-2024-003',
      nom: 'Terrain Agricole Thiès',
      superficie: '5,000 m²',
      valeur: '180M XOF',
      statut: 'attente',
      proprietaire: 'Famille Seck',
      localisation: 'Thiès',
      dateEvaluation: '25/09/2024',
      type: 'Agricole'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Terrains</h1>
          <p className="text-gray-600">Inventaire et suivi foncier</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Terrain
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Terrains</p>
                <p className="text-2xl font-bold text-gray-900">1,250</p>
              </div>
              <Map className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur Totale</p>
                <p className="text-2xl font-bold text-gray-900">2.5B XOF</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Évaluation</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Superficie Totale</p>
                <p className="text-2xl font-bold text-gray-900">145 Ha</p>
              </div>
              <Ruler className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un terrain..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Liste des terrains */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Terrains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {terrains.map((terrain, index) => (
              <motion.div
                key={terrain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Map className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{terrain.nom}</h4>
                    <p className="text-sm text-gray-600">{terrain.proprietaire}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{terrain.localisation}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {terrain.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{terrain.superficie}</p>
                    <p className="text-sm text-gray-600">{terrain.valeur}</p>
                  </div>
                  
                  <Badge
                    variant={
                      terrain.statut === 'évalué' ? 'success' :
                      terrain.statut === 'en_cours' ? 'warning' : 'secondary'
                    }
                  >
                    {terrain.statut === 'évalué' ? 'Évalué' :
                     terrain.statut === 'en_cours' ? 'En cours' : 'En attente'}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentFoncierTerrains;