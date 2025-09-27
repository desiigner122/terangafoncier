import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench,
  Calculator,
  Smartphone,
  QrCode,
  CreditCard,
  Banknote,
  Receipt,
  FileCheck,
  UserCheck,
  Shield,
  Lock,
  Key,
  Fingerprint,
  Eye,
  Database,
  Cloud,
  Server,
  Monitor,
  Wifi,
  Signal,
  Battery,
  Zap,
  Bot,
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Camera,
  Mic,
  Volume2,
  Play,
  Pause,
  Download,
  Upload,
  Share2,
  Copy,
  Settings,
  HelpCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Globe,
  Star,
  Award,
  Users,
  Building,
  Home,
  Car,
  Plane,
  Ship,
  Truck,
  Bike,
  Clock3,
  Clock9,
  Clock12,
  ClockIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const BanqueTools = ({ dashboardStats = {} }) => {
  const [loanAmount, setLoanAmount] = useState(100000000); // 100M FCFA
  const [loanTerm, setLoanTerm] = useState(20); // 20 ans
  const [interestRate, setInterestRate] = useState(5.5); // 5.5%
  const [downPayment, setDownPayment] = useState(20); // 20%
  const [selectedProperty, setSelectedProperty] = useState('terrain');
  const [clientRiskScore, setClientRiskScore] = useState(85);
  const [kycProgress, setKycProgress] = useState(67);
  const [qrCodeData, setQrCodeData] = useState('');
  const [mobilePayment, setMobilePayment] = useState({
    phone: '',
    amount: '',
    service: 'orange-money'
  });

  // Calculateur de crédit
  const calculateLoan = () => {
    const principal = loanAmount * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalInterest = (monthlyPayment * numPayments) - principal;
    const totalPayment = principal + totalInterest;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      downPaymentAmount: Math.round(loanAmount * downPayment / 100)
    };
  };

  const loanCalculation = calculateLoan();

  // Outils disponibles
  const bankingTools = [
    {
      id: 'calculator',
      name: 'Simulateur de Crédit',
      description: 'Calcul des mensualités et coût total',
      icon: Calculator,
      category: 'Calculs',
      color: 'bg-blue-500',
      status: 'active'
    },
    {
      id: 'kyc',
      name: 'KYC Express',
      description: 'Vérification d\'identité automatisée',
      icon: UserCheck,
      category: 'Conformité',
      color: 'bg-green-500',
      status: 'active'
    },
    {
      id: 'scoring',
      name: 'Score de Crédit IA',
      description: 'Évaluation intelligente des risques',
      icon: Brain,
      category: 'IA',
      color: 'bg-purple-500',
      status: 'active'
    },
    {
      id: 'qr-payment',
      name: 'Paiement QR Code',
      description: 'Génération de codes de paiement',
      icon: QrCode,
      category: 'Paiements',
      color: 'bg-yellow-500',
      status: 'active'
    },
    {
      id: 'mobile-money',
      name: 'Mobile Money',
      description: 'Intégration Orange/Wave/Free Money',
      icon: Smartphone,
      category: 'Paiements',
      color: 'bg-orange-500',
      status: 'active'
    },
    {
      id: 'blockchain',
      name: 'TerangaChain Verify',
      description: 'Vérification blockchain des titres',
      icon: Shield,
      category: 'Blockchain',
      color: 'bg-indigo-500',
      status: 'active'
    },
    {
      id: 'risk-analysis',
      name: 'Analyse de Risque',
      description: 'Évaluation multicritères avancée',
      icon: Target,
      category: 'Analyse',
      color: 'bg-red-500',
      status: 'active'
    },
    {
      id: 'document-ai',
      name: 'Document AI',
      description: 'Extraction automatique de données',
      icon: FileCheck,
      category: 'IA',
      color: 'bg-teal-500',
      status: 'beta'
    },
    {
      id: 'fraud-detection',
      name: 'Détection de Fraude',
      description: 'Surveillance en temps réel',
      icon: Eye,
      category: 'Sécurité',
      color: 'bg-pink-500',
      status: 'active'
    },
    {
      id: 'api-banking',
      name: 'API Banking',
      description: 'Interface de programmation',
      icon: Database,
      category: 'Intégration',
      color: 'bg-gray-500',
      status: 'active'
    },
    {
      id: 'diaspora-tools',
      name: 'Outils Diaspora',
      description: 'Services spécialisés diaspora',
      icon: Globe,
      category: 'Services',
      color: 'bg-cyan-500',
      status: 'active'
    },
    {
      id: 'property-valuation',
      name: 'Évaluation Immobilière',
      description: 'Estimation automatique des biens',
      icon: Home,
      category: 'Évaluation',
      color: 'bg-emerald-500',
      status: 'active'
    }
  ];

  const handleGenerateQR = () => {
    const qrData = `TERANGA_PAY:${mobilePayment.amount}:${mobilePayment.phone}:${Date.now()}`;
    setQrCodeData(qrData);
    window.safeGlobalToast({
      title: "QR Code généré",
      description: "Code de paiement créé avec succès",
      variant: "success"
    });
  };

  const handleKYCStart = () => {
    setKycProgress(0);
    const interval = setInterval(() => {
      setKycProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          window.safeGlobalToast({
            title: "KYC terminé",
            description: "Vérification d'identité complétée",
            variant: "success"
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRiskAnalysis = () => {
    window.safeGlobalToast({
      title: "Analyse en cours",
      description: "Évaluation des risques en cours...",
      variant: "success"
    });
  };

  const getToolsByCategory = (category) => {
    return bankingTools.filter(tool => tool.category === category);
  };

  const categories = [...new Set(bankingTools.map(tool => tool.category))];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Outils Bancaires</h2>
          <p className="text-gray-600 mt-1">
            Suite complète d'outils pour les opérations bancaires et l'analyse de crédit
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            {bankingTools.filter(t => t.status === 'active').length} Outils actifs
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Zap className="h-3 w-3 mr-1" />
            {bankingTools.filter(t => t.status === 'beta').length} En bêta
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="calculator">Calculateur</TabsTrigger>
          <TabsTrigger value="kyc">KYC & Vérification</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="ai-tools">Outils IA</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="all-tools">Tous les outils</TabsTrigger>
        </TabsList>

        {/* Calculateur de crédit */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Simulateur de Crédit Terrain
                </CardTitle>
                <CardDescription>
                  Calculez les mensualités et le coût total de votre crédit immobilier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Type de bien</Label>
                    <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="terrain">Terrain nu</SelectItem>
                        <SelectItem value="terrain-viabilise">Terrain viabilisé</SelectItem>
                        <SelectItem value="maison">Maison individuelle</SelectItem>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="commercial">Local commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Montant du bien: {(loanAmount / 1000000).toFixed(1)}M FCFA</Label>
                    <Slider
                      value={[loanAmount]}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      max={500000000}
                      min={10000000}
                      step={5000000}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Apport personnel: {downPayment}%</Label>
                    <Slider
                      value={[downPayment]}
                      onValueChange={(value) => setDownPayment(value[0])}
                      max={50}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Durée: {loanTerm} ans</Label>
                    <Slider
                      value={[loanTerm]}
                      onValueChange={(value) => setLoanTerm(value[0])}
                      max={30}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Taux d'intérêt: {interestRate}%</Label>
                    <Slider
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      max={12}
                      min={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Résultat du Calcul
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Apport personnel</p>
                    <p className="text-xl font-bold text-blue-600">
                      {(loanCalculation.downPaymentAmount / 1000000).toFixed(1)}M FCFA
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Montant financé</p>
                    <p className="text-xl font-bold text-green-600">
                      {((loanAmount - loanCalculation.downPaymentAmount) / 1000000).toFixed(1)}M FCFA
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Mensualité</p>
                    <p className="text-xl font-bold text-purple-600">
                      {Math.round(loanCalculation.monthlyPayment / 1000)}K FCFA
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Coût total</p>
                    <p className="text-xl font-bold text-orange-600">
                      {(loanCalculation.totalPayment / 1000000).toFixed(1)}M FCFA
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total des intérêts:</span>
                    <span className="font-semibold">{(loanCalculation.totalInterest / 1000000).toFixed(1)}M FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux d'endettement recommandé:</span>
                    <span className="font-semibold">≤ 33%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenu minimum requis:</span>
                    <span className="font-semibold text-blue-600">
                      {Math.round(loanCalculation.monthlyPayment * 3 / 1000)}K FCFA/mois
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger simulation
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* KYC et Vérification */}
        <TabsContent value="kyc" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  KYC Express
                </CardTitle>
                <CardDescription>
                  Vérification d'identité automatisée avec IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progression KYC</span>
                      <span className="text-sm text-gray-500">{kycProgress}%</span>
                    </div>
                    <Progress value={kycProgress} className="w-full" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Pièce d'identité</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Validé</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Reconnaissance faciale</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Validé</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm">Vérification adresse</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span className="text-sm">Vérification revenus</span>
                      </div>
                      <Badge variant="outline">En attente</Badge>
                    </div>
                  </div>
                  
                  <Button onClick={handleKYCStart} className="w-full">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Démarrer nouvelle vérification
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Score de Crédit IA
                </CardTitle>
                <CardDescription>
                  Évaluation intelligente basée sur 50+ critères
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-blue-100">
                    <div className="text-3xl font-bold text-blue-600">{clientRiskScore}</div>
                    <div className="absolute -bottom-2 text-xs text-gray-500">Score IA</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Historique crédit</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-green-200 rounded-full">
                        <div className="w-14 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stabilité revenus</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-blue-200 rounded-full">
                        <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Bon</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Patrimoine</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-purple-200 rounded-full">
                        <div className="w-10 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Moyen</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Comportement</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-green-200 rounded-full">
                        <div className="w-15 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Recommandation</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Client éligible pour un crédit jusqu'à 200M FCFA avec taux préférentiel de 4.8%
                  </p>
                </div>
                
                <Button onClick={handleRiskAnalysis} variant="outline" className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Analyse détaillée
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Paiements */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Génération QR Code
                </CardTitle>
                <CardDescription>
                  Créez des codes QR pour les paiements rapides
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Montant (FCFA)</Label>
                    <Input
                      id="amount"
                      placeholder="100000"
                      value={mobilePayment.amount}
                      onChange={(e) => setMobilePayment(prev => ({...prev, amount: e.target.value}))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      placeholder="77 123 45 67"
                      value={mobilePayment.phone}
                      onChange={(e) => setMobilePayment(prev => ({...prev, phone: e.target.value}))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Service de paiement</Label>
                    <Select value={mobilePayment.service} onValueChange={(value) => setMobilePayment(prev => ({...prev, service: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orange-money">Orange Money</SelectItem>
                        <SelectItem value="wave">Wave</SelectItem>
                        <SelectItem value="free-money">Free Money</SelectItem>
                        <SelectItem value="wizall">Wizall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleGenerateQR} className="w-full">
                    <QrCode className="h-4 w-4 mr-2" />
                    Générer QR Code
                  </Button>
                </div>
                
                {qrCodeData && (
                  <div className="mt-6 p-4 border rounded-lg text-center">
                    <div className="w-32 h-32 mx-auto bg-black text-white flex items-center justify-center text-xs mb-2">
                      QR CODE
                    </div>
                    <p className="text-xs text-gray-500 break-all">{qrCodeData}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Mobile Money Integration
                </CardTitle>
                <CardDescription>
                  Intégration avec les services de paiement mobile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium">Orange Money</p>
                    <Badge className="bg-green-100 text-green-800 mt-1">Connecté</Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">Wave</p>
                    <Badge className="bg-green-100 text-green-800 mt-1">Connecté</Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-sm font-medium">Free Money</p>
                    <Badge className="bg-yellow-100 text-yellow-800 mt-1">Test</Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium">Wizall</p>
                    <Badge variant="outline">Bientôt</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Statistiques du jour</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Transactions</p>
                      <p className="font-semibold">127</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Volume</p>
                      <p className="font-semibold">45.2M FCFA</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Réussite</p>
                      <p className="font-semibold text-green-600">98.4%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Délai moyen</p>
                      <p className="font-semibold">2.3s</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Outils IA */}
        <TabsContent value="ai-tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankingTools.filter(tool => tool.category === 'IA').map((tool) => (
              <Card key={tool.id} className="relative h-64 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${tool.color} text-white`}>
                      <tool.icon className="h-5 w-5" />
                    </div>
                    <Badge variant={tool.status === 'active' ? 'default' : 'secondary'}>
                      {tool.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{tool.name}</CardTitle>
                  <CardDescription className="line-clamp-3">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <Button className="w-full">
                    Utiliser l'outil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Blockchain */}
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                TerangaChain Banking
              </CardTitle>
              <CardDescription>
                Vérification et sécurisation des transactions sur la blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg text-center">
                  <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">Titres sécurisés</p>
                  <p className="text-2xl font-bold text-green-600">1,247</p>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <Database className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-medium">Transactions</p>
                  <p className="text-2xl font-bold text-blue-600">8,934</p>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="font-medium">Uptime</p>
                  <p className="text-2xl font-bold text-purple-600">99.9%</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Actions disponibles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Vérifier un titre foncier
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Enregistrer transaction
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Audit trail complet
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export blockchain
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tous les outils */}
        <TabsContent value="all-tools" className="space-y-6">
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getToolsByCategory(category).map((tool) => (
                    <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 flex flex-col h-60">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg ${tool.color} text-white flex-shrink-0`}>
                            <tool.icon className="h-6 w-6" />
                          </div>
                          <Badge variant={tool.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {tool.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3rem] text-lg">{tool.name}</h4>
                        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{tool.description}</p>
                        <Button size="sm" className="w-full mt-auto">
                          Utiliser l'outil
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueTools;