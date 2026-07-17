import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Quote
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from('reviews')
      .select('id, author_name, location, content, rating, avatar_url')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) { console.error('Erreur chargement témoignages:', error); setLoaded(true); return; }
        setTestimonials((data || []).map(r => ({
          name: r.author_name,
          location: r.location,
          quote: r.content,
          rating: r.rating || 5,
          avatar: r.avatar_url
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-blue">Ce que disent nos clients</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La confiance et la satisfaction de nos clients sont notre plus grande récompense.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true, amount: 0.2 }}
           transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                  <div className="p-1 h-full">
                    <Card className="h-full flex flex-col justify-between shadow-lg border border-primary/10 bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-6 space-y-4">
                         <Quote className="h-8 w-8 text-primary/50 mb-2 transform -scale-x-100" />
                        <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                        <div className="flex items-center pt-4 border-t border-dashed">
                          <Avatar className="h-10 w-10 mr-3">
                            {testimonial.avatar && <AvatarImage className="w-full h-full object-cover rounded-full" alt={testimonial.name} src={testimonial.avatar} />}
                            <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                          </div>
                          <div className="ml-auto flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-15px] top-1/2 -translate-y-1/2 hidden sm:inline-flex" />
            <CarouselNext className="absolute right-[-15px] top-1/2 -translate-y-1/2 hidden sm:inline-flex" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;