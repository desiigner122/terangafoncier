import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierCommunal = () => {
  const [activeTab, setActiveTab] = useState('en-cours');
  const [searchTerm, setSearchTerm] = useState('');

  // Données des demandes de terrains communaux - SUIVI UNIQUEMENT
  const [demandesTerrains] = useState({
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
      'En instruction': 'bg-blue-100 text-blue-800',
      'Documents manquants': 'bg-orange-100 text-orange-800',
      'Approuvé': 'bg-green-100 text-green-800',
      'Rejeté': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getPrioriteColor = (priorite) => {
    const colors = {
      'Urgente': 'bg-red-100 text-red-800',
      'Normale': 'bg-blue-100 text-blue-800',
      'Faible': 'bg-gray-100 text-gray-800'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800';
  };

  const DemandeCard = ({ demande, type }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{demande.libelle}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {demande.commune}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {demande.id}
              </span>
              <span>{demande.superficie}</span>
            </div>
          </div>
          <Badge className={getStatusColor(demande.statut)}>
            {demande.statut}
          </Badge>
        </div>

        {type === 'en-cours' && (
          <>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>{demande.progression}%</span>
              </div>
              <Progress value={demande.progression} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Prochaine étape:</span>
                <span>{demande.prochainEtape}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Échéance:</span>
                <span>{demande.echeance}</span>
              </div>
            </div>

            {demande.priorite && (
              <div className="mb-4">
                <Badge className={getPrioriteColor(demande.priorite)}>
                  Priorité {demande.priorite}
                </Badge>
              </div>
            )}
          </>
        )}

        {type === 'terminee' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Approuvé le {demande.dateApprobation}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>N° {demande.numeroAttestation}</span>
            </div>
          </div>
        )}

        {type === 'rejetee' && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Motif du rejet:</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{demande.motifRejet}</p>
            <p className="text-xs text-red-600 mt-2">Rejeté le {demande.dateRejet}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Déposé le {demande.dateDepot}
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
            {type === 'terminee' && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Documents
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
          Suivi des Demandes de Terrains
        </h1>
        <p className="text-gray-600">
          Suivez l'état d'avancement de toutes vos demandes de terrains communaux
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
              {demandesTerrains.enCours?.filter(d => d.statut === 'Documents manquants').length || 0}
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
        <Button>
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