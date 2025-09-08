import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight
} from 'lucide-react';
// import ParcelCard from '@/components/parcels/ParcelCard'; // Composant supprimé
import SimpleParcelCard from '@/components/common/SimpleParcelCard';
import { supabase } from '@/lib/supabaseClient';
// import ParcelListSkeleton from '@/components/parcels/ParcelListSkeleton'; // Composant supprimé

const FeaturedParcelsSection = () => {
  const [featuredParcels, setFeaturedParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedParcels = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .eq('is_featured', true)
        .in('status', ['Disponible', 'Attribution sur demande'])
        .limit(3);
      
      if (error) {
        console.error("Error fetching featured parcels:", error);
      } else {
        setFeaturedParcels(data);
      }
      setLoading(false);
    };

    fetchFeaturedParcels();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-10 text-center text-brand-blue"
        >
          Nos Parcelles à la Une
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
           ))}
        </div>
      </section>
    );
  }

  if (featuredParcels.length === 0) {
      return null;
  }
  
  return (
    <section className="container mx-auto px-4">
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-10 text-center text-brand-blue"
      >
        Nos Parcelles à la Une
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {featuredParcels.map((parcel, index) => (
          <motion.div
            key={parcel.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <SimpleParcelCard parcel={parcel} />
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild className="hover:bg-primary/5 hover:border-primary transition-colors">
              <Link to="/parcelles">Découvrir Toutes les Parcelles <ArrowRight className="ml-2 h-4 w-4"/></Link>
          </Button>
      </div>
    </section>
  );
};

export default FeaturedParcelsSection;