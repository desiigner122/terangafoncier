
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { sampleParcels } from '@/data/sampleData';
import ParcelCard from '@/components/parcels/ParcelCard';

const VerifiedParcelsSection = () => {
    const verifiedParcels = sampleParcels.filter(p => p.verified).slice(0, 3);

    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <motion.section 
            className="container mx-auto px-4"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-blue flex items-center">
                        <ShieldCheck className="h-8 w-8 text-green-500 mr-3" /> Terrains Vérifiés
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Investissez en toute confiance. Ces parcelles ont fait l'objet d'une vérification documentaire par nos équipes pour garantir leur statut juridique.
                    </p>
                </div>
                <Button asChild variant="ghost" className="mt-4 sm:mt-0 text-primary hover:text-primary/80">
                    <Link to="/parcelles?verified=true">
                        Voir tous les terrains vérifiés <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            {verifiedParcels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {verifiedParcels.map(parcel => (
                        <ParcelCard key={parcel.id} parcel={parcel} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">Aucun terrain vérifié disponible pour le moment.</p>
            )}
        </motion.section>
    );
};

export default VerifiedParcelsSection;
