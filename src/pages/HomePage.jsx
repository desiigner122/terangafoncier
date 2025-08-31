import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/sections/HeroSection';
import FeaturedParcelsSection from '@/components/home/sections/FeaturedParcelsSection';
import CallToActionSection from '@/components/home/sections/CallToActionSection';
import PartnerCarouselSection from '@/components/home/sections/PartnerCarouselSection';
import { Helmet } from 'react-helmet-async';
import MunicipalLandSection from '@/components/home/sections/MunicipalLandSection';
import FraudPreventionSection from '@/components/home/sections/FraudPreventionSection';
import CitiesCarousel from '@/components/home/sections/CitiesCarousel';

const HomePage = () => {
    return (
        <>
            <Helmet>
                <title>Teranga Foncier - Sécurisez votre Achat de Terrain au Sénégal</title>
                <meta name="description" content="La plateforme n°1 pour l'achat et la vente de terrains vérifiés au Sénégal. Accédez au cadastre, aux informations légales et à un réseau de confiance." />
                <meta property="og:title" content="Teranga Foncier - Sécurisez votre Achat de Terrain au Sénégal" />
                <meta property="og:description" content="Trouvez, vérifiez et achetez des terrains en toute sécurité à Dakar, Saly, et partout au Sénégal avec Teranga Foncier." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://www.terangafoncier.com" />
            </Helmet>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background text-foreground"
            >
                <HeroSection />

                <div className="space-y-20 md:space-y-28 lg:space-y-36 py-20 md:py-28">
                    <PartnerCarouselSection />
                    <CitiesCarousel />
                    <FraudPreventionSection />
                    <FeaturedParcelsSection />
                    <MunicipalLandSection />
                    <CallToActionSection />
                </div>
            </motion.div>
        </>
    );
};

export default HomePage;