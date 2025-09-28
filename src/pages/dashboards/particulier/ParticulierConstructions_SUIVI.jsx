import React, { useState } from 'react';
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
  Phone
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierConstructions = () => {
  const [activeTab, setActiveTab] = useState('en_cours');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');

  // Dossiers de permis de construire - SUIVI ADMINISTRATIF
  const [permisConstructions] = useState([
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
      'En instruction': 'bg-blue-100 text-blue-800',
      'Documents manquants': 'bg-orange-100 text-orange-800',
      'Approuvé': 'bg-green-100 text-green-800',
      'Rejeté': 'bg-red-100 text-red-800',
      'En attente': 'bg-gray-100 text-gray-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getPrioriteColor = (priorite) => {
    const colors = {
      'Élevée': 'bg-red-100 text-red-800',
      'Normale': 'bg-blue-100 text-blue-800',
      'Faible': 'bg-gray-100 text-gray-800'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800';
  };

  const getEtapeStatutColor = (statut) => {
    const colors = {
      'Terminé': 'bg-green-100 text-green-800',
      'En cours': 'bg-blue-100 text-blue-800',
      'En attente': 'bg-gray-100 text-gray-800',
      'Rejeté': 'bg-red-100 text-red-800',
      'Annulé': 'bg-gray-100 text-gray-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const filteredPermis = permisConstructions.filter(permis => {
    let matchesTab = true;
    if (activeTab === 'en_cours') {
      matchesTab = ['En instruction', 'Documents manquants'].includes(permis.statut);
    } else if (activeTab === 'approuves') {
      matchesTab = permis.statut === 'Approuvé';
    } else if (activeTab === 'rejetes') {
      matchesTab = permis.statut === 'Rejeté';
    }

    const matchesSearch = permis.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permis.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permis.adresse.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'tous' || permis.typeConstruction.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesTab && matchesSearch && matchesFilter;
  });

  const PermisCard = ({ permis }) => {
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
                  <h3 className="font-semibold text-lg">{permis.libelle}</h3>
                  <Badge variant="outline" className="text-xs">
                    {permis.id}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {permis.adresse}
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