import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2,
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  MapPin,
  Ruler,
  Home,
  Shield,
  Download,
  Upload,
  MessageSquare,
  Phone,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/config/supabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierConstructions = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('en_cours');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [permisConstructions, setPermisConstructions] = useState([]);

  useEffect(() => {
    if (user) {
      loadConstructionRequests();
    }
  }, [user]);

  const loadConstructionRequests = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('construction_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPermisConstructions(data || []);

    } catch (error) {
      console.error('Erreur chargement demandes construction:', error);
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

  // Dossiers de permis de construire - SUIVI ADMINISTRATIF
  const [permisConstructions_mock_removed] = useState([
    {
      id: 'PC-2024-007',
      libelle: 'Villa R+1 - Cité Keur Gorgui',
      adresse: 'Lot 45, Cité Keur Gorgui, Dakar',
      typeConstruction: 'Villa individuelle',
      nombreNiveaux: 'R+1',
      superficie: '180m²',
      surfaceConstruction: '120m²',
      statut: 'Documents manquants',
      progression: 40,
      prochainEtape: 'Fournir étude géotechnique',
      echeance: '2024-03-20',
      dateDepot: '2024-01-20',
      dateModification: '2024-01-26',
      priorite: 'Élevée',
      service: 'Mairie de Dakar',
      instructeur: 'M. Ibrahima FALL',
      contact: '33 123 45 67',
      documentsManquants: [
        'Étude géotechnique du sol',
        'Plan de fondation validé par ingénieur',
        'Attestation de raccordement SENELEC'
      ],
      documentsObtenus: [
        'Plans architecturaux signés',
        'Titre de propriété certifié',
        'Certificat d\'urbanisme',
        'Étude d\'impact environnemental'
      ],
      etapes: [
        { nom: 'Dépôt du dossier', statut: 'Terminé', date: '2024-01-20' },
        { nom: 'Vérification administrative', statut: 'Terminé', date: '2024-01-22' },
        { nom: 'Instruction technique', statut: 'En cours', date: '2024-01-26' },
        { nom: 'Enquête publique', statut: 'En attente', date: null },
        { nom: 'Décision finale', statut: 'En attente', date: null }
      ]
    },
    {
      id: 'PC-2024-012',
      libelle: 'Maison moderne - Almadies',
      adresse: 'Villa n°23, Zone A, Almadies, Dakar',
      typeConstruction: 'Maison moderne',
      nombreNiveaux: 'R+2',
      superficie: '250m²',
      surfaceConstruction: '200m²',
      statut: 'En instruction',
      progression: 75,
      prochainEtape: 'Enquête publique',
      echeance: '2024-04-15',
      dateDepot: '2024-01-10',
      dateModification: '2024-02-01',
      priorite: 'Normale',
      service: 'Mairie de Dakar',
      instructeur: 'Mme Fatou NDIAYE',
      contact: '33 987 65 43',
      documentsManquants: [],
      documentsObtenus: [
        'Plans architecturaux complets',
        'Étude géotechnique validée',
        'Plans de fondation approuvés',
        'Attestations de raccordement',
        'Titre de propriété certifié'
      ],
      etapes: [
        { nom: 'Dépôt du dossier', statut: 'Terminé', date: '2024-01-10' },
        { nom: 'Vérification administrative', statut: 'Terminé', date: '2024-01-15' },
        { nom: 'Instruction technique', statut: 'Terminé', date: '2024-01-30' },
        { nom: 'Enquête publique', statut: 'En cours', date: '2024-02-01' },
        { nom: 'Décision finale', statut: 'En attente', date: null }
      ]
    },
    {
      id: 'PC-2023-089',
      libelle: 'Extension villa - Thiès',
      adresse: 'Quartier Hersent, Thiès',
      typeConstruction: 'Extension',
      nombreNiveaux: 'R+1',
      superficie: '80m²',
      surfaceConstruction: '60m²',
      statut: 'Approuvé',
      progression: 100,
      prochainEtape: 'Permis délivré - Retrait disponible',
      echeance: null,
      dateDepot: '2023-10-15',
      dateModification: '2023-12-20',
      dateApprobation: '2023-12-20',
      priorite: 'Normale',
      service: 'Mairie de Thiès',
      instructeur: 'M. Alioune DIOP',
      contact: '33 456 78 90',
      documentsManquants: [],
      documentsObtenus: [
        'Plans d\'extension validés',
        'Autorisation de construire',
        'Certificat de conformité',
        'Permis de construire définitif'
      ],
      etapes: [
        { nom: 'Dépôt du dossier', statut: 'Terminé', date: '2023-10-15' },
        { nom: 'Vérification administrative', statut: 'Terminé', date: '2023-10-20' },
        { nom: 'Instruction technique', statut: 'Terminé', date: '2023-11-15' },
        { nom: 'Enquête publique', statut: 'Terminé', date: '2023-11-30' },
        { nom: 'Décision finale', statut: 'Terminé', date: '2023-12-20' }
      ]
    },
    {
      id: 'PC-2024-003',
      libelle: 'Immeuble R+3 - Parcelles Assainies',
      adresse: 'Unité 15, Parcelles Assainies, Dakar',
      typeConstruction: 'Immeuble résidentiel',
      nombreNiveaux: 'R+3',
      superficie: '300m²',
      surfaceConstruction: '240m²',
      statut: 'Rejeté',
      progression: 30,
      prochainEtape: 'Recours ou nouvelle demande',
      echeance: null,
      dateDepot: '2024-01-05',
      dateModification: '2024-01-30',
      dateRejet: '2024-01-30',
      priorite: 'Faible',
      service: 'Mairie de Dakar',
      instructeur: 'M. Moussa KANE',
      contact: '33 234 56 78',
      motifRejet: 'Non-conformité aux règles d\'urbanisme - Hauteur excessive pour la zone',
      documentsManquants: [],
      documentsObtenus: [
        'Plans architecturaux',
        'Titre de propriété'
      ],
      etapes: [
        { nom: 'Dépôt du dossier', statut: 'Terminé', date: '2024-01-05' },
        { nom: 'Vérification administrative', statut: 'Terminé', date: '2024-01-10' },
        { nom: 'Instruction technique', statut: 'Rejeté', date: '2024-01-30' },
        { nom: 'Enquête publique', statut: 'Annulé', date: null },
        { nom: 'Décision finale', statut: 'Rejeté', date: '2024-01-30' }
      ]
    }
  ]);

  const getStatutColor = (statut) => {
    const colors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      'submitted': 'Soumise',
      'under_review': 'En instruction',
      'in_progress': 'En cours',
      'completed': 'Complétée',
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

  const filteredPermis = permisConstructions.filter(permis => {
    let matchesTab = true;
    if (activeTab === 'en_cours') {
      matchesTab = ['submitted', 'under_review', 'in_progress'].includes(permis.status);
    } else if (activeTab === 'approuves') {
      matchesTab = permis.status === 'completed';
    } else if (activeTab === 'rejetes') {
      matchesTab = permis.status === 'rejected';
    }

    const matchesSearch = 
      (permis.project_title && permis.project_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (permis.request_number && permis.request_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (permis.location && permis.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'tous' || 
      (permis.construction_type && permis.construction_type.toLowerCase().includes(filterType.toLowerCase()));
    
    return matchesTab && matchesSearch && matchesFilter;
  });

  const PermisCard = ({ permis }) => {
    const documents = permis.documents || [];

    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-3 rounded-lg bg-blue-100">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{permis.project_title || 'Projet de construction'}</h3>
                  <Badge variant="outline" className="text-xs">
                    {permis.request_number || permis.id.slice(0, 8)}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  {permis.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {permis.location}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {permis.construction_type && <span><Home className="w-4 h-4 inline mr-1" />{permis.construction_type}</span>}
                    {permis.desired_surface && <span><Ruler className="w-4 h-4 inline mr-1" />{permis.desired_surface}m²</span>}
                  </div>
                  {permis.budget_estimate && (
                    <div className="text-blue-600 font-medium">
                      Budget: {formatPrice(permis.budget_estimate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Badge className={getStatutColor(permis.status)}>
              {getStatutLabel(permis.status)}
            </Badge>
          </div>

          {/* Progression */}
          {permis.progress_percentage !== null && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>{permis.progress_percentage}%</span>
              </div>
              <Progress value={permis.progress_percentage} className="h-2" />
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            {permis.submitted_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span>Soumise: {new Date(permis.submitted_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {permis.estimated_start_date && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Début prévu: {new Date(permis.estimated_start_date).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {permis.estimated_completion_date && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Fin prévue: {new Date(permis.estimated_completion_date).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Créée le {new Date(permis.created_at).toLocaleDateString('fr-FR')}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/acheteur/constructions')}
              >
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
              {permis.plans_url && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(permis.plans_url, '_blank')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Plans
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {permis.typeConstruction}
                    </span>
                    <span className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      {permis.superficie}
                    </span>
                    <span>{permis.nombreNiveaux}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {permis.service} - {permis.instructeur}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatutColor(permis.statut)}>
                {permis.statut}
              </Badge>
              <Badge className={getPrioriteColor(permis.priorite)} variant="outline">
                {permis.priorite}
              </Badge>
            </div>
          </div>

          {/* Progression */}
          {permis.statut !== 'Rejeté' && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>{permis.progression}%</span>
              </div>
              <Progress value={permis.progression} className="h-2" />
            </div>
          )}

          {/* Prochaine étape */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Prochaine étape:</span>
            <span>{permis.prochainEtape}</span>
          </div>

          {/* Échéance */}
          {permis.echeance && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Échéance:</span>
              <span>{permis.echeance}</span>
            </div>
          )}

          {/* Documents manquants */}
          {permis.documentsManquants && permis.documentsManquants.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">Documents manquants:</span>
              </div>
              <ul className="text-sm text-orange-700 ml-6 list-disc">
                {permis.documentsManquants.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Motif de rejet */}
          {permis.motifRejet && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Motif de rejet:</span>
              </div>
              <p className="text-sm text-red-700">{permis.motifRejet}</p>
            </div>
          )}

          {/* Étapes */}
          <div className="mb-4">
            <h4 className="font-medium mb-3">Étapes du traitement</h4>
            <div className="space-y-2">
              {permis.etapes.map((etape, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{etape.nom}</span>
                  <div className="flex items-center gap-2">
                    {etape.date && (
                      <span className="text-xs text-gray-500">{etape.date}</span>
                    )}
                    <Badge className={getEtapeStatutColor(etape.statut)} variant="outline">
                      {etape.statut}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xs text-gray-500">
              Déposé le {permis.dateDepot} • Modifié le {permis.dateModification}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Documents
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const stats = {
    total: permisConstructions.length,
    enCours: permisConstructions.filter(p => ['En instruction', 'Documents manquants'].includes(p.statut)).length,
    approuves: permisConstructions.filter(p => p.statut === 'Approuvé').length,
    rejetes: permisConstructions.filter(p => p.statut === 'Rejeté').length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          Permis de Construire
        </h1>
        <p className="text-gray-600">
          Suivi de vos demandes de permis de construire et autorisations d'urbanisme
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total demandes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.enCours}
            </div>
            <div className="text-sm text-gray-600">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.approuves}
            </div>
            <div className="text-sm text-gray-600">Approuvés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejetes}
            </div>
            <div className="text-sm text-gray-600">Rejetés</div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un permis de construire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'tous' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('tous')}
          >
            Tous
          </Button>
          <Button
            variant={filterType === 'villa' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('villa')}
          >
            Villas
          </Button>
          <Button
            variant={filterType === 'immeuble' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('immeuble')}
          >
            Immeubles
          </Button>
          <Button
            variant={filterType === 'extension' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('extension')}
          >
            Extensions
          </Button>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tous">Tous</TabsTrigger>
          <TabsTrigger value="en_cours">En Cours</TabsTrigger>
          <TabsTrigger value="approuves">Approuvés</TabsTrigger>
          <TabsTrigger value="rejetes">Rejetés</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Liste des permis */}
      <div className="space-y-4">
        {filteredPermis.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun permis de construire trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Aucun résultat pour votre recherche' : 'Vous n\'avez pas encore déposé de demande de permis'}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Déposer une nouvelle demande
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPermis.map((permis) => (
            <PermisCard key={permis.id} permis={permis} />
          ))
        )}
      </div>
    </div>
  );
};

export default ParticulierConstructions;