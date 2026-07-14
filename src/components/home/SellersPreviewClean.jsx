import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  User,
  Building2,
  Star,
  Shield,
  CreditCard,
  Percent,
  Hammer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const SellersPreviewClean = () => {
  const [stats, setStats] = useState([
    { value: null, label: 'Particuliers' },
    { value: null, label: 'Professionnels' },
    { value: null, label: 'Satisfaction' }
  ]);
  const [loading, setLoading] = useState(true);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [particuliersRes, professionnelsRes, reviewsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('account_type', 'particulier'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('account_type', 'promoteur'),
          supabase.from('reviews').select('rating').eq('is_approved', true)
        ]);

        const particuliersCount = particuliersRes.count || 0;
        const professionnelsCount = professionnelsRes.count || 0;
        const ratings = reviewsRes.data || [];
        const avgRating = ratings.length > 0
          ? (ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length).toFixed(1)
          : null;

        setStats([
          { value: particuliersCount, label: 'Particuliers' },
          { value: professionnelsCount, label: 'Professionnels' },
          { value: avgRating ? `${avgRating}/5` : 'N/A', label: 'Satisfaction' }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques vendeurs:', error);
        setStats([
          { value: 0, label: 'Particuliers' },
          { value: 0, label: 'Professionnels' },
          { value: 'N/A', label: 'Satisfaction' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    const fetchActiveProjects = async () => {
      setProjectsLoading(true);
      try {
        const { count, error } = await supabase
          .from('developer_projects')
          .select('id', { count: 'exact', head: true });

        if (error) {
          console.error('Erreur lors du chargement des projets promoteurs:', error);
          setActiveProjectsCount(0);
        } else {
          setActiveProjectsCount(count || 0);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setActiveProjectsCount(0);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchStats();
    fetchActiveProjects();
  }, []);

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
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {loading ? '…' : stat.value}
              </div>
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

          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Hammer className="h-8 w-8 text-purple-600" />
            </div>
            {projectsLoading ? (
              <div className="h-10 w-32 bg-purple-100 rounded animate-pulse" />
            ) : activeProjectsCount > 0 ? (
              <p className="text-3xl font-bold text-purple-700">{activeProjectsCount} projet{activeProjectsCount > 1 ? 's' : ''}</p>
            ) : (
              <p className="text-gray-500">Aucun projet de promoteur disponible pour le moment.</p>
            )}
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

export default SellersPreviewClean;
