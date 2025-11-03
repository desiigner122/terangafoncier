/**
 * @file AdminRoleRequests.jsx
 * @description Page admin pour valider demandes comptes professionnels
 * @created 2025-11-03
 * @week 1 - Day 4-5
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, XCircle, Eye, FileText, Download, Loader2, 
  Clock, Filter, Search, User, Building2, Phone, MapPin 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminRoleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    pending: 'En attente',
    approved: 'Approuvée',
    rejected: 'Rejetée',
    cancelled: 'Annulée',
  };

  const roleLabels = {
    vendeur_pro: 'Vendeur Pro',
    notaire: 'Notaire',
    agent_foncier: 'Agent Foncier',
    geometre: 'Géomètre',
    promoteur: 'Promoteur',
    banque: 'Banque',
    mairie: 'Mairie',
  };

  /**
   * Charger demandes depuis DB
   */
  const fetchRequests = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('role_change_requests')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          ),
          reviewer:reviewed_by (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
      setFilteredRequests(data || []);

    } catch (error) {
      console.error('❌ Erreur chargement demandes:', error);
      toast.error('Impossible de charger les demandes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /**
   * Filtrer demandes
   */
  useEffect(() => {
    let filtered = [...requests];

    // Filtre statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Filtre rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter(r => r.requested_role === roleFilter);
    }

    // Recherche texte
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.company_name?.toLowerCase().includes(term) ||
        r.profiles?.email?.toLowerCase().includes(term) ||
        `${r.profiles?.first_name} ${r.profiles?.last_name}`.toLowerCase().includes(term)
      );
    }

    setFilteredRequests(filtered);
  }, [requests, statusFilter, roleFilter, searchTerm]);

  /**
   * Approuver/Rejeter demande
   */
  const processRequest = async (requestId, newStatus) => {
    try {
      setIsProcessing(true);

      const { data, error } = await supabase.rpc('process_role_change_request', {
        request_id: requestId,
        new_status: newStatus,
        review_note_text: reviewNote || null,
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Erreur traitement demande');
      }

      toast.success(
        newStatus === 'approved' 
          ? 'Demande approuvée avec succès ! L\'utilisateur a été notifié.'
          : 'Demande rejetée. L\'utilisateur a été notifié.'
      );

      // Recharger demandes
      await fetchRequests();
      
      // Fermer dialog
      setSelectedRequest(null);
      setReviewNote('');

    } catch (error) {
      console.error('❌ Erreur traitement:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Statistiques
   */
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de Comptes Professionnels</CardTitle>
          <CardDescription>Examinez et validez les demandes d'upgrade de compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Nom, email, entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvées</SelectItem>
                  <SelectItem value="rejected">Rejetées</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rôle demandé</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Liste demandes */}
          <div className="space-y-3 mt-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucune demande trouvée</p>
              </div>
            ) : (
              filteredRequests.map(request => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">
                          {request.company_name}
                        </h4>
                        <Badge className={statusColors[request.status]}>
                          {statusLabels[request.status]}
                        </Badge>
                        <Badge variant="outline">
                          {roleLabels[request.requested_role]}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {request.profiles?.first_name} {request.profiles?.last_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {request.phone_number}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {format(new Date(request.created_at), 'dd MMM yyyy', { locale: fr })}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Examiner
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog détail demande */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Demande de {selectedRequest.company_name}</DialogTitle>
                <DialogDescription>
                  Examinez les documents et informations fournis
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Infos entreprise */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Entreprise</Label>
                    <p className="font-medium">{selectedRequest.company_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Rôle demandé</Label>
                    <Badge className="mt-1">{roleLabels[selectedRequest.requested_role]}</Badge>
                  </div>
                  <div>
                    <Label className="text-gray-600">Téléphone</Label>
                    <p className="font-medium">{selectedRequest.phone_number}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Email</Label>
                    <p className="font-medium text-sm">{selectedRequest.profiles?.email}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Adresse</Label>
                    <p className="font-medium">{selectedRequest.company_address}</p>
                  </div>
                </div>

                {/* Motivation */}
                {selectedRequest.reason && (
                  <div>
                    <Label className="text-gray-600">Motivation</Label>
                    <p className="text-sm mt-1 bg-gray-50 p-3 rounded">{selectedRequest.reason}</p>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <Label className="text-gray-900 font-semibold">Documents fournis</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {selectedRequest.business_registration_doc && (
                      <a
                        href={selectedRequest.business_registration_doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm flex-1">Enregistrement Entreprise</span>
                        <Download className="w-4 h-4 text-blue-600" />
                      </a>
                    )}
                    {selectedRequest.professional_license_doc && (
                      <a
                        href={selectedRequest.professional_license_doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm flex-1">Licence Professionnelle</span>
                        <Download className="w-4 h-4 text-blue-600" />
                      </a>
                    )}
                    {selectedRequest.identity_card_doc && (
                      <a
                        href={selectedRequest.identity_card_doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm flex-1">Pièce d'identité</span>
                        <Download className="w-4 h-4 text-blue-600" />
                      </a>
                    )}
                    {selectedRequest.tax_certificate_doc && (
                      <a
                        href={selectedRequest.tax_certificate_doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm flex-1">Attestation Fiscale</span>
                        <Download className="w-4 h-4 text-blue-600" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Note admin */}
                {selectedRequest.status === 'pending' && (
                  <div className="space-y-2">
                    <Label htmlFor="reviewNote">Note de révision (optionnel)</Label>
                    <Textarea
                      id="reviewNote"
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Ajoutez une note expliquant votre décision (visible pour l'utilisateur)..."
                      rows={3}
                    />
                  </div>
                )}

                {/* Actions */}
                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => processRequest(selectedRequest.id, 'approved')}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      Approuver
                    </Button>
                    <Button
                      onClick={() => processRequest(selectedRequest.id, 'rejected')}
                      disabled={isProcessing}
                      variant="destructive"
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Rejeter
                    </Button>
                  </div>
                )}

                {/* Review info si déjà traité */}
                {selectedRequest.status !== 'pending' && selectedRequest.reviewed_at && (
                  <div className="bg-gray-50 p-4 rounded space-y-2">
                    <p className="text-sm text-gray-600">
                      Traitée par <strong>{selectedRequest.reviewer?.first_name} {selectedRequest.reviewer?.last_name}</strong>
                      {' '}le {format(new Date(selectedRequest.reviewed_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                    {selectedRequest.review_note && (
                      <p className="text-sm italic">"{selectedRequest.review_note}"</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRoleRequests;
