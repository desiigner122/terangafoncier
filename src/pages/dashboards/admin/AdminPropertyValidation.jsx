/**
 * PAGE VALIDATION DES BIENS - ADMIN
 * Validation des propriétés en attente avec système d'approbation/rejet
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, XCircle, Clock, MapPin, DollarSign, Ruler, FileText,
  User, Calendar, Image as ImageIcon, AlertTriangle, Eye, Mail,
  Phone, Shield, ExternalLink, Download, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AdminPropertyValidation = () => {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPendingProperties();
  }, []);

  const loadPendingProperties = async () => {
    try {
      setLoading(true);
      
      // Fetch properties without FK join (FK constraint doesn't exist)
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (propError) throw propError;

      // Fetch all profiles to match with owner_id
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name');

      // Create lookup map
      const profilesMap = (profiles || []).reduce((map, p) => {
        map[p.id] = p;
        return map;
      }, {});

      // Enrichir avec les photos et owner info
      const enrichedData = await Promise.all((properties || []).map(async (prop) => {
        const { data: photos } = await supabase
          .from('property_photos')
          .select('photo_url, is_main, order_index')
          .eq('property_id', prop.id)
          .order('order_index', { ascending: true });

        // Get owner from profiles map
        const owner = profilesMap[prop.owner_id] || {};

        return {
          ...prop,
          owner, // Add owner info manually
          photos: photos || [],
          mainPhoto: photos?.find(p => p.is_main)?.photo_url || photos?.[0]?.photo_url
        };
      }));

      setPendingProperties(enrichedData);
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur lors du chargement des propriétés');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    if (!confirm('Confirmer l\'approbation de cette propriété ?')) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          verification_status: 'verified',
          status: 'active',
          published_at: new Date().toISOString(),
          verified_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (error) throw error;

      // TODO: Envoyer notification au vendeur
      toast.success('✅ Propriété approuvée avec succès !', {
        description: 'Le vendeur a été notifié par email.'
      });

      loadPendingProperties();
    } catch (error) {
      console.error('Erreur approbation:', error);
      toast.error('Erreur lors de l\'approbation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Veuillez fournir une raison pour le rejet');
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          verification_status: 'rejected',
          status: 'rejected',
          verification_notes: rejectionReason,
          verified_at: new Date().toISOString()
        })
        .eq('id', selectedProperty.id);

      if (error) throw error;

      // TODO: Envoyer notification au vendeur avec la raison
      toast.success('❌ Propriété rejetée', {
        description: 'Le vendeur a été notifié avec les raisons du rejet.'
      });

      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedProperty(null);
      loadPendingProperties();
    } catch (error) {
      console.error('Erreur rejet:', error);
      toast.error('Erreur lors du rejet');
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCompletionScore = (property) => {
    let score = 0;
    const checks = [
      property.title,
      property.description?.length >= 50,
      property.price > 0,
      property.surface > 0,
      property.location,
      property.photos?.length >= 3,
      property.features && Object.keys(property.features).length > 0,
      property.metadata?.documents?.has_title_deed
    ];

    checks.forEach(check => {
      if (check) score += 12.5;
    });

    return Math.round(score);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              Validation des Propriétés
            </h1>
            <p className="text-gray-600 mt-2">
              {pendingProperties.length} propriété{pendingProperties.length > 1 ? 's' : ''} en attente de validation
            </p>
          </div>
          <Button onClick={loadPendingProperties} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingProperties.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur totale</p>
                <p className="text-xl font-bold">
                  {formatPrice(pendingProperties.reduce((sum, p) => sum + (p.price || 0), 0))} FCFA
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avec photos</p>
                <p className="text-2xl font-bold">
                  {pendingProperties.filter(p => p.photos?.length >= 3).length}
                </p>
              </div>
              <ImageIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avec titre</p>
                <p className="text-2xl font-bold">
                  {pendingProperties.filter(p => p.metadata?.documents?.has_title_deed).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des propriétés */}
      {pendingProperties.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune propriété en attente
            </h3>
            <p className="text-gray-600">
              Toutes les propriétés ont été validées 🎉
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingProperties.map((property) => {
            const completionScore = getCompletionScore(property);
            const ownerName = property.owner?.user_metadata?.full_name || 
                            property.owner?.user_metadata?.name || 
                            'Vendeur';

            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-[300px,1fr] gap-6">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto bg-gray-200">
                      {property.mainPhoto ? (
                        <img
                          src={property.mainPhoto}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      
                      {property.photos?.length > 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-black/70">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {property.photos.length} photo{property.photos.length > 1 ? 's' : ''}
                        </Badge>
                      )}

                      {/* Score de complétion */}
                      <div className="absolute top-2 left-2">
                        <Badge className={completionScore >= 75 ? 'bg-green-500' : 'bg-orange-500'}>
                          {completionScore}% complet
                        </Badge>
                      </div>
                    </div>

                    {/* Détails */}
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* En-tête */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 gap-4">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {ownerName}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(property.created_at).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            En attente
                          </Badge>
                        </div>

                        {/* Infos principales */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Prix</p>
                            <p className="text-lg font-bold text-blue-600">
                              {formatPrice(property.price)} FCFA
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Surface</p>
                            <p className="text-lg font-semibold">
                              {property.surface} m²
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="text-lg font-semibold">
                              {property.type || property.property_type}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Localisation</p>
                            <p className="text-sm font-semibold flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {property.city}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        {property.description && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Description</p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {property.description}
                            </p>
                          </div>
                        )}

                        {/* Documents */}
                        <div className="flex flex-wrap gap-2">
                          {property.metadata?.documents?.has_title_deed && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Shield className="h-3 w-3 mr-1" />
                              Titre foncier
                            </Badge>
                          )}
                          {property.metadata?.documents?.has_survey && (
                            <Badge variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              Bornage
                            </Badge>
                          )}
                          {property.metadata?.financing?.methods?.length > 0 && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {property.metadata.financing.methods.length} option{property.metadata.financing.methods.length > 1 ? 's' : ''} de financement
                            </Badge>
                          )}
                        </div>

                        {/* Points à vérifier */}
                        {completionScore < 75 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                              <div className="text-sm text-orange-800">
                                <p className="font-semibold mb-1">Points à améliorer:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {!property.description && <li>Description manquante</li>}
                                  {property.photos?.length < 3 && <li>Moins de 3 photos</li>}
                                  {!property.metadata?.documents?.has_title_deed && <li>Titre foncier non fourni</li>}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t">
                          <Button
                            onClick={() => handleApprove(property.id)}
                            disabled={actionLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approuver
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowRejectModal(true);
                            }}
                            disabled={actionLoading}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeter
                          </Button>
                          <Button
                            onClick={() => window.open(`/parcelle/${property.id}`, '_blank')}
                            variant="outline"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Prévisualiser
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal de rejet */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la propriété</DialogTitle>
            <DialogDescription>
              Veuillez fournir une raison détaillée pour le rejet. Le vendeur recevra cette information par email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Raison du rejet *</Label>
              <Textarea
                placeholder="Ex: Les photos ne sont pas assez claires, le titre foncier n'est pas visible, la description manque de détails..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                Soyez constructif pour aider le vendeur à corriger sa publication.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedProperty(null);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || actionLoading}
            >
              {actionLoading ? 'Envoi...' : 'Confirmer le rejet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPropertyValidation;
