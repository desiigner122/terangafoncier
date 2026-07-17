import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import BlogService from '@/services/admin/BlogService';
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Search,
  Clock,
  User,
  Filter,
  ChevronRight
} from 'lucide-react';

// Placeholder neutre quand un article n'a pas d'image de couverture
const FALLBACK_COVER = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop';

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return '';
  }
};

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await BlogService.getPosts({ status: 'published' });
        if (!result.success) {
          throw new Error(result.error || 'Erreur lors du chargement des articles');
        }
        // BlogService renvoie les articles dans `posts`
        setPosts(result.posts || []);
      } catch (err) {
        setError(err.message);
        console.error('Error loading blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Catégories dérivées dynamiquement des articles réels
  const categories = useMemo(() => {
    const counts = posts.reduce((acc, post) => {
      if (post.category) acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {});
    return [
      { id: 'all', name: 'Tous les articles', count: posts.length },
      ...Object.entries(counts).map(([name, count]) => ({ id: name, name, count }))
    ];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch =
        post.title?.toLowerCase().includes(term) ||
        post.excerpt?.toLowerCase().includes(term) ||
        (Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(term)));
      return matchesCategory && matchesSearch;
    });
  }, [posts, searchTerm, selectedCategory]);

  // Les 3 articles les plus récents servent d'articles "à la une"
  const featuredPosts = useMemo(() => posts.slice(0, 3), [posts]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Guides pratiques': return 'bg-blue-100 text-blue-800';
      case 'Actualités': return 'bg-green-100 text-green-800';
      case 'Conseils experts': return 'bg-orange-100 text-orange-800';
      case 'Juridique': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    { icon: BookOpen, number: `${posts.length}`, label: 'Articles publiés' },
    { icon: Filter, number: `${categories.length - 1}`, label: 'Catégories' },
    { icon: User, number: 'Experts', label: 'Rédigés par des pros' },
    { icon: Calendar, number: 'Hebdo', label: 'Nouveaux contenus' }
  ];

  const showFeatured = selectedCategory === 'all' && !searchTerm && featuredPosts.length > 0;

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
              <div className="grid md:grid-cols-4 gap-6">
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

        {/* Categories Section */}
        {categories.length > 1 && (
          <section className="py-8 bg-white border-b">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {category.name}
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Articles */}
        {showFeatured && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Articles à la une
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Nos articles les plus récents
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                      <div className="relative">
                        <img
                          src={post.cover_image || FALLBACK_COVER}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {post.category && (
                          <Badge className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </Badge>
                        )}
                      </div>

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
                          {post.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                          {post.reading_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.reading_time}
                            </div>
                          )}
                        </div>

                        {Array.isArray(post.tags) && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="flex items-center justify-end w-full">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/blog/${post.slug}`}>
                              Lire l'article
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

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
                {selectedCategory === 'all' ? 'Tous nos articles' : `Articles - ${selectedCategory}`}
              </h2>
              {!loading && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''} trouvé{filteredPosts.length > 1 ? 's' : ''}
                </p>
              )}
            </motion.div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Chargement des articles...</div>
            ) : filteredPosts.length > 0 ? (
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
                      <div className="relative">
                        <img
                          src={post.cover_image || FALLBACK_COVER}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {post.category && (
                          <Badge className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </Badge>
                        )}
                      </div>

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
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                          {post.reading_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.reading_time}
                            </div>
                          )}
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
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {posts.length === 0 ? 'Aucun article pour le moment' : 'Aucun article trouvé'}
                </h3>
                <p className="text-gray-600">
                  {posts.length === 0
                    ? 'Nos premiers articles arrivent très bientôt. Revenez prochainement !'
                    : 'Essayez de modifier votre recherche ou explorez d\'autres catégories.'}
                </p>
              </div>
            )}
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
