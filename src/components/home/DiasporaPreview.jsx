import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Globe,
  BarChart3,
  Shield,
  Users,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import SimpleProgressTracker from './SimpleProgressTracker';

const DiasporaPreview = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Suivi en Temps Réel",
      description: "Progression mise à jour par les promoteurs"
    },
    {
      icon: Shield,
      title: "Preuves Visuelles",
      description: "Photos et vidéos quotidiennes"
    },
    {
      icon: Users,
      title: "Communication Directe",
      description: "Chat sécurisé via dashboard"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-emerald-100 text-emerald-700 mb-4">
              <Globe className="h-4 w-4 mr-2" />
              Spécial Diaspora
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Construction à Distance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Suivez et gérez vos projets de construction au Sénégal depuis n'importe où dans le monde
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Fonctionnalités */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">6M</div>
                  <div className="text-sm text-gray-600">Diaspora sénégalaise</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">100%</div>
                  <div className="text-sm text-gray-600">Transparence</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">24/7</div>
                  <div className="text-sm text-gray-600">Suivi disponible</div>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
              <Link to="/construction-diaspora">
                Découvrir la solution diaspora
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Exemple de suivi */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="max-w-sm">
              <SimpleProgressTracker />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 italic">
                  Exemple de suivi en temps réel
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiasporaPreview;
