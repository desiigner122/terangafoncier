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
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
      console.log('📊 Chargement des offres...');

      // Charger les offres de l'utilisateur
      const { data: offersData, error } = await supabase
        .from('offers')
        .select(`
          *,
          property:properties(
            id,
            title,
            price,
            city,
            surface_area,
            property_type,
            images,
            owner_id
          ),
          seller:profiles!seller_id(
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOffers(offersData || []);
      console.log('✅ Offres chargées:', offersData?.length || 0);
    } catch (error) {
      console.error('❌ Erreur chargement offres:', error);
      window.safeGlobalToast({
        description: 'Erreur lors du chargement des offres',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { label: 'Acceptée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Rejetée', color: 'bg-red-100 text-red-800', icon: XCircle },
      counter_offer: { label: 'Contre-offre', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
      expired: { label: 'Expirée', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
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
      offer.property?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || offer.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'pending').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
    counter_offer: offers.filter(o => o.status === 'counter_offer').length
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
            <div className="text-2xl font-bold text-blue-600">{stats.counter_offer}</div>
            <div className="text-sm text-gray-600">Contre-offres</div>
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
              <TabsTrigger value="counter_offer">Contre-offres ({stats.counter_offer})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptées ({stats.accepted})</TabsTrigger>
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
                      : `Aucune offre ${activeTab === 'pending' ? 'en attente' : activeTab === 'accepted' ? 'acceptée' : activeTab === 'rejected' ? 'rejetée' : 'avec contre-offre'}`
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
                            {/* Property Image */}
                            {offer.property?.images?.[0] && (
                              <img
                                src={offer.property.images[0]}
                                alt={offer.property.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                            
                            {/* Offer Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">
                                    {offer.property?.title || 'Terrain'}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {offer.property?.city} • {offer.property?.surface_area}m²
                                  </p>
                                </div>
                                {getStatusBadge(offer.status)}
                              </div>

                              <div className="grid grid-cols-3 gap-4 mt-4">
                                <div>
                                  <div className="text-xs text-gray-500">Prix demandé</div>
                                  <div className="font-semibold text-gray-900">
                                    {(offer.property?.price || 0).toLocaleString('fr-FR')} FCFA
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Votre offre</div>
                                  <div className="font-semibold text-blue-600">
                                    {(offer.offered_amount || 0).toLocaleString('fr-FR')} FCFA
                                  </div>
                                </div>
                                {offer.counter_offer_amount && (
                                  <div>
                                    <div className="text-xs text-gray-500">Contre-offre</div>
                                    <div className="font-semibold text-orange-600">
                                      {offer.counter_offer_amount.toLocaleString('fr-FR')} FCFA
                                    </div>
                                  </div>
                                )}
                              </div>

                              {offer.message && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="text-xs text-gray-500 mb-1">Votre message</div>
                                  <p className="text-sm text-gray-700">{offer.message}</p>
                                </div>
                              )}

                              {offer.counter_offer_message && (
                                <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                  <div className="text-xs text-orange-600 mb-1">Message du vendeur</div>
                                  <p className="text-sm text-gray-700">{offer.counter_offer_message}</p>
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
                                {offer.status === 'counter_offer' && (
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accepter contre-offre
                                  </Button>
                                )}
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
                            {offer.expires_at && (
                              <div className="flex items-center text-orange-600">
                                <Clock className="h-4 w-4 mr-1" />
                                Expire le {new Date(offer.expires_at).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </div>
                          <div className="text-gray-600">
                            Vendeur: {offer.seller?.full_name || 'N/A'}
                          </div>
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
