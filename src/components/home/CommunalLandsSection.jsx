import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabaseClient';

const COMMUNAL_LAND_PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop&crop=center";

const CommunalLandsSection = () => {
  const [communalLands, setCommunalLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunalLands = async () => {
      try {
        const { data, error } = await supabase
          .from('communal_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setCommunalLands(data || []);
      } catch (error) {
        console.error('Erreur chargement terrains communaux:', error);
        setCommunalLands([]);
      } finally {
        setLoading(false);
      }
    };

    loadCommunalLands();
  }, []);

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
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-80 rounded-lg border overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : communalLands.length === 0 ? (
          <p className="text-center text-gray-500 mb-8">
            Aucun terrain communal disponible pour le moment.
          </p>
        ) : (
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
                      src={land.image_url || land.photo || COMMUNAL_LAND_PLACEHOLDER_IMAGE}
                      alt={land.title || land.name || 'Terrain communal'}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      {land.status || 'Attribution ouverte'}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {land.title || land.name || 'Terrain communal'}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {land.location || land.city || land.commune || 'Localisation à confirmer'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">{land.surface || ''}</span>
                      <span className="font-semibold text-green-600">{land.requirements || ''}</span>
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
        )}

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
