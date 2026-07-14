import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  DollarSign,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Home,
  Calendar
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const FeaturedParcels = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredParcels, setFeaturedParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedParcels = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, name, description, type, price, surface, location, city, region, status, verification_status, ai_score, views_count, created_at')
          .eq('status', 'disponible')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;

        const properties = data || [];
        const propertyIds = properties.map((p) => p.id);
        let photosByProperty = {};

        if (propertyIds.length > 0) {
          const { data: photos, error: photosError } = await supabase
            .from('property_photos')
            .select('property_id, url, is_primary')
            .in('property_id', propertyIds);

          if (!photosError && photos) {
            photos.forEach((photo) => {
              if (!photosByProperty[photo.property_id] || photo.is_primary) {
                photosByProperty[photo.property_id] = photo.url;
              }
            });
          }
        }

        const formatted = properties.map((p) => {
          const surface = p.surface || 0;
          const daysOnMarket = p.created_at
            ? Math.max(0, Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)))
            : 0;
          return {
            id: p.id,
            title: p.title || p.name || 'Terrain',
            location: [p.city, p.region].filter(Boolean).join(', ') || p.location || '',
            size: surface ? `${surface.toLocaleString()} m²` : '',
            price: p.price || 0,
            pricePerSqm: surface ? Math.round((p.price || 0) / surface) : 0,
            image: photosByProperty[p.id] || null,
            type: p.type || 'standard',
            verified: p.verification_status === 'verified',
            trending: (p.ai_score || 0) >= 80,
            description: p.description || '',
            daysOnMarket
          };
        });

        setFeaturedParcels(formatted);
      } catch (err) {
        console.error('Erreur chargement terrains vedettes:', err);
        setFeaturedParcels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedParcels();
  }, []);

  const parcelsPerView = 3;
  const maxIndex = Math.max(0, featuredParcels.length - parcelsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'intelligent': return <Zap className="h-4 w-4" />;
      case 'diaspora': return <Users className="h-4 w-4" />;
      case 'commercial': return <DollarSign className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'intelligent': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'diaspora': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'commercial': return 'bg-green-100 text-green-700 border-green-200';
      case 'agricole': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredParcels.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            <Star className="h-4 w-4 mr-2" />
            Sélection Premium
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Terrains en Vedette
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Découvrez notre sélection de terrains exceptionnels, vérifiés et prêts à l'achat. 
            Des opportunités uniques dans tout le Sénégal.
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="text-sm text-gray-500">
              {currentIndex + 1} - {Math.min(currentIndex + parcelsPerView, featuredParcels.length)} sur {featuredParcels.length}
            </div>
            
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: -currentIndex * (100 / parcelsPerView) + '%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ width: `${(featuredParcels.length / parcelsPerView) * 100}%` }}
          >
            {featuredParcels.map((parcel) => (
              <motion.div
                key={parcel.id}
                className="flex-none"
                style={{ width: `${100 / featuredParcels.length}%` }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow group">
                  <div className="relative">
                    {parcel.image ? (
                      <img
                        src={parcel.image}
                        alt={parcel.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                        <Home className="h-10 w-10 text-gray-300" />
                      </div>
                    )}

                    {/* Overlays */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge className={`${getTypeColor(parcel.type)} flex items-center gap-1`}>
                        {getTypeIcon(parcel.type)}
                        {parcel.type}
                      </Badge>
                      
                      {parcel.verified && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>

                    {parcel.trending && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Tendance
                        </Badge>
                      </div>
                    )}

                    {/* Prix */}
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2">
                        <div className="text-lg font-bold text-gray-900">
                          {parcel.price.toLocaleString()} F
                        </div>
                        <div className="text-xs text-gray-500">
                          {parcel.pricePerSqm.toLocaleString()} F/m²
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        {parcel.title}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {parcel.location}
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {parcel.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-bold text-gray-900">{parcel.size}</div>
                        <div className="text-gray-500 text-xs">Superficie</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-bold text-gray-900 flex items-center justify-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {parcel.daysOnMarket}j
                        </div>
                        <div className="text-gray-500 text-xs">En ligne</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <Link to={`/purchase/${parcel.id}`}>
                            Acheter
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="flex-1">
                          <Link to={parcel.type === 'intelligent' ? `/terrain-intelligent/${parcel.id}` : `/parcelles/${parcel.id}`}>
                            Détails
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline">
            <Link to="/parcelles">
              Voir Tous les Terrains
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
      <div className="text-center mt-12">
        <Button variant="outline" size="lg" asChild className="hover:bg-primary/5 hover:border-primary transition-colors">
          <Link to="/parcelles">Découvrir Toutes les Parcelles <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedParcels;