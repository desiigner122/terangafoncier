/**
 * VENDEUR CRM REAL DATA - VERSION AVEC DONNÉES RÉELLES SUPABASE
 * Gestion complète des prospects et clients avec IA et scoring intelligent
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Phone, Mail, MapPin, Calendar, DollarSign,
  TrendingUp, Star, Search, Eye, Edit, Clock, CheckCircle,
  Target, Award, Activity, FileText, Filter, MoreVertical,
  MessageSquare, Video, Send, Brain, Sparkles, Zap, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

// 🆕 SEMAINE 3 - Import modals workflows
import ScheduleModal from '@/components/dialogs/ScheduleModal';

const VendeurCRMRealData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prospects, setProspects] = useState([]);
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // 🆕 State pour nouveau prospect
  const [newProspect, setNewProspect] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new',
    notes: ''
  });
  
  // 🆕 SEMAINE 3 - State pour ScheduleModal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [prospectForSchedule, setProspectForSchedule] = useState(null);

  const [stats, setStats] = useState({
    totalProspects: 0,
    hotProspects: 0,
    warmProspects: 0,
    coldProspects: 0,
    newProspects: 0,
    convertedToday: 0,
    averageScore: 0,
    conversionRate: 0,
    monthlyRevenue: 0,
    avgDealSize: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (user) {
      loadCRMData();
    }
  }, [user]);

  useEffect(() => {
    filterProspects();
  }, [prospects, activeFilter, searchTerm]);

  const loadCRMData = async () => {
    try {
      setLoading(true);

      // ✅ CHARGER CONTACTS CRM avec vendor_id (confirmé par audit SQL)
      const { data: contacts, error: contactsError } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      if (contactsError) {
        console.error('❌ Erreur CRM:', contactsError);
        throw contactsError;
      }

      console.log('✅ [CRM] Chargé', contacts?.length, 'contacts');

      setProspects(contacts || []);

      // Calculer les statistiques
      const totalProspects = contacts?.length || 0;
      const hotProspects = contacts?.filter(c => c.status === 'hot').length || 0;
      const warmProspects = contacts?.filter(c => c.status === 'warm').length || 0;
      const coldProspects = contacts?.filter(c => c.status === 'cold').length || 0;
      const newProspects = contacts?.filter(c => c.status === 'new').length || 0;
      
      // Score fictif car colonne n'existe pas
      const avgScore = 0;

      // Conversions du jour
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const convertedToday = contacts?.filter(c => 
        c.status === 'converted' && new Date(c.updated_at) >= today
      ).length || 0;

      // Calculer revenus et taux de conversion (depuis properties vendues)
      const { data: soldProperties } = await supabase
        .from('properties')
        .select('price, created_at')
        .eq('seller_id', user.id)
        .eq('status', 'sold');

      const monthlyRevenue = soldProperties
        ?.filter(p => {
          const createdDate = new Date(p.created_at);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return createdDate >= oneMonthAgo;
        })
        .reduce((sum, p) => sum + (p.price || 0), 0) || 0;

      const avgDealSize = soldProperties?.length > 0
        ? soldProperties.reduce((sum, p) => sum + (p.price || 0), 0) / soldProperties.length
        : 0;

      const convertedCount = contacts?.filter(c => c.status === 'converted').length || 0;
      const conversionRate = totalProspects > 0
        ? ((convertedCount / totalProspects) * 100).toFixed(1)
        : 0;

      setStats({
        totalProspects,
        hotProspects,
        warmProspects,
        coldProspects,
        newProspects,
        convertedToday,
        averageScore: avgScore,
        conversionRate: parseFloat(conversionRate),
        monthlyRevenue,
        avgDealSize
      });

      // Charger activités récentes (interactions CRM)
      await loadRecentActivities();

    } catch (error) {
      console.error('Erreur chargement CRM:', error);
      toast.error('Erreur lors du chargement des données CRM');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivities = async () => {
    try {
      const { data: interactions } = await supabase
        .from('crm_interactions')
        .select(`
          *,
          crm_contacts (name, email)
        `)
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const activities = (interactions || []).map(interaction => ({
        id: interaction.id,
        type: interaction.interaction_type,
        prospect: interaction.crm_contacts?.name || interaction.crm_contacts?.email || 'Contact',
        action: interaction.content || interaction.subject,
        time: formatTimeAgo(new Date(interaction.created_at))
      }));

      setRecentActivities(activities);
    } catch (error) {
      console.error('Erreur chargement activités:', error);
    }
  };

  const filterProspects = () => {
    let filtered = [...prospects];

    // Filtre par statut
    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => {
        if (activeFilter === 'hot') return p.status === 'hot';
        if (activeFilter === 'warm') return p.status === 'warm';
        if (activeFilter === 'cold') return p.status === 'cold';
        if (activeFilter === 'new') return p.status === 'new';
        if (activeFilter === 'converted') return p.status === 'converted';
        return true;
      });
    }

    // Filtre par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.first_name?.toLowerCase().includes(search) ||
        p.last_name?.toLowerCase().includes(search) ||
        p.email?.toLowerCase().includes(search) ||
        p.company?.toLowerCase().includes(search)
      );
    }

    setFilteredProspects(filtered);
  };

  const handleAddProspect = async (prospectData) => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .insert([{
          vendor_id: user.id,
          ...prospectData,
          score: calculateInitialScore(prospectData)
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Prospect ajouté avec succès');
      loadCRMData();
      setShowAddDialog(false);
    } catch (error) {
      console.error('Erreur ajout prospect:', error);
      toast.error('Erreur lors de l\'ajout du prospect');
    }
  };

  const handleUpdateStatus = async (contactId, newStatus) => {
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId);

      if (error) throw error;

      toast.success('Statut mis à jour');
      loadCRMData();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleAddInteraction = async (contactId, interactionData) => {
    try {
      const { error } = await supabase
        .from('crm_interactions')
        .insert([{
          contact_id: contactId,
          vendor_id: user.id,
          ...interactionData,
          completed_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Mettre à jour last_contact_date
      await supabase
        .from('crm_contacts')
        .update({ last_contact_date: new Date().toISOString() })
        .eq('id', contactId);

      toast.success('Interaction enregistrée');
      loadCRMData();
    } catch (error) {
      console.error('Erreur ajout interaction:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const calculateInitialScore = (data) => {
    let score = 50; // Score de base

    // Budget confirmé (+20)
    if (data.budget_min && data.budget_max) score += 20;

    // Email fourni (+10)
    if (data.email) score += 10;

    // Téléphone fourni (+10)
    if (data.phone) score += 10;

    // Entreprise mentionnée (+5)
    if (data.company) score += 5;

    // Source qualifiée (+5 pour referral ou linkedin)
    if (['referral', 'linkedin'].includes(data.source)) score += 5;

    return Math.min(score, 100);
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}min`;
    return 'maintenant';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount).replace('XOF', 'FCFA');
  };

  const getStatusColor = (status) => {
    const colors = {
      hot: 'bg-red-100 text-red-800 border-red-200',
      warm: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      cold: 'bg-gray-100 text-gray-800 border-gray-200',
      converted: 'bg-green-100 text-green-800 border-green-200',
      lost: 'bg-gray-200 text-gray-600 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'border-l-red-600 bg-red-50',
      high: 'border-l-orange-500 bg-orange-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      low: 'border-l-green-500 bg-green-50'
    };
    return colors[priority] || 'border-l-gray-500 bg-gray-50';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec badges IA */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  CRM Vendeur
                </h1>
                <p className="text-gray-600 mt-1 flex items-center">
                  Gestion avancée de vos prospects et clients
                  <Badge className="ml-2 bg-purple-100 text-purple-700 border-purple-200">
                    <Brain className="w-3 h-3 mr-1" />
                    IA Scoring
                  </Badge>
                </p>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
              onClick={() => setShowAddDialog(true)}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              <span className="font-medium">Nouveau Prospect</span>
            </Button>
          </div>

          {/* Stats CRM */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <motion.div 
              className="bg-blue-50 rounded-xl p-4 border border-blue-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-700">{stats.totalProspects}</span>
              </div>
              <p className="text-blue-600 text-sm font-medium mt-1">Total Prospects</p>
            </motion.div>

            <motion.div 
              className="bg-red-50 rounded-xl p-4 border border-red-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-red-600" />
                <span className="text-2xl font-bold text-red-700">{stats.hotProspects}</span>
              </div>
              <p className="text-red-600 text-sm font-medium mt-1">Prospects Chauds</p>
            </motion.div>

            <motion.div 
              className="bg-yellow-50 rounded-xl p-4 border border-yellow-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-700">{stats.warmProspects}</span>
              </div>
              <p className="text-yellow-600 text-sm font-medium mt-1">Prospects Tièdes</p>
            </motion.div>

            <motion.div 
              className="bg-green-50 rounded-xl p-4 border border-green-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-green-700">{stats.convertedToday}</span>
              </div>
              <p className="text-green-600 text-sm font-medium mt-1">Conversions Jour</p>
            </motion.div>

            <motion.div 
              className="bg-purple-50 rounded-xl p-4 border border-purple-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <Brain className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-purple-700">{stats.averageScore}</span>
              </div>
              <p className="text-purple-600 text-sm font-medium mt-1">Score Moyen IA</p>
            </motion.div>

            <motion.div 
              className="bg-indigo-50 rounded-xl p-4 border border-indigo-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-indigo-600" />
                <span className="text-2xl font-bold text-indigo-700">{stats.conversionRate}%</span>
              </div>
              <p className="text-indigo-600 text-sm font-medium mt-1">Taux Conversion</p>
            </motion.div>

            <motion.div 
              className="bg-emerald-50 rounded-xl p-4 border border-emerald-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <DollarSign className="w-8 h-8 text-emerald-600" />
                <span className="text-lg font-bold text-emerald-700">
                  {formatCurrency(stats.monthlyRevenue).slice(0, -8)}M
                </span>
              </div>
              <p className="text-emerald-600 text-sm font-medium mt-1">Revenus Mois</p>
            </motion.div>

            <motion.div 
              className="bg-pink-50 rounded-xl p-4 border border-pink-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <Award className="w-8 h-8 text-pink-600" />
                <span className="text-lg font-bold text-pink-700">
                  {formatCurrency(stats.avgDealSize).slice(0, -8)}M
                </span>
              </div>
              <p className="text-pink-600 text-sm font-medium mt-1">Deal Moyen</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un prospect..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/60 border border-gray-200 rounded-lg"
              />
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              {[
                { id: 'all', label: 'Tous', count: stats.totalProspects },
                { id: 'hot', label: 'Chauds', count: stats.hotProspects },
                { id: 'warm', label: 'Tièdes', count: stats.warmProspects },
                { id: 'new', label: 'Nouveaux', count: stats.newProspects },
                { id: 'cold', label: 'Froids', count: stats.coldProspects }
              ].map((filter) => (
                <Button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  size="sm"
                  className={activeFilter === filter.id 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : ''
                  }
                >
                  {filter.label} ({filter.count})
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Liste des prospects */}
        <div className="grid gap-6">
          {filteredProspects.length > 0 ? (
            filteredProspects.map((prospect, index) => (
              <motion.div
                key={prospect.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-l-4 ${getPriorityColor(prospect.priority)} border-t border-r border-b border-white/20`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start space-x-6">
                  {/* Avatar et score */}
                  <div className="flex-shrink-0">
                    {prospect.avatar_url ? (
                      <img
                        src={prospect.avatar_url}
                        alt={`${prospect.first_name} ${prospect.last_name}`}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg">
                        {prospect.first_name?.charAt(0)}{prospect.last_name?.charAt(0)}
                      </div>
                    )}
                    <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold text-center border ${getScoreColor(prospect.score)}`}>
                      <div className="flex items-center justify-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{prospect.score}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Informations détaillées */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
                          {prospect.first_name} {prospect.last_name}
                          {prospect.properties?.ai_analysis && (
                            <Badge className="ml-2 bg-purple-100 text-purple-700 border-purple-200">
                              <Brain className="w-3 h-3 mr-1" />
                              IA
                            </Badge>
                          )}
                          {prospect.properties?.blockchain_verified && (
                            <Badge className="ml-2 bg-orange-100 text-orange-700 border-orange-200">
                              <Shield className="w-3 h-3 mr-1" />
                              Blockchain
                            </Badge>
                          )}
                        </h3>
                        {prospect.position && prospect.company && (
                          <p className="text-gray-600 font-medium">{prospect.position} - {prospect.company}</p>
                        )}
                        {prospect.properties && (
                          <p className="text-orange-600 font-semibold mt-1">
                            Intéressé par: {prospect.properties.title}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(prospect.status)}`}>
                          {prospect.status === 'hot' && '🔥'} {prospect.status.toUpperCase()}
                        </Badge>
                        {prospect.budget_min && prospect.budget_max && (
                          <div className="text-right">
                            <p className="text-green-600 font-bold text-sm">
                              {formatCurrency(prospect.budget_min).slice(0, -8)}M - {formatCurrency(prospect.budget_max).slice(0, -8)}M
                            </p>
                            <p className="text-xs text-gray-500">Budget</p>
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(prospect.id, 'hot')}>
                              Marquer comme Chaud 🔥
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(prospect.id, 'warm')}>
                              Marquer comme Tiède ☀️
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(prospect.id, 'cold')}>
                              Marquer comme Froid ❄️
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateStatus(prospect.id, 'converted')}>
                              ✅ Marquer comme Converti
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Contacts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {prospect.email && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{prospect.email}</span>
                        </div>
                      )}
                      {prospect.phone && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{prospect.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Source: {prospect.source}</span>
                      </div>
                    </div>

                    {/* Notes et prochaine action */}
                    {prospect.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 mb-2">{prospect.notes}</p>
                        {prospect.next_action && (
                          <div className="flex items-center space-x-2 text-orange-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">Prochaine action: {prospect.next_action}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {prospect.tags && prospect.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mb-4 flex-wrap gap-2">
                        {prospect.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="px-2 py-1 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddInteraction(prospect.id, {
                          interaction_type: 'call',
                          content: 'Appel effectué'
                        })}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Appeler
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddInteraction(prospect.id, {
                          interaction_type: 'email',
                          content: 'Email envoyé'
                        })}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setProspectForSchedule(prospect);
                          setScheduleModalOpen(true);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        RDV
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedProspect(prospect)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 text-center"
            >
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun prospect trouvé</h3>
              <p className="text-gray-500 mb-6">
                Commencez à ajouter vos premiers prospects pour gérer vos relations clients
              </p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Ajouter un prospect
              </Button>
            </motion.div>
          )}
        </div>

        {/* Activité récente */}
        {recentActivities.length > 0 && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-orange-600" />
              Activité Récente
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'email' ? 'bg-green-100 text-green-600' :
                    activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'call' && <Phone className="w-5 h-5" />}
                    {activity.type === 'email' && <Mail className="w-5 h-5" />}
                    {activity.type === 'meeting' && <Calendar className="w-5 h-5" />}
                    {activity.type === 'note' && <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-600">avec {activity.prospect} • Il y a {activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* 🆕 SEMAINE 3 - Schedule Modal */}
      <ScheduleModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        prospect={prospectForSchedule}
        onScheduleComplete={(appointmentData) => {
          loadCRMData(); // Refresh CRM data
          handleAddInteraction(prospectForSchedule?.id, {
            interaction_type: 'meeting',
            content: `RDV planifié: ${appointmentData.date} à ${appointmentData.time}`
          });
          toast.success('Rendez-vous planifié avec succès !');
        }}
      />

      {/* 🆕 DIALOG AJOUT NOUVEAU PROSPECT */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          // Réinitialiser le formulaire quand on ferme
          setNewProspect({
            name: '',
            email: '',
            phone: '',
            status: 'new',
            notes: ''
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-orange-600" />
              Ajouter un Nouveau Prospect
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddProspect(newProspect);
          }} className="space-y-4 mt-4">
            {/* Nom */}
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={newProspect.name}
                onChange={(e) => setNewProspect(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Jean Dupont"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newProspect.email}
                onChange={(e) => setNewProspect(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Ex: jean@example.com"
                required
              />
            </div>

            {/* Téléphone */}
            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={newProspect.phone}
                onChange={(e) => setNewProspect(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Ex: +221 77 123 45 67"
                required
              />
            </div>

            {/* Statut */}
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={newProspect.status}
                onValueChange={(value) => setNewProspect(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="hot">Chaud</SelectItem>
                  <SelectItem value="warm">Tiède</SelectItem>
                  <SelectItem value="cold">Froid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newProspect.notes}
                onChange={(e) => setNewProspect(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes ou commentaires sur ce prospect..."
                rows={3}
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-500"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter Prospect
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendeurCRMRealData;
