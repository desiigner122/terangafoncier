import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Building2,
  Users,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  Briefcase,
  Clock,
  DollarSign,
  Home,
  Construction,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const PromoterProfilePage = () => {
  const { promoterId } = useParams();
  const navigate = useNavigate();
  const [promoter, setPromoter] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromoterProfile();
    loadPromoterProjects();
  }, [promoterId]);

  const loadPromoterProfile = async () => {
    const mockPromoter = {
      id: promoterId,
      name: 'Teranga Construction SARL',
      type: 'Promoteur Immobilier',
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=300&fit=crop',
      location: 'Almadies, Dakar',
      foundedYear: 2015,
      isVerified: true,
      rating: 4.9,
      reviewCount: 127,
      description: 'Promoteur immobilier de référence au Sénégal depuis 2015. Nous développons des projets résidentiels et commerciaux haut de gamme avec les dernières technologies et un engagement fort pour la durabilité.',
      phone: '+221 33 865 12 34',
      email: 'contact@teranga-construction.com',
      website: 'www.teranga-construction.com',
      specialties: [
        'Résidences Haut Standing',
        'Complexes Commerciaux', 
        'Bâtiments Intelligents',
        'Construction Durable',
        'Architecture Moderne'
      ],
      stats: {
        totalProjects: 24,
        completedProjects: 18,
        ongoingProjects: 6,
        totalUnits: 450,
        totalInvestment: '45 Milliards FCFA',
        employees: 125,
        averageDeliveryTime: '18 mois',
        clientSatisfaction: '96%'
      },
      certifications: [
        'Promoteur Agréé État du Sénégal',
        'ISO 9001:2015 Qualité',
        'Certification Environnementale',
        'Prix Innovation 2023',
        'Entreprise Responsable'
      ],
      services: [
        'Développement Immobilier',
        'Construction Clés en Main',
        'Financement de Projets',
        'Gestion de Patrimoine',
        'Conseil en Investissement'
      ],
      team: [
        {
          name: 'Moussa Fall',
          role: 'Directeur Général',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          experience: '15 ans'
        },
        {
          name: 'Fatou Sow',
          role: 'Architecte Principal',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616c88d3b0e?w=100&h=100&fit=crop&crop=face',
          experience: '12 ans'
        },
        {
          name: 'Omar Diop',
          role: 'Chef de Projet',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          experience: '10 ans'
        }
      ]
    };
    setPromoter(mockPromoter);
    setLoading(false);
  };

  const loadPromoterProjects = async () => {
    const mockProjects = [
      {
        id: 1,
        name: 'Résidence Almadies Premium',
        type: 'Résidentiel',
        location: 'Almadies, Dakar',
        status: 'En cours',
        progress: 75,
        units: 24,
        priceRange: '150M - 300M FCFA',
        deliveryDate: '2024-12-15',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
        description: 'Résidence haut standing avec vue sur mer, équipements modernes et espaces verts.',
        features: ['Vue mer', 'Piscine', 'Sécurité 24h', 'Parking', 'Espaces verts']
      },
      {
        id: 2,
        name: 'Centre Commercial Liberté',
        type: 'Commercial',
        location: 'Liberté 6, Dakar',
        status: 'Planifié',
        progress: 15,
        units: 45,
        priceRange: '80M - 200M FCFA',
        deliveryDate: '2025-06-30',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        description: 'Centre commercial moderne avec espaces de vente, restaurants et divertissement.',
        features: ['Parking 3 niveaux', 'Climatisation', 'Ascenseurs', 'Sécurité']
      },
      {
        id: 3,
        name: 'Villas Mermoz Gardens',
        type: 'Résidentiel',
        location: 'Mermoz, Dakar',
        status: 'Terminé',
        progress: 100,
        units: 12,
        priceRange: '200M - 400M FCFA',
        deliveryDate: '2024-03-30',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
        description: 'Villas de luxe avec jardins privés dans un quartier résidentiel calme.',
        features: ['Jardin privé', 'Garage 2 voitures', 'Terrasse', 'Système solaire']
      }
    ];
    setProjects(mockProjects);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Planifié': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Terminé': return <CheckCircle className="h-4 w-4" />;
      case 'En cours': return <Construction className="h-4 w-4" />;
      case 'Planifié': return <Target className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil promoteur...</p>
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
          style={{ backgroundImage: `url(${promoter.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={promoter.avatar} alt={promoter.name} />
                  <AvatarFallback className="text-2xl">{promoter.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {promoter.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{promoter.name}</h1>
                  <Badge className="bg-orange-500 text-white">
                    <Building2 className="h-4 w-4 mr-1" />
                    {promoter.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{promoter.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{promoter.rating}</span>
                    <span>({promoter.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Fondé en {promoter.foundedYear}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 max-w-3xl">{promoter.description}</p>

                <div className="flex flex-wrap gap-2">
                  {promoter.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {promoter.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{promoter.specialties.length - 3} autres
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contacter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Suivre
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
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
            <Tabs defaultValue="projects" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="projects">Projets ({projects.length})</TabsTrigger>
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="team">Équipe</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({promoter.reviewCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Nos Projets</h2>
                  <Button variant="outline" size="sm">
                    Voir tous les projets
                  </Button>
                </div>

                <div className="grid gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img 
                            src={project.image} 
                            alt={project.name}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{project.location}</span>
                                <Badge variant="outline">{project.type}</Badge>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(project.status)} flex items-center gap-1`}>
                              {getStatusIcon(project.status)}
                              {project.status}
                            </Badge>
                          </div>

                          <p className="text-gray-700 mb-4">{project.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-500">Unités</div>
                              <div className="font-semibold">{project.units}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Prix</div>
                              <div className="font-semibold text-sm">{project.priceRange}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Livraison</div>
                              <div className="font-semibold text-sm">
                                {new Date(project.deliveryDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Avancement</div>
                              <div className="flex items-center gap-2">
                                <Progress value={project.progress} className="h-2 flex-1" />
                                <span className="text-sm font-semibold">{project.progress}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <Button className="w-full md:w-auto">
                            Voir le projet
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>À propos de {promoter.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700">{promoter.description}</p>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Services proposés</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {promoter.services.map((service, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Spécialités</h4>
                        <div className="flex flex-wrap gap-2">
                          {promoter.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline">{specialty}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="team">
                <Card>
                  <CardHeader>
                    <CardTitle>Notre Équipe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {promoter.team.map((member, index) => (
                        <div key={index} className="text-center">
                          <Avatar className="h-16 w-16 mx-auto mb-3">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <p className="text-xs text-gray-500">{member.experience} d'expérience</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Avis clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Système d'avis en cours de développement...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(promoter.stats).map(([key, value]) => (
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
                  <span>{promoter.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{promoter.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a href={`https://${promoter.website}`} className="text-blue-600 hover:underline">
                    {promoter.website}
                  </a>
                </div>
                <Button className="w-full mt-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Demander un devis
                </Button>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Certifications & Prix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {promoter.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-orange-500 mt-0.5" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoterProfilePage;
