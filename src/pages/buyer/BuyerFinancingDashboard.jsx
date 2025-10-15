import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Banknote, 
  TrendingUp,
  Calculator,
  Building2,
  CreditCard,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign,
  Percent,
  MapPin,
  Clock,
  Shield,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Users,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const BuyerFinancingDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [financingData, setFinancingData] = useState({
    creditScore: 750,
    maxBorrowAmount: 45000000,
    monthlyIncome: 850000,
    existingDebt: 150000,
    debtRatio: 17.6,
    eligibleRate: 6.5,
    activeRequests: 2,
    approvedAmount: 0,
    pendingRequests: 1
  });
  
  // Simulateur de financement
  const [simulator, setSimulator] = useState({
    propertyPrice: '',
    downPayment: '30',
    loanDuration: '20',
    interestRate: '6.5'
  });

  const [bankOffers, setBankOffers] = useState([
    {
      id: 1,
      bankName: 'CBAO Groupe Attijariwafa Bank',
      logo: '/logos/cbao.png',
      rate: 6.2,
      maxAmount: 50000000,
      maxDuration: 25,
      features: ['Taux préférentiel', 'Accompagnement personnalisé', 'Assurance incluse'],
      processingTime: '7-10 jours',
      fees: 1.5,
      status: 'available'
    },
    {
      id: 2,
      bankName: 'UBA Sénégal',
      logo: '/logos/uba.png',
      rate: 6.8,
      maxAmount: 40000000,
      maxDuration: 20,
      features: ['Procédure simplifiée', 'Réponse rapide', 'Frais réduits'],
      processingTime: '5-7 jours',
      fees: 1.2,
      status: 'available'
    },
    {
      id: 3,
      bankName: 'Banque Atlantique',
      logo: '/logos/atlantique.png',
      rate: 7.0,
      maxAmount: 35000000,
      maxDuration: 25,
      features: ['Financement up to 80%', 'Taux fixe', 'Remboursement flexible'],
      processingTime: '10-15 jours',
      fees: 1.8,
      status: 'available'
    }
  ]);

  // Charger les demandes de financement
  const loadMyRequests = async () => {
    if (!user) return;
    
    try {
      setLoadingRequests(true);
      
      // Charger toutes les demandes de type financement bancaire
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          parcels:parcel_id (
            id,
            title,
            price,
            location,
            surface
          )
        `)
        .eq('user_id', user.id)
        .eq('payment_type', 'bank_financing')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMyRequests(data || []);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    const loadFinancingData = async () => {
      // Simulation de chargement des données de financement de l'utilisateur
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    
    loadFinancingData();
    loadMyRequests();
  }, [user]);

  const calculateMonthlyPayment = () => {
    const price = parseFloat(simulator.propertyPrice) || 0;
    const down = parseFloat(simulator.downPayment) || 0;
    const duration = parseFloat(simulator.loanDuration) || 1;
    const rate = parseFloat(simulator.interestRate) || 0;
    
    const loanAmount = price * (1 - down / 100);
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = duration * 12;
    
    if (monthlyRate === 0) return loanAmount / numberOfPayments;
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-SN', { 
      style: 'currency', 
      currency: 'XOF',
      maximumFractionDigits: 0 
    }).format(price);
  };

  // Helper pour les statuts côté banque
  const getBankStatusBadge = (status) => {
    const statuses = {
      pending: { label: 'En cours d\'étude', color: 'bg-blue-100 text-blue-800', icon: Clock },
      under_review: { label: 'Analyse en cours', color: 'bg-yellow-100 text-yellow-800', icon: FileText },
      approved: { label: 'Approuvé par la banque', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Refusé par la banque', color: 'bg-red-100 text-red-800', icon: AlertCircle },
      conditional: { label: 'Accord conditionnel', color: 'bg-purple-100 text-purple-800', icon: Shield }
    };
    
    return statuses[status] || statuses.pending;
  };

  // Helper pour les statuts côté vendeur
  const getVendorStatusBadge = (status) => {
    const statuses = {
      pending: { label: 'En attente vendeur', color: 'bg-amber-100 text-amber-800', icon: Clock },
      accepted: { label: 'Accepté par vendeur', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Refusé par vendeur', color: 'bg-red-100 text-red-800', icon: AlertCircle },
      negotiating: { label: 'En négociation', color: 'bg-blue-100 text-blue-800', icon: Users }
    };
    
    return statuses[status] || statuses.pending;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const loanAmount = (parseFloat(simulator.propertyPrice) || 0) * (1 - (parseFloat(simulator.downPayment) || 0) / 100);
  const totalCost = monthlyPayment * (parseFloat(simulator.loanDuration) || 1) * 12;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                Centre de Financement
              </h1>
              <p className="text-gray-600 mt-2">Gérez vos demandes de financement et simulez vos crédits immobiliers</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/parcelles-vendeurs')}>
                <MapPin className="w-4 h-4 mr-2" />
                Parcourir les terrains
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Retour au dashboard
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Score de crédit</p>
                  <p className="text-3xl font-bold">{financingData.creditScore}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Capacité d'emprunt</p>
                  <p className="text-2xl font-bold">{formatPrice(financingData.maxBorrowAmount)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Taux éligible</p>
                  <p className="text-3xl font-bold">{financingData.eligibleRate}%</p>
                </div>
                <Percent className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Demandes actives</p>
                  <p className="text-3xl font-bold">{financingData.activeRequests}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="simulator">Simulateur</TabsTrigger>
            <TabsTrigger value="offers">Offres bancaires</TabsTrigger>
            <TabsTrigger value="requests">Mes demandes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Profil financier */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Votre profil financier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score de crédit</span>
                      <span className="font-medium">{financingData.creditScore}/850</span>
                    </div>
                    <Progress value={(financingData.creditScore / 850) * 100} className="h-2" />
                    <p className="text-xs text-green-600 mt-1">Excellent score - Taux préférentiels disponibles</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ratio d'endettement</span>
                      <span className="font-medium">{financingData.debtRatio}%</span>
                    </div>
                    <Progress value={financingData.debtRatio} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Idéal : &lt; 33%</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Recommandations IA</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Votre profil est éligible aux meilleurs taux du marché</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Capacité d'emprunt optimale pour vos revenus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                        <span>Considérez un apport plus élevé pour réduire les mensualités</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/parcelles-vendeurs">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Parcourir les terrains</h4>
                            <p className="text-sm text-gray-600">Trouvez votre terrain idéal avec financement intégré</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-green-200" onClick={() => setActiveTab('simulator')}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Calculator className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Simuler un financement</h4>
                          <p className="text-sm text-gray-600">Calculez vos mensualités et capacity d'achat</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-purple-200" onClick={() => setActiveTab('offers')}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Comparer les banques</h4>
                          <p className="text-sm text-gray-600">Trouvez la meilleure offre de financement</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Formulaire de simulation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    Simulateur de financement
                  </CardTitle>
                  <CardDescription>
                    Simulez votre crédit immobilier et découvrez vos mensualités
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="propertyPrice">Prix du bien (FCFA)</Label>
                    <Input
                      id="propertyPrice"
                      type="number"
                      placeholder="ex: 25000000"
                      value={simulator.propertyPrice}
                      onChange={(e) => setSimulator({...simulator, propertyPrice: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="downPayment">Apport personnel (%)</Label>
                    <Select value={simulator.downPayment} onValueChange={(value) => setSimulator({...simulator, downPayment: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20% (minimum)</SelectItem>
                        <SelectItem value="30">30% (recommandé)</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                        <SelectItem value="50">50%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="loanDuration">Durée du prêt (années)</Label>
                    <Select value={simulator.loanDuration} onValueChange={(value) => setSimulator({...simulator, loanDuration: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 ans</SelectItem>
                        <SelectItem value="20">20 ans</SelectItem>
                        <SelectItem value="25">25 ans</SelectItem>
                        <SelectItem value="30">30 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="interestRate">Taux d'intérêt (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={simulator.interestRate}
                      onChange={(e) => setSimulator({...simulator, interestRate: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Résultats de simulation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Résultats de la simulation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Mensualité</div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {formatPrice(monthlyPayment)}
                      </div>
                      <div className="text-sm text-gray-500">
                        sur {simulator.loanDuration} ans
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600">Apport nécessaire</div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatPrice((parseFloat(simulator.propertyPrice) || 0) * (parseFloat(simulator.downPayment) || 0) / 100)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600">Montant emprunté</div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatPrice(loanAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Coût total du crédit</span>
                      <span className="font-medium">{formatPrice(totalCost - loanAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total à rembourser</span>
                      <span className="font-medium">{formatPrice(totalCost)}</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => setActiveTab('offers')}>
                    Comparer les offres bancaires
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <div className="grid gap-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Offres de financement partenaires</h3>
                <p className="text-gray-600">Comparez les meilleures offres du marché adaptées à votre profil</p>
              </div>

              <div className="grid gap-6">
                {bankOffers.map((bank) => (
                  <Card key={bank.id} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{bank.bankName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-green-700 bg-green-100">
                                Taux : {bank.rate}%
                              </Badge>
                              <Badge variant="outline">
                                Max : {formatPrice(bank.maxAmount)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          {bank.processingTime}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <div className="text-sm text-gray-600">Durée maximum</div>
                          <div className="font-medium">{bank.maxDuration} ans</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Frais de dossier</div>
                          <div className="font-medium">{bank.fees}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Traitement</div>
                          <div className="font-medium">{bank.processingTime}</div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-sm text-gray-600 mb-2">Avantages</div>
                        <div className="flex flex-wrap gap-2">
                          {bank.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1">
                          Demander ce financement
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button variant="outline">
                          <Calculator className="w-4 h-4 mr-2" />
                          Simuler
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Mes demandes de financement
                </CardTitle>
                <CardDescription>
                  Suivez l'état de vos demandes - Double suivi : Banque et Vendeur
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRequests ? (
                  // Loading state
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-6 animate-pulse">
                        <div className="flex justify-between mb-4">
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-6 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myRequests.length === 0 ? (
                  // Empty state
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune demande active
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Vous n'avez pas encore de demandes de financement en cours.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => setActiveTab('simulator')}>
                        <Calculator className="w-4 h-4 mr-2" />
                        Simuler un financement
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/parcelles-vendeurs')}>
                        <MapPin className="w-4 h-4 mr-2" />
                        Parcourir les terrains
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Requests list
                  <div className="space-y-4">
                    {myRequests.map((request) => {
                      const bankStatus = getBankStatusBadge(request.bank_status || 'pending');
                      const vendorStatus = getVendorStatusBadge(request.status || 'pending');
                      const BankIcon = bankStatus.icon;
                      const VendorIcon = vendorStatus.icon;
                      
                      return (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-6 hover:shadow-lg transition-all"
                        >
                          {/* Header avec titre terrain et date */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {request.parcels?.title || 'Terrain'}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {request.parcels?.location || 'N/A'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(request.created_at).toLocaleDateString('fr-FR')}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600 mb-1">Prix offert</div>
                              <div className="text-lg font-bold text-gray-900">
                                {formatPrice(request.offered_price)}
                              </div>
                            </div>
                          </div>

                          {/* Dual Status Badges */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {/* Bank Status */}
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex-shrink-0">
                                <Building2 className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-blue-600 font-medium mb-1">
                                  CÔTÉ BANQUE
                                </div>
                                <div className="flex items-center gap-2">
                                  <BankIcon className="w-4 h-4" />
                                  <Badge className={`${bankStatus.color} border-0`}>
                                    {bankStatus.label}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Vendor Status */}
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex-shrink-0">
                                <Users className="w-5 h-5 text-amber-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-amber-600 font-medium mb-1">
                                  CÔTÉ VENDEUR
                                </div>
                                <div className="flex items-center gap-2">
                                  <VendorIcon className="w-4 h-4" />
                                  <Badge className={`${vendorStatus.color} border-0`}>
                                    {vendorStatus.label}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Détails financement */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Surface</div>
                              <div className="font-semibold text-gray-900">
                                {request.parcels?.surface || 'N/A'} m²
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Revenu mensuel</div>
                              <div className="font-semibold text-gray-900">
                                {formatPrice(request.monthly_income || 0)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Durée prêt</div>
                              <div className="font-semibold text-gray-900">
                                {request.bank_details?.loan_duration || 'N/A'} mois
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Type emploi</div>
                              <div className="font-semibold text-gray-900">
                                {request.bank_details?.employment_type === 'salaried' ? 'Salarié' : 
                                 request.bank_details?.employment_type === 'self_employed' ? 'Indépendant' : 
                                 'Autre'}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                // TODO: Navigate to detailed view
                                console.log('View request details:', request.id);
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Voir détails
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                // TODO: Open chat with bank
                                console.log('Message bank for request:', request.id);
                              }}
                            >
                              <Building2 className="w-4 h-4 mr-2" />
                              Contacter banque
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                // TODO: Open chat with vendor
                                console.log('Message vendor for request:', request.id);
                              }}
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Contacter vendeur
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerFinancingDashboard;