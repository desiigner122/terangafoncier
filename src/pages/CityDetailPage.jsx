import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, 
  Users, 
  Building, 
  Landmark, 
  Phone, 
  Mail, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Star,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  Home,
  Car,
  Wifi,
  Zap,
  Droplets,
  TreePine
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const cityData = {
  dakar: {
    name: "Dakar",
    region: "Région de Dakar", 
    population: "1,030,594",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    description: "Capitale économique et politique du Sénégal, Dakar est un centre urbain dynamique offrant de nombreuses opportunités d'investissement immobilier.",
    advantages: [
      "Centre économique du pays",
      "Infrastructures développées", 
      "Proximité des services",
      "Forte demande locative",
      "Accès international"
    ],
    stats: {
      parcelsAvailable: 45,
      averagePrice: "85,000,000",
      demandLevel: "Très forte",
      growth: "+15%"
    },
    infrastructure: [
      { name: "Aéroport International", icon: Globe, status: "Excellent" },
      { name: "Transports publics", icon: Car, status: "Bon" },
      { name: "Internet/WiFi", icon: Wifi, status: "Excellent" },
      { name: "Électricité", icon: Zap, status: "Bon" },
      { name: "Eau potable", icon: Droplets, status: "Bon" },
      { name: "Espaces verts", icon: TreePine, status: "Moyen" }
    ],
    contact: {
      mayor: "Barthélémy Dias",
      phone: "+221 33 849 05 00",
      email: "contact@ville-dakar.sn",
      website: "www.ville-dakar.sn"
    },
    parcels: [
      {
        id: "DK001",
        name: "Terrain Almadies Premium",
        area: "500 m²",
        price: "125,000,000",
        status: "Disponible",
        type: "Résidentiel",
        image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80"
      },
      {
        id: "DK002", 
        name: "Parcelle Mermoz",
        area: "300 m²",
        price: "75,000,000",
        status: "Disponible",
        type: "Résidentiel",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
      },
      {
        id: "DK003",
        name: "Terrain Commercial Plateau",
        area: "800 m²", 
        price: "200,000,000",
        status: "Réservé",
        type: "Commercial",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
      }
    ]
  },
  thies: {
    name: "Thiès",
    region: "Région de Thiès",
    population: "320,000",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    description: "Deuxième ville du Sénégal, Thiès est un carrefour économique stratégique avec un potentiel d'investissement en forte croissance.",
    advantages: [
      "Position géographique stratégique",
      "Coût de la vie abordable",
      "Développement industriel",
      "Potentiel d'appréciation élevé",
      "Proximité de Dakar"
    ],
    stats: {
      parcelsAvailable: 32,
      averagePrice: "25,000,000", 
      demandLevel: "Forte",
      growth: "+20%"
    },
    infrastructure: [
      { name: "Route nationale", icon: Car, status: "Excellent" },
      { name: "Chemin de fer", icon: Car, status: "Bon" },
      { name: "Internet/WiFi", icon: Wifi, status: "Bon" },
      { name: "Électricité", icon: Zap, status: "Bon" },
      { name: "Eau potable", icon: Droplets, status: "Excellent" },
      { name: "Espaces verts", icon: TreePine, status: "Bon" }
    ],
    contact: {
      mayor: "Dr. Babacar Diop",
      phone: "+221 33 951 10 01",
      email: "contact@ville-thies.sn", 
      website: "www.ville-thies.sn"
    },
    parcels: [
      {
        id: "TH001",
        name: "Terrain Résidentiel Centre",
        area: "400 m²",
        price: "35,000,000",
        status: "Disponible",
        type: "Résidentiel",
        image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80"
      },
      {
        id: "TH002",
        name: "Parcelle Commerciale",
        area: "600 m²", 
        price: "45,000,000",
        status: "Disponible",
        type: "Commercial",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
      }
    ]
  }
  // Ajoutez d'autres villes au besoin
};

