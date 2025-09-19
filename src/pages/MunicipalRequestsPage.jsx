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
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const MunicipalRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(3);

  // Données mockées des demandes
  useEffect(() => {
    const mockRequests = [
      {
        id: 'REQ-2024-001',
        type: 'Attribution terrain communal',
        municipality: 'Commune de Guédiawaye',
        location: 'Zone résidentielle Nord',
        area: '300mÂ²',
        status: 'En cours d\'examen',
        submittedDate: '2024-01-15',
        lastUpdate: '2024-01-22',
        estimatedDecision: '2024-02-15',
        documents: ['Demande manuscrite', 'Pièce d\'identité', 'Justificatif de revenus'],
        requirements: ['Résidence dans la commune depuis 2 ans', 'Revenus inférieurs Ï  500,000 FCFA/mois', 'Premier logement']
      },
      {
        id: 'REQ-2024-002',
        type: 'Lotissement social',
        municipality: 'Commune de Pikine',
        location: 'Extension Pikine Sud',
        area: '250mÂ²',
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
        area: '500mÂ²',
        status: 'Documents manquants',
        submittedDate: '2024-01-05',
        lastUpdate: '2024-01-18',
        estimatedDecision: '2024-02-28',
        documents: ['Demande incomplète', 'Justificatifs financiers manquants'],
        requirements: ['Activité commerciale justifiée', 'Caution de 2,000,000 FCFA', 'Autorisation commerciale']
      },
      {
        id: 'REQ-2024-004',
        type: 'Terrain résidentiel',
        municipality: 'Commune de Thiès',
        location: 'Quartier résidentiel Est',
        area: '400mÂ²',
        status: 'En cours d\'examen',
        submittedDate: '2024-01-25',
        lastUpdate: '2024-02-01',
        estimatedDecision: '2024-03-05',
        documents: ['Demande complète', 'Justificatifs revenus', 'Plan de construction'],
        requirements: ['Résidence Thiès', 'Premier achat terrain', 'Projet familial']
      },
      {
        id: 'REQ-2024-005',
        type: 'Extension urbaine',
        municipality: 'Commune de Mbour',
        location: 'Zone d\'extension Sud',
        area: '350mÂ²',
        status: 'Approuvée',
        submittedDate: '2023-11-20',
        lastUpdate: '2024-01-15',
        estimatedDecision: '2024-01-15',
        documents: ['Dossier validé', 'Contrat signé', 'Permis de construire'],
        requirements: ['Domiciliation Mbour', 'Activité économique locale', 'Engagement construction 18 mois']
      }
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  // Fonction de filtrage et recherche
  useEffect(() => {
    let filtered = requests;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset Ï  la première page lors du filtrage
  }, [searchTerm, statusFilter, requests]);

  // Pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                Guide de Demande ({filteredRequests.length})
              </h2>
              <p className="text-gray-600">
                Suivez l'état d'avancement de toutes vos demandes municipales
              </p>
            </div>
          </div>

          {/* Contrôles de recherche et filtrage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Recherche */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rechercher</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="ID, type, commune..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtre par statut */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="En cours d'examen">En cours d'examen</SelectItem>
                      <SelectItem value="Approuvée">Approuvée</SelectItem>
                      <SelectItem value="Documents manquants">Documents manquants</SelectItem>
                      <SelectItem value="Rejetée">Rejetée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Résumé des résultats */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Résultats</label>
                  <div className="flex items-center space-x-4 h-10">
                    <div className="text-sm text-gray-600">
                      {filteredRequests.length} demande(s) trouvée(s)
                    </div>
                    {(searchTerm || statusFilter !== 'all') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                        }}
                      >
                        Réinitialiser
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {filteredRequests.length === 0 && searchTerm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-8 text-gray-300">
                <Search className="w-full h-full" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-500 mb-8">
                Aucune demande ne correspond Ï  vos critères de recherche
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Voir toutes les demandes
              </Button>
            </motion.div>
          ) : requests.length === 0 ? (
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
            <>
              <div className="space-y-6">
                {currentRequests.map((request, index) => {
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

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center"
                >
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Précédent
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => paginate(page)}
                          className={currentPage === page ? "bg-blue-600 text-white" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Action buttons moved to bottom */}
          {filteredRequests.length > 0 && (
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

