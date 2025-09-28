import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierPromoteurs = () => {
  const [activeTab, setActiveTab] = useState('en-cours');
  const [searchTerm, setSearchTerm] = useState('');

  // Données des candidatures aux projets promoteurs - SUIVI UNIQUEMENT
  const [candidaturesPromoteurs] = useState({
    enCours: [
      {
        id: 'CP-2024-003',
        libelle: 'Candidature Résidence Les Palmiers',
        promoteur: 'TERANGA CONSTRUCTION',
        projet: 'Résidence Les Palmiers - Phase 2',
        localisation: 'Cité Keur Gorgui, Dakar',
        typeLogement: 'Villa F4',
        superficieTotale: '200m²',
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
      'En instruction': 'bg-blue-100 text-blue-800',
      'Pré-sélectionné': 'bg-yellow-100 text-yellow-800',
      'Accepté': 'bg-green-100 text-green-800',
      'Rejeté': 'bg-red-100 text-red-800'
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

  const CandidatureCard = ({ candidature, type }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{candidature.libelle}</h3>
            <div className="space-y-1 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span className="font-medium">{candidature.promoteur}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {candidature.localisation}
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {candidature.id}
                </span>
                <span>{candidature.typeLogement}</span>
                <span>{candidature.superficieTotale}</span>
              </div>
            </div>
            {candidature.prixTotal && (
              <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                <DollarSign className="w-4 h-4" />
                {parseInt(candidature.prixTotal).toLocaleString()} FCFA
              </div>
            )}
          </div>
          <Badge className={getStatusColor(candidature.statut)}>
            {candidature.statut}
          </Badge>
        </div>

        {type === 'en-cours' && (
          <>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>{candidature.progression}%</span>
              </div>
              <Progress value={candidature.progression} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Prochaine étape:</span>
                <span>{candidature.prochainEtape}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Échéance:</span>
                <span>{candidature.echeance}</span>
              </div>
            </div>

            {candidature.priorite && (
              <div className="mb-4">
                <Badge className={getPrioriteColor(candidature.priorite)}>
                  Priorité {candidature.priorite}
                </Badge>
              </div>
            )}
          </>
        )}

        {type === 'acceptee' && (
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Accepté le {candidature.dateAcceptation}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Contrat: {candidature.numeroContrat}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Signé le {candidature.dateSignature}</span>
            </div>
          </div>
        )}

        {type === 'rejetee' && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-800 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Motif du rejet:</span>
            </div>
            <p className="text-sm text-red-700 mb-2">{candidature.motifRejet}</p>
            <div className="text-xs text-red-600">
              Rejeté le {candidature.dateRejet}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Candidature déposée le {candidature.dateCandidature}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Détails
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              Contact
            </Button>
            {type === 'acceptee' && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Contrat
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
              {candidaturesPromoteurs.enCours?.filter(c => c.statut === 'Pré-sélectionné').length || 0}
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
        <Button>
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