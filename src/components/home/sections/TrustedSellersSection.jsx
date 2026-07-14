import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Landmark,
  Building2,
  UserCheck as UserCheckIcon
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from '@/lib/supabaseClient';

const ROLE_CONFIG = {
  'Mairie': { type: 'Institutionnel', color: 'text-blue-600', link: '/parcelles?ownerType=Mairie' },
  'Promoteur': { type: 'Promoteur Certifié', color: 'text-green-600', link: '/parcelles?ownerType=Promoteur' },
  'Particulier': { type: 'Vendeur Particulier Vérifié', color: 'text-purple-600', link: '/parcelles?ownerType=Particulier' },
};

const SellerIcon = ({ type, className }) => {
  if (type === 'Institutionnel') return <Landmark className={className} />;
  if (type === 'Vendeur Particulier Vérifié') return <UserCheckIcon className={className} />;
  return <Building2 className={className} />;
};

const TrustedSellersSection = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );
  const [trustedSellers, setTrustedSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrustedSellers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, company, role')
          .eq('is_verified', true)
          .in('role', Object.keys(ROLE_CONFIG))
          .limit(8);

        if (error) throw error;

        const mapped = (data || []).map((seller) => {
          const config = ROLE_CONFIG[seller.role] || ROLE_CONFIG['Particulier'];
          return {
            name: seller.company || seller.full_name || '',
            type: config.type,
            color: config.color,
            link: config.link,
          };
        });
        setTrustedSellers(mapped);
      } catch (error) {
        console.log('Erreur lors du chargement des vendeurs vérifiés:', error);
        setTrustedSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrustedSellers();
  }, []);

  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Nos Vendeurs de Confiance</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Nous vérifions l'identité et les FileTexts de chaque vendeur pour vous garantir des transactions sécurisées. Achetez en toute sérénité auprès de nos partenaires institutionnels, promoteurs certifiés et particuliers vérifiés.
        </p>
      </motion.div>

      {!loading && trustedSellers.length === 0 ? (
        <p className="text-center text-muted-foreground mb-10">Aucun vendeur vérifié disponible pour le moment.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 2,
            }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {trustedSellers.map((seller, index) => (
                <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <Link to={seller.link}>
                    <div className="p-4 bg-card rounded-xl border shadow-sm text-center h-full flex flex-col items-center justify-center hover:shadow-md transition-shadow group">
                      <SellerIcon type={seller.type} className={`h-10 w-10 mb-3 ${seller.color} group-hover:scale-110 transition-transform`} />
                      <h3 className="text-base font-semibold text-foreground truncate w-full">{seller.name}</h3>
                      <p className={`text-xs ${seller.color} font-medium`}>{seller.type}</p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      )}

      <div className="text-center mt-12">
        <Button asChild size="lg">
          <Link to="/parcelles?verified=true">
            Voir toutes les offres certifiées <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default TrustedSellersSection;