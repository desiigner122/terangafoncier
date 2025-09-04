import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, MapPin, Eye, Flag, Calendar, DollarSign, FileText, Search, Filter } from 'lucide-react';
import { sampleParcels, sampleUsers } from '@/data';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const TerrainOversightPage = () => {
  const [loading, setLoading] = useState(true);
  const [localTerrains, setLocalTerrains] = useState([]);
  const [filteredTerrains, setFilteredTerrains] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagDescription, setFlagDescription] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Simulation de la mairie connectée (Saly dans cet exemple)
  const currentMairie = "Saly";

  useEffect(() => {
    const fetchLocalTerrains = async () => {
      setLoading(true);
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filtrer les terrains dans la localité de la mairie
      const terrainsInLocality = sampleParcels.filter(parcel => 
        parcel.zone === currentMairie && 
        (parcel.status === 'Disponible' || parcel.status === 'En négociation' || parcel.status === 'Sous promesse')
      ).map(parcel => {
        const seller = sampleUsers.find(user => user.id === parcel.seller_id);
        return {
          ...parcel,
          seller_name: seller?.name || 'Vendeur inconnu',
          seller_type: seller?.user_type || 'Non spécifié',
          days_on_market: Math.floor(Math.random() * 90) + 1,
          flags: Math.random() > 0.8 ? ['Prix suspect', 'Documents manquants'] : [],
          last_activity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      });

      setLocalTerrains(terrainsInLocality);
      setFilteredTerrains(terrainsInLocality);
      setLoading(false);
    };

    fetchLocalTerrains();
  }, []);

  useEffect(() => {
    let filtered = localTerrains;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(terrain => 
        terrain.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        terrain.seller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        terrain.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(terrain => terrain.status === statusFilter);
    }

    // Filtrage par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(terrain => terrain.type === typeFilter);
    }

    setFilteredTerrains(filtered);
  }, [searchTerm, statusFilter, typeFilter, localTerrains]);

  const handleFlag = (terrain) => {
    setSelectedTerrain(terrain);
    setIsReportModalOpen(true);
  };

  const submitFlag = () => {
    if (!flagReason || !flagDescription) {
      window.safeGlobalToast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Simulation de l'envoi du signalement
    const updatedTerrains = localTerrains.map(terrain => {
      if (terrain.id === selectedTerrain.id) {
        return {
          ...terrain,
          flags: [...terrain.flags, flagReason]
        };
      }
      return terrain;
    });

    setLocalTerrains(updatedTerrains);
    setFilteredTerrains(updatedTerrains);

    window.safeGlobalToast({
      title: "Signalement envoyé",
      description: `Le signalement pour la parcelle ${selectedTerrain.reference} a été transmis aux autorités compétentes.`,
    });

    // Reset form
    setFlagReason('');
    setFlagDescription('');
    setIsReportModalOpen(false);
    setSelectedTerrain(null);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800 border-green-200';
      case 'En négociation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Sous promesse': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriceDisplay = (price) => {
    if (!price) return 'Sur demande';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Eye className="h-8 w-8 text-blue-600" />
            Surveillance des Terrains - {currentMairie}
          </h1>
          <p className="text-muted-foreground mt-2">
            Surveillez en temps réel les terrains mis en vente dans votre commune
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terrains</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{localTerrains.length}</div>
            <p className="text-xs text-muted-foreground">en vente dans la commune</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouvelles Annonces</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localTerrains.filter(t => t.days_on_market <= 7).length}
            </div>
            <p className="text-xs text-muted-foreground">cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signalements</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localTerrains.filter(t => t.flags.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">terrains signalés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getPriceDisplay(localTerrains.reduce((sum, t) => sum + (t.price || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">marché local</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres de Surveillance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Reference, vendeur..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="En négociation">En négociation</SelectItem>
                  <SelectItem value="Sous promesse">Sous promesse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="résidentiel">Résidentiel</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="agricole">Agricole</SelectItem>
                  <SelectItem value="industriel">Industriel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des terrains */}
      <Card>
        <CardHeader>
          <CardTitle>
            Terrains Surveillés ({filteredTerrains.length})
          </CardTitle>
          <CardDescription>
            Liste complète des terrains actuellement en vente dans votre commune
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTerrains.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun terrain trouvé avec les filtres actuels
              </div>
            ) : (
              filteredTerrains.map((terrain) => (
                <div
                  key={terrain.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{terrain.title}</h3>
                        <Badge className={getStatusBadgeColor(terrain.status)}>
                          {terrain.status}
                        </Badge>
                        {terrain.flags.length > 0 && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {terrain.flags.length} signalement(s)
                          </Badge>
                        )}
                      </div>

                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          Réf: {terrain.reference}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {terrain.area}m² - {terrain.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {getPriceDisplay(terrain.price)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {terrain.days_on_market} jours en ligne
                        </div>
                      </div>

                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Vendeur:</span>
                        <span className="ml-1 font-medium">{terrain.seller_name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {terrain.seller_type}
                        </Badge>
                      </div>

                      {terrain.flags.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm text-red-600 font-medium">Signalements:</span>
                          <div className="flex gap-1 mt-1">
                            {terrain.flags.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/terrain/${terrain.id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFlag(terrain)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        Signaler
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de signalement */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Signaler un problème</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTerrain && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">{selectedTerrain.title}</div>
                <div className="text-sm text-muted-foreground">
                  Réf: {selectedTerrain.reference}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="flag-reason">Type de problème *</Label>
              <Select value={flagReason} onValueChange={setFlagReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prix suspect">Prix suspect</SelectItem>
                  <SelectItem value="Documents manquants">Documents manquants</SelectItem>
                  <SelectItem value="Informations incorrectes">Informations incorrectes</SelectItem>
                  <SelectItem value="Vendeur non autorisé">Vendeur non autorisé</SelectItem>
                  <SelectItem value="Terrain inexistant">Terrain inexistant</SelectItem>
                  <SelectItem value="Conflit foncier">Conflit foncier</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flag-description">Description détaillée *</Label>
              <Textarea
                id="flag-description"
                placeholder="Décrivez le problème en détail..."
                value={flagDescription}
                onChange={(e) => setFlagDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsReportModalOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={submitFlag}>
                Envoyer le signalement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TerrainOversightPage;
