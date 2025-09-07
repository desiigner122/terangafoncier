import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  User,
  Building2,
  Star,
  Shield,
  CreditCard,
  Calendar,
  Percent,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const SellersPreview = () => {
  const stats = [
    { value: "1,247", label: "Particuliers" },
    { value: "89", label: "Professionnels" },
    { value: "4.8/5", label: "Satisfaction" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trouvez Votre Vendeur Idéal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Particuliers vérifiés ou promoteurs certifiés, explorez notre réseau de vendeurs de confiance
          </p>
        </motion.div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Sections vendeurs simplifiées */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Vendeurs Particuliers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Vendeurs Particuliers</h3>
                    <p className="text-sm text-gray-600">Propriétaires directs</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Identité vérifiée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Système de notation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Paiement échelonné possible</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link to="/vendeurs-particuliers">
                    Explorer les particuliers
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vendeurs Professionnels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-purple-200 hover:border-purple-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Vendeurs Professionnels</h3>
                    <p className="text-sm text-gray-600">Promoteurs certifiés</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Certification professionnelle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Projets validés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Financement facilité</span>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" asChild>
                  <Link to="/vendeurs-professionnels">
                    Explorer les professionnels
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section aperçu des projets de promoteurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Projets de Promoteurs en Cours
            </h3>
            <p className="text-gray-600">
              Découvrez les derniers projets immobiliers des promoteurs certifiés
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            
            {/* Projet 1 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="relative mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop&crop=center" 
                  alt="Résidence Les Palmiers"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                  En construction
                </Badge>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Résidence Les Palmiers</h4>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="text-xs">Guédiawaye</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">12 appartements</span>
                <span className="font-bold text-purple-600">35-50M FCFA</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Livraison: Décembre 2025</p>
            </div>

            {/* Projet 2 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="relative mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop&crop=center" 
                  alt="Villa Complex Almadies"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <Badge className="absolute top-2 right-2 bg-blue-500 text-white text-xs">
                  Nouveau
                </Badge>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Villa Complex Almadies</h4>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="text-xs">Almadies, Dakar</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">8 villas</span>
                <span className="font-bold text-purple-600">120-180M FCFA</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Livraison: Juin 2026</p>
            </div>

            {/* Projet 3 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="relative mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop&crop=center" 
                  alt="Centre Commercial Sicap"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">
                  Mixte
                </Badge>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Centre Commercial Sicap</h4>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="text-xs">Sicap Liberté</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Commerce + Résidentiel</span>
                <span className="font-bold text-purple-600">25-90M FCFA</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{width: '50%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Livraison: Mars 2026</p>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
              <Link to="/projets-promoteurs">
                Voir tous les projets
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SellersPreview;
