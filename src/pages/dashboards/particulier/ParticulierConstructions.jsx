import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  MessageSquare,
  Phone,
  RefreshCw,
  AlertTriangle,
  Info,
  Loader2,
  FileText,
  Euro,
  Home,
  Send
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierConstructions = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('en-cours');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewDemande, setShowNewDemande] = useState(false);
  const [demandesConstruction, setDemandesConstruction] = useState({
    enCours: [],
    terminees: [],
    rejettees: []
  });

  const [newDemande, setNewDemande] = useState({
    type_construction: '',
    surface_souhaitee: '',
    budget_max: '',
    localisation_preferee: '',
    description: '',
    date_souhaitee: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadConstructionRequests();
    }
  }, [user?.id]);

  const loadConstructionRequests = async () => {
    if (!user?.id) {
      console.log('❌ Utilisateur non disponible');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('demandes_construction')
        .select(`
          *,
          promoteur:promoteur_id(full_name, company_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (['PGRST205', '42P01'].includes(error.code)) {
          console.warn('⚠️ Table demandes_construction manquante - affichage vide');
          setDemandesConstruction({ enCours: [], terminees: [], rejettees: [] });
          setLoading(false);
          return;
        }
        throw error;
      }

      // Organiser par statut
      const enCours = data?.filter(d => 
        ['en_attente', 'en_cours', 'en_instruction'].includes(d.statut)
      ) || [];
      
      const terminees = data?.filter(d => 
        d.statut === 'approuvee'
      ) || [];
      
      const rejettees = data?.filter(d => 
        d.statut === 'rejetee'
      ) || [];

      setDemandesConstruction({ enCours, terminees, rejettees });

    } catch (error) {
      console.error('Erreur chargement demandes:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDemande = async (e) => {
    e.preventDefault();
    
    if (!newDemande.type_construction || !newDemande.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('demandes_construction')
        .insert([{
          user_id: user.id,
          ...newDemande,
          surface_souhaitee: parseInt(newDemande.surface_souhaitee) || null,
          budget_max: parseFloat(newDemande.budget_max) || null,
          statut: 'en_attente'
        }]);

      if (error) {
        if (['PGRST205', '42P01'].includes(error.code)) {
          toast.error('Cette fonctionnalité n\'est pas disponible pour le moment');
          return;
        }
        throw error;
      }

      toast.success('Demande de construction soumise avec succès');
      setShowNewDemande(false);
      setNewDemande({
        type_construction: '',
        surface_souhaitee: '',
        budget_max: '',
        localisation_preferee: '',
        description: '',
        date_souhaitee: ''
      });
      
      loadConstructionRequests();

    } catch (error) {
      console.error('Erreur création demande:', error);
      toast.error('Erreur lors de la création de la demande');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (statut) => {
    const statusMap = {
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'en_instruction': 'En instruction',
      'approuvee': 'Approuvée',
      'rejetee': 'Rejetée'
    };
    return statusMap[statut] || statut;
  };

  const getStatusColor = (statut) => {
    const colorMap = {
      'en_attente': 'bg-blue-100 text-blue-800',
      'en_cours': 'bg-purple-100 text-purple-800',
      'en_instruction': 'bg-yellow-100 text-yellow-800',
      'approuvee': 'bg-green-100 text-green-800',
      'rejetee': 'bg-red-100 text-red-800'
    };
    return colorMap[statut] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price) => {
    if (!price) return 'Non spécifié';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}j`;
  };

  const DemandeCard = ({ demande }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-slate-200 hover:shadow-lg transition-shadow"
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                {demande.type_construction || 'Construction'}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                Soumise le {new Date(demande.created_at).toLocaleDateString('fr-FR')}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(demande.statut)}>
              {getStatusLabel(demande.statut)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {demande.surface_souhaitee && (
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2 text-slate-500" />
                <span>{demande.surface_souhaitee} m²</span>
              </div>
            )}
            
            {demande.budget_max && (
              <div className="flex items-center">
                <Euro className="h-4 w-4 mr-2 text-slate-500" />
                <span>{formatPrice(demande.budget_max)}</span>
              </div>
            )}
            
            {demande.localisation_preferee && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                <span>{demande.localisation_preferee}</span>
              </div>
            )}

            {demande.date_souhaitee && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                <span>Souhaité: {new Date(demande.date_souhaitee).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>

          {demande.description && (
            <div className="border-t pt-3">
              <p className="text-sm text-slate-600 line-clamp-3">
                {demande.description}
              </p>
            </div>
          )}

          {demande.promoteur && (
            <div className="border-t pt-3">
              <div className="flex items-center text-sm text-slate-600">
                <User className="h-4 w-4 mr-2" />
                <span>
                  Promoteur: {demande.promoteur.company_name || demande.promoteur.full_name}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-xs text-slate-500">
              Mis à jour {getTimeAgo(demande.updated_at)}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Détails
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const filteredDemandes = (demandes) => {
    if (!searchTerm) return demandes;
    return demandes.filter(demande =>
      demande.type_construction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.localisation_preferee?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading && demandesConstruction.enCours.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Chargement des demandes de construction...</p>
        </div>
      </div>
    );
  }

  // Vérification du contexte
  if (!outletContext) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement du contexte utilisateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Demandes de Construction</h1>
          <p className="text-slate-600 mt-1">
            Suivez vos demandes de construction auprès des promoteurs
          </p>
        </div>
        
        <Button onClick={() => setShowNewDemande(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{demandesConstruction.enCours.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{demandesConstruction.terminees.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Rejetées</p>
                <p className="text-2xl font-bold text-red-600">{demandesConstruction.rejettees.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans vos demandes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nouvelle demande modal */}
      {showNewDemande && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Nouvelle demande de construction</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNewDemande(false)}
                >
                  ×
                </Button>
              </div>

              <form onSubmit={handleCreateDemande} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type de construction *
                  </label>
                  <Input
                    placeholder="Villa, Appartement, Bureau..."
                    value={newDemande.type_construction}
                    onChange={(e) => setNewDemande(prev => ({ ...prev, type_construction: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Surface souhaitée (m²)
                    </label>
                    <Input
                      type="number"
                      placeholder="200"
                      value={newDemande.surface_souhaitee}
                      onChange={(e) => setNewDemande(prev => ({ ...prev, surface_souhaitee: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Budget maximum (XOF)
                    </label>
                    <Input
                      type="number"
                      placeholder="50000000"
                      value={newDemande.budget_max}
                      onChange={(e) => setNewDemande(prev => ({ ...prev, budget_max: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Localisation préférée
                    </label>
                    <Input
                      placeholder="Dakar, Thiès, Mbour..."
                      value={newDemande.localisation_preferee}
                      onChange={(e) => setNewDemande(prev => ({ ...prev, localisation_preferee: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date souhaitée
                    </label>
                    <Input
                      type="date"
                      value={newDemande.date_souhaitee}
                      onChange={(e) => setNewDemande(prev => ({ ...prev, date_souhaitee: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description détaillée *
                  </label>
                  <Textarea
                    placeholder="Décrivez votre projet de construction..."
                    value={newDemande.description}
                    onChange={(e) => setNewDemande(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Soumettre la demande
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewDemande(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en-cours" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            En cours ({demandesConstruction.enCours.length})
          </TabsTrigger>
          <TabsTrigger value="terminees" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Terminées ({demandesConstruction.terminees.length})
          </TabsTrigger>
          <TabsTrigger value="rejettees" className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Rejetées ({demandesConstruction.rejettees.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours" className="space-y-4">
          {filteredDemandes(demandesConstruction.enCours).length > 0 ? (
            <div className="grid gap-4">
              {filteredDemandes(demandesConstruction.enCours).map((demande) => (
                <DemandeCard key={demande.id} demande={demande} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Aucune demande en cours
                </h3>
                <p className="text-slate-600 mb-4">
                  Vous n'avez pas de demande de construction en cours de traitement.
                </p>
                <Button onClick={() => setShowNewDemande(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une demande
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="terminees" className="space-y-4">
          {filteredDemandes(demandesConstruction.terminees).length > 0 ? (
            <div className="grid gap-4">
              {filteredDemandes(demandesConstruction.terminees).map((demande) => (
                <DemandeCard key={demande.id} demande={demande} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Aucune demande terminée
                </h3>
                <p className="text-slate-600">
                  Vos demandes approuvées apparaîtront ici.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejettees" className="space-y-4">
          {filteredDemandes(demandesConstruction.rejettees).length > 0 ? (
            <div className="grid gap-4">
              {filteredDemandes(demandesConstruction.rejettees).map((demande) => (
                <DemandeCard key={demande.id} demande={demande} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Aucune demande rejetée
                </h3>
                <p className="text-slate-600">
                  Les demandes rejetées apparaîtront ici.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierConstructions;