import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Building,
  Landmark,
  ArrowRight,
  Star
} from 'lucide-react';

const PopularCities = () => {
  const cities = [
    {
      id: 'dakar',
      name: 'Dakar',
      region: 'Région de Dakar',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      demandLevel: 'Très Élevée',
      demandColor: 'text-red-500',
      availableParcels: 245,
      averagePrice: 85000,
      description: 'Capital économique du Sénégal, zones d\'extension Pikine, Guédiawaye',
      advantages: [
        'Proximité centre économique',
        'Infrastructure développée',
        'Transport public',
        'Opportunités d\'emploi'
      ],
      communalRequests: 89,
      trending: true
    },
    {
      id: 'thies',
      name: 'Thiès',
      region: 'Région de Thiès',
      image: 'https://images.unsplash.com/photo-1571041804726-53e8bf082096?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      demandLevel: 'Élevée',
      demandColor: 'text-orange-500',
      availableParcels: 156,
      averagePrice: 35000,
      description: 'Ville industrielle en pleine expansion, idéale pour l\'investissement',
      advantages: [
        'Prix abordables',
        'Développement industriel',
        'Accès autoroute Dakar',
        'Climat favorable'
      ],
      communalRequests: 67,
      trending: false
    },
    {
      id: 'mbour',
      name: 'Mbour',
      region: 'Région de Thiès',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      demandLevel: 'Très Élevée',
      demandColor: 'text-red-500',
      availableParcels: 198,
      averagePrice: 45000,
      description: 'Zone touristique Saly-Portudal, forte demande diaspora',
      advantages: [
        'Zone touristique',
        'Plages attractives',
        'Investissement diaspora',
        'Potentiel locatif élevé'
      ],
      communalRequests: 134,
      trending: true
    },
    {
      id: 'saint-louis',
      name: 'Saint-Louis',
      region: 'Région de Saint-Louis',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      demandLevel: 'Modérée',
      demandColor: 'text-green-500',
      availableParcels: 87,
      averagePrice: 25000,
      description: 'Ville historique UNESCO, patrimoine culturel exceptionnel',
      advantages: [
        'Patrimoine UNESCO',
        'Prix attractifs',
        'Potentiel touristique',
        'Culture riche'
      ],
      communalRequests: 43,
      trending: false
    },
    {
      id: 'kaolack',
      name: 'Kaolack',
      region: 'Région de Kaolack',
      image: 'https://images.unsplash.com/photo-1571041804726-53e8bf082096?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      demandLevel: 'Élevée',
      demandColor: 'text-orange-500',
      availableParcels: 123,
      averagePrice: 28000,
      description: 'Centre commercial et agricole, carrefour économique',
      advantages: [
        'Centre commercial',
        'Zone agricole riche',
        'Carrefour routier',
        'Développement rapide'
      ],
      communalRequests: 56,
      trending: false
    },
    {
      id: 'ziguinchor',
      name: 'Ziguinchor',
      region: 'Région de Ziguinchor',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      demandLevel: 'Modérée',
      demandColor: 'text-green-500',
      availableParcels: 76,
      averagePrice: 30000,
      description: 'Capitale de la Casamance, nature luxuriante',
      advantages: [
        'Nature préservée',
        'Tourisme écologique',
        'Agriculture fertile',
        'Calme et sérénité'
      ],
      communalRequests: 34,
      trending: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            <Landmark className="h-4 w-4 mr-2" />
            Villes Partenaires
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Villes les Plus Demandées
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les villes où la demande de terrains est la plus forte. 
            Soumettez vos demandes directement aux mairies partenaires.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cities.map((city) => (
            <motion.div key={city.id} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="relative">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  
                  {/* Overlay avec badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`${city.demandColor} bg-white/90 backdrop-blur-sm`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {city.demandLevel}
                    </Badge>
                    
                    {city.trending && (
                      <Badge className="bg-red-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Tendance
                      </Badge>
                    )}
                  </div>

                  {/* Demandes communales */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                      {city.communalRequests} demandes
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{city.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {city.region}
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {city.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-gray-900">{city.availableParcels}</div>
                      <div className="text-gray-500 text-xs">Parcelles</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-primary">{city.averagePrice.toLocaleString()} F</div>
                      <div className="text-gray-500 text-xs">Prix moyen/m²</div>
                    </div>
                  </div>

                  {/* Avantages */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Avantages clés:</h4>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {city.advantages.slice(0, 4).map((advantage, index) => (
                        <div key={index} className="flex items-center text-gray-600">
                          <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                          {advantage}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button asChild size="sm" className="w-full">
                      <Link to={`/ville/${city.id}`}>
                        <Building className="h-4 w-4 mr-2" />
                        Voir la Ville
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/parcelles?zone=${city.id}`}>
                        Terrains Disponibles
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline">
            <Link to="/villes-partenaires">
              <Landmark className="h-5 w-5 mr-2" />
              Voir Toutes les Villes Partenaires
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCities;
