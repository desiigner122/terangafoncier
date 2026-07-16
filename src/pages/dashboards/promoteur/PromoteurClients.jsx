import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import {
  Users,
  User,
  Phone,
  Mail,
  Building,
  MessageSquare,
  Eye,
  UserPlus,
  Filter,
  Download,
  Search,
  Flame,
  CheckCircle,
  Gift,
  FileText,
  Award,
  TrendingUp,
  Loader2
} from 'lucide-react';

const PromoteurClients = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Contacts CRM réels (crm_contacts, owner_id = promoteur)
  const [clients, setClients] = useState([]);

  // Statistiques agrégées (données réelles crm_contacts)
  const [clientStats, setClientStats] = useState({
    totalClients: 0,
    newThisMonth: 0,
    hotProspects: 0,
    activeClients: 0,
    averageScore: 0
  });

  // Normalisation de la « temperature » CRM (chaud / tiède / froid)
  const tempKey = (t) => {
    const s = String(t || '').toLowerCase();
    if (['hot', 'chaud'].includes(s)) return 'hot';
    if (['warm', 'tiède', 'tiede'].includes(s)) return 'warm';
    if (['cold', 'froid'].includes(s)) return 'cold';
    return '';
  };

  // Classification d'un contact en segment (best-effort sur status/temperature réels)
  const classify = (c) => {
    const s = String(c.status || '').toLowerCase();
    if (['inactive', 'inactif', 'lost', 'perdu', 'closed', 'clos', 'archived', 'archivé'].includes(s)) return 'inactive';
    if (['client', 'active', 'actif', 'won', 'gagné', 'gagne', 'customer', 'signé', 'signe'].includes(s)) return 'active';
    return 'prospect';
  };

  // Un contact est « VIP » s'il est chaud ou fortement scoré (données réelles)
  const isVip = (c) => tempKey(c.temperature) === 'hot' || (Number(c.score) || 0) >= 80;

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const { data: contacts } = await supabase
          .from('crm_contacts')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        const list = contacts || [];
        setClients(list);

        const now = new Date();
        const newThisMonth = list.filter((c) => {
          if (!c.created_at) return false;
          const d = new Date(c.created_at);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }).length;

        const hotProspects = list.filter((c) => tempKey(c.temperature) === 'hot').length;
        const activeClients = list.filter((c) => classify(c) === 'active').length;
        const scored = list.filter((c) => c.score !== null && c.score !== undefined && c.score !== '');
        const averageScore = scored.length
          ? Math.round(scored.reduce((s, c) => s + (Number(c.score) || 0), 0) / scored.length)
          : 0;

        setClientStats({
          totalClients: list.length,
          newThisMonth,
          hotProspects,
          activeClients,
          averageScore
        });
      } catch (err) {
        console.error('Erreur chargement clients CRM:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Segmentation des clients (sur données réelles)
  const clientSegments = {
    all: clients,
    active: clients.filter((c) => classify(c) === 'active'),
    prospects: clients.filter((c) => classify(c) === 'prospect'),
    vip: clients.filter(isVip),
    inactive: clients.filter((c) => classify(c) === 'inactive')
  };

  const getStatusLabel = (status) => {
    const s = String(status || '').toLowerCase();
    if (['client', 'customer', 'signé', 'signe'].includes(s)) return 'Client';
    if (['active', 'actif'].includes(s)) return 'Actif';
    if (['won', 'gagné', 'gagne'].includes(s)) return 'Gagné';
    if (['prospect'].includes(s)) return 'Prospect';
    if (['lead', 'nouveau', 'new'].includes(s)) return 'Nouveau';
    if (['inactive', 'inactif'].includes(s)) return 'Inactif';
    if (['lost', 'perdu'].includes(s)) return 'Perdu';
    return status || '—';
  };

  const getStatusColor = (segment) => {
    switch (segment) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTempLabel = (t) => {
    switch (tempKey(t)) {
      case 'hot': return 'Chaud';
      case 'warm': return 'Tiède';
      case 'cold': return 'Froid';
      default: return null;
    }
  };

  const getTempColor = (t) => {
    switch (tempKey(t)) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-orange-100 text-orange-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClients = clientSegments[activeTab].filter((client) =>
    (client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) =>
    (name || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="text-gray-600">Suivi et relation client personnalisée</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              <Users className="w-3 h-3 mr-1" />
              {clientStats.totalClients} contact{clientStats.totalClients > 1 ? 's' : ''}
            </Badge>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Nouveau client
            </Button>
          </div>
        </div>

        {/* Métriques principales (données réelles crm_contacts) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{clientStats.totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  {clientStats.newThisMonth > 0 ? `+${clientStats.newThisMonth} ce mois` : 'Aucun nouveau ce mois'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prospects chauds</p>
                  <p className="text-2xl font-bold text-gray-900">{clientStats.hotProspects}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">À prioriser</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contacts actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{clientStats.activeClients}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress
                  value={clientStats.totalClients ? Math.round((clientStats.activeClients / clientStats.totalClients) * 100) : 0}
                  className="h-2"
                />
                <span className="text-xs text-gray-500 mt-1">Clients / customers</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score moyen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clientStats.averageScore > 0 ? `${clientStats.averageScore}/100` : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">Scoring CRM</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-5">
              <TabsTrigger value="all" className="text-xs">
                Tous ({clientSegments.all.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs">
                Actifs ({clientSegments.active.length})
              </TabsTrigger>
              <TabsTrigger value="prospects" className="text-xs">
                Prospects ({clientSegments.prospects.length})
              </TabsTrigger>
              <TabsTrigger value="vip" className="text-xs">
                VIP ({clientSegments.vip.length})
              </TabsTrigger>
              <TabsTrigger value="inactive" className="text-xs">
                Anciens ({clientSegments.inactive.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Contenu des onglets */}
          {Object.keys(clientSegments).map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tabKey === 'all' && 'Tous les Clients'}
                    {tabKey === 'active' && 'Clients Actifs'}
                    {tabKey === 'prospects' && 'Prospects'}
                    {tabKey === 'vip' && 'Clients VIP'}
                    {tabKey === 'inactive' && 'Anciens Clients'}
                  </CardTitle>
                  <CardDescription>
                    {filteredClients.length} contact{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredClients.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p>Aucun contact dans cette catégorie.</p>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {filteredClients.map((client) => {
                      const segment = classify(client);
                      const tempLabel = getTempLabel(client.temperature);
                      const score = Number(client.score) || 0;
                      return (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-6 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {getInitials(client.name)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900">{client.name || 'Sans nom'}</h3>
                                {isVip(client) && (
                                  <Badge className="bg-purple-100 text-purple-800">
                                    <Award className="w-3 h-3 mr-1" />
                                    VIP
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                                {client.email && (
                                  <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-1" />
                                    {client.email}
                                  </div>
                                )}
                                {client.phone && (
                                  <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-1" />
                                    {client.phone}
                                  </div>
                                )}
                                {client.company && (
                                  <div className="flex items-center">
                                    <Building className="w-4 h-4 mr-1" />
                                    {client.company}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center flex-wrap gap-2 mb-3">
                                <Badge className={getStatusColor(segment)}>
                                  {getStatusLabel(client.status)}
                                </Badge>
                                {tempLabel && (
                                  <Badge className={getTempColor(client.temperature)}>
                                    <Flame className="w-3 h-3 mr-1" />
                                    {tempLabel}
                                  </Badge>
                                )}
                              </div>

                              {/* Score CRM réel */}
                              {(client.score !== null && client.score !== undefined && client.score !== '') && (
                                <div className="mb-2 max-w-sm">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-600">Score CRM:</span>
                                    <span className="font-medium">{score}/100</span>
                                  </div>
                                  <Progress value={score} className="h-2" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="mb-4">
                              <p className="text-sm text-gray-500">Contact depuis</p>
                              <p className="font-medium">{formatDate(client.created_at)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end mt-6 pt-4 border-t">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!client.phone}
                              onClick={() => client.phone && (window.location.href = `tel:${client.phone}`)}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Appeler
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!client.email}
                              onClick={() => client.email && (window.location.href = `mailto:${client.email}`)}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Email
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Eye className="w-4 h-4 mr-1" />
                              Profil
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                      );
                    })}
                  </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col">
                <UserPlus className="w-5 h-5 mb-1" />
                <span className="text-sm">Nouveau Client</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <MessageSquare className="w-5 h-5 mb-1" />
                <span className="text-sm">Campagne Email</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Gift className="w-5 h-5 mb-1" />
                <span className="text-sm">Programme Fidélité</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-sm">Rapport Client</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default PromoteurClients;
