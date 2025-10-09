import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ParticulierZonesCommunales = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const [loading, setLoading] = useState(true);
  const [candidatures, setCandidatures] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadCandidatures();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadCandidatures = async () => {
    try {
      setLoading(true);
      // Simulation de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données mockées des candidatures
      setCandidatures([
        {
          id: 1,
          zone_nom: 'Zone Résidentielle Guédiawaye Centre',
          commune: 'Guédiawaye',
          superficie_demandee: '300m²',
          statut: 'en_attente',
          date_candidature: '2024-10-01',
          numero_dossier: 'ZC-2024-001',
          prix_estime: 45000000
        },
        {
          id: 2,
          zone_nom: 'Parcelles Sociales Pikine Nord',
          commune: 'Pikine',
          superficie_demandee: '250m²',
          statut: 'acceptee',
          date_candidature: '2024-09-15',
          numero_dossier: 'ZC-2024-002',
          prix_estime: 35000000
        },
        {
          id: 3,
          zone_nom: 'Extension Rufisque Est',
          commune: 'Rufisque',
          superficie_demandee: '400m²',
          statut: 'en_instruction',
          date_candidature: '2024-09-28',
          numero_dossier: 'ZC-2024-003',
          prix_estime: 55000000
        }
      ]);
    } catch (error) {
      console.error('Erreur chargement candidatures:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'en_attente':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'en_instruction':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'acceptee':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejetee':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'en_attente': 'En attente',
      'en_instruction': 'En instruction',
      'acceptee': 'Acceptée',
      'rejetee': 'Rejetée'
    };
    return labels[statut] || statut;
  };

  const getStatusColor = (statut) => {
    const colors = {
      'en_attente': 'bg-orange-50 text-orange-700 border-orange-200',
      'en_instruction': 'bg-blue-50 text-blue-700 border-blue-200',
      'acceptee': 'bg-green-50 text-green-700 border-green-200',
      'rejetee': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[statut] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Vérification du contexte
  if (!outletContext) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement du contexte...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des candidatures...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Zones Communales</h1>
          <p className="text-gray-600 mt-1">Suivi de vos candidatures aux parcelles communales</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {candidatures.length} candidature{candidatures.length !== 1 ? 's' : ''}
          </Badge>
          <Button variant="outline" size="sm" onClick={loadCandidatures}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Candidature aux zones communales</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Les candidatures aux nouvelles zones communales se font depuis notre site public. 
                  Cette page permet uniquement de suivre vos candidatures existantes.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600 mt-2" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Voir les zones disponibles sur le site public
                </Button>
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
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{candidatures.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {candidatures.filter(c => c.statut === 'en_attente').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En instruction</p>
                <p className="text-2xl font-bold text-blue-600">
                  {candidatures.filter(c => c.statut === 'en_instruction').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-green-600">
                  {candidatures.filter(c => c.statut === 'acceptee').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Liste des candidatures */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {candidatures.map((candidature, index) => (
          <motion.div
            key={candidature.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {candidature.zone_nom}
                      </h3>
                      <Badge className={`border ${getStatusColor(candidature.statut)}`}>
                        {getStatusIcon(candidature.statut)}
                        <span className="ml-1">{getStatusLabel(candidature.statut)}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{candidature.commune}</span>
                      </div>
                      <div>
                        <span className="font-medium">Superficie:</span> {candidature.superficie_demandee}
                      </div>
                      <div>
                        <span className="font-medium">Prix estimé:</span> {(candidature.prix_estime / 1000000).toFixed(1)}M FCFA
                      </div>
                      <div>
                        <span className="font-medium">N° Dossier:</span> {candidature.numero_dossier}
                      </div>
                      <div>
                        <span className="font-medium">Date candidature:</span> {new Date(candidature.date_candidature).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {candidatures.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-12"
        >
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune candidature</h3>
          <p className="text-gray-600 mb-4">Vous n'avez pas encore soumis de candidature pour les zones communales</p>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Découvrir les zones disponibles
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ParticulierZonesCommunales;