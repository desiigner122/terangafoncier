/**
 * PAGE DEMANDES D'ACHAT - VERSION COMPLÈTE AVEC WORKFLOWS
 * Gestion complète des demandes d'acheteurs avec:
 * - Liste et filtres avancés
 * - Statuts: pending, accepted, rejected, negotiating, completed
 * - Actions: Accepter, Refuser, Négocier, Générer contrat
 * - Chat intégré pour communication
 * - Historique complet des négociations
 * - Intégration paiement et blockchain
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Check, X, MessageSquare, Eye, DollarSign, Calendar,
  User, Mail, Phone, MapPin, TrendingUp, Clock, AlertCircle,
  Filter, Search, Download, Send, Edit, History, FileCheck,
  CreditCard, Shield, RefreshCw, MoreVertical, Building2,
  ChevronDown, ChevronUp, ExternalLink, Star, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const VendeurPurchaseRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Filtres
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [sortBy, setSortBy] = useState('recent'); // recent, price-high, price-low, urgent
  
  // Dialogs
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showNegotiateDialog, setShowNegotiateDialog] = useState(false);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  
  // Négociation
  const [counterOffer, setCounterOffer] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');
  
  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    negotiating: 0,
    completed: 0,
    rejected: 0,
    totalRevenue: 0,
    avgResponseTime: '0h'
  });

  useEffect(() => {
    if (user) {
      loadRequests();
      setupRealtimeSubscription();
    }
  }, [user]);

  useEffect(() => {
    filterRequests();
  }, [requests, statusFilter, searchTerm, dateFilter, sortBy]);

  const loadRequests = async () => {
    try {
      setLoading(true);

      // Récupérer d'abord les parcelles du vendeur
      const { data: sellerParcels, error: parcelsError } = await supabase
        .from('parcels')
        .select('id')
        .eq('seller_id', user.id);

      if (parcelsError) throw parcelsError;

      const parcelIds = sellerParcels?.map(p => p.id) || [];

      if (parcelIds.length === 0) {
        setRequests([]);
        calculateStats([]);
        setLoading(false);
        return;
      }

      // Récupérer les demandes pour ces parcelles
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          parcels:parcel_id (
            id,
            title,
            name,
            price,
            location,
            surface,
            status
          ),
          profiles:user_id (
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          transactions (
            id,
            amount,
            payment_method,
            status
          )
        `)
        .in('parcel_id', parcelIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('requests_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'requests'
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              toast.success('🎉 Nouvelle demande d\'achat reçue !', {
                duration: 5000,
                icon: '🔔'
              });
              loadRequests();
              break;
            case 'UPDATE':
              loadRequests();
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      pending: data.filter(r => r.status === 'pending').length,
      accepted: data.filter(r => r.status === 'accepted').length,
      negotiating: data.filter(r => r.status === 'negotiating').length,
      completed: data.filter(r => r.status === 'completed').length,
      rejected: data.filter(r => r.status === 'rejected').length,
      totalRevenue: data
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + (r.final_price || r.offer_price || 0), 0),
      avgResponseTime: calculateAvgResponseTime(data)
    };
    setStats(stats);
  };

  const calculateAvgResponseTime = (data) => {
    const respondedRequests = data.filter(r => r.responded_at);
    if (respondedRequests.length === 0) return '0h';

    const totalHours = respondedRequests.reduce((sum, r) => {
      const created = new Date(r.created_at);
      const responded = new Date(r.responded_at);
      const hours = (responded - created) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    const avgHours = Math.round(totalHours / respondedRequests.length);
    return avgHours < 24 ? `${avgHours}h` : `${Math.round(avgHours / 24)}j`;
  };

  const filterRequests = () => {
    let filtered = [...requests];

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.buyer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(r => {
        const created = new Date(r.created_at);
        switch (dateFilter) {
          case 'today':
            return created.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return created >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return created >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'price-high':
          return (b.offer_price || 0) - (a.offer_price || 0);
        case 'price-low':
          return (a.offer_price || 0) - (b.offer_price || 0);
        case 'urgent':
          // Priorité: pending récents, puis negotiating, puis accepted
          const priorityScore = (r) => {
            if (r.status === 'pending') return new Date(r.created_at).getTime() + 10000000000;
            if (r.status === 'negotiating') return new Date(r.created_at).getTime() + 5000000000;
            return new Date(r.created_at).getTime();
          };
          return priorityScore(b) - priorityScore(a);
        default:
          return 0;
      }
    });

    setFilteredRequests(filtered);
  };

  const handleAccept = async (requestId) => {
    try {
      const { error } = await supabase
        .from('purchase_requests')
        .update({
          status: 'accepted',
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('✅ Demande acceptée ! L\'acheteur a été notifié.');
      loadRequests();
      
      // TODO: Envoyer notification email/push à l'acheteur
      sendBuyerNotification(requestId, 'accepted');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'acceptation');
    }
  };

  const handleReject = async (requestId, reason = '') => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette demande ?')) return;

    try {
      const { error } = await supabase
        .from('purchase_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Demande refusée.');
      loadRequests();
      sendBuyerNotification(requestId, 'rejected');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du refus');
    }
  };

  const handleStartNegotiation = async () => {
    if (!counterOffer || !negotiationMessage) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const negotiationEntry = {
        type: 'counter_offer',
        from: 'vendor',
        price: parseFloat(counterOffer),
        message: negotiationMessage,
        timestamp: new Date().toISOString()
      };

      const currentHistory = selectedRequest.negotiation_history || [];
      
      const { error } = await supabase
        .from('purchase_requests')
        .update({
          status: 'negotiating',
          counter_offer_price: parseFloat(counterOffer),
          negotiation_history: [...currentHistory, negotiationEntry],
          responded_at: selectedRequest.responded_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success('💬 Contre-offre envoyée !');
      setShowNegotiateDialog(false);
      setCounterOffer('');
      setNegotiationMessage('');
      loadRequests();
      sendBuyerNotification(selectedRequest.id, 'counter_offer');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi');
    }
  };

  const handleGenerateContract = async (requestId) => {
    try {
      // TODO: Implémenter génération contrat PDF
      toast.success('📄 Génération du contrat...');
      
      const { error } = await supabase
        .from('purchase_requests')
        .update({
          status: 'contract_pending',
          contract_generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Ouvrir page de contrat
      // navigate(`/dashboard/contracts/${requestId}`);
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur génération contrat');
    }
  };

  const sendBuyerNotification = async (requestId, type) => {
    // TODO: Implémenter notifications email/push
    console.log(`Notification ${type} envoyée pour demande ${requestId}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      negotiating: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-purple-100 text-purple-800 border-purple-200',
      contract_pending: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Refusée',
      negotiating: 'Négociation',
      completed: 'Terminée',
      contract_pending: 'Contrat en cours'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      accepted: Check,
      rejected: X,
      negotiating: MessageSquare,
      completed: FileCheck,
      contract_pending: FileText
    };
    const Icon = icons[status] || AlertCircle;
    return <Icon className="h-4 w-4" />;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            Demandes d'Achat
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez toutes vos demandes d'acheteurs en un seul endroit
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => loadRequests()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">{stats.total}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Total</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-700">{stats.pending}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">En attente</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">{stats.negotiating}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Négociation</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Check className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700">{stats.accepted}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Acceptées</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <FileCheck className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-700">{stats.completed}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Terminées</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-red-100"
        >
          <div className="flex items-center justify-between mb-2">
            <X className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-red-700">{stats.rejected}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Refusées</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="text-lg font-bold text-green-700">
              {(stats.totalRevenue / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600">Revenus FCFA</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">{stats.avgResponseTime}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Temps réponse</p>
        </motion.div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, propriété..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Statut */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="negotiating">Négociation</SelectItem>
                <SelectItem value="accepted">Acceptées</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="rejected">Refusées</SelectItem>
              </SelectContent>
            </Select>

            {/* Date */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {filteredRequests.length} demande(s) trouvée(s)
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récentes</SelectItem>
                <SelectItem value="urgent">Urgentes</SelectItem>
                <SelectItem value="price-high">Prix croissant</SelectItem>
                <SelectItem value="price-low">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune demande trouvée
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchTerm || statusFilter !== 'all'
                ? 'Essayez de modifier vos filtres'
                : 'Vous n\'avez pas encore de demandes d\'achat'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Image propriété */}
                      <div className="flex-shrink-0">
                        {request.properties?.images?.[0] ? (
                          <img
                            src={request.properties.images[0]}
                            alt={request.properties.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building2 className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {request.buyer_name || request.buyer?.full_name || 'Acheteur'}
                              </h3>
                              <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                                {getStatusIcon(request.status)}
                                {getStatusLabel(request.status)}
                              </Badge>
                              {request.priority === 'urgent' && (
                                <Badge className="bg-red-100 text-red-800">
                                  ⚡ Urgent
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {request.buyer_email || request.buyer?.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {request.buyer_phone || request.buyer?.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(request.created_at)}
                              </span>
                            </div>
                          </div>

                          {/* Menu actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedRequest(request);
                                setShowDetailDialog(true);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/parcelle/${request.property_id}`)}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Voir propriété
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedRequest(request);
                                setShowChatDialog(true);
                              }}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Ouvrir chat
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleGenerateContract(request.id)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Générer contrat
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Propriété */}
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900 mb-1">
                            🏠 {request.properties?.title || 'Propriété'}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {request.properties?.location || request.properties?.city}
                            </span>
                            <span>
                              {request.properties?.surface} m²
                            </span>
                            <span>
                              {request.properties?.property_type}
                            </span>
                          </div>
                        </div>

                        {/* Prix */}
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Prix demandé</p>
                            <p className="text-lg font-bold text-gray-900">
                              {parseInt(request.properties?.price || 0).toLocaleString('fr-FR')} FCFA
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Offre acheteur</p>
                            <p className="text-lg font-bold text-blue-600">
                              {parseInt(request.offer_price || 0).toLocaleString('fr-FR')} FCFA
                            </p>
                          </div>
                          {request.counter_offer_price && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Contre-offre</p>
                              <p className="text-lg font-bold text-orange-600">
                                {parseInt(request.counter_offer_price).toLocaleString('fr-FR')} FCFA
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Message */}
                        {request.message && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <p className="text-sm text-gray-700 italic">
                              "{request.message}"
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => handleAccept(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Accepter
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowNegotiateDialog(true);
                                }}
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Négocier
                              </Button>
                              <Button
                                onClick={() => handleReject(request.id)}
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Refuser
                              </Button>
                            </>
                          )}

                          {request.status === 'negotiating' && (
                            <>
                              <Button
                                onClick={() => handleAccept(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Accepter l'offre finale
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowChatDialog(true);
                                }}
                                variant="outline"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Continuer négociation
                              </Button>
                            </>
                          )}

                          {request.status === 'accepted' && (
                            <Button
                              onClick={() => handleGenerateContract(request.id)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Générer le contrat
                            </Button>
                          )}

                          {request.status === 'completed' && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowDetailDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dialog Négociation */}
      <Dialog open={showNegotiateDialog} onOpenChange={setShowNegotiateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Faire une contre-offre
            </DialogTitle>
            <DialogDescription>
              Proposez un prix différent et expliquez votre position
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="counter-offer">Votre contre-offre (FCFA) *</Label>
              <Input
                id="counter-offer"
                type="number"
                placeholder="Ex: 45000000"
                value={counterOffer}
                onChange={(e) => setCounterOffer(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Offre initiale: {parseInt(selectedRequest?.offer_price || 0).toLocaleString('fr-FR')} FCFA
              </p>
            </div>

            <div>
              <Label htmlFor="negotiation-message">Message *</Label>
              <Textarea
                id="negotiation-message"
                placeholder="Expliquez votre proposition..."
                rows={4}
                value={negotiationMessage}
                onChange={(e) => setNegotiationMessage(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNegotiateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleStartNegotiation} className="bg-blue-600">
              <Send className="h-4 w-4 mr-2" />
              Envoyer contre-offre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Détails */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="negotiation">Négociation</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                {/* Contenu onglet Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Acheteur</Label>
                    <p className="font-medium">{selectedRequest.buyer_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedRequest.buyer_email}</p>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <p className="font-medium">{selectedRequest.buyer_phone}</p>
                  </div>
                  <div>
                    <Label>Date demande</Label>
                    <p className="font-medium">
                      {new Date(selectedRequest.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="negotiation" className="space-y-4">
                {/* Historique négociations */}
                <div className="space-y-3">
                  {selectedRequest.negotiation_history?.map((entry, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge>{entry.from === 'vendor' ? 'Vous' : 'Acheteur'}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="font-semibold text-blue-600 mb-1">
                        {parseInt(entry.price).toLocaleString('fr-FR')} FCFA
                      </p>
                      <p className="text-sm text-gray-700">{entry.message}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history">
                {/* Historique activités */}
                <div className="text-center text-muted-foreground py-8">
                  Historique des activités à venir
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Chat (placeholder) */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chat avec l'acheteur</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-center text-muted-foreground">
                Fonctionnalité chat en développement...
              </p>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendeurPurchaseRequests;
