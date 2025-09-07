import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  ArrowRight,
  Landmark,
  Shield,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const CommunalLandsPreview = () => {
  const stats = [
    { value: "156", label: "Terrains disponibles" },
    { value: "14", label: "Régions couvertes" },
    { value: "89%", label: "Attributions réussies" }
  ];

  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-green-100 text-green-700 mb-4">
              <Landmark className="h-4 w-4 mr-2" />
              Terrains Communaux
            </Badge>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Attribution de Terrains Communaux
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Accédez aux terrains communaux officiels via notre processus 
              d'attribution transparent et sécurisé.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">
                Processus officiel validé par les autorités
              </span>
            </div>

            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
              <Link to="/terrains-communaux">
                Voir tous les terrains communaux
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Card d'exemple */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-lg">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop&crop=center" 
                  alt="Terrain communal exemple"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                  Attribution ouverte
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Terrain Communal Thiès
                </h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Thiès Centre</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">500m²</span>
                  <span className="font-semibold text-green-600">Dossier complet requis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>12 demandes en cours</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunalLandsPreview;
