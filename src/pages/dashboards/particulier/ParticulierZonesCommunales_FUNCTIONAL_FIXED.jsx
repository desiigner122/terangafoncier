import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin,
  Building2,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Search,
  Filter,
  RefreshCw,
  DollarSign,
  Calendar,
  ExternalLink,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';

const ParticulierZonesCommunales = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const [loading, setLoading] = useState(true);
  const [candidatures, setCandidatures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadCandidatures();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadCandidatures = async () => {
    if (!user?.id) {
      console.log('❌ Utilisateur non disponible');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📊 Chargement des candidatures zones communales...');

      const { data, error } = await supabase
        .from('candidatures_zones_communales')
        .select(`
          *,
          zone:zone_id(
            id, nom, commune, superficie_lot, prix_unitaire, description, statut
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCandidatures(data || []);
      console.log(`✅ ${data?.length || 0} candidatures chargées`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des candidatures:', error);
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

  const filteredCandidatures = candidatures.filter(candidature =>
    candidature.zone?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.zone?.commune?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidature.numero_dossier.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Zones Communales</h1>
          <p className="text-slate-600 mt-1">
            Suivi de vos candidatures aux parcelles d'aménagement communal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {candidatures.length} candidature{candidatures.length !== 1 ? 's' : ''}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadCandidatures}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* Carte d'information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Candidatures aux zones communales
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  Cette page vous permet de suivre vos candidatures existantes. 
                  Pour découvrir et postuler à de nouvelles zones, rendez-vous sur notre site public.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Découvrir les zones disponibles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques rapides */}
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
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-900">{candidatures.length}</p>
              </div>
              <FileText className="h-8 w-8 text-slate-700" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">En Attente</p>
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
                <p className="text-sm text-slate-600">En Instruction</p>
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
                <p className="text-sm text-slate-600">Acceptées</p>
                <p className="text-2xl font-bold text-green-600">
                  {candidatures.filter(c => c.statut === 'acceptee').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Barre de recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par zone, commune ou n° dossier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Liste des candidatures */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {filteredCandidatures.map((candidature, index) => (
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
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {candidature.zone?.nom || 'Zone non spécifiée'}
                      </h3>
                      <Badge className={`border ${getStatusColor(candidature.statut)}`}>
                        {getStatusIcon(candidature.statut)}
                        <span className="ml-1">{getStatusLabel(candidature.statut)}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{candidature.zone?.commune || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Superficie:</span> {candidature.superficie_demandee}m²
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span> {(candidature.budget_disponible / 1000000).toFixed(1)}M FCFA
                      </div>
                      <div>
                        <span className="font-medium">N° Dossier:</span> {candidature.numero_dossier}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(candidature.date_candidature || candidature.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <div>
                        <span className="font-medium">Financement:</span> {candidature.type_financement?.replace('_', ' ') || 'N/A'}
                      </div>
                    </div>

                    {candidature.projet_description && (
                      <div className="text-sm text-slate-600 mb-3">
                        <span className="font-medium">Projet:</span> {candidature.projet_description}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedCandidature(candidature);
                        setIsViewModalOpen(true);
                      }}
                    >
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

      {filteredCandidatures.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12"
        >
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {searchTerm ? 'Aucun résultat' : 'Aucune candidature'}
          </h3>
          <p className="text-slate-600 mb-4">
            {searchTerm 
              ? 'Aucune candidature ne correspond à votre recherche' 
              : 'Vous n\'avez pas encore soumis de candidature pour les zones communales'
            }
          </p>
          {!searchTerm && (
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Découvrir les zones disponibles
            </Button>
          )}
        </motion.div>
      )}

      {/* Modal de détails */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
            <DialogDescription>
              Informations complètes sur votre candidature
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidature && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Zone</Label>
                  <p className="text-slate-900">{selectedCandidature.zone?.nom}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Commune</Label>
                  <p className="text-slate-900">{selectedCandidature.zone?.commune}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">N° de dossier</Label>
                  <p className="text-slate-900">{selectedCandidature.numero_dossier}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Statut</Label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedCandidature.statut)}
                    <span>{getStatusLabel(selectedCandidature.statut)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Superficie demandée</Label>
                  <p className="text-slate-900">{selectedCandidature.superficie_demandee}m²</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Budget disponible</Label>
                  <p className="text-slate-900">{(selectedCandidature.budget_disponible / 1000000).toFixed(1)}M FCFA</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Type de financement</Label>
                  <p className="text-slate-900">{selectedCandidature.type_financement?.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Délai de construction</Label>
                  <p className="text-slate-900">{selectedCandidature.delai_construction}</p>
                </div>
              </div>

              {selectedCandidature.projet_description && (
                <div>
                  <Label className="text-sm font-medium text-slate-700">Description du projet</Label>
                  <p className="text-slate-900 mt-1">{selectedCandidature.projet_description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticulierZonesCommunales;