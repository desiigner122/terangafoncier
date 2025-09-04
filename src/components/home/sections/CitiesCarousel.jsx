import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

const CitiesCarousel = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      const { data, error } = await supabase
  .from('users')
        .select('full_name, company_info')
        .eq('role', 'Mairie')
        .limit(10);
      
      if (error) {
        console.error("Error fetching cities:", error);
      } else {
        const formattedCities = data
          .filter(mairie => mairie.full_name || mairie.company_info?.commune) // Filtrer les entrées avec des noms valides
          .map(mairie => {
            const communeName = mairie.company_info?.commune || 
                              (mairie.full_name ? mairie.full_name.replace('Mairie de ', '') : 'Ville inconnue');
            return {
              name: communeName,
              slug: communeName.toLowerCase().replace(/ /g, '-'),
              description: `Découvrez les opportunités à ${communeName}`,
              image: `https://source.unsplash.com/random/400x500/?${communeName.toLowerCase()}`,
            };
          });
        setCities(formattedCities);
      }
      setLoading(false);
    };

    fetchCities();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-10" />
        <div className="flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1/4">
              <Skeleton className="aspect-[3/4] w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cities.length === 0) return null;

  return (
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-4 text-center text-primary"
      >
        Explorez le Sénégal par Commune
      </motion.h2>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto"
      >
        Cliquez sur une commune pour découvrir ses atouts et les opportunités foncières qu'elle a à offrir.
      </motion.p>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {cities.map((city, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="p-1"
              >
                <Card className="overflow-hidden group relative rounded-xl shadow-lg border-border/50 hover:shadow-primary/20 transition-all duration-300">
                  <Link to={`/mairie/${city.slug}`} className="block">
                    <CardContent className="flex aspect-[3/4] items-end p-6 text-white">
                      <div className="absolute inset-0 z-0">
                        <img  alt={city.description} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" src="https://images.unsplash.com/photo-1636559361440-2e36720966c9" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                      </div>
                      <div className="relative z-10 w-full">
                        <div className="flex items-center text-lg">
                          <MapPin className="h-5 w-5 mr-2" />
                          <h3 className="text-2xl font-bold">{city.name}</h3>
                        </div>
                        <p className="text-sm opacity-90 mb-4">{city.description}</p>
                        <div className="flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          Découvrir <ArrowRight className="ml-1.5 h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default CitiesCarousel;