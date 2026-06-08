import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { 
  ArrowRight, 
  Users, 
  Shield, 
  Star, 
  Phone, 
  Mail, 
  CheckCircle,
  Calculator,
  Zap,
  Globe,
  Building,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const SuccessStoriesPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Histoires de réussite et statistiques chargées depuis Supabase (aucune donnée fictive)
  const [successStories, setSuccessStories] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    let active = true;

    const loadStories = async () => {
      try {
        // Histoires réelles depuis la table `success_stories` (défensif si absente)
        const { data, error } = await supabase
          .from('success_stories')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setSuccessStories(data || []);
      } catch (err) {
        console.warn('Histoires de réussite indisponibles:', err?.message);
        if (active) setSuccessStories([]);
      }

      try {
        // Statistiques RÉELLES (comptes Supabase)
        const [{ count: clients }, { count: tx }, { count: biens }, { count: avis }] =
          await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('blockchain_transactions').select('id', { count: 'exact', head: true }),
            supabase.from('properties').select('id', { count: 'exact', head: true }),
            supabase.from('reviews').select('id', { count: 'exact', head: true }).gte('rating', 5)
          ]);
        if (active) {
          setStats([
            { label: 'Clients inscrits', value: String(clients ?? 0), icon: Users },
            { label: 'Transactions', value: String(tx ?? 0), icon: CheckCircle },
            { label: 'Biens listés', value: String(biens ?? 0), icon: Calculator },
            { label: 'Avis 5 étoiles', value: String(avis ?? 0), icon: Star }
          ]);
        }
      } catch (err) {
        console.warn('Statistiques indisponibles:', err?.message);
      }
    };

    loadStories();
    return () => { active = false; };
  }, []);

  const categories = [
    { id: 'all', label: 'Tous', count: successStories.length },
    { id: 'diaspora', label: 'Diaspora', count: successStories.filter(s => s.category === 'diaspora').length },
    { id: 'promoteur', label: 'Promoteurs', count: successStories.filter(s => s.category === 'promoteur').length },
    { id: 'particulier', label: 'Particuliers', count: successStories.filter(s => s.category === 'particulier').length },
    { id: 'banque', label: 'Banques', count: successStories.filter(s => s.category === 'banque').length },
    { id: 'mairie', label: 'Mairies', count: successStories.filter(s => s.category === 'mairie').length }
  ];

  const filteredStories = activeTab === 'all' 
    ? successStories 
    : successStories.filter(story => story.category === activeTab);


  return (
    <>
      <SEO
        title="Success Stories - Témoignages de Nos Clients Satisfaits"
        description="Découvrez les témoignages de clients satisfaits : diaspora, promoteurs, particuliers, agents. +2500 projets réussis, 98.5% de satisfaction client. Lisez leurs histoires de succès immobilier."
        keywords="témoignages clients, histoires réussite immobilière, avis clients terrain, expériences investisseurs, cas réussis"
        canonicalUrl="https://www.terangafoncier.sn/success-stories"
      />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-800">
                Success Stories
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Ils ont réussi avec
                <span className="text-emerald-600"> Teranga Foncier</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez comment nos clients transforment leurs projets immobiliers en succès. 
                De la diaspora aux promoteurs, tous témoignent de notre excellence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-white p-6 rounded-lg shadow-lg"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filtres */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? "default" : "outline"}
                  onClick={() => setActiveTab(category.id)}
                  className={`${
                    activeTab === category.id 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'hover:bg-emerald-50'
                  }`}
                >
                  {category.label} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <img
                          src={story.image}
                          alt={story.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{story.name}</h3>
                          <p className="text-emerald-600 text-sm">{story.role}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(story.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <blockquote className="text-gray-700 italic mb-4">
                        "{story.story}"
                      </blockquote>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Investissement:</span>
                          <span className="font-semibold text-emerald-600">{story.investment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Localisation:</span>
                          <span className="font-semibold">{story.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Délai:</span>
                          <span className="font-semibold">{story.timeline}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Points clés:</p>
                        <div className="flex flex-wrap gap-2">
                          {story.highlights.map((highlight, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Prêt Ï  écrire votre success story ?
              </h2>
              <p className="text-xl mb-8 text-emerald-100">
                Rejoignez des milliers de clients satisfaits qui ont concrétisé leurs projets immobiliers avec nous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link to="/register">
                    Commencer Maintenant
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/contact">
                    Parler Ï  un Expert
                    <Phone className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>contact@terangafoncier.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>+221 77 593 42 41</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SuccessStoriesPage;
