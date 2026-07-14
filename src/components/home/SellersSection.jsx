import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  User,
  Building2,
  Verified,
  ImageOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';

const getPrimaryPhoto = (photos) => {
  if (!Array.isArray(photos) || photos.length === 0) return null;
  const primary = photos.find((p) => p.is_primary);
  return (primary || photos[0])?.url || null;
};

const SellersSection = () => {
  const [particularSellers, setParticularSellers] = useState([]);
  const [professionalSellers, setProfessionalSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            id,
            title,
            name,
            location,
            city,
            surface,
            price,
            verification_status,
            created_at,
            property_photos(url, is_primary),
            profiles:owner_id(full_name, account_type)
          `)
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) {
          console.error('Erreur lors du chargement des propriétés:', error);
          setParticularSellers([]);
          setProfessionalSellers([]);
        } else {
          const rows = data || [];
          const particuliers = rows.filter((p) => p.profiles?.account_type === 'particulier').slice(0, 2);
          const professionnels = rows.filter((p) => p.profiles?.account_type && p.profiles.account_type !== 'particulier').slice(0, 2);
          setParticularSellers(particuliers);
          setProfessionalSellers(professionnels);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setParticularSellers([]);
        setProfessionalSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const renderImage = (property) => {
    const url = getPrimaryPhoto(property.property_photos);
    if (url) {
      return (
        <img
          src={url}
          alt={property.title || property.name}
          className="w-full h-48 object-cover"
        />
      );
    }
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        <ImageOff className="h-8 w-8 text-gray-300" />
      </div>
    );
  };

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

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[1, 2].map((i) => (
                <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : particularSellers.length === 0 ? (
            <p className="text-center text-gray-500 mb-8">Aucune propriété de particulier disponible pour le moment.</p>
          ) : (
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
                      {renderImage(property)}
                      {property.verification_status === 'verified' && (
                        <Badge className="absolute top-3 right-3 bg-blue-500 text-white">
                          <Verified className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{property.title || property.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location || property.city}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Par {property.profiles?.full_name || 'Vendeur particulier'}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">{property.surface ? `${property.surface} m²` : ''}</span>
                        <span className="font-bold text-blue-600">{property.price ? `${Number(property.price).toLocaleString()} FCFA` : ''}</span>
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
          )}

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

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[1, 2].map((i) => (
                <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : professionalSellers.length === 0 ? (
            <p className="text-center text-gray-500 mb-8">Aucun projet professionnel disponible pour le moment.</p>
          ) : (
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
                      {renderImage(project)}
                      {project.verification_status === 'verified' && (
                        <Badge className="absolute top-3 right-3 bg-purple-500 text-white">
                          <Verified className="h-3 w-3 mr-1" />
                          Certifié
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{project.title || project.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{project.location || project.city}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Par {project.profiles?.full_name || 'Promoteur certifié'}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">{project.surface ? `${project.surface} m²` : ''}</span>
                        <span className="font-bold text-purple-600">{project.price ? `${Number(project.price).toLocaleString()} FCFA` : ''}</span>
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
          )}

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
