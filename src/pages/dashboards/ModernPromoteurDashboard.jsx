import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ShoppingCart, 
  Euro, 
  Settings,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Home,
  Truck,
  Star,
  Phone,
  Mail,
  Eye,
  Download,
  Upload,
  Target,
  Award,
  PlusCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router-dom';

const ModernPromoteurDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('projects');
  const navigate = useNavigate();

  // Stats du header pour Promoteur
  const stats = [
    { 
      label: 'Projets Actifs', 
      value: '8', 
      icon: Building2, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Ventes ce Mois', 
      value: '23', 
      icon: ShoppingCart, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'CA Mensuel', 
      value: '4.2M FCFA', 
      icon: Euro, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'ROI Moyen', 
      value: '18.5%', 
      icon: TrendingUp, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const DashboardHeader = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const ProjectsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Projets en cours */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Projets en Développement
            </CardTitle>
            <button 
              onClick={() => navigate('/developer/new-project')}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Nouveau
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                name: 'Résidence TERANGA Gardens',
                location: 'Almadies, Dakar',
                units: 45,
                sold: 32,
                progress: 75,
                phase: 'Construction',
                completion: 'Mars 2024',
                investment: '2.8M FCFA'
              },
              { 
                name: 'Complexe SAHEL Business',
                location: 'Diamniadio',
                units: 28,
                sold: 15,
                progress: 45,
                phase: 'Commercialisation',
                completion: 'Juin 2024',
                investment: '1.9M FCFA'
              },
              { 
                name: 'Villas PLATEAU Premium',
                location: 'Plateau, Dakar',
                units: 12,
                sold: 8,
                progress: 90,
                phase: 'Finitions',
                completion: 'Février 2024',
                investment: '3.2M FCFA'
              }
            ].map((project, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </p>
                  </div>
                  <Badge variant="outline">{project.phase}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-gray-600">Unités vendues:</p>
                    <p className="font-medium">{project.sold}/{project.units}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Livraison:</p>
                    <p className="font-medium">{project.completion}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avancement</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    Investissement: <span className="font-semibold text-gray-900">{project.investment}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance des projets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Performance des Projets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-sm text-gray-600">Taux de vente moyen</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">4.2</div>
                <p className="text-sm text-gray-600">Mois de commercialisation</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-medium">Projets les plus performants:</h5>
              {[
                { name: 'Villas PLATEAU Premium', roi: '24.5%', satisfaction: 95 },
                { name: 'Résidence TERANGA Gardens', roi: '19.2%', satisfaction: 92 },
                { name: 'Complexe SAHEL Business', roi: '16.8%', satisfaction: 88 }
              ].map((perf, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{perf.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>ROI: {perf.roi}</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {perf.satisfaction}%
                      </span>
                    </div>
                  </div>
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Types de biens */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-purple-600" />
            Portfolio par Type de Bien
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { 
                type: 'Appartements', 
                count: 156, 
                avgPrice: '18M FCFA', 
                demand: 'Très forte',
                icon: Building2,
                color: 'text-blue-600 bg-blue-50'
              },
              { 
                type: 'Villas', 
                count: 45, 
                avgPrice: '45M FCFA', 
                demand: 'Forte',
                icon: Home,
                color: 'text-green-600 bg-green-50'
              },
              { 
                type: 'Bureaux', 
                count: 28, 
                avgPrice: '25M FCFA', 
                demand: 'Modérée',
                icon: Building2,
                color: 'text-purple-600 bg-purple-50'
              },
              { 
                type: 'Commerces', 
                count: 18, 
                avgPrice: '12M FCFA', 
                demand: 'Croissante',
                icon: ShoppingCart,
                color: 'text-orange-600 bg-orange-50'
              }
            ].map((bien, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className={`w-12 h-12 rounded-lg ${bien.color} flex items-center justify-center mb-3`}>
                  <bien.icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-1">{bien.type}</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">{bien.count} unités</p>
                  <p className="font-medium">{bien.avgPrice}</p>
                  <p className="text-xs text-gray-500">Demande: {bien.demand}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SalesTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ventes récentes */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Ventes Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                client: 'Amadou DIALLO',
                property: 'App. T3 - TERANGA Gardens #24',
                price: '22M FCFA',
                date: '20/01/2024',
                commission: '1.1M FCFA',
                status: 'Signé',
                agent: 'Fatou SECK'
              },
              {
                client: 'Société DIGITAL Corp',
                property: 'Bureau 180m² - SAHEL Business',
                price: '28M FCFA',
                date: '18/01/2024',
                commission: '1.4M FCFA',
                status: 'Compromis',
                agent: 'Ibrahim FALL'
              },
              {
                client: 'Mariama NDIAYE',
                property: 'Villa 4ch - PLATEAU Premium',
                price: '45M FCFA',
                date: '15/01/2024',
                commission: '2.25M FCFA',
                status: 'Finalisé',
                agent: 'Moussa DIOP'
              }
            ].map((sale, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{sale.client}</h4>
                    <p className="text-sm text-gray-600">{sale.property}</p>
                    <p className="text-xs text-gray-500">Agent: {sale.agent}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={sale.status === 'Finalisé' ? 'default' : 'outline'}>
                      {sale.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">{sale.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Prix de vente</p>
                    <p className="font-semibold">{sale.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Commission</p>
                    <p className="font-semibold text-green-600">{sale.commission}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Objectifs de vente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Objectifs Mensuels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">23/30</div>
              <p className="text-sm text-gray-600 mb-4">Ventes réalisées</p>
              <Progress value={77} className="h-3" />
              <p className="text-xs text-gray-500 mt-2">77% de l'objectif atteint</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">CA Objectif</span>
                <span className="font-semibold">5.2M / 6.5M FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Nouveaux clients</span>
                <span className="font-semibold">18 / 25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Taux conversion</span>
                <span className="font-semibold">68% / 70%</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                7 ventes nécessaires pour atteindre l'objectif
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline commercial */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Pipeline Commercial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">45</div>
              <p className="text-sm text-gray-600">Prospects</p>
              <p className="text-xs text-gray-500 mt-1">Potentiel: 15.2M FCFA</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2">23</div>
              <p className="text-sm text-gray-600">Visites planifiées</p>
              <p className="text-xs text-gray-500 mt-1">Cette semaine</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">12</div>
              <p className="text-sm text-gray-600">Négociations</p>
              <p className="text-xs text-gray-500 mt-1">En cours</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">8</div>
              <p className="text-sm text-gray-600">Promesses</p>
              <p className="text-xs text-gray-500 mt-1">À signer</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h5 className="font-medium mb-3">Affaires prioritaires cette semaine:</h5>
            <div className="space-y-2">
              {[
                { client: 'SARL TECH Innovation', property: 'Bureaux 250m²', value: '32M FCFA', priority: 'Haute' },
                { client: 'Famille WADE', property: 'Villa 5ch', value: '48M FCFA', priority: 'Moyenne' },
                { client: 'Moussa SARR', property: 'App. T4', value: '25M FCFA', priority: 'Haute' }
              ].map((deal, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{deal.client}</p>
                    <p className="text-xs text-gray-600">{deal.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{deal.value}</p>
                    <Badge 
                      variant={deal.priority === 'Haute' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {deal.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FinancesTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenus et rentabilité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5 text-green-600" />
            Revenus et Rentabilité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4.2M</div>
                <p className="text-sm text-gray-600">CA ce mois</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">48.5M</div>
                <p className="text-sm text-gray-600">CA annuel</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-medium">Répartition des revenus:</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ventes directes</span>
                  <div className="flex items-center gap-2">
                    <Progress value={75} className="w-20" />
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Commissions agents</span>
                  <div className="flex items-center gap-2">
                    <Progress value={15} className="w-20" />
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Partenariats</span>
                  <div className="flex items-center gap-2">
                    <Progress value={10} className="w-20" />
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">ROI Moyen</span>
                <span className="text-xl font-bold text-purple-600">18.5%</span>
              </div>
              <p className="text-sm text-gray-600">
                Meilleure performance: Villas PLATEAU Premium (24.5%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coûts et investissements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            Coûts et Investissements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">8.2M</div>
                <p className="text-sm text-gray-600">Coûts ce mois</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">24.8M</div>
                <p className="text-sm text-gray-600">Investissement total</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-medium">Répartition des coûts:</h5>
              {[
                { category: 'Construction', amount: '15.2M FCFA', percent: 61 },
                { category: 'Terrain', amount: '6.5M FCFA', percent: 26 },
                { category: 'Marketing', amount: '1.8M FCFA', percent: 7 },
                { category: 'Administration', amount: '1.3M FCFA', percent: 6 }
              ].map((cost, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{cost.category}</p>
                    <p className="text-xs text-gray-600">{cost.amount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={cost.percent} className="w-16" />
                    <span className="text-sm">{cost.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financement des projets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Financement des Projets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                project: 'Résidence TERANGA Gardens',
                totalBudget: '2.8M FCFA',
                own: '60%',
                bank: '30%',
                partners: '10%',
                status: 'Bouclé'
              },
              {
                project: 'Complexe SAHEL Business',
                totalBudget: '1.9M FCFA',
                own: '45%',
                bank: '40%',
                partners: '15%',
                status: 'En cours'
              },
              {
                project: 'Nouveau Projet Guédiawaye',
                totalBudget: '3.5M FCFA',
                own: '35%',
                bank: '50%',
                partners: '15%',
                status: 'Recherche'
              }
            ].map((financing, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-medium">{financing.project}</h5>
                    <p className="text-sm text-gray-600">Budget: {financing.totalBudget}</p>
                  </div>
                  <Badge variant={financing.status === 'Bouclé' ? 'default' : 'outline'}>
                    {financing.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fonds propres:</span>
                    <span className="font-medium">{financing.own}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financement bancaire:</span>
                    <span className="font-medium">{financing.bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partenaires:</span>
                    <span className="font-medium">{financing.partners}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prévisions financières */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Prévisions Financières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">62M FCFA</div>
              <p className="text-sm text-gray-600">CA prévisionnels 2024</p>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-medium">Projections trimestrielles:</h5>
              {[
                { quarter: 'Q1 2024', revenue: '12.5M FCFA', confidence: 92 },
                { quarter: 'Q2 2024', revenue: '18.2M FCFA', confidence: 85 },
                { quarter: 'Q3 2024', revenue: '16.8M FCFA', confidence: 78 },
                { quarter: 'Q4 2024', revenue: '14.5M FCFA', confidence: 65 }
              ].map((forecast, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{forecast.quarter}</p>
                    <p className="text-xs text-gray-600">Confiance: {forecast.confidence}%</p>
                  </div>
                  <p className="font-semibold">{forecast.revenue}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600 mb-2">Facteurs de risque:</p>
              <div className="space-y-1 text-xs">
                <p className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Retards de construction possibles
                </p>
                <p className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Évolution taux d'intérêt
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SettingsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profil société */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Profil Société
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de la société</label>
              <input 
                type="text" 
                defaultValue="TERANGA Développement SARL"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">NINEA</label>
              <input 
                type="text" 
                defaultValue="00512345678"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input 
                  type="tel" 
                  defaultValue="+221 77 123 45 67"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue="contact@teranga-dev.sn"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Adresse siège social</label>
              <textarea 
                defaultValue="Immeuble FAHD, 3ème étage&#10;Avenue Cheikh Anta Diop&#10;Dakar, Sénégal"
                className="w-full p-2 border rounded-lg"
                rows="3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres commerciaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Paramètres Commerciaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Objectif mensuel (unités)</label>
              <input 
                type="number" 
                defaultValue="30"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Objectif CA mensuel (FCFA)</label>
              <input 
                type="number" 
                defaultValue="6500000"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Commission agents (%)</label>
              <input 
                type="number" 
                step="0.1"
                defaultValue="5.0"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Marge minimum (%)</label>
              <input 
                type="number" 
                step="0.1"
                defaultValue="15.0"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Délai de livraison standard (mois)</label>
              <input 
                type="number" 
                defaultValue="18"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestion équipe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Gestion Équipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">12</div>
                <p className="text-sm text-gray-600">Agents commerciaux</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <p className="text-sm text-gray-600">Personnel technique</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-medium">Top performers ce mois:</h5>
              {[
                { name: 'Fatou SECK', sales: 8, commission: '2.1M FCFA' },
                { name: 'Ibrahim FALL', sales: 6, commission: '1.8M FCFA' },
                { name: 'Moussa DIOP', sales: 5, commission: '1.5M FCFA' }
              ].map((performer, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{performer.name}</p>
                    <p className="text-xs text-gray-600">{performer.sales} ventes</p>
                  </div>
                  <p className="font-semibold text-green-600">{performer.commission}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications et rapports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            Notifications et Rapports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Rapport mensuel automatique</h4>
                <p className="text-sm text-gray-600">Envoi le 1er de chaque mois</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Alerte objectifs</h4>
                <p className="text-sm text-gray-600">Si inférieur à 80% à J-7 de fin de mois</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Suivi prospects</h4>
                <p className="text-sm text-gray-600">Relance automatique J+3</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Analyse concurrence</h4>
                <p className="text-sm text-gray-600">Rapport hebdomadaire</p>
              </div>
              <input type="checkbox" />
            </div>
            
            <div className="pt-3 border-t">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Générer Rapport Personnalisé
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Promoteur</h1>
          <p className="text-gray-600 mb-6">Gestion des projets immobiliers, ventes et finances</p>
          
          <DashboardHeader />
        </div>

        {/* Tabs navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger 
              value="projects" 
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Projets
            </TabsTrigger>
            <TabsTrigger 
              value="sales" 
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Ventes
            </TabsTrigger>
            <TabsTrigger 
              value="finances" 
              className="flex items-center gap-2"
            >
              <Euro className="h-4 w-4" />
              Finances
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsTab />
          </TabsContent>

          <TabsContent value="sales">
            <SalesTab />
          </TabsContent>

          <TabsContent value="finances">
            <FinancesTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default ModernPromoteurDashboard;
