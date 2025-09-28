import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Building2,
  Shield,
  Star,
  Folder,
  Archive,
  Share2,
  Paperclip
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierDocuments = () => {
  const [activeTab, setActiveTab] = useState('mes_documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');

  // Documents administratifs organisés par dossier - SUIVI DOCUMENTAIRE
  const [documents] = useState([
    // Documents pour DT-2024-001 (Demande Terrain)
    {
      id: 'DOC-001',
      dossierRef: 'DT-2024-001',
      nom: 'Demande initiale terrain communal',
      type: 'demande',
      format: 'PDF',
      taille: '2.3 MB',
      dateCreation: '2024-01-15',
      dateModification: '2024-01-15',
      statut: 'Validé',
      proprietaire: 'Système',
      description: 'Formulaire de demande de terrain communal dûment rempli et signé',
      version: '1.0',
      acces: 'Lecture seule',
      etape: 'Soumission',
      priorite: 'Normale',
      actions: ['Télécharger', 'Partager', 'Historique']
    },
    {
      id: 'DOC-002',
      dossierRef: 'DT-2024-001',
      nom: 'Copie CNI certifiée conforme',
      type: 'identite',
      format: 'PDF',
      taille: '850 KB',
      dateCreation: '2024-01-15',
      dateModification: '2024-01-15',
      statut: 'En vérification',
      proprietaire: 'Citoyen',
      description: 'Copie de la carte d\'identité nationale certifiée conforme',
      version: '1.0',
      acces: 'Lecture/Écriture',
      etape: 'Vérification identité',
      priorite: 'Élevée',
      actions: ['Télécharger', 'Remplacer', 'Valider']
    },
    {
      id: 'DOC-003',
      dossierRef: 'DT-2024-001',
      nom: 'Plan de situation du terrain',
      type: 'plan',
      format: 'PDF',
      taille: '4.2 MB',
      dateCreation: '2024-01-25',
      dateModification: '2024-01-28',
      statut: 'Approuvé',
      proprietaire: 'Commission Technique',
      description: 'Plan cadastral avec délimitation précise du terrain demandé',
      version: '2.0',
      acces: 'Lecture seule',
      etape: 'Validation technique',
      priorite: 'Élevée',
      actions: ['Télécharger', 'Voir versions', 'Imprimer']
    },

    // Documents pour PC-2024-007 (Permis de Construire)
    {
      id: 'DOC-004',
      dossierRef: 'PC-2024-007',
      nom: 'Dossier permis de construire',
      type: 'permis',
      format: 'PDF',
      taille: '8.7 MB',
      dateCreation: '2024-01-20',
      dateModification: '2024-01-22',
      statut: 'Incomplet',
      proprietaire: 'Citoyen',
      description: 'Dossier complet de demande de permis de construire pour villa R+1',
      version: '1.2',
      acces: 'Lecture/Écriture',
      etape: 'Complément documents',
      priorite: 'Élevée',
      manquant: ['Étude géotechnique', 'Plan fondation', 'Attestation SENELEC'],
      echeance: '2024-02-25',
      actions: ['Télécharger', 'Compléter', 'Soumettre']
    },
    {
      id: 'DOC-005',
      dossierRef: 'PC-2024-007',
      nom: 'Plans architecturaux',
      type: 'plan',
      format: 'DWG',
      taille: '12.1 MB',
      dateCreation: '2024-01-20',
      dateModification: '2024-01-20',
      statut: 'Validé',
      proprietaire: 'Architecte',
      description: 'Plans complets (façades, coupes, plans étages) signés par architecte agréé',
      version: '1.0',
      acces: 'Lecture seule',
      etape: 'Validation architecturale',
      priorite: 'Normale',
      actions: ['Télécharger', 'Convertir PDF', 'Partager']
    },

    // Documents pour CP-2024-003 (Candidature Promoteur)
    {
      id: 'DOC-006',
      dossierRef: 'CP-2024-003',
      nom: 'Dossier de candidature',
      type: 'candidature',
      format: 'PDF',
      taille: '3.2 MB',
      dateCreation: '2024-01-30',
      dateModification: '2024-02-01',
      statut: 'Soumis',
      proprietaire: 'Citoyen',
      description: 'Dossier complet de candidature pour la Résidence Les Palmiers',
      version: '1.1',
      acces: 'Lecture seule',
      etape: 'Évaluation promoteur',
      priorite: 'Normale',
      actions: ['Télécharger', 'Suivre évaluation']
    },
    {
      id: 'DOC-007',
      dossierRef: 'CP-2024-003',
      nom: 'Justificatifs de revenus',
      type: 'financier',
      format: 'PDF',
      taille: '1.8 MB',
      dateCreation: '2024-01-30',
      dateModification: '2024-01-30',
      statut: 'En vérification',
      proprietaire: 'Citoyen',
      description: 'Bulletins de salaire et attestation bancaire',
      version: '1.0',
      acces: 'Confidentiel',
      etape: 'Vérification financière',
      priorite: 'Élevée',
      actions: ['Télécharger', 'Mettre à jour']
    },

    // Documents généraux
    {
      id: 'DOC-008',
      dossierRef: 'General',
      nom: 'Guide des procédures foncières',
      type: 'guide',
      format: 'PDF',
      taille: '5.5 MB',
      dateCreation: '2024-01-01',
      dateModification: '2024-01-01',
      statut: 'Publié',
      proprietaire: 'Plateforme TERANGA',
      description: 'Guide complet des procédures administratives foncières au Sénégal',
      version: '2024.1',
      acces: 'Public',
      etape: 'Information',
      priorite: 'Normale',
      actions: ['Télécharger', 'Partager', 'Imprimer']
    }
  ]);

  const getStatutColor = (statut) => {
    const colors = {
      'Validé': 'bg-green-100 text-green-800',
      'Approuvé': 'bg-green-100 text-green-800',
      'En vérification': 'bg-yellow-100 text-yellow-800',
      'Soumis': 'bg-blue-100 text-blue-800',
      'Incomplet': 'bg-red-100 text-red-800',
      'Publié': 'bg-purple-100 text-purple-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getPrioriteColor = (priorite) => {
    const colors = {
      'Élevée': 'bg-red-100 text-red-800',
      'Normale': 'bg-blue-100 text-blue-800'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'demande': FileText,
      'identite': User,
      'plan': Building2,
      'permis': Shield,
      'candidature': Star,
      'financier': Clock,
      'guide': Archive
    };
    return icons[type] || FileText;
  };

  const getAccesColor = (acces) => {
    const colors = {
      'Public': 'bg-green-100 text-green-800',
      'Lecture seule': 'bg-blue-100 text-blue-800',
      'Lecture/Écriture': 'bg-yellow-100 text-yellow-800',
      'Confidentiel': 'bg-red-100 text-red-800'
    };
    return colors[acces] || 'bg-gray-100 text-gray-800';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.dossierRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'dossiers_actifs') {
      matchesTab = ['DT-2024-001', 'PC-2024-007', 'CP-2024-003'].includes(doc.dossierRef);
    } else if (activeTab === 'documents_officiels') {
      matchesTab = ['demande', 'permis', 'plan'].includes(doc.type);
    } else if (activeTab === 'candidatures') {
      matchesTab = doc.type === 'candidature' || doc.dossierRef.startsWith('CP');
    }

    const matchesFilter = filterType === 'tous' || doc.type === filterType;
    
    return matchesSearch && matchesTab && matchesFilter;
  });

  const DocumentCard = ({ document }) => {
    const TypeIcon = getTypeIcon(document.type);

    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-blue-100">
                <TypeIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{document.nom}</h3>
                  {document.dossierRef !== 'General' && (
                    <Badge variant="outline" className="text-xs">
                      {document.dossierRef}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{document.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>{document.format}</span>
                  <span>{document.taille}</span>
                  <span>v{document.version}</span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {document.proprietaire}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  <div>Créé: {document.dateCreation}</div>
                  <div>Modifié: {document.dateModification}</div>
                  {document.echeance && (
                    <div className="text-orange-600 font-medium">
                      Échéance: {document.echeance}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatutColor(document.statut)}>
                {document.statut}
              </Badge>
              <Badge className={getPrioriteColor(document.priorite)} variant="outline">
                {document.priorite}
              </Badge>
              <Badge className={getAccesColor(document.acces)} variant="secondary">
                {document.acces}
              </Badge>
            </div>
          </div>

          {/* Documents manquants */}
          {document.manquant && document.manquant.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">Documents manquants:</span>
              </div>
              <ul className="text-sm text-orange-700 ml-6 list-disc">
                {document.manquant.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Étape actuelle */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Étape:</span>
            <span>{document.etape}</span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xs text-gray-500">
              Type: {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
            </div>
            <div className="flex gap-2">
              {document.actions.map((action, index) => (
                <Button key={index} variant="outline" size="sm">
                  {action === 'Télécharger' && <Download className="w-4 h-4 mr-1" />}
                  {action === 'Voir' && <Eye className="w-4 h-4 mr-1" />}
                  {action === 'Partager' && <Share2 className="w-4 h-4 mr-1" />}
                  {action === 'Compléter' && <Plus className="w-4 h-4 mr-1" />}
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className={`w-8 h-8 mx-auto mb-2 text-${color}-600`} />
        <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
        <div className="text-sm font-medium text-gray-900">{title}</div>
        {subtitle && <div className="text-xs text-gray-600">{subtitle}</div>}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          Gestion Documentaire
        </h1>
        <p className="text-gray-600">
          Tous vos documents administratifs organisés par dossier
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Documents total"
          value={documents.length}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="En vérification"
          value={documents.filter(d => d.statut === 'En vérification').length}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Validés"
          value={documents.filter(d => d.statut === 'Validé' || d.statut === 'Approuvé').length}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Incomplets"
          value={documents.filter(d => d.statut === 'Incomplet').length}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Avec échéance"
          value={documents.filter(d => d.echeance).length}
          subtitle="À surveiller"
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans les documents..."
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
            variant={filterType === 'demande' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('demande')}
          >
            Demandes
          </Button>
          <Button
            variant={filterType === 'plan' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('plan')}
          >
            Plans
          </Button>
          <Button
            variant={filterType === 'permis' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('permis')}
          >
            Permis
          </Button>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Ajouter document
        </Button>
      </div>

      {/* Onglets de navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mes_documents">Mes Documents</TabsTrigger>
          <TabsTrigger value="dossiers_actifs">Dossiers Actifs</TabsTrigger>
          <TabsTrigger value="documents_officiels">Documents Officiels</TabsTrigger>
          <TabsTrigger value="candidatures">Candidatures</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Liste des documents */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun document trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Aucun résultat pour votre recherche' : 'Cette section est vide'}
              </p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Ajouter le premier document
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))
        )}
      </div>
    </div>
  );
};

export default ParticulierDocuments;