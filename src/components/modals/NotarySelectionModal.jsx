/**
 * NotarySelectionModal.jsx
 * 
 * Modal pour que l'acheteur ou le vendeur puisse choisir un notaire
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, Star, MapPin, TrendingUp, Phone, Mail,
  Building2, CheckCircle, X, AlertCircle, Scale, FileText
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
import { toast } from 'sonner';

import NotaireAssignmentService from '@/services/NotaireAssignmentService';

const NotarySelectionModal = ({ isOpen, onClose, caseId, onNotarySelected }) => {
  const [notaries, setNotaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotary, setSelectedNotary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && caseId) {
      loadNotaries();
    }
  }, [isOpen, caseId]);

  const loadNotaries = async () => {
    try {
      setLoading(true);
      console.log('🔍 [NotaryModal] Chargement notaires pour case:', caseId);
      
      const result = await NotaireAssignmentService.findBestNotaires(caseId, {
        limit: 20,
        autoSelect: false
      });
      
      console.log('📊 [NotaryModal] Résultat:', result);
      
      if (result.success) {
        console.log('✅ [NotaryModal] Notaires chargés:', result.data?.length);
        setNotaries(result.data || []);
        
        if (!result.data || result.data.length === 0) {
          toast.info('Aucun notaire disponible pour le moment');
        }
      } else {
        console.error('❌ [NotaryModal] Erreur:', result.error);
        toast.error(result.error || 'Erreur lors du chargement des notaires');
        setNotaries([]);
      }
    } catch (error) {
      console.error('❌ [NotaryModal] Exception:', error);
      toast.error('Erreur lors du chargement des notaires');
      setNotaries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNotary = async () => {
    if (!selectedNotary) {
      toast.error('Veuillez sélectionner un notaire');
      return;
    }

    try {
      setAssigning(true);
      
      // Proposer le notaire via le service
      const result = await NotaireAssignmentService.proposeNotaire(caseId, selectedNotary.id, {
        proposedBy: 'buyer', // ou 'seller' selon le contexte
        score: selectedNotary.score,
        distance: selectedNotary.distance,
        reason: 'Sélection manuelle par l\'utilisateur'
      });
      
      if (result.success) {
        toast.success(`Notaire ${selectedNotary.profile?.full_name} proposé avec succès !`);
        
        if (onNotarySelected) {
          onNotarySelected(selectedNotary);
        }
        
        onClose();
      } else {
        toast.error(result.error || 'Erreur lors de la proposition');
      }
    } catch (error) {
      console.error('Erreur assignation notaire:', error);
      toast.error(error.message || 'Erreur lors de l\'assignation');
    } finally {
      setAssigning(false);
    }
  };

  const filteredNotaries = notaries.filter(notary => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      notary.office_name?.toLowerCase().includes(query) ||
      notary.profile?.full_name?.toLowerCase().includes(query) ||
      notary.office_address?.toLowerCase().includes(query)
    );
  });

  const getInitials = (name) => {
    if (!name) return 'NT';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderNotaryCard = (notary) => (
    <Card 
      key={notary.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedNotary?.id === notary.id 
          ? 'ring-2 ring-primary border-primary' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
      onClick={() => setSelectedNotary(notary)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16">
            <AvatarImage src={notary.profile?.avatar_url} alt={notary.profile?.full_name} />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-lg font-bold">
              {getInitials(notary.profile?.full_name)}
            </AvatarFallback>
          </Avatar>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 mb-1">
                  {notary.profile?.full_name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {notary.office_name}
                </p>
              </div>
              
              {/* Score badge */}
              <Badge 
                variant={notary.score >= 85 ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                <Star className="w-3 h-3 fill-current" />
                {notary.score}
              </Badge>
            </div>

            {/* Localisation */}
            {notary.office_address && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{notary.office_address}</span>
                {notary.distance && (
                  <Badge variant="outline" className="ml-2">
                    {notary.distance} km
                  </Badge>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {notary.total_cases_completed || 0} dossiers complétés
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {notary.success_rate || 95}% de réussite
              </div>
            </div>

            {/* Capacité */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    notary.capacity_percentage < 70 ? 'bg-green-500' :
                    notary.capacity_percentage < 90 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${notary.capacity_percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {notary.available_slots} places disponibles
              </span>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              {notary.profile?.phone && (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Phone className="w-3 h-3" />
                  {notary.profile.phone}
                </div>
              )}
              {notary.profile?.email && (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Mail className="w-3 h-3" />
                  {notary.profile.email}
                </div>
              )}
            </div>
          </div>

          {/* Checkmark si sélectionné */}
          {selectedNotary?.id === notary.id && (
            <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            Choisir un Notaire
          </DialogTitle>
          <DialogDescription>
            Sélectionnez le notaire qui suivra votre dossier. Les notaires sont classés par score de pertinence.
          </DialogDescription>
        </DialogHeader>

        {/* Filtres */}
        <div className="space-y-3 py-4">
          <div>
            <Label htmlFor="search">Rechercher</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Nom du notaire ou de l'office..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Liste des notaires */}
        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Chargement des notaires...</p>
              </div>
            </div>
          ) : filteredNotaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucun notaire disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotaries.map(renderNotaryCard)}
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Footer */}
        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedNotary ? (
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {selectedNotary.profile?.full_name} sélectionné(e)
              </span>
            ) : (
              <span>Sélectionnez un notaire pour continuer</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={assigning}
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button 
              onClick={handleSelectNotary}
              disabled={!selectedNotary || assigning}
            >
              {assigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assignation...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmer le choix
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotarySelectionModal;
