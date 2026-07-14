import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabaseClient';

const CITY_NAMES = ["Dakar", "Thiès", "Saint-Louis"];
const CITY_PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=150&h=100&fit=crop&crop=center";

const CitiesPreview = () => {
  const [topCities, setTopCities] = useState([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCitiesData = async () => {
      try {
        const [cityResults, totalRes] = await Promise.all([
          Promise.all(
            CITY_NAMES.map((name) =>
              supabase.from('properties').select('id', { count: 'exact', head: true }).eq('city', name)
            )
          ),
          supabase.from('properties').select('id', { count: 'exact', head: true })
        ]);

        setTopCities(
          CITY_NAMES.map((name, index) => ({
            name,
            properties: cityResults[index]?.count || 0,
            image: CITY_PLACEHOLDER_IMAGE
          }))
        );
        setTotalProperties(totalRes?.count || 0);
      } catch (error) {
        console.error('Erreur chargement des villes:', error);
        setTopCities([]);
      } finally {
        setLoading(false);
      }
    };

    loadCitiesData();
  }, []);

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
                  <div className="text-2xl font-bold text-orange-600">{totalProperties.toLocaleString('fr-FR')}</div>
                  <div className="text-sm text-gray-600">Propriétés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">0%</div>
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
            {loading ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="h-20 rounded-lg border bg-white animate-pulse" />
              ))
            ) : topCities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucune donnée de ville disponible pour le moment.
              </p>
            ) : (
              topCities.map((city, index) => (
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
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CitiesPreview;
