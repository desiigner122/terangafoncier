import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  TrendingUp,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';

const PopularCitiesSection = () => {
  const [popularCities, setPopularCities] = useState([]);
  const [globalStats, setGlobalStats] = useState({ regions: 0, properties: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propertiesRes, totalCountRes] = await Promise.all([
          supabase.from('properties').select('city, region, price'),
          supabase.from('properties').select('id', { count: 'exact', head: true })
        ]);

        if (propertiesRes.error) {
          console.error('Erreur lors du chargement des villes:', propertiesRes.error);
          setPopularCities([]);
          setGlobalStats({ regions: 0, properties: 0 });
          return;
        }

        const rows = propertiesRes.data || [];
        const grouped = {};
        const regions = new Set();

        rows.forEach((row) => {
          if (row.region) regions.add(row.region);
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
            properties: c.count,
            averagePrice: c.priceCount > 0 ? Math.round(c.totalPrice / c.priceCount) : null
          }))
          .sort((a, b) => b.properties - a.properties)
          .slice(0, 6);

        setPopularCities(list);
        setGlobalStats({
          regions: regions.size,
          properties: totalCountRes.count || 0
        });
      } catch (error) {
        console.error('Erreur:', error);
        setPopularCities([]);
        setGlobalStats({ regions: 0, properties: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
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
              Villes les Plus Demandées
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les destinations immobilières les plus prisées du Sénégal
            </p>
          </motion.div>
        </div>

        {/* Grille des villes */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : popularCities.length === 0 ? (
          <p className="text-center text-gray-500 mb-8">Aucune donnée de ville disponible pour le moment.</p>
        ) : (
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
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-gray-900">{city.name}</h3>
                      {city.region && <p className="text-sm text-gray-600">{city.region}</p>}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Home className="h-4 w-4 mr-1" />
                          Propriétés
                        </span>
                        <span className="font-semibold text-gray-900">{city.properties}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Prix moyen</span>
                        <span className="font-semibold text-orange-600">
                          {city.averagePrice ? `${city.averagePrice.toLocaleString()} FCFA` : 'N/A'}
                        </span>
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
        )}

        {/* Statistiques globales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-6 shadow-sm mb-8"
        >
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {loading ? '…' : globalStats.regions}
              </div>
              <div className="text-sm text-gray-600">Régions couvertes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {loading ? '…' : globalStats.properties}
              </div>
              <div className="text-sm text-gray-600">Propriétés disponibles</div>
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
