/**
 * AgentSelectionModal.jsx
 * 
 * Modal pour que l'acheteur puisse choisir un agent foncier (FACULTATIF)
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, Star, MapPin, TrendingUp, Phone, Mail,
  Building2, CheckCircle, X, AlertCircle
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

import unifiedCaseTrackingService from '@/services/UnifiedCaseTrackingService';

const AgentSelectionModal = ({ isOpen, onClose, caseId, onAgentSelected }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAgents();
    }
  }, [isOpen, regionFilter]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const filters = {
        minRating: 3.0,
        limit: 20
      };
      
      if (regionFilter) {
        filters.region = regionFilter;
      }

      const data = await unifiedCaseTrackingService.searchAvailableAgents(filters);
      setAgents(data);
    } catch (error) {
      console.error('Erreur chargement agents:', error);
      toast.error('Erreur lors du chargement des agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAgent = async () => {
    if (!selectedAgent) {
      toast.error('Veuillez sélectionner un agent');
      return;
    }

    try {
      setAssigning(true);
      const commissionRate = selectedAgent.commission_rate || 5.0;
      
      await unifiedCaseTrackingService.chooseAgent(caseId, selectedAgent.id, commissionRate);
      
      toast.success(`Agent ${selectedAgent.profile.full_name} assigné avec succès !`);
      
      if (onAgentSelected) {
        onAgentSelected(selectedAgent);
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur assignation agent:', error);
      toast.error(error.message || 'Erreur lors de l\'assignation');
    } finally {
      setAssigning(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      agent.agency_name?.toLowerCase().includes(query) ||
      agent.profile?.full_name?.toLowerCase().includes(query) ||
      agent.agency_region?.toLowerCase().includes(query)
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Choisir un agent foncier (Facultatif)
          </DialogTitle>
          <DialogDescription>
            Un agent peut vous accompagner dans les négociations et les démarches.
            Commission généralement: 5% du prix de vente.
          </DialogDescription>
        </DialogHeader>

        {/* Filtres */}
        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            <Label htmlFor="search">Rechercher</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nom, agence, région..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="region">Région</Label>
            <Input
              id="region"
              placeholder="Ex: Dakar, Thiès..."
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Liste des agents */}
        <ScrollArea className="h-96 pr-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Chargement des agents...</p>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucun agent disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent?.id === agent.id}
                  onSelect={() => setSelectedAgent(agent)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={assigning}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button 
            onClick={handleSelectAgent} 
            disabled={!selectedAgent || assigning}
          >
            {assigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assignation...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Choisir cet agent
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Composant: Carte agent
const AgentCard = ({ agent, isSelected, onSelect }) => {
  const hasCapacity = agent.active_cases_count < agent.max_active_cases;
  const availableCapacity = agent.max_active_cases - agent.active_cases_count;

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
            <AvatarImage src={agent.profile?.avatar_url} />
            <AvatarFallback className="text-2xl">🏢</AvatarFallback>
          </Avatar>

          {/* Informations */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg">{agent.agency_name}</h3>
                <p className="text-sm text-muted-foreground">{agent.profile?.full_name}</p>
              </div>
              {isSelected && (
                <Badge className="bg-primary">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Sélectionné
                </Badge>
              )}
            </div>

            {/* Rating & Stats */}
            <div className="flex items-center gap-4 mb-2">
              {agent.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{agent.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({agent.reviews_count} avis)
                  </span>
                </div>
              )}
              {agent.is_verified && (
                <Badge variant="outline" className="bg-green-50">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  Vérifié
                </Badge>
              )}
            </div>

            {/* Localisation */}
            {agent.agency_region && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{agent.agency_region}</span>
              </div>
            )}

            {/* Commission */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                Commission: {agent.commission_rate}%
              </Badge>
              {hasCapacity ? (
                <Badge variant="outline" className="bg-green-50">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  {availableCapacity} dossiers disponibles
                </Badge>
              ) : (
                <Badge variant="destructive">Complet</Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{agent.total_sales_completed} ventes réalisées</span>
              <span>• {agent.experience_years} ans d'expérience</span>
            </div>

            {/* Contact */}
            <div className="flex gap-3 mt-2 text-xs">
              {agent.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{agent.phone}</span>
                </div>
              )}
              {agent.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{agent.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentSelectionModal;
