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
  Key,
  FileText,
  CheckCircle,
  Users,
  Calendar,
  Briefcase,
  Home,
  Calculator,
  MessageSquare,
  Share2,
  Heart,
  Search,
  Award,
  Clock,
  TrendingUp,
  Shield,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AgentProfilePage = () => {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentProfile();
  }, [agentId]);

  const loadAgentProfile = async () => {
    const mockAgent = {
      id: agentId,
      name: 'Fatou SARR',
      title: 'Agent Foncier Certifié',
      agency: 'Agence Foncière SARR & Partners',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=300&fit=crop',
      location: 'Point E, Dakar',
      practiceStart: 2012,
      isVerified: true,
      rating: 4.8,
      reviewCount: 234,
      description: 'Agent foncier expérimentée spécialisée dans les transactions immobilières résidentielles et commerciales. Excellente connaissance du marché dakarois.',
      phone: '+221 77 123 45 67',
      email: 'contact@agence-sarr.sn',
      website: 'www.agence-sarr.sn',
      license: 'AF-2024-189',
      stats: {
        propertiesSold: '320+',
        yearsExperience: 12,
        activeListings: 45,
        averageTime: '21 jours',
        successRate: '94%',
        totalSales: '4.8 Milliards FCFA',
        clients: '890+',
        satisfaction: '97%'
      },
      services: [
        {
          name: 'Vente de Propriétés',
          description: 'Accompagnement complet dans la vente de biens immobiliers',
          commission: '3-5%',
          duration: 'Variable',
          icon: Home,
          popular: true
        },
        {
          name: 'Location & Gestion',
          description: 'Mise en location et gestion locative de propriétés',
          commission: '1 mois de loyer',
          duration: 'Continu',
          icon: Key
        },
        {
          name: 'Évaluation Immobilière',
          description: 'Estimation professionnelle de la valeur des biens',
          commission: '50,000 - 100,000 FCFA',
          duration: '3-5 jours',
          icon: Calculator
        },
        {
          name: 'Recherche de Biens',
          description: 'Recherche personnalisée selon vos critères',
          commission: 'Gratuit',
          duration: '1-4 semaines',
          icon: Search
        },
        {
          name: 'Conseil Juridique',
          description: 'Accompagnement dans les démarches légales',
          commission: 'Inclus',
          duration: 'Selon besoin',
          icon: FileText
        },
        {
          name: 'Visite Virtuelle',
          description: 'Visites 360° et présentations digitales',
          commission: '25,000 FCFA',
          duration: '1-2 jours',
          icon: Eye
        }
      ],
      specialties: [
        'Immobilier Résidentiel',
        'Immobilier Commercial',
        'Terrains & Parcelles',
        'Investissement Locatif',
        'Propriétés de Luxe',
        'Première Acquisition'
      ],
      areas: [
        'Plateau', 'Point E', 'Almadies', 'Mermoz', 'Sacré-Cœur',
        'VDN', 'Ouakam', 'Ngor', 'Fann', 'Liberté'
      ],
      recentSales: [
        {
          type: 'Villa',
          location: 'Almadies',
          price: '450M FCFA',
          time: '18 jours',
          status: 'Vendue'
        },
        {
          type: 'Appartement',
          location: 'Point E',
          price: '185M FCFA',
          time: '12 jours',
          status: 'Vendu'
        },
        {
          type: 'Terrain',
          location: 'Diamaguene',
          price: '95M FCFA',
          time: '25 jours',
          status: 'Vendu'
        }
      ],
      certifications: [
        {
          name: 'Agent Foncier Certifié',
          issuer: 'Ministère de l\'Urbanisme',
          year: 2012
        },
        {
          name: 'Formation Continue Immobilier',
          issuer: 'CFCE Dakar',
          year: 2024
        },
        {
          name: 'Négociation Immobilière',
          issuer: 'École Supérieure de Commerce',
          year: 2020
        }
      ]
    };
    setAgent(mockAgent);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil agent...</p>
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
          style={{ backgroundImage: `url(${agent.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback className="text-2xl">{agent.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {agent.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
                  <Badge className="bg-blue-600 text-white">
                    <Home className="h-4 w-4 mr-1" />
                    {agent.title}
                  </Badge>
                </div>

                <p className="text-lg text-gray-700 mb-2">{agent.agency}</p>

                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{agent.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{agent.rating}</span>
                    <span>({agent.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{agent.stats.yearsExperience} ans d'expérience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Licence {agent.license}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 max-w-3xl">{agent.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  {agent.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {agent.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.specialties.length - 3} autres
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Recherche
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contacter
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
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="sales">Ventes</TabsTrigger>
                <TabsTrigger value="areas">Secteurs</TabsTrigger>
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-6">
                <h2 className="text-xl font-semibold">Services Immobiliers</h2>
                
                <div className="grid gap-4">
                  {agent.services.map((service, index) => (
                    <Card key={index} className={`hover:shadow-lg transition-shadow ${service.popular ? 'ring-2 ring-blue-200' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <service.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{service.name}</h3>
                              {service.popular && (
                                <Badge className="bg-orange-500 text-white text-xs">
                                  Populaire
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3">{service.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Commission : </span>
                                <span className="font-semibold text-green-600">{service.commission}</span>
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

              <TabsContent value="sales">
                <Card>
                  <CardHeader>
                    <CardTitle>Ventes Récentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {agent.recentSales.map((sale, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{sale.type} - {sale.location}</h4>
                          <Badge className="bg-green-500 text-white">
                            {sale.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Prix :</span>
                            <span className="ml-2 text-green-600 font-semibold">{sale.price}</span>
                          </div>
                          <div>
                            <span className="font-medium">Temps de vente :</span>
                            <span className="ml-2 font-semibold">{sale.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="areas">
                <Card>
                  <CardHeader>
                    <CardTitle>Secteurs d'Intervention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Zones géographiques où notre expertise est reconnue :
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {agent.areas.map((area, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{area}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de {agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700">{agent.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Domaines de spécialité :</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {agent.specialties.map((specialty, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Certifications :</h4>
                      <div className="space-y-3">
                        {agent.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Award className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">{cert.name}</div>
                              <div className="text-sm text-gray-600">{cert.issuer} - {cert.year}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="testimonials">
                <Card>
                  <CardHeader>
                    <CardTitle>Témoignages Clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Section témoignages en cours de développement...</p>
                      <div className="mt-4 text-sm text-gray-400">
                        Note moyenne : {agent.rating}/5 ({agent.reviewCount} avis)
                      </div>
                    </div>
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
                {Object.entries(agent.stats).map(([key, value]) => (
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
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{agent.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a href={`https://${agent.website}`} className="text-blue-600 hover:underline">
                    {agent.website}
                  </a>
                </div>
                <Button className="w-full mt-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Demander conseil
                </Button>
              </CardContent>
            </Card>

            {/* Quick Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Services Express</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Vendre mon bien
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Recherche personnalisée
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  Estimation gratuite
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Visite virtuelle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfilePage;
