import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabaseService } from '@/lib/supabaseServiceClient';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Eye,
  Heart,
  Share2,
  MessageSquare,
  CheckCircle,
  Building2,
  TrendingUp,
  Users,
  Calendar,
  Award,
  DollarSign,
  Home,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SellerProfilePage = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadSellerProfile();
    loadSellerProperties();
  }, [sellerId]);

  const loadSellerProfile = async () => {
    setLoading(true);
    try {
      const { data: sellerData, error } = await supabaseService
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();

      if (error || !sellerData) {
        console.error("Erreur lors du chargement du profil vendeur:", error);
        setSeller(null);
        setLoading(false);
        return;
      }

      const profile = sellerData;
      setSeller({
        id: profile.id,
        name: profile.full_name || 'Vendeur',
        type: profile.role || 'Vendeur Particulier',
        avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=300&fit=crop',
        location: profile.address || 'Adresse non spécifiée',
        joinedDate: profile.created_at,
        isVerified: profile.is_verified || false,
        rating: profile.rating || 4.8,
        reviewCount: profile.review_count || 0,
        description: profile.bio || 'Aucune description.',
        phone: profile.phone || 'Non spécifié',
        email: profile.email || 'Non spécifié',
        specialties: ['Terrains Résidentiels', 'Titres Fonciers'],
        stats: {
          totalProperties: 15,
          propertiesSold: 8,
          activeListings: 7,
        },
        certifications: ['Vendeur Certifié Teranga Foncier'],
        languages: ['Français', 'Wolof'],
        serviceAreas: ['Dakar', 'Thiès']
      });
    } catch (error) {
      console.error("Erreur lors du chargement du profil vendeur:", error);
      setSeller(null);
    }
    setLoading(false);
  };

  const loadSellerProperties = async () => {
    // Simulation des propriétés du vendeur
    const mockProperties = [
      {
        id: 1,
        title: 'Terrain Résidentiel 400m²',
        location: 'Liberté 6, Dakar',
        price: '45,000,000 FCFA',
        surface: '400m²',
        type: 'Terrain',
        status: 'Disponible',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
        postedDate: '2024-08-15',
        views: 234,
        interested: 12
      },
      {
        id: 2,
        title: 'Parcelle Commerciale 600m²',
        location: 'Mermoz, Dakar',
        price: '78,000,000 FCFA',
        surface: '600m²',
        type: 'Commercial',
        status: 'Négociation',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
        postedDate: '2024-07-20',
        views: 189,
        interested: 8
      },
      {
        id: 3,
        title: 'Grand Terrain 800m²',
        location: 'Sacré-Cœur, Dakar',
        price: '95,000,000 FCFA',
        surface: '800m²',
        type: 'Terrain',
        status: 'Disponible',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
        postedDate: '2024-08-01',
        views: 345,
        interested: 18
      }
    ];
    setProperties(mockProperties);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'Négociation': return 'bg-yellow-100 text-yellow-800';
      case 'Vendu': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil vendeur...</p>
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
          style={{ backgroundImage: `url(${seller.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={seller.avatar} alt={seller.name} />
                  <AvatarFallback className="text-2xl">{seller.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {seller.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
                  <Badge className="bg-blue-500 text-white">
                    <Users className="h-4 w-4 mr-1" />
                    {seller.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{seller.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{seller.rating}</span>
                    <span>({seller.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Membre depuis {new Date(seller.joinedDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {seller.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
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
            <Tabs defaultValue="properties" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="properties">Biens ({properties.length})</TabsTrigger>
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({seller.reviewCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="space-y-6">
                {/* Properties Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Biens disponibles</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Properties Grid */}
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-3 right-3 ${getStatusColor(property.status)}`}>
                          {property.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                        <div className="flex items-center gap-1 text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-2xl font-bold text-blue-600">{property.price}</div>
                          <div className="text-sm text-gray-500">{property.surface}</div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                          <span>{property.views} vues</span>
                          <span>{property.interested} intéressés</span>
                        </div>
                        <Button className="w-full">Voir les détails</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de {seller.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{seller.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Zones de service</h4>
                      <div className="flex flex-wrap gap-2">
                        {seller.serviceAreas.map((area, index) => (
                          <Badge key={index} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Langues parlées</h4>
                      <div className="flex flex-wrap gap-2">
                        {seller.languages.map((language, index) => (
                          <Badge key={index} variant="outline">{language}</Badge>
                        ))}
                      </div>
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
                {Object.entries(seller.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
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
                  <span>{seller.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{seller.email}</span>
                </div>
                <Button className="w-full mt-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Envoyer un message
                </Button>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seller.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
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

export default SellerProfilePage;
