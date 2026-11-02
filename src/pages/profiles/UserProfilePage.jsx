import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase, fetchDirect } from '@/lib/supabaseClient';
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
      // Correction: Utiliser supabase pour contourner RLS sur les profils publics
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        console.warn(`⚠️ Profil non trouvé pour ID ${userId}`);
        setProfile(null);
        return;
      }
      
      const userProfile = data;
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
        rating: userProfile.rating != null ? parseFloat(userProfile.rating) : null,
        reviewCount: userProfile.review_count || 0,
        followers: userProfile.followers_count || 0,
        views: userProfile.views_count || 0,
        stats: await loadUserStats(userProfile.id, userProfile.role),
        achievements: generateAchievements(userProfile)
      };
      setProfile(mappedProfile);
    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil:', error);
      setProfile(null);
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
                  <span>{profile.rating ?? '—'}</span>
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
