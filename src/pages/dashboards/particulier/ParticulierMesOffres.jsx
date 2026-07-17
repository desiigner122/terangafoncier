import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MessageSquare,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ParticulierSupabaseService from '@/services/ParticulierSupabaseService';

const ParticulierMesOffres = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      loadOffers();
    }
  }, [user]);

  const loadOffers = async () => {
    try {
      setLoading(true);

      // Offres = transactions financières de l'acheteur (financial_transactions),
      // filtrées sur user_id = acheteur, avec la propriété jointe.
      const result = await ParticulierSupabaseService.getMyOffers(user.id);

      if (!result.success) throw new Error(result.error);

      setOffers(result.data || []);
    } catch (error) {
      console.error('Erreur chargement offres:', error);
      window.safeGlobalToast?.({
        description: 'Erreur lors du chargement des offres',
        variant: 'destructive'
      });
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { label: 'Acceptée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { label: 'Finalisée', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
      rejected: { label: 'Rejetée', color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = !searchTerm ||
      offer.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.property?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.property?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || offer.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'pending').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
    completed: offers.filter(o => o.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Mes Offres</h1>
          <p className="text-gray-600 mt-2">Suivez vos offres d'achat soumises aux vendeurs</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <FileText className="h-4 w-4 mr-2" />
          Nouvelle Offre
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Offres</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Acceptées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Finalisées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejetées</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Offres</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptées ({stats.accepted})</TabsTrigger>
              <TabsTrigger value="completed">Finalisées ({stats.completed})</TabsTrigger>
              <TabsTrigger value="rejected">Rejetées ({stats.rejected})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {filteredOffers.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune offre</h3>
                  <p className="text-gray-600">
                    {activeTab === 'all' 
                      ? "Vous n'avez pas encore soumis d'offre"
                      : `Aucune offre ${activeTab === 'pending' ? 'en attente' : activeTab === 'accepted' ? 'acceptée' : activeTab === 'rejected' ? 'rejetée' : 'finalisée'}`
                    }
                  </p>
                </div>
              ) : (
                filteredOffers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex space-x-4 flex-1">
                            {/* Offer Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">
                                    {offer.property?.title || offer.property?.name || offer.description || 'Terrain'}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {offer.property?.location || offer.property?.region || '—'}
                                  </p>
                                </div>
                                {getStatusBadge(offer.status)}
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <div className="text-xs text-gray-500">Prix du bien</div>
                                  <div className="font-semibold text-gray-900">
                                    {offer.property?.price
                                      ? `${offer.property.price.toLocaleString('fr-FR')} FCFA`
                                      : '—'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Votre offre</div>
                                  <div className="font-semibold text-blue-600">
                                    {(offer.amount || 0).toLocaleString('fr-FR')} {offer.currency || 'FCFA'}
                                  </div>
                                </div>
                              </div>

                              {offer.description && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="text-xs text-gray-500 mb-1">Détail de l'offre</div>
                                  <p className="text-sm text-gray-700">{offer.description}</p>
                                </div>
                              )}

                              <div className="flex items-center space-x-4 mt-4">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir le terrain
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Contacter vendeur
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Soumise le {new Date(offer.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          {offer.reference && (
                            <div className="text-gray-600">
                              Réf: {offer.reference}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticulierMesOffres;
