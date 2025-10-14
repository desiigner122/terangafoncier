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
  Upload,
  Search,
  Filter,
  ArrowRight,
  MessageSquare,
  Phone,
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
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierCommunal = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('en-cours');
  const [searchTerm, setSearchTerm] = useState('');
  const [demandesTerrains, setDemandesTerrains] = useState({
    enCours: [],
    terminees: [],
    rejettees: []
  });

  useEffect(() => {
    if (user) {
      loadConstructionRequests();
    }
  }, [user]);

  const loadConstructionRequests = async () => {
    try {
      setLoading(true);

      // Récupérer toutes les demandes de construction
      const { data, error } = await supabase
        .from('construction_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Séparer par statut
      const enCours = data.filter(d => 
        ['submitted', 'under_review', 'in_progress'].includes(d.status)
      );
      const terminees = data.filter(d => d.status === 'completed');
      const rejettees = data.filter(d => d.status === 'rejected');

      setDemandesTerrains({ enCours, terminees, rejettees });

    } catch (error) {
      console.error('Erreur chargement demandes:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  // Fonction pour obtenir le statut en français
  const getStatusLabel = (status) => {
    const statusMap = {
      'submitted': 'Soumise',
      'under_review': 'En instruction',
      'in_progress': 'En cours',
      'completed': 'Terminée',
      'rejected': 'Rejetée'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Données filtrées pour l'affichage
  const filteredData = {
    enCours: [
      {
        id: 'DT-2024-001',
        libelle: 'Demande Terrain Résidentiel - Thiès',
        commune: 'Thiès',
        superficie: '300m²',
        dateDepot: '2024-01-15',
        statut: 'En instruction',
        progression: 60,
        prochainEtape: 'Validation commission technique',
        echeance: '2024-02-15',
        priorite: 'Normale',
        documents: [
          { nom: 'Formulaire de demande', statut: 'Validé' },
          { nom: 'Plan de situation', statut: 'Validé' },
          { nom: 'Justificatif revenus', statut: 'En attente' }
        ],
        historique: [
          { date: '2024-01-15', action: 'Dépôt de la demande', responsable: 'Service Accueil' },
          { date: '2024-01-20', action: 'Vérification dossier', responsable: 'Agent Technique' },
          { date: '2024-01-25', action: 'Demande pièce complémentaire', responsable: 'Commission' }
        ]
      },
      {
        id: 'DT-2024-002',
        libelle: 'Demande Terrain Commercial - Mbour',
        commune: 'Mbour',
        superficie: '500m²',
        dateDepot: '2024-01-22',
        statut: 'Documents manquants',
        progression: 25,
        prochainEtape: 'Compléter le dossier',
        echeance: '2024-02-05',
        priorite: 'Urgente',
        documents: [
          { nom: 'Formulaire de demande', statut: 'Validé' },
          { nom: 'Plan de situation', statut: 'Manquant' },
          { nom: 'Justificatif activité', statut: 'Manquant' }
        ],
        historique: [
          { date: '2024-01-22', action: 'Dépôt de la demande', responsable: 'Service Accueil' },
          { date: '2024-01-28', action: 'Demande documents manquants', responsable: 'Agent Technique' }
        ]
      }
    ],
    terminees: [
      {
        id: 'DT-2023-045',
        libelle: 'Demande Terrain Résidentiel - Kaolack',
        commune: 'Kaolack',
        superficie: '250m²',
        dateDepot: '2023-11-10',
        statut: 'Approuvé',
        progression: 100,
        dateApprobation: '2023-12-15',
        numeroAttestation: 'ATT-2023-045',
        documents: [
          { nom: 'Attestation d\'attribution', statut: 'Délivré' },
          { nom: 'Plan parcellaire', statut: 'Délivré' }
        ]
      }
    ],
    rejettees: [
      {
        id: 'DT-2023-032',
        libelle: 'Demande Terrain Industriel - Diourbel',
        commune: 'Diourbel',
        superficie: '1000m²',
        dateDepot: '2023-10-05',
        statut: 'Rejeté',
        motifRejet: 'Zone non constructible selon POS',
        dateRejet: '2023-11-20'
      }
    ]
  });

  const getStatusColor = (statut) => {
    const colors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-blue-100 text-blue-800',
      'additional_info_required': 'bg-orange-100 text-orange-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'submitted': 'Soumise',
      'under_review': 'En instruction',
      'additional_info_required': 'Documents manquants',
      'approved': 'Approuvée',
      'rejected': 'Rejetée'
    };
    return labels[statut] || statut;
  };

  const getPrioriteColor = (priorite) => {
    const colors = {
      'elevee': 'bg-red-100 text-red-800',
      'normale': 'bg-blue-100 text-blue-800',
      'faible': 'bg-gray-100 text-gray-800'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800';
  };

  const DemandeCard = ({ demande, type }) => {
    const documents = demande.documents || [];
    const history = demande.history || [];
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {demande.zone?.name || 'Zone communale'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {demande.zone?.commune}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {demande.request_number || demande.id.slice(0, 8)}
                </span>
                {demande.zone?.lot_size && (
                  <span>{demande.zone.lot_size}m²</span>
                )}
              </div>
            </div>
            <Badge className={getStatusColor(demande.status)}>
              {getStatusLabel(demande.status)}
            </Badge>
          </div>

          {type === 'en-cours' && (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span>{demande.progress_percentage || 0}%</span>
                </div>
                <Progress value={demande.progress_percentage || 0} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {demande.current_step && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Étape actuelle:</span>
                    <span>{demande.current_step}</span>
                  </div>
                )}
                {demande.deadline_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">Échéance:</span>
                    <span>{new Date(demande.deadline_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>

              {demande.priority && (
                <div className="mb-4">
                  <Badge className={getPrioriteColor(demande.priority)}>
                    Priorité {demande.priority}
                  </Badge>
                </div>
              )}
            </>
          )}

          {type === 'terminee' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
              {demande.approved_at && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Approuvé le {new Date(demande.approved_at).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              {demande.attribution_number && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>N° {demande.attribution_number}</span>
                </div>
              )}
            </div>
          )}

          {type === 'rejetee' && demande.rejection_reason && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Motif du rejet:</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{demande.rejection_reason}</p>
              {demande.rejected_at && (
                <p className="text-xs text-red-600 mt-2">
                  Rejeté le {new Date(demande.rejected_at).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Déposée le {new Date(demande.submitted_at || demande.created_at).toLocaleDateString('fr-FR')}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/acheteur/zones-communales`)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
              {type === 'terminee' && demande.attribution_certificate_url && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(demande.attribution_certificate_url, '_blank')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Certificat
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Demandes de Construction
        </h1>
        <p className="text-gray-600">
          Suivez l'état d'avancement de vos projets de construction
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {demandesTerrains.enCours?.length || 0}
            </div>
            <div className="text-sm text-gray-600">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {demandesTerrains.terminees?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Approuvées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {demandesTerrains.rejettees?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Rejetées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {demandesTerrains.enCours?.filter(d => d.status === 'additional_info_required').length || 0}
            </div>
            <div className="text-sm text-gray-600">Documents manquants</div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par référence, commune..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={() => navigate('/zones-communales')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Demande
        </Button>
      </div>

      {/* Onglets de suivi */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en-cours">En Cours ({demandesTerrains.enCours?.length})</TabsTrigger>
          <TabsTrigger value="terminees">Terminées ({demandesTerrains.terminees?.length})</TabsTrigger>
          <TabsTrigger value="rejettees">Rejetées ({demandesTerrains.rejettees?.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours" className="mt-6">
          <div className="space-y-4">
            {demandesTerrains.enCours?.map((demande) => (
              <DemandeCard key={demande.id} demande={demande} type="en-cours" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="terminees" className="mt-6">
          <div className="space-y-4">
            {demandesTerrains.terminees?.map((demande) => (
              <DemandeCard key={demande.id} demande={demande} type="terminee" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejettees" className="mt-6">
          <div className="space-y-4">
            {demandesTerrains.rejettees?.map((demande) => (
              <DemandeCard key={demande.id} demande={demande} type="rejetee" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierCommunal;