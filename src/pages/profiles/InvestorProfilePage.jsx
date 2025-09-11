import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Building2,
  TrendingUp,
  DollarSign,
  CheckCircle,
  PieChart,
  BarChart3,
  Award,
  Users,
  Calendar,
  Briefcase,
  Target,
  LineChart,
  Calculator,
  MessageSquare,
  Share2,
  Heart,
  Wallet,
  Shield,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const InvestorProfilePage = () => {
  const { investorId } = useParams();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvestorProfile();
  }, [investorId]);

  const loadInvestorProfile = async () => {
    const mockInvestor = {
      id: investorId,
      name: 'Moussa KONE',
      title: 'Investisseur Immobilier',
      company: 'KONE Investment Group',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=300&fit=crop',
      location: 'Plateau, Dakar',
      investingSince: 2015,
      isVerified: true,
      rating: 4.9,
      reviewCount: 89,
      description: 'Investisseur expérimenté spécialisé dans l\'immobilier résidentiel et commercial au Sénégal. Portfolio diversifié avec focus sur les zones à fort potentiel.',
      phone: '+221 77 888 99 00',
      email: 'contact@kone-investment.sn',
      website: 'www.kone-investment.sn',
      license: 'INV-2024-156',
      stats: {
        totalInvested: '2.5 Milliards FCFA',
        properties: '45 propriétés',
        averageROI: '12.5%',
        yearsExperience: 10,
        activeProjects: 8,
        completedDeals: 127,
        portfolioValue: '3.2 Milliards FCFA',
        satisfaction: '96%'
      },
      investmentTypes: [
        {
          name: 'Immobilier Résidentiel',
          description: 'Appartements, villas et résidences de standing',
          allocation: '45%',
          roi: '11.2%',
          icon: Building2,
          performance: 'Excellent'
        },
        {
          name: 'Immobilier Commercial',
          description: 'Bureaux, centres commerciaux et entrepôts',
          allocation: '30%',
          roi: '14.8%',
          icon: Briefcase,
          performance: 'Très bon'
        },
        {
          name: 'Terrains à Bâtir',
          description: 'Terrains stratégiques dans zones en développement',
          allocation: '20%',
          roi: '16.5%',
          icon: Target,
          performance: 'Excellent'
        },
        {
          name: 'Projets Mixtes',
          description: 'Développements résidentiels et commerciaux',
          allocation: '5%',
          roi: '9.8%',
          icon: PieChart,
          performance: 'Bon'
        }
      ],
      investmentCriteria: [
        'Localisation stratégique',
        'Potentiel de plus-value',
        'Rendement locatif minimum 8%',
        'Zone en développement',
        'Accessibilité transport',
        'Qualité de construction'
      ],
      recentInvestments: [
        {
          name: 'Résidence Les Palmiers',
          type: 'Résidentiel',
          amount: '450M FCFA',
          roi: '13.2%',
          status: 'Actif',
          location: 'Almadies'
        },
        {
          name: 'Centre Commercial Plateau',
          type: 'Commercial',
          amount: '1.2Md FCFA',
          roi: '15.8%',
          status: 'En cours',
          location: 'Plateau'
        },
        {
          name: 'Lotissement Diamaguene',
          type: 'Terrain',
          amount: '320M FCFA',
          roi: '18.5%',
          status: 'Terminé',
          location: 'Diamaguene'
        }
      ],
      partnerships: [
        {
          name: 'Banque de l\'Habitat',
          type: 'Financement',
          since: 2018
        },
        {
          name: 'Cabinet DIOP & Associés',
          type: 'Juridique',
          since: 2017
        },
        {
          name: 'FALL Géomètres',
          type: 'Expertise technique',
          since: 2019
        }
      ]
    };
    setInvestor(mockInvestor);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil investisseur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover & Profile Header */}
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${investor.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-blue-600/80"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                  <AvatarImage src={investor.avatar} alt={investor.name} />
                  <AvatarFallback className="text-2xl">{investor.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {investor.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{investor.name}</h1>
                  <Badge className="bg-green-600 text-white">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {investor.title}
                  </Badge>
                </div>

                <p className="text-lg text-gray-700 mb-2">{investor.company}</p>

                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{investor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{investor.rating}</span>
                    <span>({investor.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{investor.stats.yearsExperience} ans d'expérience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>ROI moyen {investor.stats.averageROI}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 max-w-3xl">{investor.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    <Wallet className="h-3 w-3 mr-1" />
                    {investor.stats.totalInvested} investis
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    {investor.stats.properties}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Certifié
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Partenariat
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Projet commun
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="portfolio" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="criteria">Critères</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="partnerships">Partenariats</TabsTrigger>
              </TabsList>

              <TabsContent value="portfolio" className="space-y-6">
                <h2 className="text-xl font-semibold">Types d'Investissement</h2>
                
                <div className="grid gap-4">
                  {investor.investmentTypes.map((type, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <type.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold">{type.name}</h3>
                              <Badge className={
                                type.performance === 'Excellent' ? 'bg-green-500' :
                                type.performance === 'Très bon' ? 'bg-blue-500' : 'bg-orange-500'
                              }>
                                {type.performance}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{type.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Allocation : </span>
                                <span className="font-semibold text-green-600">{type.allocation}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">ROI : </span>
                                <span className="font-semibold">{type.roi}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Investissements Récents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {investor.recentInvestments.map((investment, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold">{investment.name}</h4>
                            <Badge className={
                              investment.status === 'Actif' ? 'bg-green-500' : 
                              investment.status === 'En cours' ? 'bg-blue-500' : 'bg-gray-500'
                            }>
                              {investment.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Type :</span>
                              <br />
                              {investment.type}
                            </div>
                            <div>
                              <span className="font-medium">Montant :</span>
                              <br />
                              {investment.amount}
                            </div>
                            <div>
                              <span className="font-medium">ROI :</span>
                              <br />
                              <span className="text-green-600 font-semibold">{investment.roi}</span>
                            </div>
                            <div>
                              <span className="font-medium">Localisation :</span>
                              <br />
                              {investment.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="criteria">
                <Card>
                  <CardHeader>
                    <CardTitle>Critères d'Investissement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 mb-4">
                      Nos critères de sélection pour identifier les meilleures opportunités d'investissement immobilier.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {investor.investmentCriteria.map((criteria, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{criteria}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyse de Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Graphiques de performance en cours de développement...</p>
                      <div className="mt-4 text-sm text-gray-400">
                        ROI moyen : {investor.stats.averageROI} | Portfolio : {investor.stats.portfolioValue}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="partnerships">
                <Card>
                  <CardHeader>
                    <CardTitle>Partenaires Stratégiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {investor.partnerships.map((partner, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{partner.name}</h4>
                          <p className="text-gray-700 text-sm mb-1">{partner.type}</p>
                          <div className="text-xs text-gray-500">
                            Partenaire depuis {partner.since}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(investor.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{investor.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{investor.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a href={`https://${investor.website}`} className="text-blue-600 hover:underline">
                    {investor.website}
                  </a>
                </div>
                <Button className="w-full mt-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Proposer un projet
                </Button>
              </CardContent>
            </Card>

            {/* Quick Investment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investissement Rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">{investor.stats.averageROI}</div>
                  <div className="text-sm text-gray-600 mb-4">ROI moyen</div>
                  <Button className="w-full" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Opportunité express
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorProfilePage;
