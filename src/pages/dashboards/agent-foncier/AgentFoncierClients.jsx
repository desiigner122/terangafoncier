import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  User,
  Star,
  Clock,
  Download,
  MessageSquare,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  UserPlus,
  Target,
  Globe,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const AgentFoncierClients = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('tous');
  const [clients, setClients] = useState([]);

  // Helpers
  const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?';
  };

  const formatXOF = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '—';
    if (amount >= 1e9) return (amount / 1e9).toFixed(1).replace(/\.0$/, '') + 'B XOF';
    if (amount >= 1e6) return (amount / 1e6).toFixed(1).replace(/\.0$/, '') + 'M XOF';
    if (amount >= 1e3) return (amount / 1e3).toFixed(0) + 'K XOF';
    return amount + ' XOF';
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

  useEffect(() => {
    const loadClients = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const agentId = user.id;
        const [contactsRes, dealsRes] = await Promise.all([
          supabase
            .from('crm_contacts')
            .select('id, name, email, phone, company, status, temperature, score, created_at')
            .eq('owner_id', agentId)
            .order('created_at', { ascending: false }),
          supabase
            .from('crm_deals')
            .select('id, contact_id, amount, stage')
            .eq('owner_id', agentId)
        ]);

        const contacts = contactsRes.data || [];
        const deals = dealsRes.data || [];

        // Agrégation des deals par contact (portefeuille + projets réels)
        const closedStages = ['won', 'lost', 'closed', 'gagne', 'gagné', 'perdu'];
        const dealsByContact = {};
        deals.forEach((d) => {
          if (!d.contact_id) return;
          if (!dealsByContact[d.contact_id]) {
            dealsByContact[d.contact_id] = { total: 0, actifs: 0, montant: 0, hasAmount: false };
          }
          const agg = dealsByContact[d.contact_id];
          agg.total += 1;
          const stage = (d.stage || '').toLowerCase();
          if (!closedStages.includes(stage)) agg.actifs += 1;
          if (d.amount !== null && d.amount !== undefined && !isNaN(d.amount)) {
            agg.montant += Number(d.amount);
            agg.hasAmount = true;
          }
        });

        const mapped = contacts.map((c) => {
          const agg = dealsByContact[c.id] || { total: 0, actifs: 0, montant: 0, hasAmount: false };
          const temperature = (c.temperature || '').toLowerCase();
          return {
            id: c.id,
            nom: c.name || 'Client sans nom',
            type: c.company ? 'Entreprise' : 'Particulier',
            email: c.email || '—',
            telephone: c.phone || '—',
            adresse: c.company || '—',
            projetsActifs: agg.actifs,
            projetsTotal: agg.total,
            valeurPortefeuille: agg.hasAmount ? formatXOF(agg.montant) : '—',
            dateInscription: c.created_at,
            statut: c.status || 'nouveau',
            score: (c.score === null || c.score === undefined) ? null : Number(c.score),
            temperature,
            avatar: getInitials(c.name),
            isNew: isRecent(c.created_at),
            isVip: temperature === 'hot' || (c.score !== null && c.score !== undefined && Number(c.score) >= 90)
          };
        });

        setClients(mapped);
      } catch (e) {
        console.error('Erreur chargement clients CRM:', e);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [user?.id]);

  // Statistiques clients (issues des vraies colonnes crm_contacts)
  const scoredClients = clients.filter(c => c.score !== null);
  const avgScore = scoredClients.length
    ? Math.round(scoredClients.reduce((acc, c) => acc + c.score, 0) / scoredClients.length)
    : null;

  const clientStats = [
    {
      title: 'Total Clients',
      value: clients.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Nouveaux (30j)',
      value: clients.filter(c => c.isNew).length,
      icon: UserPlus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Prospects chauds',
      value: clients.filter(c => c.temperature === 'hot').length,
      icon: Flame,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Score Moyen',
      value: avgScore === null ? '—' : avgScore,
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getStatusColor = (statut) => {
    switch ((statut || '').toLowerCase()) {
      case 'actif':
      case 'active':
      case 'client': return 'bg-green-100 text-green-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'nouveau':
      case 'new':
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'inactif':
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemperatureColor = (temperature) => {
    switch ((temperature || '').toLowerCase()) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-orange-500';
      case 'cold': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  const filteredClients = clients.filter(client => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      client.nom.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term);
    let matchesFilter = true;
    if (selectedFilter === 'vip') matchesFilter = client.isVip;
    else if (selectedFilter === 'nouveau') matchesFilter = client.isNew;
    else if (selectedFilter === 'hot') matchesFilter = client.temperature === 'hot';
    else if (selectedFilter === 'cold') matchesFilter = client.temperature === 'cold';
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion Clients</h1>
          <p className="text-gray-600">Portefeuille client et relation commerciale</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {clientStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="tous">Tous</option>
            <option value="vip">VIP</option>
            <option value="nouveau">Nouveaux (30j)</option>
            <option value="hot">Prospects chauds</option>
            <option value="cold">Prospects froids</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Plus de filtres
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tous les Clients
          </TabsTrigger>
          <TabsTrigger value="vip" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Clients VIP
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Activité Récente
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Tous les Clients */}
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Portefeuille Clients ({filteredClients.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredClients.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucun client dans votre portefeuille</p>
                  <p className="text-sm">Ajoutez vos premiers contacts pour les retrouver ici.</p>
                </div>
              ) : (
              <div className="space-y-4">
                {filteredClients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {client.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getTemperatureColor(client.temperature)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900">{client.nom}</h3>
                            <Badge className={getStatusColor(client.statut)}>
                              {client.statut}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {client.type}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {client.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {client.telephone}
                            </div>
                            <div className="flex items-center">
                              <Building2 className="h-3 w-3 mr-1" />
                              {client.adresse}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 text-sm">
                            <div>
                              <span className="text-gray-500">Projets: </span>
                              <span className="font-medium">{client.projetsActifs}/{client.projetsTotal}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Portefeuille: </span>
                              <span className="font-medium text-green-600">{client.valeurPortefeuille}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Score: </span>
                              {client.score === null ? (
                                <span className="font-medium">—</span>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Progress value={client.score} className="w-12 h-2" />
                                  <span className="font-medium">{client.score}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="text-gray-500">Inscrit le: </span>
                              <span className="font-medium">{formatDate(client.dateInscription)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="Appeler">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Email">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Message">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Voir détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Plus d'options">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients VIP */}
        <TabsContent value="vip" className="mt-6">
          {clients.filter(c => c.isVip).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <Star className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Aucun client VIP</p>
                <p className="text-sm">Les prospects chauds ou au score élevé (≥ 90) apparaîtront ici.</p>
              </CardContent>
            </Card>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clients.filter(c => c.isVip).map((client) => (
              <Card key={client.id} className="border-2 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {client.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{client.nom}</h3>
                        <Badge className="bg-purple-100 text-purple-800">
                          {client.type}
                        </Badge>
                      </div>
                    </div>
                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valeur Portefeuille:</span>
                      <span className="font-bold text-green-600">{client.valeurPortefeuille}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projets Actifs:</span>
                      <span className="font-medium">{client.projetsActifs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score:</span>
                      {client.score === null ? (
                        <span className="font-medium">—</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Progress value={client.score} className="w-16 h-2" />
                          <span className="font-medium">{client.score}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </TabsContent>

        {/* Activité Récente */}
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Derniers Clients Ajoutés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucune activité récente</div>
              ) : (
              <div className="space-y-4">
                {clients.slice(0, 4).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {client.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.nom}</p>
                        <p className="text-sm text-gray-600">Inscrit le: {formatDate(client.dateInscription)}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {client.projetsActifs} projets actifs
                    </Badge>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                {clients.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">Aucune donnée</div>
                ) : (
                <div className="space-y-4">
                  {['Particulier', 'Entreprise'].map((type) => {
                    const count = clients.filter(c => c.type === type).length;
                    const percentage = Math.round((count / clients.length) * 100);
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="font-medium">{type}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={percentage} className="w-24 h-2" />
                          <span className="text-sm font-medium">{count} ({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                {avgScore === null ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    Aucun score renseigné pour vos clients
                  </div>
                ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {avgScore}
                    </div>
                    <p className="text-gray-600">Score Moyen</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="font-bold text-green-600">
                        {scoredClients.filter(c => c.score >= 90).length}
                      </div>
                      <div className="text-gray-600">Excellent (90+)</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="font-bold text-blue-600">
                        {scoredClients.filter(c => c.score >= 80 && c.score < 90).length}
                      </div>
                      <div className="text-gray-600">Bon (80-89)</div>
                    </div>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AgentFoncierClients;
