import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  TrendingUp,
  Building,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// Détermine un niveau de demande à partir du nombre réel de parcelles trouvées pour la ville
const getDemandLevel = (count) => {
  if (count >= 150) return { label: 'Très Élevée', color: 'text-red-500' };
  if (count >= 60) return { label: 'Élevée', color: 'text-orange-500' };
  return { label: 'Modérée', color: 'text-green-500' };
};

const PopularCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('city, region, price');

        if (error) {
          console.error('Erreur lors du chargement des villes:', error);
          setCities([]);
          return;
        }

        const grouped = {};
        (data || []).forEach((row) => {
          if (!row.city) return;
          if (!grouped[row.city]) {
            grouped[row.city] = { name: row.city, region: row.region, count: 0, totalPrice: 0, priceCount: 0 };
          }
          grouped[row.city].count += 1;
          if (row.price) {
            grouped[row.city].totalPrice += Number(row.price);
            grouped[row.city].priceCount += 1;
          }
          if (!grouped[row.city].region && row.region) {
            grouped[row.city].region = row.region;
          }
        });

        const list = Object.values(grouped)
          .map((c) => ({
            id: c.name.toLowerCase().replace(/\s+/g, '-'),
            name: c.name,
            region: c.region || '',
            availableParcels: c.count,
            averagePrice: c.priceCount > 0 ? Math.round(c.totalPrice / c.priceCount) : null,
            demand: getDemandLevel(c.count)
          }))
          .sort((a, b) => b.availableParcels - a.availableParcels)
          .slice(0, 6);

        setCities(list);
      } catch (error) {
        console.error('Erreur:', error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : cities.length === 0 ? (
          <p className="text-center text-gray-500">Aucune donnée de ville disponible pour le moment.</p>
        ) : (
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
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{city.name}</h3>
                        {city.region && (
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {city.region}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className={`${city.demand.color} bg-white/90`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {city.demand.label}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-bold text-gray-900">{city.availableParcels}</div>
                        <div className="text-gray-500 text-xs">Parcelles</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-bold text-primary">
                          {city.averagePrice ? `${city.averagePrice.toLocaleString()} F` : 'N/A'}
                        </div>
                        <div className="text-gray-500 text-xs">Prix moyen</div>
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
        )}

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
