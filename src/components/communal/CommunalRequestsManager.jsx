import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import {
  Building2, 
  MapPin, 
  FileText, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calculator, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Settings
} from 'lucide-react';

const CommunalRequestsManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [subscribedCommunes, setSubscribedCommunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({
    monthly: 0,
    pending: 0,
    total: 0
  });

  // Types de demandes communales avec tarification
  const requestTypes = {
    terrain_municipal: {
      title: "Terrain Municipal",
      price: 50000,
      breakdown: {
        dossier: 15000,
        commission: 25000,
        instruction: 10000
      },
      icon: Building2,
      color: "bg-blue-500"
    },
    permis_construire: {
      title: "Permis de Construire", 
      price: 90000,
      breakdown: {
        dossier: 20000,
        commission: 30000,
        geometre: 40000
      },
      icon: FileText,
      color: "bg-green-500"
    },
    terrain_agricole: {
      title: "Terrain Agricole",
      price: 50000,
      breakdown: {
        dossier: 10000,
        commission: 15000,
        expertise: 25000
      },
      icon: MapPin,
      color: "bg-yellow-500"
    }
  };

  // Plans d'abonnement mairies
  const subscriptionPlans = {
    basic: {
      name: "Mairie Basic",
      price: 75000,
      requests: 50,
      features: ["Gestion 50 demandes/mois", "Interface standard", "Support email"]
    },
    premium: {
      name: "Mairie Premium", 
      price: 150000,
      requests: "Illimité",
      features: ["Demandes illimitées", "Dashboard avancé", "Support téléphone", "Géolocalisation"]
    },
    enterprise: {
      name: "Mairie Enterprise",
      price: 300000,
      requests: "Illimité",
      features: ["Tout Premium +", "API intégration", "Multi-utilisateurs", "Manager dédié"]
    }
  };

  useEffect(() => {
    loadCommunalRequests();
  }, []);

  const loadCommunalRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communal_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const mappedRequests = (data || []).map((req) => ({
        id: req.id,
        type: req.type,
        citizen: req.applicant_name || '',
        commune: req.commune,
        status: req.status,
        amount: requestTypes[req.type]?.price || 0,
        date: req.created_at,
        location: req.zone
      }));

      setRequests(mappedRequests);
      calculateRevenue(mappedRequests);
    } catch (error) {
      console.error('Erreur chargement demandes communales:', error);
      setRequests([]);
      calculateRevenue([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenue = (requestsList) => {
    // Calcul revenus secteur communal a partir des demandes reelles
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyRevenue = requestsList
      .filter((r) => {
        if (r.status !== 'approuve' || !r.date) return false;
        const d = new Date(r.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const pendingRevenue = requestsList
      .filter((r) => r.status === 'en_attente' || r.status === 'en_cours')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const totalRevenue = requestsList
      .filter((r) => r.status === 'approuve')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    setRevenue({
      monthly: monthlyRevenue,
      pending: pendingRevenue,
      total: totalRevenue
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approuve': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'rejete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approuve': return <CheckCircle className="w-4 h-4" />;
      case 'en_cours': return <Clock className="w-4 h-4" />;
      case 'en_attente': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Métriques revenus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus Mensuels</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(revenue.monthly)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(revenue.pending)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Année</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(revenue.total)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Types de demandes et tarification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Tarification Services Communaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(requestTypes).map(([key, type]) => {
              const IconComponent = type.icon;
              return (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${type.color} text-white`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{type.title}</h3>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(type.price)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {Object.entries(type.breakdown).map(([item, amount]) => (
                      <div key={item} className="flex justify-between">
                        <span className="capitalize">{item}:</span>
                        <span>{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Demandes récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Demandes Communales Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => {
              const requestType = requestTypes[request.type];
              const IconComponent = requestType.icon;
              
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${requestType.color} text-white`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{requestType.title}</h4>
                        <p className="text-sm text-gray-600">
                          {request.citizen} • {request.commune}
                        </p>
                        <p className="text-xs text-gray-500">{request.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatCurrency(request.amount)}
                      </p>
                      <Badge className={`${getStatusColor(request.status)} mt-1`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SubscriptionsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Plans d'Abonnement Mairies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(subscriptionPlans).map(([key, plan]) => (
              <div key={key} className="border rounded-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {formatCurrency(plan.price)}
                  </p>
                  <p className="text-sm text-gray-600">/mois</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-center font-semibold">
                    {plan.requests} demandes/mois
                  </p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full"
                  variant={key === 'premium' ? 'default' : 'outline'}
                >
                  {key === 'premium' ? 'Recommandé' : 'Choisir ce plan'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communes abonnées */}
      <Card>
        <CardHeader>
          <CardTitle>Communes Abonnées</CardTitle>
        </CardHeader>
        <CardContent>
          {subscribedCommunes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribedCommunes.map((commune, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{commune.name}</h4>
                    <Badge variant="outline" className="capitalize">
                      {commune.plan}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {commune.requests} demandes ce mois
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2"
                      style={{ width: `${(commune.requests / 50) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Aucune commune abonnée"
              description="Les communes ayant souscrit à un plan d'abonnement apparaîtront ici."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion Demandes Communales
          </h1>
          <p className="text-gray-600">
            Business model et revenus du secteur communal - Teranga Foncier
          </p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'subscriptions' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('subscriptions')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Abonnements
          </Button>
        </div>

        {/* Contenu selon l'onglet */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'subscriptions' && <SubscriptionsTab />}
          </>
        )}

        {/* Alert business model */}
        <Alert className="mt-8 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Objectif Q1 2025 :</strong> 200 demandes/mois, 15 mairies abonnées, 
            12M FCFA de revenus mensuels. Expansion vers 100 communes d'ici fin 2025.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default CommunalRequestsManager;
