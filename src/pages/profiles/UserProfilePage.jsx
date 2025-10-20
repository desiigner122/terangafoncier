import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchDirect } from '@/lib/supabaseClient';
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
  Settings,
  AlertTriangle
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
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Correction: The user ID from the URL corresponds to the 'id' column in the 'profiles' table.
      const data = await fetchDirect(`profiles?select=*&id=eq.${userId}`);
      
      if (data && data.length > 0) {
        const userProfile = data[0];
        const mappedProfile = {
          id: userProfile.id,
          name: userProfile.full_name || 'Utilisateur',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          avatar: userProfile.avatar_url || `https://i.pravatar.cc/150?u=${userProfile.id}`,
          location: userProfile.address || 'Non spécifié',
          website: userProfile.website || '',
          role: userProfile.role || 'particulier',
          description: userProfile.bio || 'Aucune description disponible.',
          isVerified: userProfile.is_verified || false,
          createdAt: new Date(userProfile.created_at),
          rating: parseFloat(userProfile.rating || 4.5),
          reviewCount: userProfile.review_count || 0,
          followers: userProfile.followers_count || 0,
          views: userProfile.views_count || 0,
          stats: await loadUserStats(userProfile.id, userProfile.role),
          achievements: generateAchievements(userProfile)
        };
        setProfile(mappedProfile);
      } else {
        // If no profile is found, display a 'not found' state.
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil:', error);
      setProfile(null); // Fallback to null on any error.
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques de l'utilisateur selon son rôle
  const loadUserStats = async (userId, role) => {
    try {
      // Charger les propriétés pour tout utilisateur qui a des propriétés (vendeur, agent, promoteur, particulier)
      if (role && ['vendeur', 'particulier', 'agent-foncier', 'promoteur', 'seller'].includes(role)) {
        // Compter les propriétés
        console.log(`📊 Loading properties for ${role} user ${userId}`);
        const properties = await fetchDirect(
          `properties?select=id,status&owner_id=eq.${userId}`
        );
        
        console.log(`✅ Found ${properties.length} properties`);
        
        const sold = properties.filter(p => p.status === 'sold').length;
        const available = properties.filter(p => p.status === 'active').length;
        
        return {
          properties: properties.length,
          sold: sold,
          available: available,
          totalValue: 'Non disponible'
        };
      }
      return {};
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      return {};
    }
  };

  // Générer les achievements basés sur les données réelles
  const generateAchievements = (profile) => {
    const achievements = [];
    
    if (profile.is_verified) {
      achievements.push('Vendeur Vérifiés');
    }
    if (profile.email_verified) {
      achievements.push('Email Vérifié');
    }
    if (profile.phone_verified) {
      achievements.push('Téléphone Vérifié');
    }
    
    return achievements.length > 0 ? achievements : ['Utilisateur Actif'];
  };

  const generateMockProfile = (type, id) => {
    if (!type || !id) {
      return null;
    }
    
    const baseProfile = {
      id: String(id),
      type: String(type),
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      isVerified: Math.random() > 0.3,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 10,
      followers: Math.floor(Math.random() * 1000) + 50,
      views: Math.floor(Math.random() * 5000) + 100
    };

    switch (String(type).toLowerCase()) {
      case 'vendeur-particulier':
      case 'seller':
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
      case 'seller-pro':
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
      case 'promoter':
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
      case 'bank':
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
      case 'geometer':
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
      case 'notary':
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

      case 'municipality':
        return {
          ...baseProfile,
          name: 'Mairie de Dakar',
          title: 'Administration Municipale',
          avatar: 'https://images.unsplash.com/photo-1555074683-6ad1f02c0d4b?w=150&h=150&fit=crop',
          location: 'Hôtel de Ville, Dakar',
          phone: '+221 33 823 90 00',
          email: 'contact@mairie-dakar.sn',
          website: 'www.villededakar.sn',
          description: 'Administration municipale en charge de la gestion des terres communales et de l\'attribution des parcelles aux citoyens selon les critères légaux.',
          specialties: ['Attribution Terrain', 'Permis de Construire', 'Urbanisme', 'Cadastre Municipal'],
          stats: {
            parcels: 2340,
            attributed: 1850,
            pending: 490,
            area: '83 km²'
          },
          achievements: ['Digitalisation Services', 'Transparence Administrative', 'Développement Durable']
        };

      case 'agent':
      case 'agent-foncier':
        return {
          ...baseProfile,
          name: 'Moussa Ba',
          title: 'Agent Foncier Certifié',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          location: 'Sacré-Cœur, Dakar',
          phone: '+221 77 555 44 33',
          email: 'moussa.ba@agent-foncier.com',
          description: 'Agent foncier expérimenté spécialisé dans l\'accompagnement des transactions immobilières. Expert en négociation et conseil.',
          specialties: ['Négociation', 'Évaluation', 'Conseil Client', 'Documentation'],
          stats: {
            deals: 145,
            clients: 320,
            commission: '3.5%',
            satisfaction: '98%'
          },
          achievements: ['Agent Certifié', 'Top Performer', 'Client Satisfaction']
        };

      case 'investor':
      case 'investisseur':
        return {
          ...baseProfile,
          name: 'Groupe Investissement Teranga',
          title: 'Fonds d\'Investissement Immobilier',
          avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
          location: 'CBAO, Dakar',
          phone: '+221 33 889 77 00',
          email: 'contact@invest-teranga.com',
          website: 'www.invest-teranga.com',
          description: 'Fonds d\'investissement spécialisé dans l\'immobilier et le foncier au Sénégal. Partenaire de choix pour vos projets d\'investissement.',
          specialties: ['Investissement Foncier', 'Capital Risque', 'Développement Projets', 'Conseil Financier'],
          stats: {
            portfolio: '12 Milliards FCFA',
            projects: 45,
            roi: '15.8%',
            partners: 23
          },
          achievements: ['Fonds Certifié', 'Meilleur ROI 2024', 'Partenaire Stratégique']
        };

      default:
        // Profil par défaut si type inconnu
        return {
          ...baseProfile,
          name: 'Utilisateur',
          title: 'Profil',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          location: 'Dakar, Sénégal',
          phone: '+221 XX XXX XX XX',
          email: 'user@teranga-foncier.sn',
          description: 'Profil utilisateur sur Teranga Foncier.',
          specialties: ['Utilisateur'],
          stats: {
            activity: 0,
            joined: 'Récent'
          },
          achievements: []
        };
      }
  };

  const getRoleColor = (role) => {
    const roleMap = {
      'particulier': 'bg-blue-500',
      'seller': 'bg-blue-500',
      'vendeur': 'bg-blue-500',
      'agent-foncier': 'bg-yellow-500',
      'promoteur': 'bg-orange-500',
      'banque': 'bg-green-500',
      'geometre': 'bg-cyan-500',
      'notaire': 'bg-indigo-500',
      'mairie': 'bg-red-500',
      'municipality': 'bg-red-500',
      'investisseur': 'bg-pink-500'
    };
    return roleMap[role] || 'bg-gray-500';
  };

  const getRoleIcon = (role) => {
    const iconMap = {
      'particulier': Users,
      'seller': Users,
      'vendeur': Users,
      'agent-foncier': Users,
      'promoteur': Award,
      'banque': TrendingUp,
      'geometre': MapPin,
      'notaire': Shield,
      'mairie': Building2,
      'municipality': Building2,
      'investisseur': TrendingUp
    };
    const IconComponent = iconMap[role] || Users;
    return <IconComponent className="h-5 w-5" />;
  };

  const getRoleLabel = (role) => {
    const labels = {
      'particulier': 'Particulier',
      'seller': 'Vendeur',
      'vendeur': 'Vendeur',
      'agent-foncier': 'Agent Foncier',
      'promoteur': 'Promoteur',
      'banque': 'Banque',
      'geometre': 'Géomètre',
      'notaire': 'Notaire',
      'mairie': 'Mairie',
      'municipality': 'Municipalité',
      'investisseur': 'Investisseur'
    };
    return labels[role] || 'Utilisateur';
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profil introuvable</h2>
          <p className="text-gray-600 mb-4">
            Les paramètres du profil sont manquants ou invalides.
          </p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Retour à l'accueil
          </Button>
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
                <Badge className={`${getRoleColor(profile.role)} text-white`}>
                  <div className="flex items-center gap-1">
                    {getRoleIcon(profile.role)}
                    {getRoleLabel(profile.role)}
                  </div>
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-gray-600 mb-4 flex-wrap">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
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

              {profile.description && (
                <p className="text-gray-700 mb-4 max-w-3xl">{profile.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-full">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-full">
                    <Mail className="h-4 w-4" />
                    <span className="text-blue-600">{profile.email}</span>
                  </div>
                )}
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
            {profile?.stats && (
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
            )}

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
