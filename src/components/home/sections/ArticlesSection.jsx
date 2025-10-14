import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarDays, 
  User, 
  ArrowRight, 
  Eye, 
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Articles de démonstration en cas d'absence de données
  const defaultArticles = [
    {
      id: 1,
      title: "Guide Complet pour Investir dans l'Immobilier Sénégalais",
      excerpt: "Découvrez les meilleures stratégies pour réussir votre investissement immobilier au Sénégal en 2025.",
      author: "Équipe Teranga Foncier",
      published_at: "2025-01-15",
      category: "Investissement",
      views: 1250,
      image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      slug: "guide-investir-immobilier-senegal"
    },
    {
      id: 2,
      title: "Diaspora : Comment Construire sa Maison depuis l'Étranger",
      excerpt: "Les étapes essentielles pour mener à bien votre projet de construction à distance.",
      author: "Abdoul Diémé",
      published_at: "2025-01-12",
      category: "Diaspora",
      views: 890,
      image_url: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400&h=250&fit=crop",
      slug: "construction-maison-diaspora"
    },
    {
      id: 3,
      title: "Les Zones d'Investissement les Plus Prometteuses à Dakar",
      excerpt: "Analyse des quartiers en pleine expansion et des opportunités d'investissement.",
      author: "Fatou Sall",
      published_at: "2025-01-10",
      category: "Marché",
      views: 756,
      image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
      slug: "zones-investissement-dakar"
    }
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          excerpt,
          author,
          published_at,
          category,
          views,
          image_url,
          slug
        `)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) {
        console.log('Erreur lors du chargement des articles:', error);
        setArticles(defaultArticles);
      } else {
        setArticles(data?.length > 0 ? data : defaultArticles);
      }
    } catch (error) {
      console.log('Erreur:', error);
      setArticles(defaultArticles);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Investissement': 'bg-blue-100 text-blue-700',
      'Diaspora': 'bg-green-100 text-green-700',
      'Marché': 'bg-purple-100 text-purple-700',
      'Conseils': 'bg-orange-100 text-orange-700',
      'default': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.default;
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Derniers Articles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Restez informé avec nos conseils d'experts et analyses du marché immobilier sénégalais.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="relative">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-3 left-3 ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(article.published_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.views}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      {article.author}
                    </div>
                    <Button asChild size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-white transition-colors">
                      <Link to={`/blog/${article.slug}`}>
                        Lire
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" variant="outline">
            <Link to="/blog">
              Voir Tous les Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlesSection;
