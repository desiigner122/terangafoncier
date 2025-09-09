import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Award, 
  Users, 
  Building2, 
  Shield, 
  Eye,
  Heart,
  Share2,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  Clock,
  Camera,
  Edit,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfilePage = () => {
  const { userId, userType } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId, userType]);

  const loadProfile = async () => {
    setLoading(true);
    // Simulation des données de profil selon le type
    const mockProfile = generateMockProfile(userType, userId);
    setProfile(mockProfile);
    setLoading(false);
  };

  const generateMockProfile = (type, id) => {
    const baseProfile = {
      id: id,
      type: type,
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      isVerified: Math.random() > 0.3,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 500) + 10,
      followers: Math.floor(Math.random() * 1000) + 50,
      views: Math.floor(Math.random() * 5000) + 100
    };

    switch (type) {
      case 'vendeur-particulier':
        return {
          ...baseProfile,
          name: 'Amadou Diallo',
          title: 'Propriétaire Foncier',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          location: 'Liberté 6, Dakar',
          phone: '+221 77 123 45 67',
          email: 'amadou.diallo@email.com',
          description: 'Propriétaire de plusieurs terrains dans la région de Dakar. Spécialisé dans la vente de parcelles résidentielles avec tous les documents légaux en règle.',
          specialties: ['Terrains Résidentiels', 'Zones Urbaines', 'Titres Fonciers'],
          stats: {
            properties: 12,
            sold: 8,
            available: 4,
            totalValue: '450M FCFA'
          },
          achievements: ['Vendeur Certifié', 'Documents Vérifiés', 'Transactions Sécurisées']
        };

      case 'vendeur-pro':
        return {
          ...baseProfile,
          name: 'Sénégal Immobilier SARL',
          title: 'Agence Immobilière Professionnelle',
          avatar: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&h=150&fit=crop',
          location: 'Plateau, Dakar',
          phone: '+221 33 821 45 67',
          email: 'contact@senegal-immo.com',
          website: 'www.senegal-immobilier.com',
          description: 'Agence immobilière leader au Sénégal avec plus de 15 ans d\'expérience. Spécialiste des transactions foncières et accompagnement complet.',
          specialties: ['Vente de Terrains', 'Conseil Juridique', 'Évaluation Foncière', 'Négociation'],
          stats: {
            properties: 156,
            sold: 89,
            clients: 340,
            experience: '15 ans'
          },
          achievements: ['Agence Certifiée', 'Top Vendeur 2024', 'Service Client Excellence']
        };

      case 'promoteur':
        return {
          ...baseProfile,
          name: 'Teranga Construction',
          title: 'Promoteur Immobilier',
          avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop',
          location: 'Almadies, Dakar',
          phone: '+221 33 865 12 34',
          email: 'contact@teranga-construction.com',
          website: 'www.teranga-construction.com',
          description: 'Promoteur immobilier de référence au Sénégal. Nous développons des projets résidentiels et commerciaux haut de gamme avec les dernières technologies.',
          specialties: ['Résidences Haut Standing', 'Complexes Commerciaux', 'Smart Buildings', 'Éco-Construction'],
          stats: {
            projects: 24,
            completed: 18,
            ongoing: 6,
            units: 450
          },
          achievements: ['Promoteur de l\'Année 2023', 'Construction Durable', 'Innovation Technologique']
        };

      case 'banque':
        return {
          ...baseProfile,
          name: 'Banque de l\'Habitat du Sénégal',
          title: 'Institution Financière Spécialisée',
          avatar: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=150&h=150&fit=crop',
          location: 'Point E, Dakar',
          phone: '+221 33 889 50 00',
          email: 'info@bhs.sn',
          website: 'www.bhs.sn',
          description: 'Banque spécialisée dans le financement immobilier au Sénégal. Nous proposons des solutions de crédit adaptées à tous les projets fonciers.',
          specialties: ['Crédit Immobilier', 'Financement Terrain', 'Crédit Construction', 'Investissement Locatif'],
          stats: {
            loans: 2340,
            funded: '45 Milliards FCFA',
            clients: 12500,
            rate: '8.5%'
          },
          achievements: ['Banque de l\'Année', 'Meilleur Taux', 'Service Digital']
        };

      case 'geometre':
        return {
          ...baseProfile,
          name: 'Cabinet Géomètre Fall & Associés',
          title: 'Géomètre-Expert Certifié',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          location: 'Mermoz, Dakar',
          phone: '+221 77 654 32 10',
          email: 'contact@geometre-fall.com',
          description: 'Cabinet de géomètres-experts agréés par l\'État du Sénégal. Spécialisé dans la délimitation, le bornage et la cartographie foncière.',
          specialties: ['Bornage de Terrain', 'Levé Topographique', 'Plan de Lotissement', 'Certificat de Superficie'],
          stats: {
            surveys: 890,
            hectares: 12500,
            clients: 670,
            precision: '99.8%'
          },
          achievements: ['Géomètre Agréé État', 'Expertise Judiciaire', 'Technologies Modernes']
        };

      case 'notaire':
        return {
          ...baseProfile,
          name: 'Maître Fatou Sow',
          title: 'Notaire',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616c88d3b0e?w=150&h=150&fit=crop&crop=face',
          location: 'Plateau, Dakar',
          phone: '+221 33 823 15 67',
          email: 'etude.sow@notaires.sn',
          description: 'Notaire expérimentée spécialisée dans les transactions immobilières et foncières. Garantit la sécurité juridique de vos acquisitions.',
          specialties: ['Actes de Vente', 'Succession Foncière', 'Hypothèques', 'Conseil Juridique'],
          stats: {
            acts: 1250,
            transactions: '18 Milliards FCFA',
            clients: 890,
            experience: '12 ans'
          },
          achievements: ['Notaire Assermentée', 'Spécialiste Foncier', 'Médiation Juridique']
        };

      default:
        return baseProfile;
    }
  };

  const getRoleColor = (type) => {
    const colors = {
      'vendeur-particulier': 'bg-blue-500',
      'vendeur-pro': 'bg-purple-500',
      'promoteur': 'bg-orange-500',
      'banque': 'bg-green-500',
      'geometre': 'bg-cyan-500',
      'notaire': 'bg-indigo-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getRoleIcon = (type) => {
    const icons = {
      'vendeur-particulier': Users,
      'vendeur-pro': Building2,
      'promoteur': Award,
      'banque': TrendingUp,
      'geometre': MapPin,
      'notaire': Shield
    };
    const IconComponent = icons[type] || Users;
    return <IconComponent className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Profile */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-2xl">{profile.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {profile.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.name}</h1>
                <Badge className={`${getRoleColor(profile.type)} text-white`}>
                  <div className="flex items-center gap-1">
                    {getRoleIcon(profile.type)}
                    {profile.title}
                  </div>
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{profile.rating}</span>
                  <span>({profile.reviewCount} avis)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{profile.views} vues</span>
                </div>
              </div>

              <p className="text-gray-700 mb-4 max-w-3xl">{profile.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {profile.specialties?.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => setIsFollowing(!isFollowing)}
                variant={isFollowing ? "outline" : "default"}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
                {isFollowing ? 'Suivi' : 'Suivre'}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contacter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(profile.stats).map(([key, value]) => (
                <Card key={key}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications & Réalisations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profile.achievements?.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio & Réalisations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Portfolio en cours de développement...</p>
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
                  <p>Système d'avis en cours de développement...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informations de Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{profile.email}</span>
                </div>
                {profile.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a href={`https://${profile.website}`} className="text-blue-600 hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>Membre depuis {profile.createdAt?.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;
