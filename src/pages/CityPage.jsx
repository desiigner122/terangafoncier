import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Building,
  Landmark,
  Star,
  CheckCircle,
  Info,
  ArrowRight,
  Send,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CityPage = () => {
  const { cityId } = useParams();
  const [currentParcelIndex, setCurrentParcelIndex] = useState(0);
  const [requestForm, setRequestForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredLocation: '',
    budgetRange: '',
    landSize: '',
    purpose: '',
    timeline: '',
    additionalInfo: ''
  });

  // DonnÃ©es mockÃ©es pour la ville
  const cityData = {
    dakar: {
      name: 'Dakar',
      region: 'RÃ©gion de Dakar',
      population: '1,378,000',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      description: 'Capitale Ã©conomique et politique du SÃ©nÃ©gal, Dakar est le centre des affaires et offre les meilleures opportunitÃ©s d\'investissement immobilier.',
      advantages: [
        'Centre Ã©conomique et politique',
        'Infrastructure dÃ©veloppÃ©e',
        'Transports publics efficaces',
        'Nombreuses opportunitÃ©s d\'emploi',
        'ProximitÃ© aÃ©roport international',
        'Vie culturelle riche',
        'Ã‰tablissements d\'enseignement supÃ©rieur',
        'Services de santÃ© de qualitÃ©'
      ],
      communalRequests: 89,
      averagePrice: 85000,
      demandLevel: 'TrÃ¨s Ã‰levÃ©e',
      availableZones: [
        'Pikine Extension',
        'GuÃ©diawaye Nord',
        'Keur Massar',
        'Malika',
        'Yeumbeul Sud'
      ],
      mayor: {
        name: 'BarthÃ©lÃ©my Dias',
        email: 'mairie@ville-dakar.sn',
        phone: '+221 33 849 05 00'
      },
      parcelsForSale: [
        {
          id: 'DK-001',
          title: 'Terrain RÃ©sidentiel Almadies',
          size: '400 mÂ²',
          price: 38000000,
          image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          seller: 'Amadou Diallo',
          features: ['Vue mer', 'ViabilisÃ©', 'Proche commoditÃ©s']
        },
        {
          id: 'DK-002',
          title: 'Parcelle Commerciale Plateau',
          size: '600 mÂ²',
          price: 52000000,
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          seller: 'Fatou Ndiaye',
          features: ['Zone commerciale', 'AccÃ¨s facile', 'High standing']
        },
        {
          id: 'DK-003',
          title: 'Terrain Villa Mermoz',
          size: '500 mÂ²',
          price: 45000000,
          image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          seller: 'Moussa Sow',
          features: ['Quartier calme', 'SÃ©curisÃ©', 'Titre foncier']
        }
      ]
    }
    // Ajout d'autres villes ici...
  };

  const city = cityData[cityId] || cityData.dakar;

  const nextParcel = () => {
    setCurrentParcelIndex((prev) => (prev + 1) % city.parcelsForSale.length);
  };

  const prevParcel = () => {
    setCurrentParcelIndex((prev) => (prev - 1 + city.parcelsForSale.length) % city.parcelsForSale.length);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    // Ici, vous ajouteriez la logique pour soumettre la demande
    console.log('Demande communale soumise:', requestForm);
    // Simulation de succÃ¨s
    alert('Votre demande a Ã©tÃ© soumise avec succÃ¨s ! La mairie vous contactera sous 48h.');
  };

  return (
    <>
      <Helmet>
        <title>{city.name} - Terrains Communaux | Teranga Foncier</title>
        <meta name="description" content={`DÃ©couvrez les opportunitÃ©s fonciÃ¨res Ã  ${city.name}. Soumettez votre demande de terrain communal et explorez les parcelles disponibles.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section Ville */}
        <section className="relative h-[400px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${city.image})` }}
          />
          <div className="absolute inset-0 bg-black/60" />
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                    <Landmark className="h-4 w-4 mr-2" />
                    Ville Partenaire
                  </Badge>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {city.name}
                  </h1>
                  
                  <p className="text-xl text-gray-200 mb-6">
                    {city.region} â€¢ {city.population} habitants
                  </p>
                  
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {city.description}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Statistiques */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{city.communalRequests}</div>
                      <div className="text-sm text-gray-600">Demandes communales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{city.averagePrice.toLocaleString()} F</div>
                      <div className="text-sm text-gray-600">Prix moyen/mÂ²</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{city.demandLevel}</div>
                      <div className="text-sm text-gray-600">Niveau demande</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{city.availableZones.length}</div>
                      <div className="text-sm text-gray-600">Zones disponibles</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Onglets */}
              <Tabs defaultValue="advantages" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="advantages">Avantages</TabsTrigger>
                  <TabsTrigger value="zones">Zones Disponibles</TabsTrigger>
                  <TabsTrigger value="parcels">Terrains Vendeurs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="advantages" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pourquoi Investir Ã  {city.name} ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {city.advantages.map((advantage, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span>{advantage}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="zones" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Zones d'Extension Urbaine</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {city.availableZones.map((zone, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span className="font-medium">{zone}</span>
                              </div>
                              <Button variant="outline" size="sm">
                                Demander Info
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="parcels" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Terrains de nos Vendeurs</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={prevParcel}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={nextParcel}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative overflow-hidden">
                        <motion.div
                          className="flex"
                          animate={{ x: -currentParcelIndex * 100 + '%' }}
                          transition={{ duration: 0.5 }}
                        >
                          {city.parcelsForSale.map((parcel, index) => (
                            <div key={index} className="w-full flex-shrink-0">
                              <div className="grid md:grid-cols-2 gap-6">
                                <img
                                  src={parcel.image}
                                  alt={parcel.title}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                                <div>
                                  <h3 className="text-xl font-bold mb-2">{parcel.title}</h3>
                                  <p className="text-gray-600 mb-4">Vendu par {parcel.seller}</p>
                                  
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <div className="text-sm text-gray-500">Superficie</div>
                                      <div className="font-semibold">{parcel.size}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Prix</div>
                                      <div className="font-semibold text-primary">{parcel.price.toLocaleString()} F</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {parcel.features.map((feature, idx) => (
                                      <Badge key={idx} variant="outline">{feature}</Badge>
                                    ))}
                                  </div>
                                  
                                  <Button asChild className="w-full">
                                    <Link to={`/parcelles/${parcel.id}`}>
                                      Voir les DÃ©tails
                                      <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Formulaire de demande */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Demande de Terrain Communal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Nom complet *</Label>
                      <Input
                        id="fullName"
                        value={requestForm.fullName}
                        onChange={(e) => setRequestForm({...requestForm, fullName: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={requestForm.email}
                          onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">TÃ©lÃ©phone *</Label>
                        <Input
                          id="phone"
                          value={requestForm.phone}
                          onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="preferredLocation">Zone prÃ©fÃ©rÃ©e</Label>
                      <Select
                        value={requestForm.preferredLocation}
                        onValueChange={(value) => setRequestForm({...requestForm, preferredLocation: value})}
                      >
                        <SelectTrigger>
                          <SelectValue YOUR_API_KEY="SÃ©lectionnez une zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {city.availableZones.map((zone, index) => (
                            <SelectItem key={index} value={zone}>{zone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budgetRange">Budget (FCFA)</Label>
                        <Select
                          value={requestForm.budgetRange}
                          onValueChange={(value) => setRequestForm({...requestForm, budgetRange: value})}
                        >
                          <SelectTrigger>
                            <SelectValue YOUR_API_KEY="Budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-20M">0 - 20M</SelectItem>
                            <SelectItem value="20M-50M">20M - 50M</SelectItem>
                            <SelectItem value="50M-100M">50M - 100M</SelectItem>
                            <SelectItem value="100M+">100M+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="landSize">Superficie souhaitÃ©e</Label>
                        <Select
                          value={requestForm.landSize}
                          onValueChange={(value) => setRequestForm({...requestForm, landSize: value})}
                        >
                          <SelectTrigger>
                            <SelectValue YOUR_API_KEY="Superficie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="200-400">200-400 mÂ²</SelectItem>
                            <SelectItem value="400-600">400-600 mÂ²</SelectItem>
                            <SelectItem value="600-1000">600-1000 mÂ²</SelectItem>
                            <SelectItem value="1000+">1000+ mÂ²</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="purpose">Objectif du projet</Label>
                      <Select
                        value={requestForm.purpose}
                        onValueChange={(value) => setRequestForm({...requestForm, purpose: value})}
                      >
                        <SelectTrigger>
                          <SelectValue YOUR_API_KEY="Type de projet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residence">RÃ©sidence principale</SelectItem>
                          <SelectItem value="investment">Investissement locatif</SelectItem>
                          <SelectItem value="commercial">Projet commercial</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="additionalInfo">Informations complÃ©mentaires</Label>
                      <Textarea
                        id="additionalInfo"
                        value={requestForm.additionalInfo}
                        onChange={(e) => setRequestForm({...requestForm, additionalInfo: e.target.value})}
                        rows={3}
                        YOUR_API_KEY="DÃ©tails spÃ©cifiques, dÃ©lais souhaitÃ©s..."
                      />
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Votre demande sera transmise directement Ã  la mairie. RÃ©ponse garantie sous 48h.
                      </AlertDescription>
                    </Alert>
                    
                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Soumettre la Demande
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Mairie */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Mairie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{city.mayor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${city.mayor.phone}`} className="text-sm text-primary hover:underline">
                      {city.mayor.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${city.mayor.email}`} className="text-sm text-primary hover:underline">
                      {city.mayor.email}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to={`/parcelles?zone=${cityId}`}>
                      <Home className="h-4 w-4 mr-2" />
                      Voir tous les terrains
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/villes-partenaires">
                      <MapPin className="h-4 w-4 mr-2" />
                      Autres villes partenaires
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/contact">
                      <Phone className="h-4 w-4 mr-2" />
                      Nous contacter
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityPage;
