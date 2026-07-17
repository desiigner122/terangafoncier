import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Star
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1697256200022-f61abccad430';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from('reviews')
      .select('id, author_name, location, content, rating, avatar_url')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) { console.error('Erreur chargement témoignages:', error); setLoaded(true); return; }
        setTestimonials((data || []).map(r => ({
          name: r.author_name,
          location: r.location,
          quote: r.content,
          rating: r.rating || 5,
          image: r.avatar_url || FALLBACK_AVATAR
        })));
        setLoaded(true);
      });
    return () => { active = false; };
  }, []);

  // Masquer la section tant qu'aucun témoignage approuvé n'est disponible
  if (loaded && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/50 dark:bg-card/60 py-12 md:py-16"> {/* Reduced padding */}
      <div className="container mx-auto px-4">
         <motion.h2
             initial={{ y: 20, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.5 }}
             className="text-3xl md:text-4xl font-bold mb-10 text-center text-primary" // Reduced margin bottom
         >
             Ce que disent nos clients
         </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"> {/* Reduced gap */}
              {testimonials.map((testimonial, index) => (
                  <motion.div
                     key={index}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true, amount: 0.2 }}
                     transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                      <Card className="bg-background shadow-md hover:shadow-lg transition-shadow h-full flex flex-col rounded-xl border">
                          <CardContent className="pt-6 pb-6 flex-grow flex flex-col">
                              <div className="flex mb-3">
                                 {[...Array(5)].map((_, i) => (
                                     <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>
                                 ))}
                              </div>
                              <p className="text-muted-foreground italic mb-4 flex-grow">"{testimonial.quote}"</p>
                              <div className="flex items-center mt-auto">
                                  <div className="w-11 h-11 rounded-full bg-muted mr-4 overflow-hidden ring-2 ring-primary/10">
                                    <img className="w-full h-full object-cover" alt={`Portrait ${testimonial.name}`} src={testimonial.image} />
                                  </div>
                                  <div>
                                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  </motion.div>
              ))}
          </div>
      </div>
     </section>
  );
};

export default Testimonials;