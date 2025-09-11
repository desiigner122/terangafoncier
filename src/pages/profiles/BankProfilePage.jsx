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
  Heart,
  Share2,
  MessageSquare,
  CreditCard,
  Calculator,
  Shield,
  Award,
  Users,
  Calendar,
  Percent
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BankProfilePage = () => {
  const { bankId } = useParams();
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBankProfile();
  }, [bankId]);

  const loadBankProfile = async () => {
    const mockBank = {
      id: bankId,
      name: 'Banque de l\'Habitat du Sénégal',
      type: 'Institution Financière Spécialisée',
      avatar: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=150&h=150&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=300&fit=crop',
      location: 'Point E, Dakar',
      foundedYear: 1979,
      isVerified: true,
      rating: 4.7,
      reviewCount: 892,
      description: 'Banque spécialisée dans le financement immobilier au Sénégal depuis plus de 40 ans. Nous proposons des solutions de crédit adaptées à tous les projets fonciers et immobiliers.',
      phone: '+221 33 889 50 00',
      email: 'info@bhs.sn',
      website: 'www.bhs.sn',
      stats: {
        clients: '12,500+',
        loansGranted: '2,340',
        totalFunded: '45 Milliards FCFA',
        averageRate: '8.5%',
        maxLoan: '500M FCFA',
        branches: 12,
        employees: 245,
        satisfaction: '94%'
      },
      services: [
        {
          name: 'Crédit Immobilier',
          description: 'Financement jusqu\'à 85% pour l\'achat de résidence principale',
          rate: '8.5%',
          duration: '25 ans max',
          icon: Home
        },
        {
          name: 'Crédit Terrain',
          description: 'Financement pour l\'acquisition de terrains à bâtir',
          rate: '9.0%',
          duration: '15 ans max',
          icon: MapPin
        },
        {
          name: 'Crédit Construction',
          description: 'Financement des travaux de construction et rénovation',
          rate: '8.8%',
          duration: '20 ans max',
          icon: Building2
        },
        {
          name: 'Investissement Locatif',
          description: 'Financement pour l\'investissement immobilier locatif',
          rate: '9.5%',
          duration: '20 ans max',
          icon: TrendingUp
        }
      ],
      requirements: [
        'Justificatifs de revenus (3 dernières fiches de paie)',
        'Compromis de vente ou promesse d\'achat',
        'Pièce d\'identité et justificatif de domicile',
        'Relevés bancaires des 3 derniers mois',
        'Acte de propriété (pour refinancement)',
        'Devis détaillé (pour construction)'
      ],
      advantages: [
        'Taux compétitifs',
        'Accompagnement personnalisé',
        'Réponse rapide (72h)',
        'Frais de dossier réduits',
        'Assurance incluse',
        'Service digital'
      ]
    };
    setBank(mockBank);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil banque...</p>
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
          style={{ backgroundImage: `url(${bank.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-green-600/80"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                  <AvatarImage src={bank.avatar} alt={bank.name} />
                  <AvatarFallback className="text-2xl">{bank.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {bank.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{bank.name}</h1>
                  <Badge className="bg-green-500 text-white">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {bank.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{bank.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{bank.rating}</span>
                    <span>({bank.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Fondée en {bank.foundedYear}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 max-w-3xl">{bank.description}</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Taux à partir de {bank.stats.averageRate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Agréée Banque Centrale</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Simuler un crédit
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Demander un RDV
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
            <Tabs defaultValue="services" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="requirements">Conditions</TabsTrigger>
                <TabsTrigger value="calculator">Simulateur</TabsTrigger>
                <TabsTrigger value="about">À propos</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-6">
                <h2 className="text-xl font-semibold">Nos Solutions de Financement</h2>
                
                <div className="grid gap-6">
                  {bank.services.map((service, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                            <service.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                            <p className="text-gray-700 mb-3">{service.description}</p>
                            <div className="flex gap-6 text-sm">
                              <div>
                                <span className="text-gray-500">Taux : </span>
                                <span className="font-semibold text-green-600">{service.rate}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Durée : </span>
                                <span className="font-semibold">{service.duration}</span>
                              </div>
                            </div>
                            <Button className="mt-4" size="sm">
                              En savoir plus
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="requirements">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents et Conditions Requises</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Documents à fournir :</h4>
                      <div className="space-y-2">
                        {bank.requirements.map((req, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Conditions générales :</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Âge minimum :</span>
                          <span className="font-semibold ml-2">21 ans</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Âge maximum :</span>
                          <span className="font-semibold ml-2">65 ans</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Apport minimum :</span>
                          <span className="font-semibold ml-2">15%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Taux d'endettement max :</span>
                          <span className="font-semibold ml-2">33%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calculator">
                <Card>
                  <CardHeader>
                    <CardTitle>Simulateur de Crédit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Simulateur de crédit en cours de développement...</p>
                      <Button className="mt-4" variant="outline">
                        Demander une simulation personnalisée
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de {bank.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{bank.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Nos avantages :</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {bank.advantages.map((advantage, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{advantage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chiffres Clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(bank.stats).map(([key, value]) => (
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
                  <span>{bank.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{bank.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a href={`https://${bank.website}`} className="text-blue-600 hover:underline">
                    {bank.website}
                  </a>
                </div>
                <Button className="w-full mt-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Prendre rendez-vous
                </Button>
              </CardContent>
            </Card>

            {/* Quick Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calcul Rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">8.5%</div>
                  <div className="text-sm text-gray-600 mb-4">Taux à partir de</div>
                  <Button className="w-full" size="sm">
                    <Calculator className="h-4 w-4 mr-2" />
                    Simuler mon crédit
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

export default BankProfilePage;
