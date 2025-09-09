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
  Users,
  FileText,
  CheckCircle,
  Calendar,
  Clock,
  MessageSquare,
  Shield,
  Award,
  TreePine,
  Hammer,
  Home,
  Car,
  Lightbulb,
  Droplets,
  Wifi,
  School,
  Heart,
  ShoppingCart,
  Bus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MunicipalityProfilePage = () => {
  const { municipalityId } = useParams();
  const [municipality, setMunicipality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMunicipalityProfile();
  }, [municipalityId]);

  const loadMunicipalityProfile = async () => {
    const mockMunicipality = {
      id: municipalityId,
      name: 'Commune de Dakar',
      mayor: 'Barthélémy DIAS',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=300&fit=crop',
      location: 'Dakar, Sénégal',
      established: 1996,
      population: '1,146,053 habitants',
      area: '83 km²',
      isVerified: true,
      rating: 4.2,
      reviewCount: 1248,
      description: 'La Commune de Dakar est la collectivité territoriale qui administre la ville de Dakar, capitale du Sénégal. Elle œuvre pour le développement urbain et l\'amélioration du cadre de vie.',
      phone: '+221 33 823 05 05',
      email: 'contact@villededakar.sn',
      website: 'www.villededakar.sn',
      stats: {
        population: '1,146,053',
        superficie: '83 km²',
        quartiers: 19,
        projets: '45 en cours',
        budget: '52 Milliards FCFA',
        services: '180+ services',
        agents: '2,840 agents',
        satisfaction: '72%'
      },
      services: [
        {
          name: 'État Civil',
          description: 'Actes de naissance, mariage, décès et certificats',
          fee: 'Variable',
          duration: '1-3 jours',
          icon: FileText,
          popular: true
        },
        {
          name: 'Urbanisme & Permis',
          description: 'Permis de construire, certificats d\'urbanisme',
          fee: 'Selon projet',
          duration: '15-30 jours',
          icon: Building2
        },
        {
          name: 'Foncier & Domaines',
          description: 'Gestion du patrimoine foncier communal',
          fee: 'Variable',
          duration: '7-21 jours',
          icon: Home
        },
        {
          name: 'Commerce & Marchés',
          description: 'Autorisations commerciales et gestion des marchés',
          fee: 'Selon activité',
          duration: '5-10 jours',
          icon: ShoppingCart
        },
        {
          name: 'Transport Public',
          description: 'Gestion et régulation du transport urbain',
          fee: 'Réglementé',
          duration: 'Continu',
          icon: Bus
        },
        {
          name: 'Environnement',
          description: 'Gestion des déchets et espaces verts',
          fee: 'Inclus taxes',
          duration: 'Continu',
          icon: TreePine
        }
      ],
      infrastructure: [
        {
          name: 'Éclairage Public',
          coverage: '89%',
          status: 'En amélioration',
          icon: Lightbulb
        },
        {
          name: 'Adduction d\'Eau',
          coverage: '95%',
          status: 'Bon',
          icon: Droplets
        },
        {
          name: 'Assainissement',
          coverage: '76%',
          status: 'En cours',
          icon: Car
        },
        {
          name: 'Voirie',
          coverage: '82%',
          status: 'Rénovation',
          icon: Car
        }
      ],
      currentProjects: [
        {
          name: 'Rénovation du Marché Sandaga',
          budget: '5.2 Milliards FCFA',
          progress: '65%',
          endDate: 'Décembre 2025',
          status: 'En cours'
        },
        {
          name: 'Extension du Réseau d\'Assainissement',
          budget: '8.7 Milliards FCFA',
          progress: '40%',
          endDate: 'Mars 2026',
          status: 'En cours'
        },
        {
          name: 'Modernisation de l\'Éclairage Public',
          budget: '3.1 Milliards FCFA',
          progress: '80%',
          endDate: 'Juin 2025',
          status: 'Avancé'
        }
      ],
      departments: [
        {
          name: 'Urbanisme et Habitat',
          head: 'Directeur NDIAYE',
          services: ['Permis de construire', 'Certificats d\'urbanisme', 'Contrôle des constructions']
        },
        {
          name: 'État Civil',
          head: 'Directrice DIOP',
          services: ['Actes de naissance', 'Mariages', 'Décès', 'Certificats']
        },
        {
          name: 'Développement Local',
          head: 'Directeur FALL',
          services: ['Projets communautaires', 'Coopération', 'Développement économique']
        }
      ]
    };
    setMunicipality(mockMunicipality);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil mairie...</p>
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
          style={{ backgroundImage: `url(${municipality.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/80 to-green-700/80"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                  <AvatarImage src={municipality.avatar} alt={municipality.name} />
                  <AvatarFallback className="text-2xl">🏛️</AvatarFallback>
                </Avatar>
                {municipality.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{municipality.name}</h1>
                  <Badge className="bg-blue-600 text-white">
                    <Building2 className="h-4 w-4 mr-1" />
                    Collectivité Territoriale
                  </Badge>
                </div>

                <p className="text-lg text-gray-700 mb-2">Maire : {municipality.mayor}</p>

                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{municipality.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{municipality.population}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Créée en {municipality.established}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{municipality.rating}</span>
                    <span>({municipality.reviewCount} évaluations)</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 max-w-3xl">{municipality.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {municipality.stats.population} habitants
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    {municipality.stats.quartiers} quartiers
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Hammer className="h-3 w-3 mr-1" />
                    {municipality.stats.projets}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Nous contacter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Démarches
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
                <TabsTrigger value="projects">Projets</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                <TabsTrigger value="departments">Départements</TabsTrigger>
                <TabsTrigger value="info">Informations</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-6">
                <h2 className="text-xl font-semibold">Services Municipaux</h2>
                
                <div className="grid gap-4">
                  {municipality.services.map((service, index) => (
                    <Card key={index} className={`hover:shadow-lg transition-shadow ${service.popular ? 'ring-2 ring-blue-200' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
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
                                <span className="text-gray-500">Coût : </span>
                                <span className="font-semibold">{service.fee}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Délai : </span>
                                <span className="font-semibold">{service.duration}</span>
                              </div>
                            </div>
                            <Button className="mt-4" size="sm">
                              Plus d'infos
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Projets en Cours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {municipality.currentProjects.map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{project.name}</h4>
                          <Badge className={
                            project.status === 'Avancé' ? 'bg-green-500' : 
                            project.status === 'En cours' ? 'bg-blue-500' : 'bg-gray-500'
                          }>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span className="font-semibold">{project.progress}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: project.progress }}
                            ></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                            <div>
                              <span className="font-medium">Budget :</span>
                              <br />
                              {project.budget}
                            </div>
                            <div>
                              <span className="font-medium">Fin prévue :</span>
                              <br />
                              {project.endDate}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="infrastructure">
                <Card>
                  <CardHeader>
                    <CardTitle>État des Infrastructures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {municipality.infrastructure.map((infra, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <infra.icon className="h-6 w-6 text-blue-600" />
                          <div>
                            <h4 className="font-semibold">{infra.name}</h4>
                            <p className="text-sm text-gray-600">Couverture : {infra.coverage}</p>
                          </div>
                        </div>
                        <Badge className={
                          infra.status === 'Bon' ? 'bg-green-500' :
                          infra.status === 'En amélioration' ? 'bg-blue-500' :
                          'bg-orange-500'
                        }>
                          {infra.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="departments">
                <Card>
                  <CardHeader>
                    <CardTitle>Départements Municipaux</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {municipality.departments.map((dept, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{dept.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">Responsable : {dept.head}</p>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Services :</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {dept.services.map((service, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Pratiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Horaires d'ouverture :</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Lundi - Vendredi</span>
                          <span>8h00 - 17h00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Samedi</span>
                          <span>8h00 - 13h00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dimanche</span>
                          <span>Fermé</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Localisation :</h4>
                      <p className="text-sm text-gray-600">
                        Hôtel de Ville, Place de l'Indépendance, Dakar
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Municipality Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chiffres Clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(municipality.stats).map(([key, value]) => (
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
                  <span>{municipality.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{municipality.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a href={`https://${municipality.website}`} className="text-blue-600 hover:underline">
                    {municipality.website}
                  </a>
                </div>
                <Button className="w-full mt-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Signaler un problème
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
                  <FileText className="h-4 w-4 mr-2" />
                  État civil
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Permis construire
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Foncier
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Aide sociale
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunicipalityProfilePage;
