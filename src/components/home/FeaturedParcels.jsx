import React, { useState } from 'react';
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

const FeaturedParcels = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredParcels = [
    {
      id: 'TF-2024-001',
      title: 'Terrain Premium Almadies',
      location: 'Almadies, Dakar',
      size: '500 m²',
      price: 45000000,
      pricePerSqm: 90000,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'intelligent',
      verified: true,
      trending: true,
      features: ['Vue mer', 'Viabilisé', 'Titre foncier'],
      description: 'Magnifique terrain avec vue sur océan dans le quartier prestigieux des Almadies.',
      seller: 'Amadou Diallo',
      daysOnMarket: 15
    },
    {
      id: 'TF-2024-002',
      title: 'Parcelle Résidentielle Saly',
      location: 'Saly Portudal, Mbour',
      size: '800 m²',
      price: 32000000,
      pricePerSqm: 40000,
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'standard',
      verified: true,
      trending: false,
      features: ['Zone touristique', 'Proche plage', 'Accès route'],
      description: 'Terrain idéal pour construction de villa dans la zone touristique de Saly.',
      seller: 'Fatou Ndiaye',
      daysOnMarket: 8
    },
    {
      id: 'TF-2024-003',
      title: 'Terrain Commercial Thiès',
      location: 'Centre-ville, Thiès',
      size: '1200 m²',
      price: 24000000,
      pricePerSqm: 20000,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'commercial',
      verified: true,
      trending: true,
      features: ['Zone commerciale', 'Grande superficie', 'Bien situé'],
      description: 'Parfait pour projet commercial ou résidentiel dans le centre de Thiès.',
      seller: 'Moussa Sow',
      daysOnMarket: 22
    },
    {
      id: 'TF-2024-004',
      title: 'Parcelle Agricole Kaolack',
      location: 'Périphérie, Kaolack',
      size: '2000 m²',
      price: 18000000,
      pricePerSqm: 9000,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'agricole',
      verified: true,
      trending: false,
      features: ['Sol fertile', 'Accès eau', 'Grande taille'],
      description: 'Terrain agricole avec excellent potentiel pour cultures maraîchères.',
      seller: 'Awa Ba',
      daysOnMarket: 12
    },
    {
      id: 'TF-2024-005',
      title: 'Terrain Diaspora Saint-Louis',
      location: 'Sor, Saint-Louis',
      size: '600 m²',
      price: 15000000,
      pricePerSqm: 25000,
      image: 'https://images.unsplash.com/photo-1571041804726-53e8bf082096?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'diaspora',
      verified: true,
      trending: true,
      features: ['Suivi distance', 'Prix diaspora', 'Construction pilotée'],
      description: 'Spécialement conçu pour la diaspora avec suivi de construction.',
      seller: 'Teranga Construction',
      daysOnMarket: 5
    },
    {
      id: 'TF-2024-006',
      title: 'Parcelle Urbaine Ziguinchor',
      location: 'Centre-ville, Ziguinchor',
      size: '400 m²',
      price: 12000000,
      pricePerSqm: 30000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'standard',
      verified: true,
      trending: false,
      features: ['Centre-ville', 'Calme', 'Nature proche'],
      description: 'Terrain paisible au cœur de la capitale casamançaise.',
      seller: 'Ibrahima Cissé',
      daysOnMarket: 18
    }
  ];

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
                    <img
                      src={parcel.image}
                      alt={parcel.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    
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

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {parcel.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button asChild size="sm" className="w-full">
                        <Link to={parcel.type === 'intelligent' ? `/terrain-intelligent/${parcel.id}` : `/parcelles/${parcel.id}`}>
                          Voir les Détails
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      
                      <div className="text-xs text-gray-500 text-center">
                        Vendu par {parcel.seller}
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