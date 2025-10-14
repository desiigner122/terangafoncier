import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast-simple';
import { 
  DollarSign, 
  Calculator, 
  TrendingUp, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Download, 
  Upload, 
  Percent, 
  Building2, 
  Users, 
  Globe2, 
  Zap, 
  Shield, 
  Target, 
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const AdminPricingPage = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('fees');
  const [editingFee, setEditingFee] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Données par défaut pour les frais
  const defaultFees = [
    {
      id: 1,
      category: 'construction_diaspora',
      name: 'Frais de Gestion Construction',
      type: 'percentage',
      value: 8,
      min_amount: 500000,
      max_amount: 5000000,
      currency: 'XOF',
      description: 'Coordination générale du projet de construction à distance',
      applicable_regions: ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis'],
      is_active: true
    },
    {
      id: 2,
      category: 'supervision',
      name: 'Supervision Technique',
      type: 'fixed_per_phase',
      value: 200000,
      additional_per_visit: 50000,
      currency: 'XOF',
      description: 'Contrôle qualité et suivi technique par phase',
      applicable_regions: ['Toutes régions'],
      is_active: true
    },
    {
      id: 3,
      category: 'reporting',
      name: 'Reporting & FileTextation',
      type: 'monthly',
      value: 75000,
      currency: 'XOF',
      description: 'Photos, vidéos, rapports mensuels',
      services_included: ['Photos haute résolution', 'Vidéos progression', 'Rapports détaillés'],
      is_active: true
    },
    {
      id: 4,
      category: 'premium_services',
      name: 'Services Premium Diaspora',
      type: 'combination',
      percentage: 3,
      fixed_amount: 250000,
      currency: 'XOF',
      description: 'Support 24/7, mises à jour hebdomadaires, consultation illimitée',
      features: ['Support 24/7', 'Updates hebdomadaires', 'Consultation illimitée', 'Assistance multilingue'],
      is_active: true
    },
    {
      id: 5,
      category: 'coordination',
      name: 'Coordination Équipes Locales',
      type: 'combination',
      fixed_amount: 300000,
      monthly_fee: 100000,
      currency: 'XOF',
      description: 'Management et coordination des équipes sur site',
      is_active: true
    }
  ];

  // Données d'abonnements/commissions
  const defaultSubscriptions = [
    {
      id: 1,
      plan_name: 'Basic Diaspora',
      price: 150000,
      currency: 'XOF',
      billing_period: 'monthly',
      features: ['Suivi de base', '2 mises à jour/mois', 'Support email'],
      max_projects: 1,
      is_active: true
    },
    {
      id: 2,
      plan_name: 'Premium Diaspora',
      price: 300000,
      currency: 'XOF',
      billing_period: 'monthly',
      features: ['Suivi avancé', '4 mises à jour/mois', 'Support prioritaire', 'Vidéos HD'],
      max_projects: 3,
      is_active: true
    },
    {
      id: 3,
      plan_name: 'Enterprise Diaspora',
      price: 500000,
      currency: 'XOF',
      billing_period: 'monthly',
      features: ['Suivi temps réel', 'Updates illimitées', 'Support 24/7', 'Vidéos 4K', 'Manager dédié'],
      max_projects: 10,
      is_active: true
    }
  ];

  useEffect(() => {
    const loadPricingData = async () => {
      setLoading(true);
      try {
        // Charger depuis Supabase ou utiliser les données par défaut
        const { data: feesData, error: feesError } = await supabase
          .from('remote_construction_fees')
          .select('*')
          .eq('is_active', true);

        if (feesError && feesError.code === '42P01') {
          // Table n'existe pas encore, utiliser les données par défaut
          setFees(defaultFees);
        } else {
          setFees(feesData || defaultFees);
        }

        setSubscriptions(defaultSubscriptions);

      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setFees(defaultFees);
        setSubscriptions(defaultSubscriptions);
      } finally {
        setLoading(false);
      }
    };

    loadPricingData();
  }, []);

  const handleSaveFee = async (feeData) => {
    try {
      if (editingFee) {
        // Mise à jour
        setFees(fees.map(f => f.id === editingFee.id ? { ...f, ...feeData } : f));
        toast({ title: "Succès", description: "Frais mis à jour avec succès" });
      } else {
        // Création
        const newFee = { ...feeData, id: fees.length + 1 };
        setFees([...fees, newFee]);
        toast({ title: "Succès", description: "Nouveau frais créé avec succès" });
      }
      setIsDialogOpen(false);
      setEditingFee(null);
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la sauvegarde", variant: "destructive" });
    }
  };

  const handleDeleteFee = (feeId) => {
    setFees(fees.filter(f => f.id !== feeId));
    toast({ title: "Succès", description: "Frais supprimé avec succès" });
  };

  const exportToExcel = () => {
    // Simulation d'export Excel
    toast({ title: "Succès", description: "Export Excel généré avec succès" });
  };

  const FeeFormDialog = ({ fee, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState(fee || {
      category: '',
      name: '',
      type: 'percentage',
      value: 0,
      currency: 'XOF',
      description: '',
      is_active: true
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {fee ? 'Modifier le Frais' : 'Nouveau Frais'}
            </DialogTitle>
            <DialogDescription>
              Configurez les frais et commissions pour les services diaspora
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction_diaspora">Construction Diaspora</SelectItem>
                    <SelectItem value="supervision">Supervision</SelectItem>
                    <SelectItem value="reporting">Reporting</SelectItem>
                    <SelectItem value="premium_services">Services Premium</SelectItem>
                    <SelectItem value="coordination">Coordination</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type de Frais</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="fixed">Montant Fixe</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="fixed_per_phase">Fixe par Phase</SelectItem>
                    <SelectItem value="combination">Combinaison</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="name">Nom du Frais</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Frais de Gestion Construction"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Valeur</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XOF">XOF (Franc CFA)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="USD">USD (Dollar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description du frais..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement de la configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration Frais & Pricing</h1>
          <p className="text-muted-foreground">
            Gestion des frais, commissions et abonnements pour les services diaspora
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Frais
          </Button>
        </div>
      </motion.div>

      {/* Statistiques Rapides */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frais Actifs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fees.filter(f => f.is_active).length}</div>
            <p className="text-xs text-muted-foreground">
              Barèmes configurés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Prévisionnels</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">25.8M</div>
            <p className="text-xs text-muted-foreground">
              XOF ce trimestre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marge Moyenne</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.6%</div>
            <p className="text-xs text-muted-foreground">
              Sur projets diaspora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnements</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Plans disponibles
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets de Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="fees">Frais & Commissions</TabsTrigger>
            <TabsTrigger value="subscriptions">Plans d'Abonnement</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Pricing</TabsTrigger>
          </TabsList>

          {/* Gestion des Frais */}
          <TabsContent value="fees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frais et Commissions Diaspora</CardTitle>
                <CardDescription>
                  Configuration des frais pour les services de construction à distance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fees.map((fee) => (
                    <motion.div
                      key={fee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{fee.name}</h3>
                            <Badge variant={fee.is_active ? 'default' : 'secondary'}>
                              {fee.is_active ? 'Actif' : 'Inactif'}
                            </Badge>
                            <Badge variant="outline">{fee.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{fee.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Type: </span>
                              <span className="capitalize">{fee.type.replace('_', ' ')}</span>
                            </div>
                            <div>
                              <span className="font-medium">Valeur: </span>
                              {fee.type === 'percentage' ? `${fee.value}%` : `${fee.value?.toLocaleString()} ${fee.currency}`}
                            </div>
                            <div>
                              <span className="font-medium">Devise: </span>
                              {fee.currency}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingFee(fee);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteFee(fee.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans d'Abonnement */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plans d'Abonnement Diaspora</CardTitle>
                <CardDescription>
                  Gestion des formules d'abonnement pour les services diaspora
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptions.map((plan) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">{plan.plan_name}</h3>
                        <div className="text-3xl font-bold text-primary my-2">
                          {(plan.price / 1000).toFixed(0)}k
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {plan.currency} / {plan.billing_period === 'monthly' ? 'mois' : 'an'}
                        </p>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center">
                        <Badge variant="outline">
                          {plan.max_projects} projet{plan.max_projects > 1 ? 's' : ''} max
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Pricing */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance des Frais</CardTitle>
                  <CardDescription>Analyse des revenus par type de frais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Frais de Gestion</span>
                      <span className="font-bold">12.5M XOF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Supervision Technique</span>
                      <span className="font-bold">8.3M XOF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Services Premium</span>
                      <span className="font-bold">3.2M XOF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reporting</span>
                      <span className="font-bold">1.8M XOF</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Objectifs vs Réalisé</CardTitle>
                  <CardDescription>Comparaison avec les objectifs fixés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Revenus Mensuels</span>
                        <span>103% de l'objectif</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '103%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Nouveaux Abonnements</span>
                        <span>87% de l'objectif</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '87%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Marge Opérationnelle</span>
                        <span>112% de l'objectif</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '112%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Dialog de Configuration */}
      <FeeFormDialog
        fee={editingFee}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingFee(null);
        }}
        onSave={handleSaveFee}
      />
    </div>
  );
};

export default AdminPricingPage;

