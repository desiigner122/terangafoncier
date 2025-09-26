import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3,
  PieChart,
  Calendar,
  Building,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Save,
  History,
  Settings,
  Lightbulb,
  Zap
} from 'lucide-react';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurCalculateurs = () => {
  const [activeTab, setActiveTab] = useState('roi');
  const [calculations, setCalculations] = useState([]);

  // État pour le calculateur ROI
  const [roiInputs, setRoiInputs] = useState({
    purchasePrice: 150000000,
    renovationCost: 15000000,
    monthlyRent: 800000,
    annualExpenses: 2400000,
    holdingPeriod: 5,
    exitValue: 200000000,
    financingAmount: 100000000,
    interestRate: 8.5
  });

  // État pour le calculateur de rentabilité
  const [rentabilityInputs, setRentabilityInputs] = useState({
    investment: 100000000,
    monthlyIncome: 650000,
    monthlyExpenses: 150000,
    taxRate: 15,
    duration: 10
  });

  // État pour le calculateur de financement
  const [financingInputs, setFinancingInputs] = useState({
    loanAmount: 80000000,
    interestRate: 8.0,
    loanTerm: 15,
    downPayment: 20000000
  });

  // Calculer ROI
  const calculateROI = () => {
    const totalInvestment = roiInputs.purchasePrice + roiInputs.renovationCost - roiInputs.financingAmount;
    const annualRent = roiInputs.monthlyRent * 12;
    const netAnnualIncome = annualRent - roiInputs.annualExpenses;
    const totalCashFlow = netAnnualIncome * roiInputs.holdingPeriod;
    const capitalGain = roiInputs.exitValue - roiInputs.purchasePrice - roiInputs.renovationCost;
    const totalReturn = totalCashFlow + capitalGain;
    const roi = ((totalReturn / totalInvestment) * 100);
    const annualROI = roi / roiInputs.holdingPeriod;
    
    return {
      totalInvestment,
      annualRent,
      netAnnualIncome,
      totalCashFlow,
      capitalGain,
      totalReturn,
      roi,
      annualROI,
      grossYield: (annualRent / roiInputs.purchasePrice) * 100,
      netYield: (netAnnualIncome / roiInputs.purchasePrice) * 100
    };
  };

  // Calculer rentabilité
  const calculateRentability = () => {
    const annualIncome = rentabilityInputs.monthlyIncome * 12;
    const annualExpenses = rentabilityInputs.monthlyExpenses * 12;
    const grossProfit = annualIncome - annualExpenses;
    const tax = grossProfit * (rentabilityInputs.taxRate / 100);
    const netProfit = grossProfit - tax;
    const totalNetProfit = netProfit * rentabilityInputs.duration;
    const totalValue = rentabilityInputs.investment + totalNetProfit;
    const rentabilityRate = (netProfit / rentabilityInputs.investment) * 100;
    
    return {
      annualIncome,
      annualExpenses,
      grossProfit,
      tax,
      netProfit,
      totalNetProfit,
      totalValue,
      rentabilityRate,
      paybackPeriod: rentabilityInputs.investment / netProfit
    };
  };

  // Calculer financement
  const calculateFinancing = () => {
    const monthlyRate = financingInputs.interestRate / 100 / 12;
    const numPayments = financingInputs.loanTerm * 12;
    const monthlyPayment = (financingInputs.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayments = monthlyPayment * numPayments;
    const totalInterest = totalPayments - financingInputs.loanAmount;
    const totalCost = financingInputs.downPayment + totalPayments;
    
    return {
      monthlyPayment,
      totalPayments,
      totalInterest,
      totalCost,
      loanToValue: (financingInputs.loanAmount / (financingInputs.loanAmount + financingInputs.downPayment)) * 100
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const roiResults = calculateROI();
  const rentabilityResults = calculateRentability();
  const financingResults = calculateFinancing();

  // Historique des calculs récents
  const recentCalculations = [
    {
      id: 1,
      type: 'ROI',
      title: 'Villa VDN',
      result: '18.5%',
      date: '2024-12-15',
      investment: 150000000
    },
    {
      id: 2,
      type: 'Rentabilité',
      title: 'Appartement Liberté 6',
      result: '12.3%',
      date: '2024-12-14',
      investment: 85000000
    },
    {
      id: 3,
      type: 'Financement',
      title: 'Complexe Commercial',
      result: '680K XOF/mois',
      date: '2024-12-13',
      investment: 120000000
    }
  ];

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calculateurs d'Investissement</h1>
            <p className="text-gray-600">Outils d'analyse financière pour vos investissements</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              <Zap className="w-3 h-3 mr-1" />
              Calculs en temps réel
            </Badge>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Calculs Effectués</p>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">19.2%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projets Analysés</p>
                  <p className="text-2xl font-bold text-gray-900">43</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sauvegardés</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Save className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calculateurs */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Calculateurs Financiers</CardTitle>
                <CardDescription>
                  Analysez la rentabilité de vos investissements immobiliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="roi" className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      ROI
                    </TabsTrigger>
                    <TabsTrigger value="rentability" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Rentabilité
                    </TabsTrigger>
                    <TabsTrigger value="financing" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Financement
                    </TabsTrigger>
                  </TabsList>

                  {/* Calculateur ROI */}
                  <TabsContent value="roi" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Paramètres d'Investissement</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="purchasePrice">Prix d'achat</Label>
                            <Input
                              id="purchasePrice"
                              type="number"
                              value={roiInputs.purchasePrice}
                              onChange={(e) => setRoiInputs({...roiInputs, purchasePrice: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="renovationCost">Coûts de rénovation</Label>
                            <Input
                              id="renovationCost"
                              type="number"
                              value={roiInputs.renovationCost}
                              onChange={(e) => setRoiInputs({...roiInputs, renovationCost: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="monthlyRent">Loyer mensuel</Label>
                            <Input
                              id="monthlyRent"
                              type="number"
                              value={roiInputs.monthlyRent}
                              onChange={(e) => setRoiInputs({...roiInputs, monthlyRent: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="annualExpenses">Charges annuelles</Label>
                            <Input
                              id="annualExpenses"
                              type="number"
                              value={roiInputs.annualExpenses}
                              onChange={(e) => setRoiInputs({...roiInputs, annualExpenses: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="holdingPeriod">Durée de détention (années)</Label>
                            <Input
                              id="holdingPeriod"
                              type="number"
                              value={roiInputs.holdingPeriod}
                              onChange={(e) => setRoiInputs({...roiInputs, holdingPeriod: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="exitValue">Valeur de sortie</Label>
                            <Input
                              id="exitValue"
                              type="number"
                              value={roiInputs.exitValue}
                              onChange={(e) => setRoiInputs({...roiInputs, exitValue: Number(e.target.value)})}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Résultats de l'Analyse</h3>
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Investissement total:</span>
                            <span className="font-semibold">{formatCurrency(roiResults.totalInvestment)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Revenus annuels:</span>
                            <span className="font-semibold">{formatCurrency(roiResults.annualRent)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Revenus nets annuels:</span>
                            <span className="font-semibold text-green-600">{formatCurrency(roiResults.netAnnualIncome)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cash-flow total:</span>
                            <span className="font-semibold">{formatCurrency(roiResults.totalCashFlow)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Plus-value:</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(roiResults.capitalGain)}</span>
                          </div>
                          
                          <hr className="border-gray-300" />
                          
                          <div className="flex justify-between text-lg">
                            <span className="font-semibold">ROI Total:</span>
                            <span className="font-bold text-green-600">{roiResults.roi.toFixed(1)}%</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-semibold">ROI Annuel:</span>
                            <span className="font-bold text-purple-600">{roiResults.annualROI.toFixed(1)}%</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{roiResults.grossYield.toFixed(1)}%</div>
                              <div className="text-xs text-gray-500">Rendement brut</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{roiResults.netYield.toFixed(1)}%</div>
                              <div className="text-xs text-gray-500">Rendement net</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button className="flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Exporter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Calculateur Rentabilité */}
                  <TabsContent value="rentability" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Analyse de Rentabilité</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="investment">Investissement initial</Label>
                            <Input
                              id="investment"
                              type="number"
                              value={rentabilityInputs.investment}
                              onChange={(e) => setRentabilityInputs({...rentabilityInputs, investment: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="monthlyIncome">Revenus mensuels</Label>
                            <Input
                              id="monthlyIncome"
                              type="number"
                              value={rentabilityInputs.monthlyIncome}
                              onChange={(e) => setRentabilityInputs({...rentabilityInputs, monthlyIncome: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="monthlyExpenses">Charges mensuelles</Label>
                            <Input
                              id="monthlyExpenses"
                              type="number"
                              value={rentabilityInputs.monthlyExpenses}
                              onChange={(e) => setRentabilityInputs({...rentabilityInputs, monthlyExpenses: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="taxRate">Taux d'imposition (%)</Label>
                            <Input
                              id="taxRate"
                              type="number"
                              value={rentabilityInputs.taxRate}
                              onChange={(e) => setRentabilityInputs({...rentabilityInputs, taxRate: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="duration">Durée (années)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={rentabilityInputs.duration}
                              onChange={(e) => setRentabilityInputs({...rentabilityInputs, duration: Number(e.target.value)})}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Résultats</h3>
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Revenus annuels:</span>
                            <span className="font-semibold">{formatCurrency(rentabilityResults.annualIncome)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Charges annuelles:</span>
                            <span className="font-semibold text-red-600">{formatCurrency(rentabilityResults.annualExpenses)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bénéfice brut:</span>
                            <span className="font-semibold">{formatCurrency(rentabilityResults.grossProfit)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Impôts:</span>
                            <span className="font-semibold text-orange-600">{formatCurrency(rentabilityResults.tax)}</span>
                          </div>
                          
                          <hr className="border-gray-300" />
                          
                          <div className="flex justify-between text-lg">
                            <span className="font-semibold">Bénéfice net annuel:</span>
                            <span className="font-bold text-green-600">{formatCurrency(rentabilityResults.netProfit)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-semibold">Taux de rentabilité:</span>
                            <span className="font-bold text-purple-600">{rentabilityResults.rentabilityRate.toFixed(1)}%</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-semibold">Retour sur investissement:</span>
                            <span className="font-bold text-blue-600">{rentabilityResults.paybackPeriod.toFixed(1)} ans</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Calculateur Financement */}
                  <TabsContent value="financing" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Simulation de Financement</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="loanAmount">Montant du prêt</Label>
                            <Input
                              id="loanAmount"
                              type="number"
                              value={financingInputs.loanAmount}
                              onChange={(e) => setFinancingInputs({...financingInputs, loanAmount: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="interestRate">Taux d'intérêt (%)</Label>
                            <Input
                              id="interestRate"
                              type="number"
                              value={financingInputs.interestRate}
                              onChange={(e) => setFinancingInputs({...financingInputs, interestRate: Number(e.target.value)})}
                              step="0.1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="loanTerm">Durée (années)</Label>
                            <Input
                              id="loanTerm"
                              type="number"
                              value={financingInputs.loanTerm}
                              onChange={(e) => setFinancingInputs({...financingInputs, loanTerm: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="downPayment">Apport personnel</Label>
                            <Input
                              id="downPayment"
                              type="number"
                              value={financingInputs.downPayment}
                              onChange={(e) => setFinancingInputs({...financingInputs, downPayment: Number(e.target.value)})}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Résultats du Financement</h3>
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between text-lg">
                            <span className="font-semibold">Mensualité:</span>
                            <span className="font-bold text-blue-600">{formatCurrency(financingResults.monthlyPayment)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total des paiements:</span>
                            <span className="font-semibold">{formatCurrency(financingResults.totalPayments)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total des intérêts:</span>
                            <span className="font-semibold text-orange-600">{formatCurrency(financingResults.totalInterest)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Coût total:</span>
                            <span className="font-semibold">{formatCurrency(financingResults.totalCost)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ratio d'endettement:</span>
                            <span className="font-semibold text-purple-600">{financingResults.loanToValue.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Calculs récents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="w-4 h-4 mr-2" />
                  Calculs Récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCalculations.map((calc) => (
                    <div key={calc.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {calc.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(calc.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{calc.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {formatCurrency(calc.investment)}
                        </span>
                        <span className="font-semibold text-green-600 text-sm">
                          {calc.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conseils */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Conseils
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">
                      Un ROI supérieur à 15% est considéré comme excellent sur le marché sénégalais.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">
                      N'oubliez pas d'inclure tous les coûts cachés (notaire, taxes, rénovations).
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">
                      Diversifiez vos investissements pour réduire les risques.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestisseurCalculateurs;