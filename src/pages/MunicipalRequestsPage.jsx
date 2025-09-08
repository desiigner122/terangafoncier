import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  FileText, 
  Calendar,
  MapPin,
  User,
  RefreshCw,
  Download,
  Eye,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const MunicipalRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données mockées des demandes
  useEffect(() => {
    const mockRequests = [
      {
        id: 'REQ-2024-001',
        type: 'Attribution terrain communal',
        municipality: 'Commune de Guédiawaye',
        location: 'Zone résidentielle Nord',
        area: '300m²',
        status: 'En cours d\'examen',
        submittedDate: '2024-01-15',
        lastUpdate: '2024-01-22',
        estimatedDecision: '2024-02-15',
        documents: ['Demande manuscrite', 'Pièce d\'identité', 'Justificatif de revenus'],
        requirements: ['Résidence dans la commune depuis 2 ans', 'Revenus inférieurs à 500,000 FCFA/mois', 'Premier logement']
      },
      {
        id: 'REQ-2024-002',
        type: 'Lotissement social',
        municipality: 'Commune de Pikine',
        location: 'Extension Pikine Sud',
        area: '250m²',
        status: 'Approuvée',
        submittedDate: '2023-12-10',
        lastUpdate: '2024-01-20',
        estimatedDecision: '2024-01-20',
        documents: ['Dossier complet', 'Attestation domiciliation', 'Projet de construction'],
        requirements: ['Domiciliation Pikine', 'Famille de 4+ personnes', 'Projet architectural validé']
      },
      {
        id: 'REQ-2024-003',
        type: 'Terrain commercial',
        municipality: 'Commune de Rufisque',
        location: 'Zone commerciale centrale',
        area: '500m²',
        status: 'Documents manquants',
        submittedDate: '2024-01-05',
        lastUpdate: '2024-01-18',
        estimatedDecision: '2024-02-28',
        documents: ['Demande incomplète', 'Justificatifs financiers manquants'],
        requirements: ['Activité commerciale justifiée', 'Caution de 2,000,000 FCFA', 'Autorisation commerciale']
      }
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'En cours d\'examen':
        return { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', bgColor: 'bg-yellow-50' };
      case 'Approuvée':
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-800 border-green-200', bgColor: 'bg-green-50' };
      case 'Documents manquants':
        return { icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800 border-orange-200', bgColor: 'bg-orange-50' };
      case 'Rejetée':
        return { icon: <X className="w-4 h-4" />, color: 'bg-red-100 text-red-800 border-red-200', bgColor: 'bg-red-50' };
      default:
        return { icon: <Clock className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800 border-gray-200', bgColor: 'bg-gray-50' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Helmet>
        <title>Mes Demandes Municipales - Suivi en Temps Réel | Teranga Foncier</title>
        <meta name="description" content="Suivez l'état d'avancement de vos demandes de terrains communaux auprès des mairies partenaires. Suivi en temps réel et notifications." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Suivi de vos <span className="text-yellow-400">Demandes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Suivez en temps réel l'état d'avancement de vos demandes de terrains communaux
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <RefreshCw className="w-4 h-4" />
                <span>Suivi en temps réel</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <FileText className="w-4 h-4" />
                <span>Documents sécurisés</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>Process transparent</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requests Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Guide de Demande ({requests.length})
              </h2>
              <p className="text-gray-600">
                Suivez l'état d'avancement de toutes vos demandes municipales
              </p>
            </div>
          </div>

          {requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-8 text-gray-300">
                <FileText className="w-full h-full" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                Aucune demande en cours
              </h3>
              <p className="text-gray-500 mb-8">
                Vous n'avez pas encore soumis de demande de terrain communal
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/terrains-communaux">
                    Faire une demande
                  </Link>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link to="/terrains-communaux">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle demande
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {requests.map((request, index) => {
                const statusInfo = getStatusInfo(request.status);
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardHeader className={`${statusInfo.bgColor} border-b`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl mb-2">
                              {request.type}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{request.municipality}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>ID: {request.id}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={statusInfo.color}>
                            {statusInfo.icon}
                            <span className="ml-1">{request.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Informations générales */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Informations générales</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Localisation:</span>
                                <span className="font-medium">{request.location}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Surface:</span>
                                <span className="font-medium">{request.area}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Date soumission:</span>
                                <span className="font-medium">{new Date(request.submittedDate).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Dernière MAJ:</span>
                                <span className="font-medium">{new Date(request.lastUpdate).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Décision estimée:</span>
                                <span className="font-medium">{new Date(request.estimatedDecision).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Documents */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                            <div className="space-y-2">
                              {request.documents.map((doc, docIndex) => (
                                <div key={docIndex} className="flex items-center gap-2 text-sm">
                                  <FileText className="w-4 h-4 text-blue-500" />
                                  <span>{doc}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Critères */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Critères d'éligibilité</h4>
                            <div className="space-y-2">
                              {request.requirements.map((req, reqIndex) => (
                                <div key={reqIndex} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 pt-6 border-t flex flex-wrap gap-3">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger dossier
                          </Button>
                          {request.status === 'Documents manquants' && (
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                              <FileText className="w-4 h-4 mr-2" />
                              Compléter dossier
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualiser
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
          
          {/* Action buttons moved to bottom */}
          {requests.length > 0 && (
            <div className="mt-12 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/terrains-communaux">
                    Faire une demande
                  </Link>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link to="/terrains-communaux">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle demande
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MunicipalRequestsPage;