const CityDetailPage = () => {
  const { cityId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    parcelInterest: ''
  });

  const city = cityData[cityId] || cityData.dakar;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Demande municipale soumise:', formData);
    // Logique de soumission
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(parseInt(price));
  };

  return (
    <>
      <Helmet>
        <title>{city.name} - Terrains et Investissements | Teranga Foncier</title>
        <meta name="description" content={`Découvrez les opportunités d'investissement immobilier à ${city.name}. ${city.description}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white max-w-3xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-6 w-6" />
                  <span className="text-lg">{city.region}</span>
                </div>
                <h1 className="text-5xl font-bold mb-4">{city.name}</h1>
                <p className="text-xl text-gray-200 mb-6">{city.description}</p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 text-white">
                    <Building className="mr-2 h-5 w-5" />
                    Voir les Terrains
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                    <FileText className="mr-2 h-5 w-5" />
                    Faire une Demande
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{city.stats.parcelsAvailable}</div>
                <div className="text-sm text-gray-600">Terrains disponibles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{formatPrice(city.stats.averagePrice)}</div>
                <div className="text-sm text-gray-600">Prix moyen</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{city.stats.demandLevel}</div>
                <div className="text-sm text-gray-600">Niveau de demande</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{city.stats.growth}</div>
                <div className="text-sm text-gray-600">Croissance annuelle</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="parcels" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="parcels">Terrains Disponibles</TabsTrigger>
              <TabsTrigger value="info">Informations Ville</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructures</TabsTrigger>
              <TabsTrigger value="contact">Contact Mairie</TabsTrigger>
            </TabsList>

            <TabsContent value="parcels" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {city.parcels.map((parcel) => (
                  <Card key={parcel.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={parcel.image}
                        alt={parcel.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className={`absolute top-3 right-3 ${
                          parcel.status === 'Disponible'
                            ? 'bg-green-500'
                            : parcel.status === 'Réservé'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {parcel.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{parcel.name}</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600">{parcel.area}</span>
                        <Badge variant="outline">{parcel.type}</Badge>
                      </div>
                      <div className="text-xl font-bold text-primary mb-3">
                        {formatPrice(parcel.price)}
                      </div>
                      <Button className="w-full" asChild>
                        <Link to={`/parcelles/${parcel.id}`}>
                          Voir Détails <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="info" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Avantages de {city.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {city.advantages.map((advantage, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informations Générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population:</span>
                      <span className="font-semibold">{city.population} habitants</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Région:</span>
                      <span className="font-semibold">{city.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Demande:</span>
                      <Badge className="bg-primary">{city.stats.demandLevel}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Croissance:</span>
                      <span className="font-semibold text-green-600">{city.stats.growth}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {city.infrastructure.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <Badge
                          variant="outline"
                          className={
                            item.status === 'Excellent'
                              ? 'border-green-500 text-green-700'
                              : item.status === 'Bon'
                              ? 'border-blue-500 text-blue-700'
                              : 'border-orange-500 text-orange-700'
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Mairie</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Maire</div>
                        <div className="text-gray-600">{city.contact.mayor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Téléphone</div>
                        <a href={`tel:${city.contact.phone}`} className="text-primary hover:underline">
                          {city.contact.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Email</div>
                        <a href={`mailto:${city.contact.email}`} className="text-primary hover:underline">
                          {city.contact.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Site Web</div>
                        <a href={`https://${city.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {city.contact.website}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Faire une Demande Municipale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Nom complet</label>
                        <input
                          type="text"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Téléphone</label>
                        <input
                          type="tel"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type de terrain souhaité</label>
                        <select
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                          value={formData.parcelInterest}
                          onChange={(e) => setFormData({...formData, parcelInterest: e.target.value})}
                        >
                          <option value="">Sélectionner</option>
                          <option value="residential">Résidentiel</option>
                          <option value="commercial">Commercial</option>
                          <option value="industrial">Industriel</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message</label>
                        <textarea
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Envoyer la Demande
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CityDetailPage;
