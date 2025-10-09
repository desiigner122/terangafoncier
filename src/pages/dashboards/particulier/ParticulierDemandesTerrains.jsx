import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2,
  MapPin,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  FileText,
  Upload,
  Download,
  MessageSquare,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';

const ParticulierDemandesTerrains = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const [loading, setLoading] = useState(true);
  const [demandes, setDemandes] = useState([]);
  const [activeTab, setActiveTab] = useState('mes_demandes');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Formulaire nouvelle demande
  const [newDemande, setNewDemande] = useState({
    commune: '',
    quartier: '',
    superficie_souhaitee: '',
    budget_max: '',
    usage_prevu: '',
    description: '',
    priorite: 'normale'
  });

  useEffect(() => {
    if (user?.id) {
      loadDemandes();
    }
  }, [user?.id]);

  const loadDemandes = async () => {
    if (!user?.id) {
      console.log('❌ Utilisateur non disponible');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📊 Chargement des demandes de terrains communaux...');

      const { data, error } = await supabase
        .from('demandes_terrains_communaux')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDemandes(data || []);
      console.log(`✅ ${data?.length || 0} demandes chargées`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDemande = async () => {
    try {
      console.log('🆕 Création nouvelle demande terrain communal...');

      const { data, error } = await supabase
        .from('demandes_terrains_communaux')
        .insert([{
          ...newDemande,
          user_id: user.id,
          statut: 'en_attente',
          numero_demande: `DTC-${Date.now()}`
        }])
        .select()
        .single();

      if (error) throw error;

      setDemandes(prev => [data, ...prev]);
      setIsCreateModalOpen(false);
      setNewDemande({
        commune: '',
        quartier: '',
        superficie_souhaitee: '',
        budget_max: '',
        usage_prevu: '',
        description: '',
        priorite: 'normale'
      });

      console.log('✅ Demande créée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
    }
  };

  const getStatutBadge = (statut) => {
    const configs = {
      en_attente: { label: 'En Attente', variant: 'secondary', icon: Clock },
      en_cours: { label: 'En Cours', variant: 'default', icon: RefreshCw },
      acceptee: { label: 'Acceptée', variant: 'default', icon: CheckCircle },
      refusee: { label: 'Refusée', variant: 'destructive', icon: XCircle },
      en_revision: { label: 'En Révision', variant: 'secondary', icon: AlertTriangle }
    };

    const config = configs[statut] || configs.en_attente;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const filteredDemandes = demandes.filter(demande =>
    demande.commune?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.quartier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.numero_demande?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement des demandes...</p>
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
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Demandes de Terrains Communaux</h1>
          <p className="text-slate-600 mt-1">
            Gérez vos demandes d'attribution de terrains communaux
          </p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Demande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle Demande de Terrain Communal</DialogTitle>
              <DialogDescription>
                Remplissez le formulaire pour soumettre votre demande d'attribution
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="commune">Commune</Label>
                <Select value={newDemande.commune} onValueChange={(value) => setNewDemande(prev => ({...prev, commune: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une commune" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thies">Thiès</SelectItem>
                    <SelectItem value="dakar">Dakar</SelectItem>
                    <SelectItem value="mbour">Mbour</SelectItem>
                    <SelectItem value="saint-louis">Saint-Louis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quartier">Quartier</Label>
                <Input
                  value={newDemande.quartier}
                  onChange={(e) => setNewDemande(prev => ({...prev, quartier: e.target.value}))}
                  placeholder="Nom du quartier"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="superficie">Superficie souhaitée (m²)</Label>
                <Input
                  type="number"
                  value={newDemande.superficie_souhaitee}
                  onChange={(e) => setNewDemande(prev => ({...prev, superficie_souhaitee: e.target.value}))}
                  placeholder="500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget maximum (FCFA)</Label>
                <Input
                  type="number"
                  value={newDemande.budget_max}
                  onChange={(e) => setNewDemande(prev => ({...prev, budget_max: e.target.value}))}
                  placeholder="5000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usage">Usage prévu</Label>
                <Select value={newDemande.usage_prevu} onValueChange={(value) => setNewDemande(prev => ({...prev, usage_prevu: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'usage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="habitation">Habitation</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="mixte">Mixte</SelectItem>
                    <SelectItem value="industriel">Industriel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priorite">Priorité</Label>
                <Select value={newDemande.priorite} onValueChange={(value) => setNewDemande(prev => ({...prev, priorite: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau de priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normale">Normale</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="tres_urgente">Très Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea
                  value={newDemande.description}
                  onChange={(e) => setNewDemande(prev => ({...prev, description: e.target.value}))}
                  placeholder="Décrivez votre projet et vos besoins spécifiques..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={createDemande}>
                Soumettre la Demande
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Demandes</p>
                <p className="text-2xl font-bold text-slate-900">{demandes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">En Attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {demandes.filter(d => d.statut === 'en_attente').length}
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
                <p className="text-sm text-slate-600">Acceptées</p>
                <p className="text-2xl font-bold text-green-600">
                  {demandes.filter(d => d.statut === 'acceptee').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">En Cours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {demandes.filter(d => d.statut === 'en_cours').length}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par commune, quartier ou numéro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={loadDemandes}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <div className="grid gap-4">
        {filteredDemandes.length > 0 ? (
          filteredDemandes.map((demande) => (
            <motion.div
              key={demande.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">
                      {demande.numero_demande}
                    </h3>
                    {getStatutBadge(demande.statut)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{demande.commune} - {demande.quartier}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>{demande.superficie_souhaitee} m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{formatDate(demande.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span>{demande.usage_prevu}</span>
                    </div>
                  </div>

                  {demande.description && (
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                      {demande.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDemande(demande);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {demande.statut === 'en_attente' && (
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {demande.budget_max && (
                <div className="text-sm text-slate-600">
                  Budget maximum: <span className="font-medium">{formatPrice(demande.budget_max)}</span>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Aucune demande trouvée
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm ? 
                  'Aucune demande ne correspond à votre recherche.' :
                  'Vous n\'avez pas encore fait de demande de terrain communal.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Faire une première demande
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de visualisation détaillée */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedDemande && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selectedDemande.numero_demande}
                </DialogTitle>
                <DialogDescription>
                  Détails de votre demande de terrain communal
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatutBadge(selectedDemande.statut)}
                  <span className="text-sm text-slate-500">
                    Créée le {formatDate(selectedDemande.created_at)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Localisation</Label>
                    <p className="text-sm text-slate-600">
                      {selectedDemande.commune} - {selectedDemande.quartier}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Superficie</Label>
                    <p className="text-sm text-slate-600">
                      {selectedDemande.superficie_souhaitee} m²
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Usage prévu</Label>
                    <p className="text-sm text-slate-600">
                      {selectedDemande.usage_prevu}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Budget maximum</Label>
                    <p className="text-sm text-slate-600">
                      {selectedDemande.budget_max ? formatPrice(selectedDemande.budget_max) : 'Non spécifié'}
                    </p>
                  </div>
                </div>

                {selectedDemande.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-slate-600 mt-1">
                      {selectedDemande.description}
                    </p>
                  </div>
                )}

                {selectedDemande.commentaire_admin && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="text-sm font-medium text-blue-800">
                      Commentaire administratif
                    </Label>
                    <p className="text-sm text-blue-700 mt-1">
                      {selectedDemande.commentaire_admin}
                    </p>
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

export default ParticulierDemandesTerrains;