import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2,
  Plus,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  ArrowRight,
  MessageSquare,
  Phone,
  RefreshCw,
  AlertTriangle,
  Info,
  Loader2,
  Euro,
  Home,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';

const ParticulierPromoteurs = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('en-cours');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // État des candidatures aux projets promoteurs
  const [candidaturesPromoteurs, setCandidaturesPromoteurs] = useState({
    enCours: [],
    acceptees: [],
    refusees: []
  });

  useEffect(() => {
    if (user?.id) {
      loadCandidaturesPromoteurs();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadCandidaturesPromoteurs = async () => {
    if (!user?.id) {
      console.log('❌ Utilisateur non disponible');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📊 Chargement des candidatures promoteurs...');

      const { data, error } = await supabase
        .from('candidatures_promoteurs')
        .select('*')
        .eq('candidat_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Séparer les candidatures par statut
      const enCours = data?.filter(c => ['en_attente', 'pre_selectionne', 'en_cours'].includes(c.statut)) || [];
      const acceptees = data?.filter(c => c.statut === 'acceptee') || [];
      const refusees = data?.filter(c => c.statut === 'refusee') || [];

      setCandidaturesPromoteurs({ enCours, acceptees, refusees });
      console.log(`✅ ${data?.length || 0} candidatures promoteurs chargées`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des candidatures promoteurs:', error);  
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'pre_selectionne': 'bg-blue-100 text-blue-800',
      'en_cours': 'bg-orange-100 text-orange-800',
      'acceptee': 'bg-green-100 text-green-800',
      'refusee': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (statut) => {
    const texts = {
      'en_attente': 'En attente',
      'pre_selectionne': 'Pré-sélectionné',
      'en_cours': 'En cours',
      'acceptee': 'Acceptée',
      'refusee': 'Refusée'
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredData = () => {
    let data = [];
    
    switch (activeTab) {
      case 'en-cours':
        data = candidaturesPromoteurs.enCours;
        break;
      case 'acceptees':
        data = candidaturesPromoteurs.acceptees;
        break;
      case 'refusees':
        data = candidaturesPromoteurs.refusees;
        break;
      default:
        data = [...candidaturesPromoteurs.enCours, ...candidaturesPromoteurs.acceptees, ...candidaturesPromoteurs.refusees];
    }

    if (searchTerm) {
      data = data.filter(item =>
        item.projet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.promoteur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.localisation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data;
  };

  const CandidatureCard = ({ candidature }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedDemande(candidature);
              setShowDetailDialog(true);
            }}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{candidature.projet || 'Projet'}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {candidature.promoteur || 'Promoteur'}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {candidature.localisation || 'Localisation'}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  {candidature.type_logement || 'Type logement'}
                </div>
                <div className="flex items-center gap-1">
                  <Euro className="w-4 h-4" />
                  {candidature.prix_total ? formatPrice(candidature.prix_total) : 'Prix non défini'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(candidature.statut)}>
                {getStatusText(candidature.statut)}
              </Badge>
              {candidature.priorite && (
                <Badge className={`${getPrioriteColor(candidature.priorite)} mt-2`} variant="outline">
                  {candidature.priorite}
                </Badge>
              )}
            </div>
          </div>

          {candidature.progression !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progression</span>
                <span className="text-sm text-gray-600">{candidature.progression}%</span>
              </div>
              <Progress value={candidature.progression} className="h-2" />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Candidature: {new Date(candidature.created_at).toLocaleDateString('fr-FR')}
              </div>
              {candidature.echeance && (
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" />
                  Échéance: {new Date(candidature.echeance).toLocaleDateString('fr-FR')}
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
        <Building2 className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {type === 'en-cours' && 'Aucune candidature en cours'}
          {type === 'acceptees' && 'Aucune candidature acceptée'}
          {type === 'refusees' && 'Aucune candidature refusée'}
        </h3>
        <p className="text-gray-600 text-center mb-4">
          {type === 'en-cours' && 'Vous n\'avez pas de candidatures en cours auprès des promoteurs.'}
          {type === 'acceptees' && 'Aucune de vos candidatures n\'a encore été acceptée.'}
          {type === 'refusees' && 'Aucune de vos candidatures n\'a été refusée.'}
        </p>
        {type === 'en-cours' && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle candidature
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
          <span className="ml-2 text-gray-600">Chargement des candidatures...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidatures Promoteurs</h1>
          <p className="text-gray-600">Suivez vos candidatures aux projets des promoteurs immobiliers</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadCandidaturesPromoteurs}
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle candidature
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
                <p className="text-2xl font-bold text-blue-600">{candidaturesPromoteurs.enCours.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-green-600">{candidaturesPromoteurs.acceptees.length}</p>
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
                <p className="text-2xl font-bold text-red-600">{candidaturesPromoteurs.refusees.length}</p>
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
            placeholder="Rechercher par projet, promoteur ou localisation..."
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
            En cours ({candidaturesPromoteurs.enCours.length})
          </TabsTrigger>
          <TabsTrigger value="acceptees">
            Acceptées ({candidaturesPromoteurs.acceptees.length})
          </TabsTrigger>
          <TabsTrigger value="refusees">
            Refusées ({candidaturesPromoteurs.refusees.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours" className="space-y-4">
          <AnimatePresence>
            {filteredData().length === 0 ? (
              <EmptyState type="en-cours" />
            ) : (
              filteredData().map((candidature) => (
                <CandidatureCard key={candidature.id} candidature={candidature} />
              ))
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="acceptees" className="space-y-4">
          <AnimatePresence>
            {filteredData().length === 0 ? (
              <EmptyState type="acceptees" />
            ) : (
              filteredData().map((candidature) => (
                <CandidatureCard key={candidature.id} candidature={candidature} />
              ))
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="refusees" className="space-y-4">
          <AnimatePresence>
            {filteredData().length === 0 ? (
              <EmptyState type="refusees" />
            ) : (
              filteredData().map((candidature) => (
                <CandidatureCard key={candidature.id} candidature={candidature} />
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
                  <Building2 className="h-5 w-5" />
                  {selectedDemande.projet || 'Projet'}
                </DialogTitle>
                <DialogDescription>
                  Détails de votre candidature
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Promoteur</label>
                    <p className="text-sm text-gray-900">{selectedDemande.promoteur || 'Non défini'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Statut</label>
                    <Badge className={getStatusColor(selectedDemande.statut)}>
                      {getStatusText(selectedDemande.statut)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Localisation</label>
                  <p className="text-sm text-gray-900">{selectedDemande.localisation || 'Non définie'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type de logement</label>
                    <p className="text-sm text-gray-900">{selectedDemande.type_logement || 'Non défini'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Prix total</label>
                    <p className="text-sm text-gray-900">
                      {selectedDemande.prix_total ? formatPrice(selectedDemande.prix_total) : 'Non défini'}
                    </p>
                  </div>
                </div>

                {selectedDemande.progression !== undefined && (
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
                    <label className="text-sm font-medium text-gray-700">Date de candidature</label>
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

export default ParticulierPromoteurs;