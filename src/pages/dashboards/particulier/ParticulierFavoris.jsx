import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart,
  FileText,
  Building2,
  MapPin,
  Eye,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Star,
  Trash2,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const ParticulierFavoris = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');

  // Dossiers marqués comme favoris - SUIVI ADMINISTRATIF
  const [dossiersFavoris] = useState([
    {
      id: 'DT-2024-001',
      type: 'terrain',
      libelle: 'Demande Terrain Résidentiel - Thiès',
      commune: 'Thiès',
      superficie: '300m²',
      statut: 'En instruction',
      progression: 75,
      prochainEtape: 'Validation commission technique',
      echeance: '2024-02-15',
      dateAjoutFavori: '2024-01-20',
      priorite: 'Élevée',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'PC-2024-007',
      type: 'permis',
      libelle: 'Permis de Construire - Villa R+1',
      adresse: 'Lot 45, Cité Keur Gorgui, Dakar',
      superficie: '180m²',
      statut: 'Documents manquants',
      progression: 45,
      prochainEtape: 'Fournir étude de sol',
      echeance: '2024-03-20',
      dateAjoutFavori: '2024-01-25',
      priorite: 'Normale',
      icon: Building2,
      color: 'green'
    },
    {
      id: 'CP-2024-003',
      type: 'candidature',
      libelle: 'Candidature Résidence Les Palmiers',
      promoteur: 'TERANGA CONSTRUCTION',
      localisation: 'Cité Keur Gorgui, Dakar',
      typeLogement: 'Villa F4',
      statut: 'Pré-sélectionné',
      progression: 70,
      prochainEtape: 'Entretien final',
      echeance: '2024-02-15',
      dateAjoutFavori: '2024-02-01',
      priorite: 'Élevée',
      icon: Star,
      color: 'purple'
    },
    {
      id: 'CP-2023-045',
      type: 'candidature',
      libelle: 'Candidature Villa Almadies',
      promoteur: 'SÉNÉGAL IMMOBILIER',
      localisation: 'Almadies, Dakar',
      typeLogement: 'Villa F5',
      statut: 'Accepté',
      progression: 100,
      prochainEtape: 'Signature contrat effectuée',
      dateAcceptation: '2023-12-01',
      dateAjoutFavori: '2023-10-20',
      priorite: 'Normale',
      icon: Star,
      color: 'purple'
    }
  ]);

  const getStatusColor = (statut) => {
    const colors = {
      'En instruction': 'bg-blue-100 text-blue-800',
      'Documents manquants': 'bg-orange-100 text-orange-800',
      'Pré-sélectionné': 'bg-yellow-100 text-yellow-800',
      'Accepté': 'bg-green-100 text-green-800',
      'Approuvé': 'bg-green-100 text-green-800'
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

  const getTypeLabel = (type) => {
    const labels = {
      'terrain': 'Demande Terrain',
      'permis': 'Permis Construire',
      'candidature': 'Candidature Promoteur'
    };
    return labels[type] || type;
  };

  const filteredDossiers = dossiersFavoris.filter(dossier => {
    const matchesSearch = dossier.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'tous' || dossier.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const DossierFavoriCard = ({ dossier }) => {
    const IconComponent = dossier.icon;

    return (
      <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-red-400">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-lg bg-${dossier.color}-100`}>
                <IconComponent className={`w-5 h-5 text-${dossier.color}-600`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(dossier.type)}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{dossier.libelle}</h3>
                
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  {dossier.commune && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {dossier.commune}
                    </div>
                  )}
                  {dossier.adresse && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {dossier.adresse}
                    </div>
                  )}
                  {dossier.localisation && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {dossier.localisation}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {dossier.id}
                    </span>
                    {dossier.superficie && <span>{dossier.superficie}</span>}
                    {dossier.typeLogement && <span>{dossier.typeLogement}</span>}
                  </div>
                  {dossier.promoteur && (
                    <div className="font-medium text-blue-600">{dossier.promoteur}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(dossier.statut)}>
                {dossier.statut}
              </Badge>
              {dossier.priorite && (
                <Badge className={getPrioriteColor(dossier.priorite)} variant="outline">
                  {dossier.priorite}
                </Badge>
              )}
            </div>
          </div>

          {/* Progression */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression</span>
              <span>{dossier.progression}%</span>
            </div>
            <Progress value={dossier.progression} className="h-2" />
          </div>

          {/* Prochaine étape */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Prochaine étape:</span>
            <span>{dossier.prochainEtape}</span>
          </div>

          {/* Échéance */}
          {dossier.echeance && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Échéance:</span>
              <span>{dossier.echeance}</span>
            </div>
          )}

          {dossier.dateAcceptation && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium">Accepté le:</span>
              <span>{dossier.dateAcceptation}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xs text-gray-500">
              Ajouté aux favoris le {dossier.dateAjoutFavori}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Voir
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Contact
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500" />
          Mes Dossiers Favoris
        </h1>
        <p className="text-gray-600">
          Retrouvez rapidement vos dossiers administratifs les plus importants
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {dossiersFavoris.length}
            </div>
            <div className="text-sm text-gray-600">Total favoris</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {dossiersFavoris.filter(d => d.type === 'terrain').length}
            </div>
            <div className="text-sm text-gray-600">Demandes terrains</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {dossiersFavoris.filter(d => d.type === 'permis').length}
            </div>
            <div className="text-sm text-gray-600">Permis construire</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {dossiersFavoris.filter(d => d.type === 'candidature').length}
            </div>
            <div className="text-sm text-gray-600">Candidatures</div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans vos favoris..."
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
            variant={filterType === 'terrain' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('terrain')}
          >
            Terrains
          </Button>
          <Button
            variant={filterType === 'permis' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('permis')}
          >
            Permis
          </Button>
          <Button
            variant={filterType === 'candidature' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('candidature')}
          >
            Candidatures
          </Button>
        </div>
      </div>

      {/* Liste des dossiers favoris */}
      <div className="space-y-4">
        {filteredDossiers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun dossier favori trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Aucun résultat pour votre recherche' : 'Vous n\'avez pas encore de dossiers favoris'}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un favori
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDossiers.map((dossier) => (
            <DossierFavoriCard key={dossier.id} dossier={dossier} />
          ))
        )}
      </div>
    </div>
  );
};

export default ParticulierFavoris;