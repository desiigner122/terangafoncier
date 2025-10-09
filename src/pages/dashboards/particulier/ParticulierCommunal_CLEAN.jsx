import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Plus,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierCommunal = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('en-cours');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [demandesTerrains, setDemandesTerrains] = useState({
    enCours: [],
    terminees: [],
    rejettees: []
  });

  useEffect(() => {
    if (user?.id) {
      loadCommunalRequests();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadCommunalRequests = async () => {
    if (!user?.id) {
      console.log('❌ Utilisateur non disponible');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📊 Chargement des demandes communales...');

      // Récupérer toutes les demandes avec JOIN sur les zones
      const { data, error } = await supabase
        .from('communal_zone_requests')
        .select(`
          *,
          zone:communal_zones (
            nom,
            commune,
            superficie_min,
            superficie_max,
            prix_m2
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Séparer les demandes par statut
      const enCours = data?.filter(d => ['en_attente', 'en_cours', 'pre_selection'].includes(d.status)) || [];
      const terminees = data?.filter(d => ['approuvee', 'validee'].includes(d.status)) || [];
      const rejettees = data?.filter(d => ['refusee', 'annulee'].includes(d.status)) || [];

      setDemandesTerrains({ enCours, terminees, rejettees });
      console.log(`✅ ${data?.length || 0} demandes communales chargées`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des demandes communales:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'en_cours': 'bg-blue-100 text-blue-800',
      'pre_selection': 'bg-orange-100 text-orange-800',
      'approuvee': 'bg-green-100 text-green-800',
      'validee': 'bg-green-100 text-green-800',
      'refusee': 'bg-red-100 text-red-800',
      'annulee': 'bg-gray-100 text-gray-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (statut) => {
    const texts = {
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'pre_selection': 'Pré-sélection',
      'approuvee': 'Approuvée',
      'validee': 'Validée',
      'refusee': 'Refusée',
      'annulee': 'Annulée'
    };
    return texts[statut] || statut;
  };

  const getPrioriteColor = (priorite) => {
    const colors = {
      'elevee': 'bg-red-100 text-red-800',
      'normale': 'bg-green-100 text-green-800',
      'faible': 'bg-gray-100 text-gray-800'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800';
  };

  const filteredData = () => {
    let data = [];
    
    switch (activeTab) {
      case 'en-cours':
        data = demandesTerrains.enCours;
        break;
      case 'terminees':
        data = demandesTerrains.terminees;
        break;
      case 'rejettees':
        data = demandesTerrains.rejettees;
        break;
      default:
        data = [...demandesTerrains.enCours, ...demandesTerrains.terminees, ...demandesTerrains.rejettees];
    }

    if (searchTerm) {
      data = data.filter(item =>
        item.zone?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.zone?.commune?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data;
  };

  const DemandeCard = ({ demande }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedDemande(demande);
              setShowDetailDialog(true);
            }}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                {demande.zone?.nom || 'Zone communale'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {demande.zone?.commune || 'Commune'}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {demande.superficie_demandee ? `${demande.superficie_demandee}m²` : 'Superficie non définie'}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Demande: {new Date(demande.created_at).toLocaleDateString('fr-FR')}
                </div>
                {demande.echeance && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Échéance: {new Date(demande.echeance).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(demande.status)}>
                {getStatusText(demande.status)}
              </Badge>
              {demande.priorite && (
                <Badge className={`${getPrioriteColor(demande.priorite)} mt-2`} variant="outline">
                  {demande.priorite}
                </Badge>
              )}
            </div>
          </div>

          {demande.progression !== undefined && demande.progression !== null && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progression</span>
                <span className="text-sm text-gray-600">{demande.progression}%</span>
              </div>
              <Progress value={demande.progression} className="h-2" />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {demande.prochaine_etape && (
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-4 h-4" />
                  Prochaine étape: {demande.prochaine_etape}
                </div>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Détails
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EmptyState = ({ type }) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {type === 'en-cours' && 'Aucune demande en cours'}
          {type === 'terminees' && 'Aucune demande terminée'}
          {type === 'rejettees' && 'Aucune demande refusée'}
        </h3>
        <p className="text-gray-600 text-center mb-4">
          {type === 'en-cours' && 'Vous n\'avez pas de demandes de terrains communaux en cours.'}
          {type === 'terminees' && 'Aucune de vos demandes n\'a encore été finalisée.'}
          {type === 'rejettees' && 'Aucune de vos demandes n\'a été refusée.'}
        </p>
        {type === 'en-cours' && (
          <Button onClick={() => navigate('/acheteur/zones-communales')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Chargement des demandes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes Terrains Communaux</h1>
          <p className="text-gray-600">Suivez vos demandes de terrains communaux</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadCommunalRequests}
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={() => navigate('/acheteur/zones-communales')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{demandesTerrains.enCours.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{demandesTerrains.terminees.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refusées</p>
                <p className="text-2xl font-bold text-red-600">{demandesTerrains.rejettees.length}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par zone, commune ou statut..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="en-cours">
            En cours ({demandesTerrains.enCours.length})
          </TabsTrigger>
          <TabsTrigger value="terminees">
            Terminées ({demandesTerrains.terminees.length})
          </TabsTrigger>
          <TabsTrigger value="rejettees">
            Refusées ({demandesTerrains.rejettees.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours" className="space-y-4">
          <AnimatePresence>
            {filteredData().length === 0 ? (
              <EmptyState type="en-cours" />
            ) : (
              filteredData().map((demande) => (
                <DemandeCard key={demande.id} demande={demande} />
              ))
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="terminees" className="space-y-4">
          <AnimatePresence>
            {filteredData().length === 0 ? (
              <EmptyState type="terminees" />
            ) : (
              filteredData().map((demande) => (
                <DemandeCard key={demande.id} demande={demande} />
              ))
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="rejettees" className="space-y-4">
          <AnimatePresence>
            {filteredData().length === 0 ? (
              <EmptyState type="rejettees" />
            ) : (
              filteredData().map((demande) => (
                <DemandeCard key={demande.id} demande={demande} />
              ))
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Dialog de détails */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDemande && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedDemande.zone?.nom || 'Zone communale'}
                </DialogTitle>
                <DialogDescription>
                  Détails de votre demande de terrain communal
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Zone</label>
                    <p className="text-sm text-gray-900">{selectedDemande.zone?.nom || 'Non définie'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Statut</label>
                    <Badge className={getStatusColor(selectedDemande.status)}>
                      {getStatusText(selectedDemande.status)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Commune</label>
                  <p className="text-sm text-gray-900">{selectedDemande.zone?.commune || 'Non définie'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Superficie demandée</label>
                    <p className="text-sm text-gray-900">
                      {selectedDemande.superficie_demandee ? `${selectedDemande.superficie_demandee}m²` : 'Non définie'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Prix estimé</label>
                    <p className="text-sm text-gray-900">
                      {selectedDemande.prix_estime ? 
                        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(selectedDemande.prix_estime) :
                        'Non défini'
                      }
                    </p>
                  </div>
                </div>

                {selectedDemande.progression !== undefined && selectedDemande.progression !== null && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Progression</label>
                    <div className="mt-2">
                      <Progress value={selectedDemande.progression} className="h-2" />
                      <p className="text-sm text-gray-600 mt-1">{selectedDemande.progression}% complété</p>
                    </div>
                  </div>
                )}

                {selectedDemande.prochaine_etape && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Prochaine étape</label>
                    <p className="text-sm text-gray-900">{selectedDemande.prochaine_etape}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date de demande</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedDemande.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {selectedDemande.echeance && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Échéance</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedDemande.echeance).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>

                {selectedDemande.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedDemande.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticulierCommunal;