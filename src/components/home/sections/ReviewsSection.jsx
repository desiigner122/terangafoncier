import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  User, 
  Building, 
  MapPin, 
  Calendar, 
  Quote, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    reviewsCount: 0,
    satisfactionRate: 0,
    propertiesCount: 0,
    usersCount: 0
  });

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          content,
          rating,
          author_name,
          author_role,
          location,
          avatar_url,
          created_at
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.log('Erreur lors du chargement des avis:', error);
        setReviews([]);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.log('Erreur:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [
        { count: reviewsCount },
        { count: propertiesCount },
        { count: usersCount },
        { data: ratingsData }
      ] = await Promise.all([
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', true),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('rating').eq('is_approved', true)
      ]);

      const ratings = ratingsData || [];
      const satisfactionRate = ratings.length > 0
        ? Math.round((ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length / 5) * 100)
        : 0;

      setStats({
        reviewsCount: reviewsCount || 0,
        satisfactionRate,
        propertiesCount: propertiesCount || 0,
        usersCount: usersCount || 0
      });
    } catch (error) {
      console.log('Erreur lors du chargement des statistiques:', error);
      setStats({ reviewsCount: 0, satisfactionRate: 0, propertiesCount: 0, usersCount: 0 });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      'Diaspora': 'bg-blue-100 text-blue-700',
      'Promoteur': 'bg-green-100 text-green-700',
      'Banque': 'bg-purple-100 text-purple-700',
      'Propriétaire': 'bg-orange-100 text-orange-700',
      'Investisseur': 'bg-red-100 text-red-700',
      'default': 'bg-gray-100 text-gray-700'
    };
    return colors[role] || colors.default;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Promoteur': return Building;
      case 'Banque': return Building;
      case 'Diaspora': return User;
      default: return User;
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les avis de nos clients satisfaits : diaspora, promoteurs, banques et propriétaires.
          </p>
        </motion.div>

        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {reviews.map((review, index) => {
              const RoleIcon = getRoleIcon(review.author_role);
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: review.rating || 0 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      {/* Quote Icon */}
                      <Quote className="h-8 w-8 text-primary/20 mb-3" />

                      {/* Content */}
                      <p className="text-gray-700 text-sm mb-6 line-clamp-4 italic">
                        "{review.content}"
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={review.avatar_url}
                          alt={review.author_name || 'Avatar utilisateur'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{review.author_name}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {review.location}
                          </div>
                        </div>
                      </div>

                      {/* Role Badge */}
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getRoleColor(review.author_role)}`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {review.author_role}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 mb-12">Aucun avis disponible pour le moment.</p>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{stats.reviewsCount}</div>
              <div className="text-gray-600 text-sm">Avis Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{stats.satisfactionRate}%</div>
              <div className="text-gray-600 text-sm">Taux de Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{stats.propertiesCount}</div>
              <div className="text-gray-600 text-sm">Biens Disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{stats.usersCount}</div>
              <div className="text-gray-600 text-sm">Utilisateurs Inscrits</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/register">
              Rejoignez-Nous Maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
