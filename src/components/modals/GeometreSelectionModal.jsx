/**
 * GeometreSelectionModal.jsx
 * 
 * Modal pour que l'acheteur puisse choisir un géomètre pour le bornage (FACULTATIF)
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, Star, Ruler, Phone, Mail, CheckCircle, X,
  AlertCircle, Plane, MapPin, Award, Clock
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

import unifiedCaseTrackingService from '@/services/UnifiedCaseTrackingService';

const MISSION_TYPES = {
  complete: {
    label: 'Mission complète',
    description: 'Bornage + Plan + Certificat topographique',
    icon: Ruler
  },
  bornage: {
    label: 'Bornage uniquement',
    description: 'Mesure et pose de bornes',
    icon: MapPin
  },
  plan: {
    label: 'Plan uniquement',
    description: 'Plan de bornage détaillé',
    icon: Award
  },
  certificat: {
    label: 'Certificat uniquement',
    description: 'Certificat topographique',
    icon: CheckCircle
  }
};

const GeometreSelectionModal = ({ isOpen, onClose, caseId, onGeometreSelected }) => {
  const [geometres, setGeometres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGeometre, setSelectedGeometre] = useState(null);
  const [missionType, setMissionType] = useState('complete');
  const [searchQuery, setSearchQuery] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadGeometres();
    }
  }, [isOpen]);

  const loadGeometres = async () => {
    try {
      setLoading(true);
      const filters = {
        minRating: 3.0,
        limit: 20
      };

      const data = await unifiedCaseTrackingService.searchAvailableGeometres(filters);
      setGeometres(data);
    } catch (error) {
      console.error('Erreur chargement géomètres:', error);
      toast.error('Erreur lors du chargement des géomètres');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSurveying = async () => {
    if (!selectedGeometre) {
      toast.error('Veuillez sélectionner un géomètre');
      return;
    }

    if (!missionType) {
      toast.error('Veuillez choisir le type de mission');
      return;
    }

    try {
      setRequesting(true);
      
      const result = await unifiedCaseTrackingService.requestSurveying(
        caseId, 
        selectedGeometre.id, 
        missionType
      );
      
      toast.success(
        `Mission de ${MISSION_TYPES[missionType].label.toLowerCase()} demandée à ${selectedGeometre.profile.full_name} !`
      );
      
      if (onGeometreSelected) {
        onGeometreSelected(result);
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur demande bornage:', error);
      toast.error(error.message || 'Erreur lors de la demande');
    } finally {
      setRequesting(false);
    }
  };

  const filteredGeometres = geometres.filter(geometre => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      geometre.cabinet_name?.toLowerCase().includes(query) ||
      geometre.profile?.full_name?.toLowerCase().includes(query)
    );
  });

  const getEstimatedFee = () => {
    if (!selectedGeometre) return 0;
    
    switch (missionType) {
      case 'complete':
        return selectedGeometre.complete_mission_fee || 150000;
      case 'bornage':
        return selectedGeometre.bornage_fee || 100000;
      case 'plan':
        return selectedGeometre.plan_fee || 50000;
      case 'certificat':
        return selectedGeometre.certificate_fee || 30000;
      default:
        return 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Demander un bornage (Facultatif)
          </DialogTitle>
          <DialogDescription>
            Un géomètre peut vérifier les limites exactes de la parcelle et fournir un plan officiel.
          </DialogDescription>
        </DialogHeader>

        {/* Type de mission */}
        <div className="my-4">
          <Label className="mb-3 block">Type de mission</Label>
          <RadioGroup value={missionType} onValueChange={setMissionType}>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(MISSION_TYPES).map(([key, mission]) => {
                const MissionIcon = mission.icon;
                return (
                  <div key={key} className="flex items-start space-x-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label 
                      htmlFor={key} 
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-start gap-2">
                        <MissionIcon className="w-4 h-4 mt-1" />
                        <div>
                          <p className="font-semibold">{mission.label}</p>
                          <p className="text-xs text-muted-foreground">{mission.description}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Recherche */}
        <div className="my-4">
          <Label htmlFor="search">Rechercher un géomètre</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nom, cabinet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Liste des géomètres */}
        <ScrollArea className="h-96 pr-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Chargement des géomètres...</p>
            </div>
          ) : filteredGeometres.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucun géomètre disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGeometres.map((geometre) => (
                <GeometreCard
                  key={geometre.id}
                  geometre={geometre}
                  missionType={missionType}
                  isSelected={selectedGeometre?.id === geometre.id}
                  onSelect={() => setSelectedGeometre(geometre)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Résumé */}
        {selectedGeometre && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Mission sélectionnée:</p>
                <p className="text-sm text-muted-foreground">
                  {MISSION_TYPES[missionType].label} avec {selectedGeometre.cabinet_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Tarif estimé:</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-FR').format(getEstimatedFee())} FCFA
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={requesting}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button 
            onClick={handleRequestSurveying} 
            disabled={!selectedGeometre || requesting}
          >
            {requesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Demande en cours...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Demander cette mission
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Composant: Carte géomètre
const GeometreCard = ({ geometre, missionType, isSelected, onSelect }) => {
  const hasCapacity = geometre.active_missions_count < geometre.max_active_missions;
  const availableCapacity = geometre.max_active_missions - geometre.active_missions_count;

  // Calculer le tarif selon le type de mission
  const getFee = () => {
    switch (missionType) {
      case 'complete':
        return geometre.complete_mission_fee || 150000;
      case 'bornage':
        return geometre.bornage_fee || 100000;
      case 'plan':
        return geometre.plan_fee || 50000;
      case 'certificat':
        return geometre.certificate_fee || 30000;
      default:
        return 0;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
      } ${!hasCapacity ? 'opacity-60' : ''}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className="w-16 h-16">
            <AvatarImage src={geometre.profile?.avatar_url} />
            <AvatarFallback className="text-2xl">📐</AvatarFallback>
          </Avatar>

          {/* Informations */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg">{geometre.cabinet_name}</h3>
                <p className="text-sm text-muted-foreground">{geometre.profile?.full_name}</p>
              </div>
              <div className="text-right">
                {isSelected && (
                  <Badge className="bg-primary mb-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Sélectionné
                  </Badge>
                )}
                <p className="text-sm font-bold">
                  {new Intl.NumberFormat('fr-FR').format(getFee())} FCFA
                </p>
                <p className="text-xs text-muted-foreground">
                  {MISSION_TYPES[missionType].label}
                </p>
              </div>
            </div>

            {/* Rating & Stats */}
            <div className="flex items-center gap-4 mb-2 flex-wrap">
              {geometre.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{geometre.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({geometre.reviews_count} avis)
                  </span>
                </div>
              )}
              {geometre.is_verified && (
                <Badge variant="outline" className="bg-green-50">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  Vérifié
                </Badge>
              )}
              {hasCapacity ? (
                <Badge variant="outline" className="bg-blue-50">
                  <Clock className="w-3 h-3 mr-1 text-blue-500" />
                  {availableCapacity} missions disponibles
                </Badge>
              ) : (
                <Badge variant="destructive">Complet</Badge>
              )}
            </div>

            {/* Équipement */}
            <div className="flex gap-2 mb-2 flex-wrap">
              {geometre.has_gps && (
                <Badge variant="secondary" className="text-xs">
                  📍 GPS
                </Badge>
              )}
              {geometre.has_drone && (
                <Badge variant="secondary" className="text-xs">
                  <Plane className="w-3 h-3 mr-1" />
                  Drone
                </Badge>
              )}
              {geometre.has_total_station && (
                <Badge variant="secondary" className="text-xs">
                  🎯 Station totale
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-xs text-muted-foreground mb-2">
              <span>{geometre.total_missions_completed} missions réalisées</span>
              {geometre.average_completion_days && (
                <span>• Délai moyen: {Math.round(geometre.average_completion_days)} jours</span>
              )}
              <span>• {geometre.experience_years} ans d'expérience</span>
            </div>

            {/* Contact */}
            <div className="flex gap-3 text-xs">
              {geometre.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{geometre.phone}</span>
                </div>
              )}
              {geometre.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{geometre.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeometreSelectionModal;
