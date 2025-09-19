import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  MapPin,
  TrendingUp,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const CitiesPreview = () => {
  const topCities = [
    {
      name: "Dakar",
      properties: 1247,
      growth: "+12%",
      image: "/api/YOUR_API_KEY/150/100"
    },
    {
      name: "Thiès",
      properties: 834,
      growth: "+25%",
      image: "/api/YOUR_API_KEY/150/100"
    },
    {
      name: "Saint-Louis",
      properties: 456,
      growth: "+18%",
      image: "/api/YOUR_API_KEY/150/100"
    }
  ];

  return (
    <section className="py-16 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-orange-100 text-orange-700 mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tendances du Marché
            </Badge>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Villes les Plus Demandées
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Découvrez les destinations immobilières en pleine croissance 
              avec des opportunités d'investissement attractives.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">14+</div>
                  <div className="text-sm text-gray-600">Régions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">3,750</div>
                  <div className="text-sm text-gray-600">Propriétés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">+19%</div>
                  <div className="text-sm text-gray-600">Croissance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">72h</div>
                  <div className="text-sm text-gray-600">Réponse</div>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
              <Link to="/villes-populaires">
                Explorer toutes les villes
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Villes top 3 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {topCities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={city.image} 
                        alt={city.name}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{city.name}</h3>
                          <Badge className="bg-orange-100 text-orange-700 text-xs">
                            {city.growth}
                          </Badge>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Home className="h-4 w-4 mr-1" />
                          <span>{city.properties} propriétés</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Et 11 autres villes disponibles
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CitiesPreview;
