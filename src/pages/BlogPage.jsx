import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Search,
  Clock,
  Users,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

const computeReadingTime = (content) => {
  if (!content) return '1 min';
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
};

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, content, created_at, updated_at, author:profiles(full_name)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        if (active) {
          setPosts(
            (data || []).map((p) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt || (p.content ? `${p.content.slice(0, 150)}...` : ''),
              author: p.author?.full_name || 'Teranga Foncier',
              publishedAt: p.created_at
                ? new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                : '',
              readTime: computeReadingTime(p.content)
            }))
          );
        }
      } catch (err) {
        if (active) setError(err.message || 'Erreur lors du chargement des articles');
        console.error('Error loading blog posts:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPosts();
    return () => { active = false; };
  }, []);

  const filteredPosts = useMemo(() => posts.filter(post => {
    const term = searchTerm.toLowerCase();
    return post.title?.toLowerCase().includes(term) || post.excerpt?.toLowerCase().includes(term);
  }), [posts, searchTerm]);

  const stats = useMemo(() => ([
    { icon: BookOpen, number: `${posts.length}`, label: "Articles publiés" },
    { icon: Calendar, number: posts[0]?.publishedAt || "—", label: "Dernière publication" },
    { icon: Clock, number: posts.length > 0 ? computeReadingTime(posts.map(p => p.excerpt).join(' ')) : "—", label: "Temps de lecture moyen" }
  ]), [posts]);

  return (
    <>
      <SEO
        title="Blog - Guides et Conseils Experts en Immobilier Sénégalais"
        description="Découvrez nos guides experts, conseils pratiques et actualités du marché foncier sénégalais. Apprenez comment acheter terrain, investir diaspora, vérifier titre foncier et sécuriser transaction."
        keywords="blog immobilier sénégal, guides achat terrain, conseils foncier, actualités immobilière, tutos terrains"
        canonicalUrl="https://www.terangafoncier.sn/blog"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20">

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Blog Teranga Foncier
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Guides experts, conseils pratiques et actualités du marché foncier
              </p>

              {/* Loading State */}
              {loading && (
                <div className="text-white/80 py-4">
                  Chargement des articles...
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-100 text-red-800 px-4 py-3 rounded-xl mb-4 max-w-2xl mx-auto">
                  {error}
                </div>
              )}

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-xl"
                  disabled={loading}
                />
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <stat.icon className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* All Articles */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tous nos articles
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''} trouvé{filteredPosts.length > 1 ? 's' : ''}
              </p>
            </motion.div>

            {!loading && filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.publishedAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="flex items-center justify-end w-full">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/blog/${post.slug}`}>
                              Lire
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : !loading ? (
              <EmptyState
                icon={Search}
                title="Aucun article trouvé"
                description="Essayez de modifier votre recherche, ou revenez plus tard : de nouveaux articles seront publiés prochainement."
              />
            ) : null}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Restez informé de nos derniers articles
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Recevez nos conseils d'experts directement dans votre boîte mail
              </p>

              <div className="max-w-md mx-auto flex gap-2">
                <Input
                  placeholder="Votre email..."
                  className="bg-white/90 border-0 text-gray-900"
                />
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                  S'abonner
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;
