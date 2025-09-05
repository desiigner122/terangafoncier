import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CalendarDays, 
  TrendingUp
} from 'lucide-react';
import { sampleBlogPosts } from '@/data'; 

const MarketNewsSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const newsItems = sampleBlogPosts.filter(post => post.category === "Marché Immobilier" || post.category === "Juridique").slice(0, 3).map((post) => ({
    id: post.id,
    title: post.title,
    date: new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    excerpt: post.excerpt,
    category: post.category,
    imagePlaceholder: post.title,
    slug: `/blog/${post.slug}`, 
    description: `Actualité du marché immobilier au Sénégal: ${post.title}`
  }));


  return (
    <section className="container mx-auto px-4">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-center mb-10"
      >
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-primary mb-3 flex items-center justify-center">
          <TrendingUp className="h-8 w-8 mr-3 text-primary" /> Actualités du Marché Foncier
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Restez informé des dernières tendances, réglementations et opportunités du secteur foncier au Sénégal.
        </motion.p>
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {newsItems.map((newsItem) => (
          <motion.div key={newsItem.id} variants={itemVariants}>
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border rounded-xl bg-card">
              <div className="aspect-video bg-muted relative">
                 <img  className="w-full h-full object-cover" alt={newsItem.imagePlaceholder} src="https://images.unsplash.com/photo-1667118300849-1872d823219f" />
                 <div className="absolute inset-0 bg-black/10"></div>
                 <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                    {newsItem.category}
                 </span>
              </div>
              <CardHeader>
                <CardTitle className="text-lg leading-snug text-foreground">{newsItem.title}</CardTitle>
                <p className="text-xs text-muted-foreground pt-1 flex items-center">
                   <CalendarDays className="h-3.5 w-3.5 mr-1.5"/> {newsItem.date}
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{newsItem.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="p-0 h-auto text-primary">
                  <Link to={newsItem.slug}>Lire la suite <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mt-10"
      >
        <Button size="lg" asChild variant="outline" className="hover:bg-primary/5 hover:border-primary transition-colors">
          <Link to="/blog">Voir Toutes les Actualités</Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default MarketNewsSection;