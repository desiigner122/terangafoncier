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
  Clock,
  Map,
  CheckCircle,
  Compass,
  Ruler,
  Award,
  Users,
  Calendar,
  Camera,
  Satellite,
  FileCheck,
  Calculator,
  Plane,
  MessageSquare,
  Share2,
  Heart,
  Target,
  Eye,
  BarChart3,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const GeometerProfilePage = () => {
  const { geometerId } = useParams();
  const [geometer, setGeometer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGeometerProfile();
  }, [geometerId]);

  const loadGeometerProfile = async () => {
    const mockGeometer = {
      id: geometerId,
      name: 'Ibrahima FALL',
      title: 'Géomètre Expert',
      company: 'Cabinet de Géométrie FALL & Associés',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=300&fit=crop',
      location: 'Almadies, Dakar',
      practiceStart: 2005,
      isVerified: true,
      rating: 4.8,
      reviewCount: 156,
      description: 'Géomètre Expert diplômé de l\'ENSTP Yaoundé, spécialisé dans le bornage, l\'arpentage et les levés topographiques. Utilisation de technologies modernes (GPS, drone, laser).',
      phone: '+221 77 654 32 10',
      email: 'contact@geometre-fall.sn',
      website: 'www.geometre-fall.sn',
      license: 'GE-2024-089',
      stats: {
        projectsCompleted: '580+',
        yearsExperience: 19,
        clients: '340+',
        averageDelay: '5 jours',
        accuracy: '99.9%',
        teamSize: 8,
        equipment: '15+ appareils',
        satisfaction: '97%'
      },
      services: [
        {
          name: 'Bornage de Terrains',
          description: 'Délimitation précise des propriétés foncières avec pose de bornes',
          price: '25,000 - 50,000 FCFA/ha',
          duration: '3-7 jours',
          icon: Target,
          popular: true
        },
        {
          name: 'Levés Topographiques',
          description: 'Relevé précis du relief et des détails du terrain',
          price: '15,000 - 30,000 FCFA/ha',
          duration: '2-5 jours',
          icon: Map
        },
        {
          name: 'Plans de Lotissement',
          description: 'Conception et réalisation de plans de division',
          price: '100,000 - 300,000 FCFA',
          duration: '10-15 jours',
          icon: BarChart3
        },
        {
          name: 'Implantation de Bâtiments',
          description: 'Positionnement précis des constructions',
          price: '50,000 - 100,000 FCFA',
          duration: '1-2 jours',
          icon: Building2
        },
        {
          name: 'Levés par Drone',
          description: 'Cartographie aérienne haute précision',
          price: '200,000 - 500,000 FCFA',
          duration: '1-3 jours',
          icon: Plane
        },
        {
          name: 'Expertise Foncière',
          description: 'Évaluation et expertise de propriétés',
          price: 'Sur devis',
          duration: '7-10 jours',
          icon: FileCheck
        }
      ],
      specialties: [
        'Bornage Foncier',
        'Topographie',
        'Cartographie',
        'SIG (Systèmes d\'Information Géographique)',
        'Photogrammétrie',
        'Géodésie'
      ],
      equipment: [
        {
          name: 'Station Totale Leica',
          description: 'Mesure ultra-précise des angles et distances',
          precision: '±1mm'
        },
        {
          name: 'GPS RTK',
          description: 'Positionnement centimétrique en temps réel',
          precision: '±2cm'
        },
        {
          name: 'Drone DJI Phantom 4 RTK',
          description: 'Cartographie aérienne haute résolution',
          precision: '±3cm'
        },
        {
          name: 'Scanner Laser 3D',
          description: 'Numérisation complète des terrains',
          precision: '±5mm'
        }
      ],
      certifications: [
        {
          name: 'Géomètre Expert',
          issuer: 'ENSTP Yaoundé',
          year: 2005
        },
        {
          name: 'Télépilote de Drone',
          issuer: 'DGAC Sénégal',
          year: 2022
        },
        {
          name: 'Formation SIG',
          issuer: 'ESRI',
          year: 2023
        }
      ],
      recentProjects: [
        {
          name: 'Lotissement Résidentiel Almadies',
          type: 'Division parcellaire',
          area: '15 hectares',
          duration: '45 jours',
          status: 'Terminé'
        },
        {
          name: 'Bornage Terrain Industriel',
          type: 'Bornage',
          area: '8.5 hectares',
          duration: '12 jours',
          status: 'En cours'
        },
        {
          name: 'Levé Topographique Route',
          type: 'Topographie',
          area: '5 km linéaire',
          duration: '20 jours',
          status: 'Terminé'
        }
      ]
    };
    setGeometer(mockGeometer);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil géomètre...</p>
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
          style={{ backgroundImage: `url(${geometer.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-blue-600/80"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                  <AvatarImage src={geometer.avatar} alt={geometer.name} />
                  <AvatarFallback className="text-2xl">{geometer.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {geometer.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{geometer.name}</h1>
                  <Badge className="bg-green-600 text-white">
                    <Compass className="h-4 w-4 mr-1" />
                    {geometer.title}
                  </Badge>
                </div>

                <p className="text-lg text-gray-700 mb-2">{geometer.company}</p>

                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{geometer.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{geometer.rating}</span>
                    <span>({geometer.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{geometer.stats.yearsExperience} ans d'expérience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    <span>Licence {geometer.license}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 max-w-3xl">{geometer.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  {geometer.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {geometer.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{geometer.specialties.length - 3} autres
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Devis gratuit
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
                <TabsTrigger value="equipment">Équipement</TabsTrigger>
                <TabsTrigger value="projects">Projets</TabsTrigger>
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="gallery">Galerie</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-6">
                <h2 className="text-xl font-semibold">Services de Géométrie</h2>
                
                <div className="grid gap-4">
                  {geometer.services.map((service, index) => (
                    <Card key={index} className={`hover:shadow-lg transition-shadow ${service.popular ? 'ring-2 ring-green-200' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
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
                                <span className="text-gray-500">Prix : </span>
                                <span className="font-semibold text-green-600">{service.price}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Délai : </span>
                                <span className="font-semibold">{service.duration}</span>
                              </div>
                            </div>
                            <Button className="mt-4" size="sm">
                              Demander un devis
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="equipment">
                <Card>
                  <CardHeader>
                    <CardTitle>Équipement Professionnel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      {geometer.equipment.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Satellite className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.name}</h4>
                            <p className="text-gray-700 text-sm mb-2">{item.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Précision {item.precision}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Projets Récents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {geometer.recentProjects.map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{project.name}</h4>
                          <Badge className={
                            project.status === 'Terminé' ? 'bg-green-500' : 
                            project.status === 'En cours' ? 'bg-blue-500' : 'bg-gray-500'
                          }>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Type :</span>
                            <br />
                            {project.type}
                          </div>
                          <div>
                            <span className="font-medium">Surface :</span>
                            <br />
                            {project.area}
                          </div>
                          <div>
                            <span className="font-medium">Durée :</span>
                            <br />
                            {project.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de {geometer.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700">{geometer.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Domaines d'expertise :</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {geometer.specialties.map((specialty, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Formations et certifications :</h4>
                      <div className="space-y-3">
                        {geometer.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Award className="h-5 w-5 text-green-600" />
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

              <TabsContent value="gallery">
                <Card>
                  <CardHeader>
                    <CardTitle>Galerie de Projets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Galerie de projets en cours de développement...</p>
                      <Button className="mt-4" variant="outline">
                        Voir le portfolio complet
                      </Button>
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
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(geometer.stats).map(([key, value]) => (
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
                  <span>{geometer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{geometer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a href={`https://${geometer.website}`} className="text-blue-600 hover:underline">
                    {geometer.website}
                  </a>
                </div>
                <Button className="w-full mt-4">
                  <Calculator className="h-4 w-4 mr-2" />
                  Demander un devis
                </Button>
              </CardContent>
            </Card>

            {/* Quick Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Services Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Bornage terrain
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Map className="h-4 w-4 mr-2" />
                  Levé topographique
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Plane className="h-4 w-4 mr-2" />
                  Cartographie drone
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Visite technique
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometerProfilePage;
