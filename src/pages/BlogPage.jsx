import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { 
  Tag, 
  Calendar, 
  ArrowRight, 
  BookOpen,
  Search,
  Clock,
  User,
  Users,
  Eye,
  TrendingUp,
  Filter,
  Bookmark,
  Share2,
  ChevronRight
} from 'lucide-react';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tous les articles', count: 12 },
    { id: 'guides', name: 'Guides pratiques', count: 5 },
    { id: 'actualites', name: 'ActualitÃ©s', count: 3 },
    { id: 'conseils', name: 'Conseils experts', count: 4 }
  ];

  const featuredPosts = [
    {
      id: 1,
      title: "Guide complet pour acheter un terrain au SÃ©nÃ©gal en 2024",
      excerpt: "Tout ce que vous devez savoir pour acquÃ©rir un terrain en toute sÃ©curitÃ© : dÃ©marches, documents, vÃ©rifications et conseils d'experts.",
      category: "guides",
      categoryLabel: "Guide pratique",
      author: "Abdoulaye DiÃ¨mÃ©",
      publishedAt: "15 DÃ©cembre 2024",
      readTime: "8 min",
      views: "2.1k",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
      featured: true,
      tags: ["Achat", "Guide", "DÃ©butant"]
    },
    {
      id: 2,
      title: "Les piÃ¨ges Ã  Ã©viter lors de l'achat d'un terrain",
      excerpt: "DÃ©couvrez les erreurs les plus communes et comment les Ã©viter pour sÃ©curiser votre investissement foncier.",
      category: "conseils",
      categoryLabel: "Conseils expert",
      author: "Abdoulaye DiÃ¨mÃ©",
      publishedAt: "12 DÃ©cembre 2024",
      readTime: "6 min",
      views: "1.8k",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
      featured: true,
      tags: ["SÃ©curitÃ©", "Conseils", "Fraude"]
    },
    {
      id: 3,
      title: "Investir dans l'immobilier depuis l'Ã©tranger : mode d'emploi",
      excerpt: "Guide spÃ©cialement conÃ§u pour la diaspora sÃ©nÃ©galaise souhaitant investir au pays en toute tranquillitÃ©.",
      category: "guides",
      categoryLabel: "Guide pratique",
      author: "Abdoulaye DiÃ¨mÃ©",
      publishedAt: "10 DÃ©cembre 2024",
      readTime: "10 min",
      views: "3.2k",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
      featured: true,
      tags: ["Diaspora", "Investissement", "International"]
    }
  ];

  const blogPosts = [
    {
      id: 4,
      title: "Nouvelle rÃ©glementation fonciÃ¨re : ce qui change en 2024",
      excerpt: "Les derniÃ¨res modifications rÃ©glementaires et leur impact sur le marchÃ© foncier sÃ©nÃ©galais.",
      category: "actualites",
      categoryLabel: "ActualitÃ©s",
      author: "Abdoulaye DiÃ¨mÃ©",
      publishedAt: "8 DÃ©cembre 2024",
      readTime: "5 min",
      views: "1.5k",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop",
      tags: ["RÃ©glementation", "2024", "NouveautÃ©s"]
    },
    {
      id: 5,
      title: "Comment vÃ©rifier l'authenticitÃ© d'un titre foncier",
      excerpt: "MÃ©thodes et outils pour s'assurer de la validitÃ© des documents fonciers avant tout achat.",
      category: "conseils",
      categoryLabel: "Conseils expert",
      author: "Abdoulaye DiÃ¨mÃ©",
      publishedAt: "5 DÃ©cembre 2024",
      readTime: "7 min",
      views: "2.3k",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      tags: ["VÃ©rification", "SÃ©curitÃ©", "Documents"]
    },
    {
      id: 6,
      title: "Les zones les plus prometteuses pour investir en 2024",
      excerpt: "Analyse des rÃ©gions en dÃ©veloppement et des opportunitÃ©s d'investissement foncier.",
      category: "conseils",
      categoryLabel: "Conseils expert",
      author: "Abdoulaye DiÃ¨mÃ©",
      publishedAt: "2 DÃ©cembre 2024",
      readTime: "9 min",
      views: "1.9k",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250&fit=crop",
      tags: ["Investissement", "Zones", "OpportunitÃ©s"]
    },
    {
      id: 7,
      title: "Financement immobilier : toutes les options disponibles",
      excerpt: "Tour d'horizon des solutions de financement pour votre projet d'acquisition fonciÃ¨re.",
      category: "guides",
      categoryLabel: "Guide pratique",
      author: "Abdoulaye DiÃ¨mÃ©",
      publishedAt: "28 Novembre 2024",
      readTime: "12 min",
      views: "2.7k",
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=250&fit=crop",
      tags: ["Financement", "Banques", "CrÃ©dit"]
    },
    {
      id: 8,
      title: "Technologie blockchain dans l'immobilier : rÃ©volution en cours",
      excerpt: "Comment la blockchain transforme le secteur immobilier et sÃ©curise les transactions.",
      category: "actualites",
      categoryLabel: "ActualitÃ©s",
      author: "Abdoulaye DiÃ¨mÃ©",
      publishedAt: "25 Novembre 2024",
      readTime: "6 min",
      views: "1.4k",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
      tags: ["Blockchain", "Innovation", "Technologie"]
    },
    {
      id: 9,
      title: "Construire sa maison : Ã©tapes et autorisations nÃ©cessaires",
      excerpt: "Guide complet des dÃ©marches administratives pour la construction de votre future maison.",
      category: "guides",
      categoryLabel: "Guide pratique",
      author: "Abdoulaye DiÃ¨mÃ©",
      publishedAt: "22 Novembre 2024",
      readTime: "11 min",
      views: "3.1k",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=250&fit=crop",
      tags: ["Construction", "Permis", "Maison"]
    }
  ];

  const allPosts = [...featuredPosts, ...blogPosts];

  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'guides': return 'bg-blue-100 text-blue-800';
      case 'actualites': return 'bg-green-100 text-green-800';
      case 'conseils': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    { icon: BookOpen, number: "50+", label: "Articles publiÃ©s" },
    { icon: Eye, number: "25k", label: "Lectures mensuelles" },
    { icon: Users, number: "5k", label: "Lecteurs fidÃ¨les" },
    { icon: TrendingUp, number: "98%", label: "Taux de satisfaction" }
  ];

  return (
    <>
      <Helmet>
        <title>Blog - Guides et conseils immobiliers | Teranga Foncier</title>
        <meta name="description" content="DÃ©couvrez nos guides experts, conseils pratiques et actualitÃ©s du marchÃ© foncier sÃ©nÃ©galais. Tout pour rÃ©ussir votre projet immobilier." />
      </Helmet>

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
                Guides experts, conseils pratiques et actualitÃ©s du marchÃ© foncier
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  YOUR_API_KEY="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-xl"
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

        {/* Featured Articles */}
        {selectedCategory === 'all' && (
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
                  Articles Ã  la une
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Nos articles les plus populaires et les plus rÃ©cents
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
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}>
                          {post.categoryLabel}
                        </Badge>
                        {post.featured && (
                          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                            Ã€ la une
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
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.publishedAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            {post.views} vues
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/blog/${post.id}`}>
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
                {selectedCategory === 'all' ? 'Tous nos articles' : `Articles - ${categories.find(c => c.id === selectedCategory)?.name}`}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''} trouvÃ©{filteredPosts.length > 1 ? 's' : ''}
              </p>
            </motion.div>

            {filteredPosts.length > 0 ? (
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
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}>
                          {post.categoryLabel}
                        </Badge>
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
                            {post.publishedAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            {post.views} vues
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/blog/${post.id}`}>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvÃ©</h3>
                <p className="text-gray-600">Essayez de modifier votre recherche ou explorez d'autres catÃ©gories.</p>
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
                Restez informÃ© de nos derniers articles
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Recevez nos conseils d'experts directement dans votre boÃ®te mail
              </p>
              
              <div className="max-w-md mx-auto flex gap-2">
                <Input 
                  YOUR_API_KEY="Votre email..."
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
