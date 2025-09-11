import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Home,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PopularCitiesSection = () => {
  const popularCities = [
    {
      id: 1,
      name: "Dakar",
      region: "RÃ©gion de Dakar",
      properties: 1247,
      averagePrice: "45M FCFA",
      growth: "+12%",
      image: "/api/YOUR_API_KEY/400/300",
      hotspots: ["Almadies", "Plateau", "Point E"]
    },
    {
      id: 2,
      name: "ThiÃ¨s",
      region: "RÃ©gion de ThiÃ¨s",
      properties: 834,
      averagePrice: "18M FCFA",
      growth: "+25%",
      image: "/api/YOUR_API_KEY/400/300",
      hotspots: ["Centre-ville", "Mbour", "Tivaouane"]
    },
    {
      id: 3,
      name: "Saint-Louis",
      region: "RÃ©gion de Saint-Louis",
      properties: 456,
      averagePrice: "15M FCFA",
      growth: "+18%",
      image: "/api/YOUR_API_KEY/400/300",
      hotspots: ["ÃŽle", "Sor", "Ndar Tout"]
    },
    {
      id: 4,
      name: "Kaolack",
      region: "RÃ©gion de Kaolack",
      properties: 523,
      averagePrice: "12M FCFA",
      growth: "+20%",
      image: "/api/YOUR_API_KEY/400/300",
      hotspots: ["Centre", "Ndoffane", "Kahone"]
    },
    {
      id: 5,
      name: "Ziguinchor",
      region: "RÃ©gion de Ziguinchor",
      properties: 289,
      averagePrice: "14M FCFA",
      growth: "+15%",
      image: "/api/YOUR_API_KEY/400/300",
      hotspots: ["Centre", "TilÃ¨ne", "KandÃ©"]
    },
    {
      id: 6,
      name: "Diourbel",
      region: "RÃ©gion de Diourbel",
      properties: 378,
      averagePrice: "10M FCFA",
      growth: "+22%",
      image: "/api/YOUR_API_KEY/400/300",
      hotspots: ["Touba", "MbackÃ©", "Bambey"]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tÃªte */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-orange-100 text-orange-700 mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Villes Populaires
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Villes les Plus DemandÃ©es
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              DÃ©couvrez les destinations immobiliÃ¨res les plus prisÃ©es du SÃ©nÃ©gal
            </p>
          </motion.div>
        </div>

        {/* Grille des villes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {popularCities.map((city, index) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="relative">
                  <img 
                    src={city.image} 
                    alt={city.name}
                    className="w-full h-40 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {city.growth}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-900">{city.name}</h3>
                    <p className="text-sm text-gray-600">{city.region}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        PropriÃ©tÃ©s
                      </span>
                      <span className="font-semibold text-gray-900">{city.properties}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Prix moyen</span>
                      <span className="font-semibold text-orange-600">{city.averagePrice}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Quartiers populaires:</p>
                    <div className="flex flex-wrap gap-1">
                      {city.hotspots.slice(0, 3).map((hotspot, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {hotspot}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-sm">
                    Explorer {city.name}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Statistiques globales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-6 shadow-sm mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">14+</div>
              <div className="text-sm text-gray-600">RÃ©gions couvertes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">3,750</div>
              <div className="text-sm text-gray-600">PropriÃ©tÃ©s disponibles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">+19%</div>
              <div className="text-sm text-gray-600">Croissance moyenne</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">72h</div>
              <div className="text-sm text-gray-600">Temps de rÃ©ponse moyen</div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
            <MapPin className="h-5 w-5 mr-2" />
            Voir toutes les villes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularCitiesSection;
