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
  FileText,
  CheckCircle,
  Scale,
  Shield,
  Award,
  Users,
  Calendar,
  Briefcase,
  FileCheck,
  Stamp,
  CreditCard,
  Calculator,
  MessageSquare,
  Share2,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NotaryProfilePage = () => {
  const { notaryId } = useParams();
  const [notary, setNotary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotaryProfile();
  }, [notaryId]);

  const loadNotaryProfile = async () => {
    const mockNotary = {
      id: notaryId,
      name: 'Maître Abdoulaye DIOP',
      title: 'Notaire',
      office: 'Étude Notariale Maître DIOP & Associés',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=300&fit=crop',
      location: 'Plateau, Dakar',
      practiceStart: 1998,
      isVerified: true,
      rating: 4.9,
      reviewCount: 347,
      description: 'Notaire diplômé de l\'École Nationale d\'Administration du Sénégal, spécialisé dans les transactions immobilières, le droit des affaires et les successions. Plus de 25 ans d\'expérience.',
      phone: '+221 33 821 45 67',
      email: 'etude@notaire-diop.sn',
      website: 'www.notaire-diop.sn',
      chamberNumber: 'N°056/2024',
      stats: {
        actsCompleted: '2,890+',
        yearsExperience: 26,
        clients: '1,250+',
        averageDelay: '7 jours',
        successRate: '99.8%',
        associates: 3,
        staff: 12,
        satisfaction: '98%'
      },
      services: [
        {
          name: 'Actes de Vente Immobilière',
          description: 'Rédaction et authentification des actes de vente de biens immobiliers',
          fee: 'Selon barème officiel',
          duration: '7-10 jours',
          icon: FileText,
          popular: true
        },
        {
          name: 'Contrats de Bail',
          description: 'Rédaction de baux commerciaux et d\'habitation',
          fee: '150,000 - 300,000 FCFA',
          duration: '3-5 jours',
          icon: Building2
        },
        {
          name: 'Successions et Testaments',
          description: 'Règlement de successions et rédaction de testaments',
          fee: 'Selon patrimoine',
          duration: '15-30 jours',
          icon: Scale
        },
        {
          name: 'Création de Sociétés',
          description: 'Constitution et modification de statuts de sociétés',
          fee: '250,000 - 500,000 FCFA',
          duration: '10-15 jours',
          icon: Briefcase
        },
        {
          name: 'Procurations',
          description: 'Établissement de procurations authentiques',
          fee: '25,000 - 50,000 FCFA',
          duration: '1-2 jours',
          icon: FileCheck
        },
        {
          name: 'Certifications',
          description: 'Certification de signatures et copies conformes',
          fee: '5,000 - 15,000 FCFA',
          duration: 'Immédiat',
          icon: Stamp
        }
      ],
      specialties: [
        'Droit Immobilier',
        'Droit des Affaires',
        'Droit des Successions',
        'Droit de la Famille',
        'Droit International Privé',
        'Transactions Commerciales'
      ],
      languages: ['Français', 'Wolof', 'Pulaar', 'Anglais'],
      certifications: [
        {
          name: 'Diplôme de Notaire',
          issuer: 'ENA Sénégal',
          year: 1998
        },
        {
          name: 'Formation Continue',
          issuer: 'Chambre des Notaires',
          year: 2024
        },
        {
          name: 'Droit OHADA',
          issuer: 'ERSUMA',
          year: 2020
        }
      ],
      office: {
        address: '15, Avenue Léopold Sédar Senghor, Plateau, Dakar',
        hours: {
          'Lundi - Vendredi': '8h00 - 17h00',
          'Samedi': '8h00 - 12h00',
          'Dimanche': 'Fermé'
        },
        parking: true,
        accessibility: true,
        publicTransport: true
      }
    };
    setNotary(mockNotary);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil notaire...</p>
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
          style={{ backgroundImage: `url(${notary.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-800/80"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                  <AvatarImage src={notary.avatar} alt={notary.name} />
                  <AvatarFallback className="text-2xl">{notary.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {notary.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{notary.name}</h1>
                  <Badge className="bg-blue-600 text-white">
                    <Scale className="h-4 w-4 mr-1" />
                    {notary.title}
                  </Badge>
                </div>

                <p className="text-lg text-gray-700 mb-2">{notary.office}</p>

                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{notary.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{notary.rating}</span>
                    <span>({notary.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{notary.stats.yearsExperience} ans d'expérience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>N° {notary.chamberNumber}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 max-w-3xl">{notary.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  {notary.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {notary.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{notary.specialties.length - 3} autres
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Prendre RDV
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="office">Étude</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-6">
                <h2 className="text-xl font-semibold">Services Notariaux</h2>
                
                <div className="grid gap-4">
                  {notary.services.map((service, index) => (
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
                                <span className="text-gray-500">Honoraires : </span>
                                <span className="font-semibold">{service.fee}</span>
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

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de {notary.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700">{notary.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Domaines de spécialité :</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {notary.specialties.map((specialty, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Langues parlées :</h4>
                      <div className="flex gap-2 flex-wrap">
                        {notary.languages.map((language, index) => (
                          <Badge key={index} variant="outline">{language}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Formations et certifications :</h4>
                      <div className="space-y-3">
                        {notary.certifications.map((cert, index) => (
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

              <TabsContent value="office">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations sur l'Étude</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Adresse :</h4>
                      <p className="text-gray-700">{notary.office.address}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Horaires d'ouverture :</h4>
                      <div className="space-y-2">
                        {Object.entries(notary.office.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="font-medium">{day}</span>
                            <span className="text-gray-600">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Facilités :</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Parking disponible</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Accès PMR</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Transport public</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>WiFi gratuit</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Avis Clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Section avis en cours de développement...</p>
                      <div className="mt-4 text-sm text-gray-400">
                        Note moyenne : {notary.rating}/5 ({notary.reviewCount} avis)
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
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notary.stats).map(([key, value]) => (
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
                  <span>{notary.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{notary.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a href={`https://${notary.website}`} className="text-blue-600 hover:underline">
                    {notary.website}
                  </a>
                </div>
                <Button className="w-full mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Prendre rendez-vous
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Acte de vente
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Contrat de bail
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Stamp className="h-4 w-4 mr-2" />
                  Certification
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  Devis en ligne
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotaryProfilePage;
