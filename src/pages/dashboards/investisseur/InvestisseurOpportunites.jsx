import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Users,
  Target,
  Eye,
  Heart,
  Star,
  ArrowUpRight,
  Bookmark,
  Share,
  AlertTriangle,
  CheckCircle,
  Clock,
  Home,
  Building2,
  Warehouse
} from 'lucide-react';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurOpportunites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [sortBy, setSortBy] = useState('roi');

  // Opportunités d'investissement
  const opportunities = [
    {
      id: 1,
      title: 'Villa Moderne VDN - Opportunité Exclusive',
      type: 'Résidentiel',
      location: 'VDN, Dakar',
      price: 280000000,
      minInvestment: 140000000,
      expectedRoi: 18.5,
      duration: '24 mois',
      riskLevel: 'Modéré',
      status: 'Nouveau',
      description: 'Villa moderne 4 chambres avec piscine, finitions haut de gamme',
      area: '350m²',
      landSize: '500m²',
      completionRate: 75,
      investors: 8,
      maxInvestors: 12,
      promoter: 'Fall Promotion SARL',
      images: 4,
      rating: 4.8,
      features: ['Piscine', 'Garage 2 places', 'Jardin', 'Sécurité 24h'],
      deadline: '2025-01-15',
      fundingGoal: 280000000,
      currentFunding: 210000000
    },
    {
      id: 2,
      title: 'Complexe Commercial Liberté 6',
      type: 'Commercial',
      location: 'Liberté 6, Dakar',
      price: 450000000,
      minInvestment: 50000000,
      expectedRoi: 22.3,
      duration: '36 mois',
      riskLevel: 'Faible',
      status: 'Tendance',
      description: 'Centre commercial avec 15 boutiques et parking',
      area: '1200m²',
      landSize: '800m²',
      completionRate: 30,
      investors: 24,
      maxInvestors: 30,
      promoter: 'Teranga Invest',
      images: 8,
      rating: 4.9,
      features: ['Parking', '15 boutiques', 'Ascenseur', 'Climatisation'],
      deadline: '2025-02-28',
      fundingGoal: 450000000,
      currentFunding: 320000000
    },
    {
      id: 3,
      title: 'Entrepôt Logistique Rufisque',
      type: 'Industriel',
      location: 'Rufisque',
      price: 320000000,
      minInvestment: 80000000,
      expectedRoi: 19.8,
      duration: '30 mois',
      riskLevel: 'Élevé',
      status: 'En cours',
      description: 'Entrepôt moderne avec quais de chargement',
      area: '2000m²',
      landSize: '3000m²',
      completionRate: 15,
      investors: 6,
      maxInvestors: 10,
      promoter: 'Logistics Pro',
      images: 6,
      rating: 4.6,
      features: ['Quais chargement', 'Bureau', 'Sécurité', 'Accès camions'],
      deadline: '2025-01-30',
      fundingGoal: 320000000,
      currentFunding: 128000000
    },
    {
      id: 4,
      title: 'Résidence Standing Almadies',
      type: 'Résidentiel',
      location: 'Almadies, Dakar',
      price: 680000000,
      minInvestment: 170000000,
      expectedRoi: 16.2,
      duration: '42 mois',
      riskLevel: 'Faible',
      status: 'Premium',
      description: 'Résidence de 8 villas avec vue mer',
      area: '2800m²',
      landSize: '4000m²',
      completionRate: 60,
      investors: 18,
      maxInvestors: 20,
      promoter: 'Almadies Development',
      images: 12,
      rating: 4.9,
      features: ['Vue mer', '8 villas', 'Piscine commune', 'Gardiennage'],
      deadline: '2025-03-15',
      fundingGoal: 680000000,
      currentFunding: 544000000
    }
  ];

  // Statistiques des opportunités
  const opportunityStats = {
    totalOpportunities: 47,
    newThisWeek: 8,
    averageRoi: 19.2,
    totalValue: 2100000000,
    bookmarked: 12,
    applied: 6
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Résidentiel': return 'bg-blue-100 text-blue-800';
      case 'Commercial': return 'bg-green-100 text-green-800';
      case 'Industriel': return 'bg-orange-100 text-orange-800';
      case 'Foncier': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Faible': return 'bg-green-100 text-green-800';
      case 'Modéré': return 'bg-yellow-100 text-yellow-800';
      case 'Élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Nouveau': return 'bg-blue-100 text-blue-800';
      case 'Tendance': return 'bg-green-100 text-green-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'En cours': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Résidentiel': return <Home className="w-4 h-4" />;
      case 'Commercial': return <Building2 className="w-4 h-4" />;
      case 'Industriel': return <Warehouse className="w-4 h-4" />;
      case 'Foncier': return <MapPin className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.promoter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || opp.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return b.expectedRoi - a.expectedRoi;
      case 'price':
        return a.price - b.price;
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Opportunités d'Investissement</h1>
            <p className="text-gray-600">Découvrez les meilleures opportunités du marché</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              {opportunityStats.newThisWeek} nouvelles cette semaine
            </Badge>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Opportunités</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.totalOpportunities}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.averageRoi}%</p>
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
                  <p className="text-sm font-medium text-gray-600">Favoris</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.bookmarked}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Candidatures</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.applied}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Liste des opportunités */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Opportunités Disponibles</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher une opportunité..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="roi">Trier par ROI</option>
                      <option value="price">Trier par Prix</option>
                      <option value="deadline">Trier par Échéance</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant={selectedType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('all')}
                  >
                    Tous
                  </Button>
                  <Button
                    variant={selectedType === 'résidentiel' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('résidentiel')}
                  >
                    Résidentiel
                  </Button>
                  <Button
                    variant={selectedType === 'commercial' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('commercial')}
                  >
                    Commercial
                  </Button>
                  <Button
                    variant={selectedType === 'industriel' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('industriel')}
                  >
                    Industriel
                  </Button>
                </div>

                {/* Opportunités */}
                <div className="space-y-6">
                  {sortedOpportunities.map((opportunity) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(opportunity.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {opportunity.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {opportunity.location}
                              </div>
                              <div className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {opportunity.promoter}
                              </div>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                {opportunity.rating}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                            
                            {/* Badges */}
                            <div className="flex items-center space-x-2">
                              <Badge className={getTypeColor(opportunity.type)}>
                                {opportunity.type}
                              </Badge>
                              <Badge className={getRiskColor(opportunity.riskLevel)}>
                                Risque {opportunity.riskLevel}
                              </Badge>
                              <Badge className={getStatusColor(opportunity.status)}>
                                {opportunity.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {opportunity.expectedRoi}%
                          </div>
                          <div className="text-sm text-gray-500">ROI attendu</div>
                          <div className="text-sm text-gray-500 mt-2">
                            Échéance: {formatDate(opportunity.deadline)}
                          </div>
                        </div>
                      </div>

                      {/* Métriques */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Prix total</p>
                          <p className="font-semibold">{formatCurrency(opportunity.price)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Investissement min.</p>
                          <p className="font-semibold text-blue-600">{formatCurrency(opportunity.minInvestment)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Durée</p>
                          <p className="font-semibold">{opportunity.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Investisseurs</p>
                          <p className="font-semibold">{opportunity.investors}/{opportunity.maxInvestors}</p>
                        </div>
                      </div>

                      {/* Progression du financement */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Financement</span>
                          <span className="font-medium">
                            {Math.round((opportunity.currentFunding / opportunity.fundingGoal) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(opportunity.currentFunding / opportunity.fundingGoal) * 100} 
                          className="h-2 mb-2" 
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{formatCurrency(opportunity.currentFunding)} levés</span>
                          <span>Objectif: {formatCurrency(opportunity.fundingGoal)}</span>
                        </div>
                      </div>

                      {/* Caractéristiques */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Caractéristiques:</p>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>{opportunity.area} • {opportunity.landSize} terrain</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Heart className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            Investir
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Filtres avancés */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres Avancés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Budget</label>
                    <select className="w-full px-3 py-2 border rounded-md text-sm">
                      <option>Tous budgets</option>
                      <option>Moins de 100M XOF</option>
                      <option>100M - 300M XOF</option>
                      <option>Plus de 300M XOF</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">ROI minimum</label>
                    <select className="w-full px-3 py-2 border rounded-md text-sm">
                      <option>Tous ROI</option>
                      <option>Plus de 15%</option>
                      <option>Plus de 20%</option>
                      <option>Plus de 25%</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Durée</label>
                    <select className="w-full px-3 py-2 border rounded-md text-sm">
                      <option>Toutes durées</option>
                      <option>Moins de 24 mois</option>
                      <option>24 - 36 mois</option>
                      <option>Plus de 36 mois</option>
                    </select>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <Filter className="w-4 h-4 mr-2" />
                  Appliquer filtres
                </Button>
              </CardContent>
            </Card>

            {/* Mes favoris */}
            <Card>
              <CardHeader>
                <CardTitle>Mes Favoris</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-4">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Aucun favori pour l'instant</p>
                  <p className="text-xs mt-1">Sauvegardez vos opportunités préférées</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestisseurOpportunites;