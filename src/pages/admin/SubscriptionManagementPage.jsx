import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Crown, 
  Star, 
  Zap, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Settings, 
  Edit, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  AlertCircle,
  Package,
  CreditCard,
  Activity,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const SubscriptionManagementPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // États pour le nouveau plan
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: '',
    duration_months: 12,
    max_properties: 10,
    max_images_per_property: 20,
    priority_support: false,
    featured_listings: false,
    analytics_access: false,
    api_access: false,
    custom_branding: false,
    status: 'active'
  });

  // Données de démonstration pour les plans d'abonnement
  const mockPlans = [
    {
      id: 1,
      name: 'Particulier Basic',
      description: 'Plan de base pour les particuliers',
      price: 15000,
      currency: 'XOF',
      duration_months: 12,
      max_properties: 5,
      max_images_per_property: 10,
      priority_support: false,
      featured_listings: false,
      analytics_access: false,
      api_access: false,
      custom_branding: false,
      status: 'active',
      subscribers_count: 245,
      created_at: '2024-01-15'
    },
    {
      id: 2,
      name: 'Vendeur Pro',
      description: 'Plan professionnel pour les vendeurs réguliers',
      price: 45000,
      currency: 'XOF',
      duration_months: 12,
      max_properties: 25,
      max_images_per_property: 30,
      priority_support: true,
      featured_listings: true,
      analytics_access: true,
      api_access: false,
      custom_branding: false,
      status: 'active',
      subscribers_count: 89,
      created_at: '2024-01-15'
    },
    {
      id: 3,
      name: 'Promoteur Premium',
      description: 'Plan premium pour les promoteurs immobiliers',
      price: 125000,
      currency: 'XOF',
      duration_months: 12,
      max_properties: 100,
      max_images_per_property: 50,
      priority_support: true,
      featured_listings: true,
      analytics_access: true,
      api_access: true,
      custom_branding: true,
      status: 'active',
      subscribers_count: 34,
      created_at: '2024-01-15'
    },
    {
      id: 4,
      name: 'Agent Foncier',
      description: 'Plan spécialisé pour les agents fonciers',
      price: 75000,
      currency: 'XOF',
      duration_months: 12,
      max_properties: 50,
      max_images_per_property: 40,
      priority_support: true,
      featured_listings: true,
      analytics_access: true,
      api_access: true,
      custom_branding: false,
      status: 'active',
      subscribers_count: 156,
      created_at: '2024-01-15'
    }
  ];

  // Données de démonstration pour les abonnements utilisateurs
  const mockUserSubscriptions = [
    {
      id: 1,
      user_id: 101,
      plan_id: 2,
      user_name: 'Amadou Diallo',
      user_email: 'amadou.diallo@email.com',
      plan_name: 'Vendeur Pro',
      status: 'active',
      start_date: '2024-09-01',
      end_date: '2025-09-01',
      auto_renew: true,
      last_payment: '2024-09-01',
      amount_paid: 45000
    },
    {
      id: 2,
      user_id: 102,
      plan_id: 3,
      user_name: 'Fatou Sall',
      user_email: 'fatou.sall@email.com',
      plan_name: 'Promoteur Premium',
      status: 'active',
      start_date: '2024-08-15',
      end_date: '2025-08-15',
      auto_renew: true,
      last_payment: '2024-08-15',
      amount_paid: 125000
    },
    {
      id: 3,
      user_id: 103,
      plan_id: 1,
      user_name: 'Ousmane Ba',
      user_email: 'ousmane.ba@email.com',
      plan_name: 'Particulier Basic',
      status: 'expired',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      auto_renew: false,
      last_payment: '2024-01-01',
      amount_paid: 15000
    }
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setSubscriptions(mockPlans);
      setUserSubscriptions(mockUserSubscriptions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreatePlan = async () => {
    try {
      // TODO: Intégrer avec l'API backend
      const newPlanWithId = {
        ...newPlan,
        id: Date.now(),
        subscribers_count: 0,
        created_at: new Date().toISOString().split('T')[0],
        currency: 'XOF'
      };
      
      setSubscriptions([...subscriptions, newPlanWithId]);
      setIsAddingPlan(false);
      setNewPlan({
        name: '',
        description: '',
        price: '',
        duration_months: 12,
        max_properties: 10,
        max_images_per_property: 20,
        priority_support: false,
        featured_listings: false,
        analytics_access: false,
        api_access: false,
        custom_branding: false,
        status: 'active'
      });
      
      window.safeGlobalToast({
        title: "Plan créé",
        description: "Le nouveau plan d'abonnement a été créé avec succès",
        className: "bg-green-500 text-white"
      });
    } catch (error) {
      console.error('Erreur création plan:', error);
      window.safeGlobalToast({
        title: "Erreur",
        description: "Impossible de créer le plan",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePlanStatus = (planId, newStatus) => {
    setSubscriptions(subscriptions.map(plan => 
      plan.id === planId ? { ...plan, status: newStatus } : plan
    ));
    
    window.safeGlobalToast({
      title: "Statut mis à jour",
      description: `Le plan a été ${newStatus === 'active' ? 'activé' : 'désactivé'}`,
      className: "bg-blue-500 text-white"
    });
  };

  const handleCancelUserSubscription = (subscriptionId) => {
    setUserSubscriptions(userSubscriptions.map(sub => 
      sub.id === subscriptionId ? { ...sub, status: 'cancelled', auto_renew: false } : sub
    ));
    
    window.safeGlobalToast({
      title: "Abonnement annulé",
      description: "L'abonnement utilisateur a été annulé",
      className: "bg-orange-500 text-white"
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      expired: "bg-red-100 text-red-800",
      cancelled: "bg-orange-100 text-orange-800"
    };
    
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const getPlanIcon = (planName) => {
    if (planName.includes('Premium')) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (planName.includes('Pro')) return <Star className="w-5 h-5 text-blue-500" />;
    if (planName.includes('Agent')) return <Zap className="w-5 h-5 text-purple-500" />;
    return <Package className="w-5 h-5 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des abonnements...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = subscriptions.reduce((sum, plan) => 
    sum + (plan.price * plan.subscribers_count), 0
  );
  const totalSubscribers = subscriptions.reduce((sum, plan) => 
    sum + plan.subscribers_count, 0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Abonnements</h1>
          <p className="text-gray-600 mt-2">Gérez les plans d'abonnement et les souscriptions utilisateurs</p>
        </div>
        
        <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau plan d'abonnement</DialogTitle>
              <DialogDescription>
                Configurez les détails du nouveau plan d'abonnement
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du plan</Label>
                <Input
                  id="name"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  placeholder="Ex: Vendeur Pro"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Prix (XOF)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                  placeholder="Ex: 45000"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                  placeholder="Description du plan..."
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Durée (mois)</Label>
                <Select value={newPlan.duration_months.toString()} onValueChange={(value) => setNewPlan({...newPlan, duration_months: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mois</SelectItem>
                    <SelectItem value="3">3 mois</SelectItem>
                    <SelectItem value="6">6 mois</SelectItem>
                    <SelectItem value="12">12 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="max_properties">Propriétés max</Label>
                <Input
                  id="max_properties"
                  type="number"
                  value={newPlan.max_properties}
                  onChange={(e) => setNewPlan({...newPlan, max_properties: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="max_images">Images par propriété</Label>
                <Input
                  id="max_images"
                  type="number"
                  value={newPlan.max_images_per_property}
                  onChange={(e) => setNewPlan({...newPlan, max_images_per_property: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <Label>Fonctionnalités</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPlan.priority_support}
                      onChange={(e) => setNewPlan({...newPlan, priority_support: e.target.checked})}
                    />
                    <span>Support prioritaire</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPlan.featured_listings}
                      onChange={(e) => setNewPlan({...newPlan, featured_listings: e.target.checked})}
                    />
                    <span>Annonces en vedette</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPlan.analytics_access}
                      onChange={(e) => setNewPlan({...newPlan, analytics_access: e.target.checked})}
                    />
                    <span>Accès aux analytics</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddingPlan(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreatePlan} className="bg-green-600 hover:bg-green-700">
                Créer le plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Plans Actifs</p>
                <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Abonnés</p>
                <p className="text-2xl font-bold">{totalSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenus Mensuels</p>
                <p className="text-2xl font-bold">{(totalRevenue / 12).toLocaleString()} XOF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Croissance</p>
                <p className="text-2xl font-bold">+15%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans d'abonnement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Plans d'Abonnement
          </CardTitle>
          <CardDescription>
            Gérez les différents plans d'abonnement disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Abonnés</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getPlanIcon(plan.name)}
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{plan.price.toLocaleString()} {plan.currency}</div>
                  </TableCell>
                  <TableCell>{plan.duration_months} mois</TableCell>
                  <TableCell>
                    <div className="font-medium">{plan.subscribers_count}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(plan.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdatePlanStatus(plan.id, plan.status === 'active' ? 'inactive' : 'active')}
                      >
                        {plan.status === 'active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Abonnements utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Abonnements Utilisateurs
          </CardTitle>
          <CardDescription>
            Suivez les abonnements actifs des utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Fin d'abonnement</TableHead>
                <TableHead>Renouvellement</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subscription.user_name}</div>
                      <div className="text-sm text-gray-500">{subscription.user_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getPlanIcon(subscription.plan_name)}
                      <span className="font-medium">{subscription.plan_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(subscription.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(subscription.end_date).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subscription.auto_renew ? "default" : "secondary"}>
                      {subscription.auto_renew ? "Auto" : "Manuel"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {subscription.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCancelUserSubscription(subscription.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagementPage;