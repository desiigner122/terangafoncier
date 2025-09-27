import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, 
  Plus, 
  Search, 
  Filter,
  Grid3X3,
  MapPin,
  FileText,
  Eye,
  Edit,
  Download,
  Upload,
  Share,
  Layers,
  Target,
  Building,
  Route,
  TreePine,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Users,
  Hash,
  Ruler,
  Navigation,
  Satellite,
  Compass,
  Settings,
  Database,
  Archive,
  Badge as BadgeIcon,
  Key
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GeometreCadastral = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');

  // Données cadastrales
  const parcelles = [
    {
      id: 1,
      numeroTitre: 'TF 12.345/DK',
      numeroParcelle: '0234/15',
      section: 'A',
      lieu: 'Almadies, Dakar',
      proprietaire: 'Société IMMOGO',
      typeProprietaire: 'morale',
      superficie: '2.5 ha',
      superficieExacte: '25,247 m²',
      natureTerrain: 'urbain',
      usage: 'résidentiel',
      statut: 'titre_foncier',
      dateCreation: '2024-03-15',
      dateModification: '2024-09-25',
      valeurVenale: '125,000,000 XOF',
      impotFoncier: '2,500,000 XOF',
      coordonnees: {
        lat: 14.7167,
        lng: -17.4677
      },
      limites: [
        { direction: 'Nord', limite: 'Route de la Corniche' },
        { direction: 'Sud', limite: 'Parcelle 0233/15' },
        { direction: 'Est', limite: 'Océan Atlantique' },
        { direction: 'Ouest', limite: 'Parcelle 0235/15' }
      ],
      documents: ['Plan cadastral', 'Titre foncier', 'Permis de construire'],
      icon: Building
    },
    {
      id: 2,
      numeroTitre: 'TF 8.901/RF',
      numeroParcelle: '0156/08',
      section: 'B',
      lieu: 'Rufisque',
      proprietaire: 'M. Amadou Diallo',
      typeProprietaire: 'physique',
      superficie: '800 m²',
      superficieExacte: '847 m²',
      natureTerrain: 'urbain',
      usage: 'résidentiel',
      statut: 'titre_foncier',
      dateCreation: '2024-01-20',
      dateModification: '2024-09-15',
      valeurVenale: '8,000,000 XOF',
      impotFoncier: '160,000 XOF',
      coordonnees: {
        lat: 14.7197,
        lng: -17.2658
      },
      limites: [
        { direction: 'Nord', limite: 'Rue Léopold Sédar Senghor' },
        { direction: 'Sud', limite: 'Parcelle 0155/08' },
        { direction: 'Est', limite: 'Parcelle 0157/08' },
        { direction: 'Ouest', limite: 'Rue Amadou Bamba' }
      ],
      documents: ['Plan cadastral', 'Titre foncier', 'Certificat d\'urbanisme'],
      icon: User
    },
    {
      id: 3,
      numeroTitre: 'DF 234/TH',
      numeroParcelle: '1024/12',
      section: 'C',
      lieu: 'Zone Industrielle, Thiès',
      proprietaire: 'État du Sénégal',
      typeProprietaire: 'publique',
      superficie: '15 ha',
      superficieExacte: '150,000 m²',
      natureTerrain: 'industriel',
      usage: 'industriel',
      statut: 'domaine_public',
      dateCreation: '2024-02-10',
      dateModification: '2024-09-30',
      valeurVenale: '450,000,000 XOF',
      impotFoncier: 'Exempté',
      coordonnees: {
        lat: 14.7889,
        lng: -16.9250
      },
      limites: [
        { direction: 'Nord', limite: 'Route Nationale N2' },
        { direction: 'Sud', limite: 'Chemin de fer Dakar-Niger' },
        { direction: 'Est', limite: 'Zone résidentielle' },
        { direction: 'Ouest', limite: 'Zone commerciale' }
      ],
      documents: ['Plan d\'aménagement', 'Arrêté de classement', 'Étude d\'impact'],
      icon: Building
    },
    {
      id: 4,
      numeroTitre: 'TF 5.678/KL',
      numeroParcelle: '0789/05',
      section: 'D',
      lieu: 'Kaolack',
      proprietaire: 'Coopérative Agricole Thiès',
      typeProprietaire: 'cooperative',
      superficie: '5.2 ha',
      superficieExacte: '52,000 m²',
      natureTerrain: 'agricole',
      usage: 'agricole',
      statut: 'titre_foncier',
      dateCreation: '2024-04-05',
      dateModification: '2024-08-20',
      valeurVenale: '26,000,000 XOF',
      impotFoncier: '520,000 XOF',
      coordonnees: {
        lat: 14.1516,
        lng: -16.0729
      },
      limites: [
        { direction: 'Nord', limite: 'Marigot de Kaolack' },
        { direction: 'Sud', limite: 'Parcelle 0788/05' },
        { direction: 'Est', limite: 'Piste rurale' },
        { direction: 'Ouest', limite: 'Parcelle 0790/05' }
      ],
      documents: ['Plan parcellaire', 'Titre foncier', 'Autorisation exploitation'],
      icon: TreePine
    },
    {
      id: 5,
      numeroTitre: 'DF 456/BG',
      numeroParcelle: '2048/20',
      section: 'E',
      lieu: 'Bargny',
      proprietaire: 'Ministère de l\'Industrie',
      typeProprietaire: 'publique',
      superficie: '25 ha',
      superficieExacte: '250,000 m²',
      natureTerrain: 'industriel',
      usage: 'industriel',
      statut: 'domaine_public',
      dateCreation: '2024-05-12',
      dateModification: '2024-09-28',
      valeurVenale: '750,000,000 XOF',
      impotFoncier: 'Exempté',
      coordonnees: {
        lat: 14.6928,
        lng: -17.0547
      },
      limites: [
        { direction: 'Nord', limite: 'Océan Atlantique' },
        { direction: 'Sud', limite: 'Route de Bargny' },
        { direction: 'Est', limite: 'Zone résidentielle' },
        { direction: 'Ouest', limite: 'Port de Dakar' }
      ],
      documents: ['Plan masse', 'Arrêté ministériel', 'Étude environnementale'],
      icon: Building
    },
    {
      id: 6,
      numeroTitre: 'TF 9.876/SC',
      numeroParcelle: '0345/18',
      section: 'F',
      lieu: 'Sacré-Cœur, Dakar',
      proprietaire: 'Famille Mbaye',
      typeProprietaire: 'physique',
      superficie: '1,200 m²',
      superficieExacte: '1,247 m²',
      natureTerrain: 'urbain',
      usage: 'résidentiel',
      statut: 'titre_foncier',
      dateCreation: '2024-01-08',
      dateModification: '2024-09-28',
      valeurVenale: '37,500,000 XOF',
      impotFoncier: '750,000 XOF',
      coordonnees: {
        lat: 14.6937,
        lng: -17.4441
      },
      limites: [
        { direction: 'Nord', limite: 'Avenue Cheikh Anta Diop' },
        { direction: 'Sud', limite: 'Parcelle 0344/18' },
        { direction: 'Est', limite: 'Parcelle 0346/18' },
        { direction: 'Ouest', limite: 'Rue Joseph Gomis' }
      ],
      documents: ['Plan cadastral', 'Titre foncier', 'Certificat d\'hérédité'],
      icon: User
    }
  ];

  const getTypeProprietaireIcon = (type) => {
    switch (type) {
      case 'physique': return User;
      case 'morale': return Building;
      case 'publique': return BadgeIcon;
      case 'cooperative': return Users;
      default: return User;
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'titre_foncier': return 'bg-green-100 text-green-800';
      case 'domaine_public': return 'bg-blue-100 text-blue-800';
      case 'bail': return 'bg-yellow-100 text-yellow-800';
      case 'concession': return 'bg-purple-100 text-purple-800';
      case 'litige': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsageColor = (usage) => {
    switch (usage) {
      case 'résidentiel': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'industriel': return 'bg-orange-100 text-orange-800';
      case 'agricole': return 'bg-emerald-100 text-emerald-800';
      case 'mixte': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredParcelles = parcelles.filter(parcelle => {
    const matchesSearch = parcelle.numeroTitre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parcelle.numeroParcelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parcelle.proprietaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parcelle.lieu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || parcelle.typeProprietaire === typeFilter;
    const matchesStatus = statusFilter === 'tous' || parcelle.statut === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Statistiques
  const stats = [
    {
      title: 'Total Parcelles',
      value: parcelles.length,
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Titres Fonciers',
      value: parcelles.filter(p => p.statut === 'titre_foncier').length,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Surface Totale',
      value: '69.9 ha',
      icon: Ruler,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Valeur Totale',
      value: '1.4B XOF',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastre & Foncier</h1>
          <p className="text-gray-600 mt-1">Gestion du patrimoine foncier et cadastral</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Cadastre
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Parcelle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par titre, parcelle, propriétaire ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type propriétaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                <SelectItem value="physique">Personne physique</SelectItem>
                <SelectItem value="morale">Personne morale</SelectItem>
                <SelectItem value="publique">Domaine public</SelectItem>
                <SelectItem value="cooperative">Coopérative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut foncier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous statuts</SelectItem>
                <SelectItem value="titre_foncier">Titre foncier</SelectItem>
                <SelectItem value="domaine_public">Domaine public</SelectItem>
                <SelectItem value="bail">Bail emphytéotique</SelectItem>
                <SelectItem value="concession">Concession</SelectItem>
                <SelectItem value="litige">En litige</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cadastral Tabs */}
      <Tabs defaultValue="parcelles" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="parcelles">Parcelles</TabsTrigger>
          <TabsTrigger value="carte">Carte Cadastrale</TabsTrigger>
          <TabsTrigger value="propriétaires">Propriétaires</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="parcelles" className="mt-6">
          <div className="space-y-4">
            {filteredParcelles.map((parcelle, index) => {
              const TypeIcon = getTypeProprietaireIcon(parcelle.typeProprietaire);
              const ParcelleIcon = parcelle.icon;
              
              return (
                <motion.div
                  key={parcelle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <ParcelleIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {parcelle.numeroTitre}
                              </h3>
                              <Badge variant="outline" className="font-mono text-xs">
                                {parcelle.numeroParcelle}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Section {parcelle.section}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Identification</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    {parcelle.lieu}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Ruler className="h-3 w-3" />
                                    {parcelle.superficie} ({parcelle.superficieExacte})
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Navigation className="h-3 w-3" />
                                    {parcelle.coordonnees.lat.toFixed(4)}°N, {parcelle.coordonnees.lng.toFixed(4)}°W
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Propriétaire</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <TypeIcon className="h-3 w-3" />
                                    {parcelle.proprietaire}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {parcelle.typeProprietaire === 'physique' ? 'Personne physique' :
                                     parcelle.typeProprietaire === 'morale' ? 'Personne morale' :
                                     parcelle.typeProprietaire === 'publique' ? 'Domaine public' :
                                     parcelle.typeProprietaire === 'cooperative' ? 'Coopérative' : parcelle.typeProprietaire}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Valorisation</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div>Valeur vénale: {parcelle.valeurVenale}</div>
                                  <div>Impôt foncier: {parcelle.impotFoncier}</div>
                                  <div className="text-xs text-gray-500">
                                    Créé: {parcelle.dateCreation}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <Badge className={getStatutColor(parcelle.statut)}>
                              {parcelle.statut === 'titre_foncier' ? 'Titre Foncier' :
                               parcelle.statut === 'domaine_public' ? 'Domaine Public' :
                               parcelle.statut}
                            </Badge>
                            <Badge className={getUsageColor(parcelle.usage)}>
                              {parcelle.usage}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Limites */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Limites & Confrontations</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                          {parcelle.limites.map((limite, idx) => (
                            <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                              <span className="font-medium">{limite.direction}:</span> {limite.limite}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Documents et Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Documents:</span>
                          <div className="flex gap-1">
                            {parcelle.documents.map((doc, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Certificat
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="carte" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Carte Cadastrale Interactive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Satellite className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Visualisation Cadastrale
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Carte interactive avec parcelles, limites et superposition satellite
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button>
                      Ouvrir Carte
                    </Button>
                    <Button variant="outline">
                      <Layers className="h-4 w-4 mr-2" />
                      Calques
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="propriétaires" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Propriétaires par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['physique', 'morale', 'publique', 'cooperative'].map((type) => {
                    const count = parcelles.filter(p => p.typeProprietaire === type).length;
                    const Icon = getTypeProprietaireIcon(type);
                    const typeName = type === 'physique' ? 'Personnes physiques' :
                                   type === 'morale' ? 'Personnes morales' :
                                   type === 'publique' ? 'Domaine public' :
                                   type === 'cooperative' ? 'Coopératives' : type;
                    
                    return (
                      <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">{typeName}</span>
                        </div>
                        <Badge variant="outline">{count} parcelles</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['résidentiel', 'commercial', 'industriel', 'agricole'].map((usage) => {
                    const count = parcelles.filter(p => p.usage === usage).length;
                    const percentage = (count / parcelles.length * 100).toFixed(1);
                    return (
                      <div key={usage} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{usage}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Valeurs Foncières</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Analyse des Valeurs
                  </h3>
                  <p className="text-gray-600">
                    Évolution des prix au m² par zone et par usage
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicateurs Fiscaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Impôts collectés</span>
                    <span className="font-medium">3,930,000 XOF</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux moyen</span>
                    <span className="font-medium">2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Exemptions</span>
                    <span className="font-medium">2 parcelles</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">En retard</span>
                    <span className="font-medium text-red-600">0 parcelles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GeometreCadastral;