import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building,
  Users,
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
  MessageSquare,
  Phone,
  RefreshCw,
  AlertTriangle,
  FileText,
  DollarSign,
  Star,
  Plus,
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

const ParticulierPromoteurs = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('en-cours');
  const [searchTerm, setSearchTerm] = useState('');
  const [candidaturesPromoteurs, setCandidaturesPromoteurs] = useState({
    enCours: [],
    acceptees: [],
    rejettees: []
  });

  useEffect(() => {
    if (user) {
      loadDeveloperApplications();
    }
  }, [user]);

  const loadDeveloperApplications = async () => {
    try {
      setLoading(true);

      // Récupérer toutes les candidatures avec JOINs
      const { data, error } = await supabase
        .from('developer_project_applications')
        .select(`
          *,
          project:developer_projects (
            id, title, developer_name, city, project_type, price_min, price_max
          ),
          developer:profiles!developer_id (
            id, full_name, phone
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Séparer par statut
      const enCours = data.filter(d => 
        ['submitted', 'under_review', 'shortlisted'].includes(d.status)
      );
      const acceptees = data.filter(d => d.status === 'accepted');
      const rejettees = data.filter(d => d.status === 'rejected');

      setCandidaturesPromoteurs({ enCours, acceptees, rejettees });

    } catch (error) {
      console.error('Erreur chargement candidatures:', error);
      toast.error('Erreur lors du chargement des candidatures');
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
      setLoadingPromoteurs(false);
    }
  }, [user?.id]);

  const loadCandidaturesPromoteurs = async () => {
    if (!user?.id) {
      console.log('❌ Utilisateur non disponible');
      setLoadingPromoteurs(false);
      return;
    }

    try {
      setLoadingPromoteurs(true);
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
      setLoadingPromoteurs(false);
    }
  };
        prixTotal: '45000000',
        dateCandidature: '2024-01-10',
        statut: 'Pré-sélectionné',
        progression: 70,
        prochainEtape: 'Entretien final avec promoteur',
        echeance: '2024-02-15',
        priorite: 'Élevée',
        documents: [
          { nom: 'Dossier de candidature', statut: 'Validé' },
          { nom: 'Justificatifs revenus', statut: 'Validé' },
          { nom: 'Lettre motivation', statut: 'Validé' },
          { nom: 'Garanties bancaires', statut: 'En cours' }
        ],
        historique: [
          { date: '2024-01-10', action: 'Soumission candidature', responsable: 'TERANGA CONSTRUCTION' },
          { date: '2024-01-15', action: 'Validation dossier initial', responsable: 'Service Commercial' },
          { date: '2024-01-22', action: 'Pré-sélection confirmée', responsable: 'Commission Sélection' },
          { date: '2024-02-01', action: 'Convocation entretien final', responsable: 'Direction Commerciale' }
        ]
      },
      {
        id: 'CP-2024-008',
        libelle: 'Candidature Cité Moderne Thiès',
        promoteur: 'HABITAT PLUS',
        projet: 'Cité Moderne - Thiès',
        localisation: 'Zone Extension, Thiès',
        typeLogement: 'Appartement F3',
        superficieTotale: '85m²',
        prixTotal: '22000000',
        dateCandidature: '2024-02-05',
        statut: 'En instruction',
        progression: 35,
        prochainEtape: 'Validation critères éligibilité',
        echeance: '2024-03-05',
        priorite: 'Normale',
        documents: [
          { nom: 'Dossier de candidature', statut: 'Validé' },
          { nom: 'Justificatifs revenus', statut: 'En cours' },
          { nom: 'Références bancaires', statut: 'Manquant' }
        ],
        historique: [
          { date: '2024-02-05', action: 'Soumission candidature', responsable: 'HABITAT PLUS' },
          { date: '2024-02-08', action: 'Accusé réception', responsable: 'Service Commercial' }
        ]
      }
    ],
    acceptees: [
      {
        id: 'CP-2023-045',
        libelle: 'Candidature Villa Almadies',
        promoteur: 'SÉNÉGAL IMMOBILIER',
        projet: 'Villa Almadies Premium',
        localisation: 'Almadies, Dakar',
        typeLogement: 'Villa F5',
        superficieTotale: '250m²',
        prixTotal: '65000000',
        dateCandidature: '2023-10-15',
        statut: 'Accepté',
        progression: 100,
        dateAcceptation: '2023-12-01',
        numeroContrat: 'CTR-2023-045',
        dateSignature: '2023-12-15',
        documents: [
          { nom: 'Contrat signé', statut: 'Finalisé' },
          { nom: 'Plan logement', statut: 'Remis' },
          { nom: 'Calendrier travaux', statut: 'Remis' }
        ]
      }
    ],
    rejettees: [
      {
        id: 'CP-2023-032',
        libelle: 'Candidature Résidence Mbour',
        promoteur: 'CÔTE CONSTRUCTION',
        projet: 'Résidence Balnéaire Mbour',
        localisation: 'Saly, Mbour',
        typeLogement: 'Appartement F4',
        superficieTotale: '120m²',
        prixTotal: '28000000',
        dateCandidature: '2023-09-20',
        statut: 'Rejeté',
        motifRejet: 'Profil financier non conforme aux critères du projet',
        dateRejet: '2023-11-10'
      }
    ]
  });

  const getStatusColor = (statut) => {
    const colors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-blue-100 text-blue-800',
      'shortlisted': 'bg-yellow-100 text-yellow-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'submitted': 'Soumise',
      'under_review': 'En instruction',
      'shortlisted': 'Pré-sélectionnée',
      'accepted': 'Acceptée',
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

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const CandidatureCard = ({ candidature, type }) => {
    const project = candidature.project || {};
    const developer = candidature.developer || {};

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {project.title || 'Projet promoteur'}
              </h3>
              <div className="space-y-1 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">{project.developer_name || developer.full_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.city || 'Localisation'}
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {candidature.application_number || candidature.id.slice(0, 8)}
                  </span>
                  {candidature.unit_type && <span>{candidature.unit_type}</span>}
                  {candidature.unit_surface && <span>{candidature.unit_surface}</span>}
                </div>
              </div>
              {candidature.total_price && (
                <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                  <DollarSign className="w-4 h-4" />
                  {formatPrice(candidature.total_price)}
                </div>
              )}
            </div>
            <Badge className={getStatusColor(candidature.status)}>
              {getStatusLabel(candidature.status)}
            </Badge>
          </div>

          {type === 'en-cours' && (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span>{candidature.progress_percentage || 0}%</span>
                </div>
                <Progress value={candidature.progress_percentage || 0} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {candidature.current_step && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Étape:</span>
                    <span>{candidature.current_step}</span>
                  </div>
                )}
                {candidature.deadline_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">Échéance:</span>
                    <span>{new Date(candidature.deadline_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>

              {candidature.priority && (
                <div className="mb-4">
                  <Badge className={getPrioriteColor(candidature.priority)}>
                    Priorité {candidature.priority}
                  </Badge>
                </div>
              )}
            </>
          )}

          {type === 'acceptee' && (
            <div className="space-y-2 mb-4 text-sm">
              {candidature.decision_date && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Acceptée le {new Date(candidature.decision_date).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              {candidature.interview_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Entretien: {new Date(candidature.interview_date).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          )}

          {type === 'rejetee' && candidature.decision_reason && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-red-800 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Motif du rejet:</span>
              </div>
              <p className="text-sm text-red-700 mb-2">{candidature.decision_reason}</p>
              {candidature.decision_date && (
                <div className="text-xs text-red-600">
                  Rejeté le {new Date(candidature.decision_date).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Soumise le {new Date(candidature.submitted_at || candidature.created_at).toLocaleDateString('fr-FR')}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/acheteur/promoteurs')}
              >
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
              {developer.phone && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`tel:${developer.phone}`)}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact
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
          Suivi des Candidatures Promoteurs
        </h1>
        <p className="text-gray-600">
          Suivez l'état d'avancement de toutes vos candidatures aux projets promoteurs
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {candidaturesPromoteurs.enCours?.length || 0}
            </div>
            <div className="text-sm text-gray-600">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {candidaturesPromoteurs.acceptees?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Acceptées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {candidaturesPromoteurs.rejettees?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Rejetées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {candidaturesPromoteurs.enCours?.filter(c => c.status === 'shortlisted').length || 0}
            </div>
            <div className="text-sm text-gray-600">Pré-sélectionnées</div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par référence, promoteur, projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={() => navigate('/projets-promoteurs')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Candidature
        </Button>
      </div>

      {/* Onglets de suivi */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en-cours">En Cours ({candidaturesPromoteurs.enCours?.length})</TabsTrigger>
          <TabsTrigger value="acceptees">Acceptées ({candidaturesPromoteurs.acceptees?.length})</TabsTrigger>
          <TabsTrigger value="rejettees">Rejetées ({candidaturesPromoteurs.rejettees?.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours" className="mt-6">
          <div className="space-y-4">
            {candidaturesPromoteurs.enCours?.map((candidature) => (
              <CandidatureCard key={candidature.id} candidature={candidature} type="en-cours" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="acceptees" className="mt-6">
          <div className="space-y-4">
            {candidaturesPromoteurs.acceptees?.map((candidature) => (
              <CandidatureCard key={candidature.id} candidature={candidature} type="acceptee" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejettees" className="mt-6">
          <div className="space-y-4">
            {candidaturesPromoteurs.rejettees?.map((candidature) => (
              <CandidatureCard key={candidature.id} candidature={candidature} type="rejetee" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierPromoteurs;