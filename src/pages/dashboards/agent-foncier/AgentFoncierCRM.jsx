import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  User,
  Building2,
  Eye,
  Edit,
  MoreHorizontal,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const AgentFoncierCRM = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crmStats, setCrmStats] = useState({
    totalClients: 0,
    activeClients: 0,
    nouveauxClients: 0,
    clientsPotentiels: 0,
    chiffreAffaires: 0,
    tauxConversion: null
  });

  // Helpers
  const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?';
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '—';
    }
  };

  const isRecent = (d) => {
    if (!d) return false;
    const diff = Date.now() - new Date(d).getTime();
    return diff <= 30 * 24 * 60 * 60 * 1000;
  };

  // Normalise le statut réel crm_contacts vers les catégories du filtre
  const normalizeStatus = (status, temperature) => {
    const s = (status || '').toLowerCase();
    const t = (temperature || '').toLowerCase();
    if (['active', 'actif', 'client', 'won', 'customer'].includes(s)) return 'active';
    if (['inactive', 'inactif', 'lost', 'perdu', 'cold'].includes(s) || t === 'cold') return 'inactive';
    if (['prospect', 'lead', 'nouveau', 'new', 'qualified'].includes(s)) return 'prospect';
    // Par défaut : prospect (non converti)
    return 'prospect';
  };

  useEffect(() => {
    const loadCRM = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const agentId = user.id;
        const [contactsRes, dealsRes, activitiesRes] = await Promise.all([
          supabase
            .from('crm_contacts')
            .select('id, name, email, phone, company, status, temperature, score, created_at')
            .eq('owner_id', agentId)
            .order('created_at', { ascending: false }),
          supabase
            .from('crm_deals')
            .select('id, contact_id, amount, stage')
            .eq('owner_id', agentId),
          supabase
            .from('crm_activities')
            .select('id, contact_id, created_at')
            .eq('owner_id', agentId)
        ]);

        const contacts = contactsRes.data || [];
        const deals = dealsRes.data || [];
        const activities = activitiesRes.data || [];

        // Agrégation des deals par contact (portefeuille + projets réels)
        const closedWon = ['won', 'gagne', 'gagné', 'closed_won', 'customer'];
        const closedStages = [...closedWon, 'lost', 'closed', 'perdu', 'closed_lost'];
        const dealsByContact = {};
        let caTotal = 0;
        let totalDeals = 0;
        let wonDeals = 0;
        deals.forEach((d) => {
          const stage = (d.stage || '').toLowerCase();
          totalDeals += 1;
          if (closedWon.includes(stage)) wonDeals += 1;
          const amt = (d.amount !== null && d.amount !== undefined && !isNaN(d.amount)) ? Number(d.amount) : 0;
          caTotal += amt;
          if (!d.contact_id) return;
          if (!dealsByContact[d.contact_id]) {
            dealsByContact[d.contact_id] = { total: 0, actifs: 0, montant: 0, hasAmount: false };
          }
          const agg = dealsByContact[d.contact_id];
          agg.total += 1;
          if (!closedStages.includes(stage)) agg.actifs += 1;
          if (amt) { agg.montant += amt; agg.hasAmount = true; }
        });

        // Dernière activité réelle par contact (crm_activities.created_at max)
        const lastActivityByContact = {};
        activities.forEach((a) => {
          if (!a.contact_id) return;
          const prev = lastActivityByContact[a.contact_id];
          if (!prev || new Date(a.created_at) > new Date(prev)) {
            lastActivityByContact[a.contact_id] = a.created_at;
          }
        });

        const mapped = contacts.map((c) => {
          const agg = dealsByContact[c.id] || { total: 0, actifs: 0, montant: 0, hasAmount: false };
          const temperature = (c.temperature || '').toLowerCase();
          const tags = [];
          if (temperature === 'hot') tags.push('Chaud');
          if (temperature === 'warm') tags.push('Tiède');
          if (c.company) tags.push('Entreprise');
          if (c.score !== null && c.score !== undefined && Number(c.score) >= 90) tags.push('VIP');
          if (isRecent(c.created_at)) tags.push('Nouveau');
          return {
            id: c.id,
            name: c.name || 'Client sans nom',
            email: c.email || '—',
            phone: c.phone || '—',
            company: c.company || '—',
            location: c.company || '—',
            status: normalizeStatus(c.status, c.temperature),
            value: agg.hasAmount ? agg.montant : null,
            lastContact: lastActivityByContact[c.id] || null,
            nextFollowUp: null, // pas de colonne réelle de relance planifiée
            projects: agg.total,
            avatar: null,
            tags,
            score: (c.score === null || c.score === undefined) ? null : Number(c.score)
          };
        });

        // Stats réelles
        const nouveaux = contacts.filter(c => isRecent(c.created_at)).length;
        const actifs = mapped.filter(c => c.status === 'active').length;
        const prospects = mapped.filter(c => c.status === 'prospect').length;

        setCrmStats({
          totalClients: contacts.length,
          activeClients: actifs,
          nouveauxClients: nouveaux,
          clientsPotentiels: prospects,
          chiffreAffaires: caTotal,
          tauxConversion: totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : null
        });

        setClients(mapped);
      } catch (e) {
        console.error('Erreur chargement CRM agent:', e);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    loadCRM();
  }, [user?.id]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || client.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'prospect':
        return <Badge className="bg-blue-100 text-blue-800">Prospect</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
            CRM Avancé
          </h1>
          <p className="text-slate-600">Gestion complète de la relation client</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Client
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: 'Total Clients', value: crmStats.totalClients, icon: Users, color: 'from-blue-500 to-cyan-600' },
          { title: 'Clients Actifs', value: crmStats.activeClients, icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
          { title: 'Nouveaux (30j)', value: crmStats.nouveauxClients, icon: Star, color: 'from-yellow-500 to-orange-600' },
          { title: 'Prospects', value: crmStats.clientsPotentiels, icon: Eye, color: 'from-purple-500 to-indigo-600' },
          { title: 'CA Total', value: crmStats.chiffreAffaires > 0 ? `${(crmStats.chiffreAffaires / 1000000).toFixed(0)}M` : '—', icon: DollarSign, color: 'from-rose-500 to-pink-600' },
          { title: 'Conversion', value: crmStats.tauxConversion !== null ? `${crmStats.tauxConversion}%` : '—', icon: TrendingUp, color: 'from-teal-500 to-cyan-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{loading ? '—' : stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher des clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'active', label: 'Actifs' },
            { id: 'prospect', label: 'Prospects' },
            { id: 'inactive', label: 'Inactifs' }
          ].map(filter => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Clients List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Portfolio Clients ({filteredClients.length})
            </CardTitle>
            <CardDescription>
              Gestion et suivi de votre portefeuille client
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-slate-500">Chargement des clients...</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">Aucun client pour le moment</p>
                <p className="text-sm text-slate-400 mt-1">
                  Vos contacts CRM apparaîtront ici dès qu'ils seront ajoutés.
                </p>
              </div>
            ) : (
            <div className="space-y-4">
              {filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-900">{client.name}</h3>
                        {client.score !== null && (
                          <div className={`text-sm font-bold ${getScoreColor(client.score)}`}>
                            {client.score}/100
                          </div>
                        )}
                        {client.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                        <span className="flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          {client.company}
                        </span>
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {client.email}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {client.value !== null ? `${(client.value / 1000000).toFixed(1)}M FCFA` : '—'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                        <span>Dernière activité: {formatDate(client.lastContact)}</span>
                        <span>{client.projects} projet{client.projects > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(client.status)}

                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierCRM;
