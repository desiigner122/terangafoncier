import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  ArrowRight,
  Landmark,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CommunalLandsSection = () => {
  const communalLands = [
    {
      id: 1,
      title: "Terrain Communal Thiès",
      location: "Thiès Centre",
      surface: "500m²",
      requirements: "Dossier complet",
      status: "Attribution ouverte",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Parcelle Communale Rufisque",
      location: "Rufisque Est",
      surface: "750m²", 
      requirements: "Résidence obligatoire",
      status: "Attribution ouverte",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Terrain Communal Kaolack",
      location: "Kaolack Nord",
      surface: "400m²",
      requirements: "Projet défini",
      status: "Attribution ouverte",
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-green-100 text-green-700 mb-4">
              <Landmark className="h-4 w-4 mr-2" />
              Parcelles Communales
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Terrains Communaux par Attribution
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Demandez l'attribution de terrains communaux selon les critères officiels
            </p>
          </motion.div>
        </div>

        {/* Grille des parcelles */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {communalLands.map((land, index) => (
            <motion.div
              key={land.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={land.image} 
                    alt={land.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    {land.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{land.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{land.location}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">{land.surface}</span>
                    <span className="font-semibold text-green-600">{land.requirements}</span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Demander attribution
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
            Voir toutes les attributions disponibles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunalLandsSection;
