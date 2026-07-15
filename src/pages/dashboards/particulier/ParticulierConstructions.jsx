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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabaseClient';
import ParticulierSupabaseService from '@/services/ParticulierSupabaseService';
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

  // La table réelle construction_requests ne comporte que : title, status, budget
  // (+ user_id, property_id). On ne collecte donc que ce qui peut être persisté.
  const [newDemande, setNewDemande] = useState({
    title: '',
    budget: ''
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

      const result = await ParticulierSupabaseService.getConstructionRequests(user.id);

      if (!result.success) throw new Error(result.error || 'Chargement impossible');

      const data = result.data || [];

      // Organiser par statut réel (colonne 'status' de construction_requests)
      const isRejected = (s) => ['rejected', 'rejetee', 'refusee', 'refused'].includes(s);
      const isDone = (s) => ['completed', 'approved', 'approuvee', 'terminee', 'delivered'].includes(s);

      const terminees = data.filter(d => isDone(d.status));
      const rejettees = data.filter(d => isRejected(d.status));
      const enCours = data.filter(d => !isDone(d.status) && !isRejected(d.status));

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
    
    if (!newDemande.title) {
      toast.error('Veuillez renseigner le type / titre du projet');
      return;
    }

    try {
      setLoading(true);

      // Insertion sur les colonnes réelles de construction_requests
      const { error } = await supabase
        .from('construction_requests')
        .insert([{
          user_id: user.id,
          title: newDemande.title,
          budget: parseFloat(newDemande.budget) || null,
          status: 'pending'
        }]);

      if (error) throw error;

      toast.success('Demande de construction soumise avec succès');
      setShowNewDemande(false);
      setNewDemande({
        title: '',
        budget: ''
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
      'pending': 'En attente',
      'submitted': 'Soumise',
      'in_progress': 'En cours',
      'in_review': 'En instruction',
      'approved': 'Approuvée',
      'completed': 'Terminée',
      'rejected': 'Rejetée',
      // Alias FR au cas où
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'approuvee': 'Approuvée',
      'rejetee': 'Rejetée'
    };
    return statusMap[statut] || statut || 'Inconnu';
  };

  const getStatusColor = (statut) => {
    const colorMap = {
      'pending': 'bg-blue-100 text-blue-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'in_review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'en_attente': 'bg-blue-100 text-blue-800',
      'en_cours': 'bg-purple-100 text-purple-800',
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
                {demande.title || 'Construction'}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                Soumise le {demande.created_at ? new Date(demande.created_at).toLocaleDateString('fr-FR') : '—'}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(demande.status)}>
              {getStatusLabel(demande.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {demande.budget != null && (
              <div className="flex items-center">
                <Euro className="h-4 w-4 mr-2 text-slate-500" />
                <span>{formatPrice(demande.budget)}</span>
              </div>
            )}

            {demande.property?.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                <span>{demande.property.location}</span>
              </div>
            )}
          </div>

          {demande.property && (
            <div className="border-t pt-3">
              <div className="flex items-center text-sm text-slate-600">
                <Home className="h-4 w-4 mr-2" />
                <span>
                  Terrain associé : {demande.property.title || demande.property.name || 'Bien lié'}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-xs text-slate-500">
              Créée il y a {getTimeAgo(demande.created_at)}
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
      demande.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.property?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.property?.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    Type / titre du projet *
                  </label>
                  <Input
                    placeholder="Villa, Appartement, Bureau..."
                    value={newDemande.title}
                    onChange={(e) => setNewDemande(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget estimé (XOF)
                  </label>
                  <Input
                    type="number"
                    placeholder="50000000"
                    value={newDemande.budget}
                    onChange={(e) => setNewDemande(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>

                <div className="flex items-start gap-2 rounded-md bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Après création, un conseiller pourra détailler avec vous la surface,
                    la localisation et le calendrier de votre projet.
                  </span>
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