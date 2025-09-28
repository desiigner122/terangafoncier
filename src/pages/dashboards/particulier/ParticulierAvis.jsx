import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  Calendar,
  Filter,
  Search,
  Smartphone,
  Globe,
  Shield,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierAvis = () => {
  const [activeTab, setActiveTab] = useState('donner-avis');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    category: '',
    title: '',
    review: '',
    recommend: null,
    anonymous: false
  });

  // Statistiques des avis
  const reviewStats = {
    totalReviews: 2847,
    averageRating: 4.6,
    ratingDistribution: [
      { stars: 5, count: 1823, percentage: 64 },
      { stars: 4, count: 682, percentage: 24 },
      { stars: 3, count: 227, percentage: 8 },
      { stars: 2, count: 85, percentage: 3 },
      { stars: 1, count: 30, percentage: 1 }
    ],
    satisfaction: 92,
    recommendation: 89
  };

  // Avis récents des utilisateurs
  const recentReviews = [
    {
      id: 1,
      user: "Fatou D.",
      userType: "Acheteur Vérifié",
      rating: 5,
      title: "Excellent service pour l'achat de mon terrain",
      review: "J'ai acheté un terrain à Saly via la plateforme. Le processus était transparent, les documents vérifiés et le paiement échelonné m'a beaucoup aidé. Je recommande vivement !",
      date: "2024-03-20",
      category: "Achat Terrain",
      helpful: 23,
      verified: true
    },
    {
      id: 2,
      user: "Mamadou S.",
      userType: "Diaspora - France",
      rating: 5,
      title: "Parfait pour acheter depuis l'étranger",
      review: "Vivant en France, j'ai pu acheter ma parcelle au Sénégal en toute sécurité. La blockchain et les vérifications notariales donnent une vraie confiance.",
      date: "2024-03-18",
      category: "Diaspora",
      helpful: 18,
      verified: true
    },
    {
      id: 3,
      user: "Aissatou N.",
      userType: "Première Acheteuse",
      rating: 4,
      title: "Interface intuitive, accompagnement au top",
      review: "Premier achat immobilier et l'équipe m'a accompagnée à chaque étape. L'IA m'a aidé à choisir le bon terrain selon mon budget.",
      date: "2024-03-15",
      category: "Expérience Utilisateur",
      helpful: 15,
      verified: true
    },
    {
      id: 4,
      user: "Ibrahima F.",
      userType: "Investisseur",
      rating: 5,
      title: "Transparence et sécurité blockchain",
      review: "Les NFTs des terrains et la traçabilité blockchain offrent une sécurité inégalée. J'ai acheté 3 parcelles pour mon portefeuille d'investissement.",
      date: "2024-03-12",
      category: "Blockchain",
      helpful: 21,
      verified: true
    },
    {
      id: 5,
      user: "Aminata B.",
      userType: "Utilisatrice Mobile",
      rating: 4,
      title: "Application mobile très pratique",
      review: "L'app mobile permet de suivre les annonces, recevoir des alertes et même visiter en réalité augmentée. Très innovant !",
      date: "2024-03-10",
      category: "Application Mobile",
      helpful: 12,
      verified: true
    }
  ];

  const handleSubmitReview = () => {
    if (rating === 0 || !reviewForm.title || !reviewForm.review) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Logique de soumission de l'avis
    console.log('Avis soumis:', { rating, ...reviewForm });
    
    // Reset form
    setRating(0);
    setReviewForm({
      category: '',
      title: '',
      review: '',
      recommend: null,
      anonymous: false
    });
    
    alert('Merci pour votre avis ! Il sera publié après modération.');
  };

  const renderStars = (currentRating, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            (interactive ? hoverRating || rating : currentRating) >= starValue
              ? 'text-yellow-500 fill-current'
              : 'text-gray-300'
          }`}
          onClick={interactive ? () => setRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        />
      );
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Avis & Évaluations</h1>
        <p className="text-gray-600">Partagez votre expérience et consultez les avis de la communauté TerangaFoncier</p>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-yellow-500 mr-2" />
              <span className="text-3xl font-bold text-gray-900">{reviewStats.averageRating}</span>
            </div>
            <p className="text-gray-600 text-sm">Note moyenne</p>
            <div className="flex justify-center mt-2">
              {renderStars(reviewStats.averageRating)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-3xl font-bold text-gray-900">{reviewStats.totalReviews.toLocaleString()}</span>
            </div>
            <p className="text-gray-600 text-sm">Avis reçus</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <ThumbsUp className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-3xl font-bold text-gray-900">{reviewStats.satisfaction}%</span>
            </div>
            <p className="text-gray-600 text-sm">Satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-purple-600 mr-2" />
              <span className="text-3xl font-bold text-gray-900">{reviewStats.recommendation}%</span>
            </div>
            <p className="text-gray-600 text-sm">Recommandations</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution des notes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Répartition des notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reviewStats.ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{item.stars}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{item.count}</span>
                <span className="text-sm text-gray-500 w-8">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="donner-avis">Donner un Avis</TabsTrigger>
          <TabsTrigger value="consulter-avis">Consulter les Avis</TabsTrigger>
        </TabsList>

        {/* Donner un avis */}
        <TabsContent value="donner-avis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partagez votre expérience</CardTitle>
              <CardDescription>
                Votre avis aide la communauté à prendre de meilleures décisions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Note */}
              <div>
                <label className="text-sm font-medium mb-2 block">Votre note *</label>
                <div className="flex items-center gap-2">
                  {renderStars(rating, true)}
                  <span className="text-sm text-gray-600 ml-2">
                    {rating > 0 && `${rating}/5`}
                  </span>
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <Select value={reviewForm.category} onValueChange={(value) => setReviewForm({...reviewForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achat-terrain">Achat de Terrain</SelectItem>
                    <SelectItem value="application-mobile">Application Mobile</SelectItem>
                    <SelectItem value="blockchain">Blockchain & Sécurité</SelectItem>
                    <SelectItem value="service-client">Service Client</SelectItem>
                    <SelectItem value="diaspora">Services Diaspora</SelectItem>
                    <SelectItem value="financement">Options de Financement</SelectItem>
                    <SelectItem value="experience-generale">Expérience Générale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Titre */}
              <div>
                <label className="text-sm font-medium mb-2 block">Titre de l'avis *</label>
                <Input
                  placeholder="Résumez votre expérience en quelques mots"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                />
              </div>

              {/* Avis détaillé */}
              <div>
                <label className="text-sm font-medium mb-2 block">Votre avis *</label>
                <Textarea
                  placeholder="Décrivez votre expérience en détail..."
                  rows={4}
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                />
              </div>

              {/* Recommandation */}
              <div>
                <label className="text-sm font-medium mb-2 block">Recommanderiez-vous TerangaFoncier ?</label>
                <div className="flex gap-4">
                  <Button
                    variant={reviewForm.recommend === true ? "default" : "outline"}
                    onClick={() => setReviewForm({...reviewForm, recommend: true})}
                    className="flex-1"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Oui, je recommande
                  </Button>
                  <Button
                    variant={reviewForm.recommend === false ? "default" : "outline"}
                    onClick={() => setReviewForm({...reviewForm, recommend: false})}
                    className="flex-1"
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Non, je ne recommande pas
                  </Button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={reviewForm.anonymous}
                  onChange={(e) => setReviewForm({...reviewForm, anonymous: e.target.checked})}
                />
                <label htmlFor="anonymous" className="text-sm text-gray-600">
                  Publier anonymement
                </label>
              </div>

              {/* Submit */}
              <Button 
                onClick={handleSubmitReview}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Publier mon avis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consulter les avis */}
        <TabsContent value="consulter-avis" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Rechercher dans les avis..." className="pl-10" />
                  </div>
                </div>
                
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="achat-terrain">Achat de Terrain</SelectItem>
                    <SelectItem value="application-mobile">Application Mobile</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="diaspora">Diaspora</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Note" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes notes</SelectItem>
                    <SelectItem value="5">5 étoiles</SelectItem>
                    <SelectItem value="4">4 étoiles</SelectItem>
                    <SelectItem value="3">3 étoiles</SelectItem>
                    <SelectItem value="2">2 étoiles</SelectItem>
                    <SelectItem value="1">1 étoile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des avis */}
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{review.user.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user}</span>
                        {review.verified && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{review.userType}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <Badge variant="outline">{review.category}</Badge>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                <p className="text-gray-700 mb-4">{review.review}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.date).toLocaleDateString('fr-FR')}
                    </span>
                    <button className="flex items-center gap-1 hover:text-blue-600">
                      <ThumbsUp className="w-4 h-4" />
                      Utile ({review.helpful})
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline">
              Voir plus d'avis
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierAvis;