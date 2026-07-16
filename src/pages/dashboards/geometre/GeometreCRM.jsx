import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Search,
  Eye,
  Edit,
  MoreHorizontal,
  Target,
  Briefcase,
  Award,
  UserPlus,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const formatXOF = (value) => {
  const num = Number(value) || 0;
  return `${num.toLocaleString('fr-FR')} FCFA`;
};

const GeometreCRM = () => {
  const { user } = useAuth();
  const geometreId = user?.id;

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (!geometreId) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const [contactsRes, missionsRes] = await Promise.all([
          supabase
            .from('crm_contacts')
            .select('id, name, email, phone, company, status, temperature, score, created_at')
            .eq('owner_id', geometreId)
            .order('created_at', { ascending: false }),
          supabase
            .from('survey_missions')
            .select('id, client_id, client_name, title, status, price, scheduled_date, created_at')
            .eq('geometre_id', geometreId)
        ]);

        if (!active) return;

        const contacts = contactsRes.data || [];
        const missions = missionsRes.data || [];
        const now = new Date();

        const mapped = contacts.map((c) => {
          // Missions liées : par client_id (crm_contacts.id) ou, à défaut, par nom.
          const clientMissions = missions.filter(
            (m) =>
              (m.client_id && m.client_id === c.id) ||
              (m.client_name && c.name && m.client_name.toLowerCase() === c.name.toLowerCase())
          );
          const totalRevenue = clientMissions.reduce((sum, m) => sum + (Number(m.price) || 0), 0);
          const lastProject = clientMissions
            .slice()
            .sort((a, b) => (b.scheduled_date || b.created_at || '').localeCompare(a.scheduled_date || a.created_at || ''))
            .map((m) => m.title)
            .filter(Boolean)[0] || null;
          const nextMeeting = clientMissions
            .filter((m) => m.scheduled_date && new Date(m.scheduled_date) >= now && (m.status === 'pending' || m.status === 'in_progress'))
            .map((m) => m.scheduled_date)
            .sort()[0] || null;

          return {
            id: c.id,
            name: c.name || 'Client sans nom',
            // Pas de colonne 'type' dans crm_contacts : dérivé honnêtement de la présence d'une société.
            type: c.company ? 'Entreprise' : 'Particulier',
            company: c.company || null,
            email: c.email || '—',
            phone: c.phone || '—',
            projects: clientMissions.length,
            value: totalRevenue,
            status: (c.status || 'prospect').toLowerCase(),
            temperature: (c.temperature || '').toLowerCase(),
            score: c.score,
            lastProject,
            nextMeeting
          };
        });

        setClients(mapped);
      } catch (e) {
        if (active) setClients([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [geometreId]);

  const isActiveStatus = (status) => {
    const s = (status || '').toLowerCase();
    return s === 'actif' || s === 'active' || s === 'client' || s === 'converted';
  };

  const isProspectStatus = (status) => {
    const s = (status || '').toLowerCase();
    return s === 'prospect' || s === 'lead' || s === 'new' || s === 'hot' || s === 'warm' || s === 'cold';
  };

  const isInactiveStatus = (status) => {
    const s = (status || '').toLowerCase();
    return s === 'inactif' || s === 'inactive' || s === 'perdu' || s === 'lost';
  };

  // Statistiques réelles dérivées des contacts / missions.
  const stats = useMemo(() => {
    const activeCount = clients.filter((c) => isActiveStatus(c.status)).length;
    const prospectCount = clients.filter((c) => isProspectStatus(c.status)).length;
    const totalCA = clients.reduce((sum, c) => sum + (Number(c.value) || 0), 0);
    const conversionBase = activeCount + prospectCount;
    const conversion = conversionBase > 0 ? Math.round((activeCount / conversionBase) * 100) : null;

    return [
      {
        title: 'Clients Actifs',
        value: String(activeCount),
        icon: Users,
        description: 'Contacts convertis'
      },
      {
        title: 'Prospects',
        value: String(prospectCount),
        icon: Target,
        description: 'En négociation'
      },
      {
        title: 'CA Total',
        value: totalCA > 0 ? formatXOF(totalCA) : '—',
        icon: TrendingUp,
        description: 'Cumul missions'
      },
      {
        title: 'Taux Conversion',
        value: conversion !== null ? `${conversion}%` : '—',
        icon: Award,
        description: 'Actifs / total'
      }
    ];
  }, [clients]);

  const getStatusColor = (status) => {
    if (isActiveStatus(status)) return 'bg-green-100 text-green-800';
    if (isProspectStatus(status)) return 'bg-blue-100 text-blue-800';
    if (isInactiveStatus(status)) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    if (isActiveStatus(status)) return 'Actif';
    if (isInactiveStatus(status)) return 'Inactif';
    if (isProspectStatus(status)) return 'Prospect';
    return status || 'Contact';
  };

  // Priorité dérivée de la température CRM réelle (hot/warm/cold), sinon du score.
  const getPriority = (client) => {
    if (client.temperature === 'hot') return 'high';
    if (client.temperature === 'warm') return 'medium';
    if (client.temperature === 'cold') return 'low';
    if (typeof client.score === 'number') {
      if (client.score >= 70) return 'high';
      if (client.score >= 40) return 'medium';
      return 'low';
    }
    return null;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Entreprise': return Building;
      case 'Particulier': return User;
      default: return User;
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'active' && isActiveStatus(client.status)) ||
      (activeFilter === 'prospect' && isProspectStatus(client.status)) ||
      (activeFilter === 'inactive' && isInactiveStatus(client.status));
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      client.name.toLowerCase().includes(term) ||
      (client.company && client.company.toLowerCase().includes(term)) ||
      client.email.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            CRM Professionnel Géomètre
          </h1>
          <p className="text-gray-600 mt-2">
            Gestion avancée de la relation client : Architectes, Promoteurs, Urbanistes & Particuliers
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500">{stat.description}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'active', 'prospect', 'inactive'].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ?
                  "bg-gradient-to-r from-blue-600 to-purple-600 text-white" :
                  "hover:bg-blue-50"
                }
              >
                {filter === 'all' ? 'Tous' :
                 filter === 'active' ? 'Actifs' :
                 filter === 'prospect' ? 'Prospects' : 'Inactifs'}
              </Button>
            ))}
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
      </motion.div>

      {/* Liste des clients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6"
      >
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Chargement des clients...
          </div>
        ) : filteredClients.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center text-gray-500">
              <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-700">Aucun client pour le moment</p>
              <p className="text-sm mt-1">
                Vos contacts CRM apparaîtront ici dès qu'ils seront ajoutés.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client) => {
          const TypeIcon = getTypeIcon(client.type);
          const priority = getPriority(client);
          return (
            <Card key={client.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                        {priority && (
                          <Badge className={getPriorityColor(priority)}>
                            {priority === 'high' ? 'Priorité haute' :
                             priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{client.company || client.type} • {client.type}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {client.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Missions</p>
                      <p className="text-lg font-bold text-blue-600">{client.projects}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Valeur</p>
                      <p className="text-lg font-bold text-green-600">
                        {client.value > 0 ? formatXOF(client.value) : '—'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(client.status)}>
                      {getStatusLabel(client.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Dernière mission : </span>
                      <span className="font-medium text-gray-900">{client.lastProject || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Prochain RDV : </span>
                      <span className="font-medium text-gray-900">
                        {client.nextMeeting ? new Date(client.nextMeeting).toLocaleDateString('fr-FR') : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
        )}
      </motion.div>
    </div>
  );
};

export default GeometreCRM;
