import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  ArrowRight,
  User,
  Building2,
  Star,
  Verified
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SellersSection = () => {
  const particularSellers = [
    {
      id: 1,
      title: "Villa R+2 Almadies",
      seller: "Moussa Diop",
      location: "Almadies, Dakar",
      surface: "400m²",
      price: "85M FCFA",
      rating: 4.8,
      verified: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Terrain Résidentiel Keur Massar",
      seller: "Awa Ndiaye",
      location: "Keur Massar",
      surface: "600m²",
      price: "25M FCFA",
      rating: 4.6,
      verified: true,
      image: "/api/placeholder/300/200"
    }
  ];

  const professionalSellers = [
    {
      id: 1,
      title: "Résidence Les Palmiers",
      seller: "Teranga Immobilier",
      location: "Guédiawaye",
      units: "12 appartements",
      priceRange: "35-50M FCFA",
      rating: 4.9,
      verified: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Lotissement Moderne",
      seller: "Sénégal Construction",
      location: "Sébikotane",
      units: "50 parcelles",
      priceRange: "15-30M FCFA",
      rating: 4.7,
      verified: true,
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Vendeurs Particuliers */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-blue-100 text-blue-700 mb-4">
                <User className="h-4 w-4 mr-2" />
                Vendeurs Particuliers
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Propriétés de Particuliers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Biens immobiliers vendus directement par leurs propriétaires
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Transactions et communications via votre dashboard sécurisé
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {particularSellers.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    {property.verified && (
                      <Badge className="absolute top-3 right-3 bg-blue-500 text-white">
                        <Verified className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Par {property.seller}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{property.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">{property.surface}</span>
                      <span className="font-bold text-blue-600">{property.price}</span>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Voir détails
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              Accéder au dashboard vendeurs particuliers
            </Button>
          </div>
        </div>

        {/* Vendeurs Professionnels */}
        <div>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-purple-100 text-purple-700 mb-4">
                <Building2 className="h-4 w-4 mr-2" />
                Vendeurs Professionnels
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Projets Immobiliers Professionnels
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Développements immobiliers par des professionnels certifiés
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Négociations et suivi via votre dashboard personnalisé
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {professionalSellers.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    {project.verified && (
                      <Badge className="absolute top-3 right-3 bg-purple-500 text-white">
                        <Verified className="h-3 w-3 mr-1" />
                        Certifié
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Par {project.seller}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{project.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">{project.units}</span>
                      <span className="font-bold text-purple-600">{project.priceRange}</span>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Voir le projet
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
              Accéder au dashboard projets professionnels
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellersSection;
