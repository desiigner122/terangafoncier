import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Star
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, author_name, location, content, rating, avatar_url, is_approved, created_at')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Erreur lors du chargement des avis:', error);
          setTestimonials([]);
        } else {
          setTestimonials(data || []);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="bg-muted/50 dark:bg-card/60 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="h-8 w-64 bg-muted rounded mx-auto mb-10 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
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
                     key={testimonial.id ?? index}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true, amount: 0.2 }}
                     transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                      <Card className="bg-background shadow-md hover:shadow-lg transition-shadow h-full flex flex-col rounded-xl border">
                          <CardContent className="pt-6 pb-6 flex-grow flex flex-col">
                              <div className="flex mb-3">
                                 {[...Array(5)].map((_, i) => (
                                     <Star key={i} className={`h-4 w-4 ${i < (testimonial.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>
                                 ))}
                              </div>
                              <p className="text-muted-foreground italic mb-4 flex-grow">"{testimonial.content}"</p>
                              <div className="flex items-center mt-auto">
                                  <div className="w-11 h-11 rounded-full bg-muted mr-4 overflow-hidden ring-2 ring-primary/10">
                                    {testimonial.avatar_url ? (
                                      <img className="w-full h-full object-cover" alt={`Portrait ${testimonial.author_name || ''}`} src={testimonial.avatar_url} />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-semibold">
                                        {(testimonial.author_name || '?').charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                      <p className="font-semibold text-foreground">{testimonial.author_name}</p>
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