import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  CreditCard,
  User,
  Settings,
  RefreshCw,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hybridDataService } from '@/services/HybridDataService';

const AdvancedSubscriptionManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptionStats, setSubscriptionStats] = useState({});
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  // État pour créer/modifier un plan
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'XOF',
    duration_days: 30,
    role_type: '',
    features: '',
    max_properties: 10,
    max_transactions: 50,
    has_analytics: false,
    has_priority_support: false,
    has_api_access: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les statistiques d'abonnements
      const statsResult = await hybridDataService.getSubscriptionStats();
      if (statsResult.success) {
        setSubscriptionStats(statsResult.data);
      }

      // Charger les plans d'abonnement
      const plansResult = await hybridDataService.getSubscriptionPlans();
      if (plansResult.success) {
        setSubscriptionPlans(plansResult.data);
      }

      // Charger les données utilisateurs avec abonnements
      const usersResult = await hybridDataService.getCompleteUsersData();
      if (usersResult.success) {
        setUsersData(usersResult.data);
      }

    } catch (error) {
      console.error('Erreur chargement données abonnements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'expired': 'bg-red-500',
      'cancelled': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getRoleColor = (role) => {
    const colors = {
      'Particulier': 'bg-blue-500',
      'Vendeur': 'bg-purple-500',
      'Investisseur': 'bg-green-500',
      'Promoteur': 'bg-orange-500',
      'Banque': 'bg-indigo-500',
      'Notaire': 'bg-gray-500',
      'Géomètre': 'bg-cyan-500',
      'Agent Foncier': 'bg-amber-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleCreatePlan = async () => {
    try {
      // TODO: Implémenter la création de plan via API
      console.log('Création plan:', newPlan);
      setIsCreatePlanOpen(false);
      setNewPlan({
        name: '',
        description: '',
        price: '',
        currency: 'XOF',
        duration_days: 30,
        role_type: '',
        features: '',
        max_properties: 10,
        max_transactions: 50,
        has_analytics: false,
        has_priority_support: false,
        has_api_access: false
      });
      await loadData();
    } catch (error) {
      console.error('Erreur création plan:', error);
    }
  };

  // Filtrage des utilisateurs
  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.subscription_status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données d'abonnements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Crown className="h-8 w-8 mr-3 text-yellow-600" />
            Gestion Avancée des Abonnements
          </h1>
          <p className="text-gray-600 mt-2">
            Administration complète des plans d'abonnement et des souscriptions utilisateurs
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un Nouveau Plan d'Abonnement</DialogTitle>
                <DialogDescription>
                  Définissez les caractéristiques du nouveau plan d'abonnement
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan-name">Nom du Plan</Label>
                  <Input
                    id="plan-name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    placeholder="Ex: Vendeur Premium"
                  />
                </div>
                <div>
                  <Label htmlFor="plan-role">Type de Rôle</Label>
                  <Select value={newPlan.role_type} onValueChange={(value) => setNewPlan({...newPlan, role_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Particulier">Particulier</SelectItem>
                      <SelectItem value="Vendeur">Vendeur</SelectItem>
                      <SelectItem value="Investisseur">Investisseur</SelectItem>
                      <SelectItem value="Promoteur">Promoteur</SelectItem>
                      <SelectItem value="Banque">Banque</SelectItem>
                      <SelectItem value="Notaire">Notaire</SelectItem>
                      <SelectItem value="Géomètre">Géomètre</SelectItem>
                      <SelectItem value="Agent Foncier">Agent Foncier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="plan-price">Prix (XOF)</Label>
                  <Input
                    id="plan-price"
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="plan-duration">Durée (jours)</Label>
                  <Input
                    id="plan-duration"
                    type="number"
                    value={newPlan.duration_days}
                    onChange={(e) => setNewPlan({...newPlan, duration_days: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="plan-description">Description</Label>
                  <Textarea
                    id="plan-description"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                    placeholder="Description du plan..."
                  />
                </div>
                <div>
                  <Label htmlFor="max-properties">Max Propriétés</Label>
                  <Input
                    id="max-properties"
                    type="number"
                    value={newPlan.max_properties}
                    onChange={(e) => setNewPlan({...newPlan, max_properties: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="max-transactions">Max Transactions</Label>
                  <Input
                    id="max-transactions"
                    type="number"
                    value={newPlan.max_transactions}
                    onChange={(e) => setNewPlan({...newPlan, max_transactions: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreatePlan} className="bg-blue-600 hover:bg-blue-700">
                  Créer le Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Total Abonnements</p>
                <p className="text-2xl font-bold text-blue-600">{subscriptionStats.total || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Abonnements Actifs</p>
                <p className="text-2xl font-bold text-green-600">{subscriptionStats.active || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">{subscriptionStats.pending || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Expirés</p>
                <p className="text-2xl font-bold text-red-600">{subscriptionStats.expired || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Revenus Mensuels</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(subscriptionStats.revenue || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="plans">Plans d'Abonnement</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition des abonnements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Répartition des Abonnements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Actifs</span>
                      <span className="text-sm font-medium">{subscriptionStats.active || 0}</span>
                    </div>
                    <Progress value={(subscriptionStats.active / subscriptionStats.total) * 100 || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">En attente</span>
                      <span className="text-sm font-medium">{subscriptionStats.pending || 0}</span>
                    </div>
                    <Progress value={(subscriptionStats.pending / subscriptionStats.total) * 100 || 0} className="h-2 bg-yellow-200" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Expirés</span>
                      <span className="text-sm font-medium">{subscriptionStats.expired || 0}</span>
                    </div>
                    <Progress value={(subscriptionStats.expired / subscriptionStats.total) * 100 || 0} className="h-2 bg-red-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plans les plus populaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Plans les Plus Populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subscriptionPlans.slice(0, 5).map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-gray-600">{plan.role_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(plan.price)}</p>
                        <p className="text-xs text-gray-500">0 utilisateurs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Plans d'Abonnement</h2>
            <Button onClick={() => setIsCreatePlanOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <Badge className={getRoleColor(plan.role_type)} variant="secondary">
                      {plan.role_type}
                    </Badge>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(plan.price)}
                      </p>
                      <p className="text-sm text-gray-600">par mois</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Max propriétés:</span>
                        <span className="font-medium">{plan.max_properties}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max transactions:</span>
                        <span className="font-medium">{plan.max_transactions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Durée:</span>
                        <span className="font-medium">{plan.duration_days} jours</span>
                      </div>
                    </div>

                    {plan.features && (
                      <div>
                        <p className="text-sm font-medium mb-2">Fonctionnalités:</p>
                        <div className="space-y-1">
                          {(typeof plan.features === 'string' ? 
                            plan.features.split(',') : 
                            plan.features
                          ).slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                              {feature.trim()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Utilisateurs avec Abonnements</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Rechercher utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous rôles</SelectItem>
                  <SelectItem value="Particulier">Particulier</SelectItem>
                  <SelectItem value="Vendeur">Vendeur</SelectItem>
                  <SelectItem value="Investisseur">Investisseur</SelectItem>
                  <SelectItem value="Promoteur">Promoteur</SelectItem>
                  <SelectItem value="Banque">Banque</SelectItem>
                  <SelectItem value="Notaire">Notaire</SelectItem>
                  <SelectItem value="Géomètre">Géomètre</SelectItem>
                  <SelectItem value="Agent Foncier">Agent Foncier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.first_name} {user.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Badge className={getRoleColor(user.role)} variant="secondary">
                          {user.role}
                        </Badge>
                        <Badge className={`${getStatusColor(user.subscription_status)} text-white`}>
                          {user.subscription_status || 'Aucun'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Plan actuel</p>
                          <p className="font-medium">{user.plan_name || 'Aucun plan'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Prix mensuel</p>
                          <p className="font-medium text-green-600">
                            {user.plan_price ? formatCurrency(user.plan_price) : 'Gratuit'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Propriétés</p>
                          <p className="font-medium">{user.properties_count || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Transactions</p>
                          <p className="font-medium">{user.transactions_count || 0}</p>
                        </div>
                      </div>

                      {user.subscription_end && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Expire le:</strong> {new Date(user.subscription_end).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Changer Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun utilisateur trouvé avec les critères de recherche</p>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Évolution des Abonnements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphique en développement</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Revenus par Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphique en développement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSubscriptionManagementPage;