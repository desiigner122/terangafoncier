import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  MapPin, 
  Building, 
  Leaf, 
  Ship, 
  Sun, 
  ArrowRight, 
  CheckCircle
} from 'lucide-react';
import ParcelCard from '@/components/parcels/ParcelCard';
import { Helmet } from 'react-helmet-async';

const regionDataSim = {
  "saint-louis": {
    name: "Saint-Louis",
    description: "Ancienne capitale de l'Afrique-Occidentale française, Saint-Louis est une ville chargée d'histoire, classée au patrimoine mondial de l'UNESCO. Son charme colonial, sa position stratégique entre le fleuve Sénégal et l'océan Atlantique, et son dynamisme culturel en font une destination d'investissement de premier choix.",
    image: "https://images.unsplash.com/photo-1590595978583-3967cf39d21a?q=80&w=2071&auto=format&fit=crop",
    atouts: [
      { icon: Sun, text: "Potentiel touristique exceptionnel (histoire, nature, festivals)." },
      { icon: Leaf, text: "Terres agricoles fertiles dans la vallée du fleuve Sénégal." },
      { icon: Ship, text: "Proximité du nouveau port de Ndayane et de la Mauritanie." },
      { icon: Building, text: "Développement de nouvelles zones résidentielles et commerciales." },
    ]
  },
  "thies": {
    name: "Thiès",
    description: "Véritable carrefour économique du Sénégal, Thiès est une région en pleine expansion, bénéficiant de sa proximité avec Dakar et de sa position centrale. C'est un pôle industriel, commercial et universitaire majeur, offrant une grande diversité d'opportunités d'investissement.",
    image: "https://images.unsplash.com/photo-1586254118253-65a2b858a10e?q=80&w=1974&auto=format&fit=crop",
    atouts: [
      { icon: Building, text: "Pôle industriel et artisanal dynamique." },
      { icon: MapPin, text: "Proximité de l'aéroport AIBD et du pôle de Diamniadio." },
      { icon: Leaf, text: "Zone des Niayes propice à l'agriculture maraîchère." },
      { icon: Sun, text: "Zone touristique de la Petite Côte (Saly, Somone)." },
    ]
  },
  "ziguinchor": {
    name: "Ziguinchor",
    description: "Capitale de la Casamance, Ziguinchor est le cœur d'une région verdoyante et fertile, dotée d'un potentiel agricole et touristique immense. La paix retrouvée et les investissements dans les infrastructures ouvrent des perspectives uniques pour les investisseurs.",
    image: "https://images.unsplash.com/photo-1604928141068-a185f5a9318a?q=80&w=2070&auto=format&fit=crop",
    atouts: [
      { icon: Leaf, text: "Potentiel agricole exceptionnel (riz, fruits, anacarde)." },
      { icon: Sun, text: "Écotourisme et tourisme balnéaire (Cap Skirring)." },
      { icon: Ship, text: "Port fluvial et ouverture sur la sous-région." },
      { icon: Building, text: "Forte demande en logements et infrastructures hôtelières." },
    ]
  }
};

const RegionInvestmentPage = () => {
  const { regionSlug } = useParams();
  const [region, setRegion] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchRegionAndParcels = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        // Récupérer la région depuis la table regions
        const { data: regionData, error: regionError } = await supabase.from('regions').select('*').eq('slug', regionSlug).single();
        if (regionError || !regionData) throw regionError || new Error('Région non trouvée');
        setRegion(regionData);
        // Récupérer les parcelles associées à la région
        const { data: parcelsData, error: parcelsError } = await supabase.from('parcels').select('*').ilike('zone', `%${regionData.name}%`).limit(6);
        if (parcelsError) throw parcelsError;
        setParcels(parcelsData);
      } catch (err) {
        setFetchError(err.message);
        setRegion(null);
        setParcels([]);
        console.error('Erreur lors du chargement de la région ou des parcelles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegionAndParcels();
  }, [regionSlug]);

  if (loading) {
    return <div className="container mx-auto py-10 text-center">Chargement de la région...</div>;
  }
  if (fetchError) {
    return <div className="container mx-auto py-10 text-center text-red-600">Erreur : {fetchError}</div>;
  }
  if (!region) {
    return <div className="container mx-auto py-10 text-center">Région non trouvée.</div>;
  }

  return (
    <>
      <Helmet>
        <title>Investir à {region.name} - Opportunités Foncières | Teranga Foncier</title>
        <meta name="description" content={`Découvrez pourquoi investir dans la région de ${region.name}. Atouts, projets et terrains disponibles pour votre investissement au Sénégal.`} />
      </Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <section className="relative h-[60vh] text-white flex items-center justify-center text-center">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img src={region.image} alt={`Paysage de la région de ${region.name}`} className="absolute inset-0 w-full h-full object-cover" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-20 container mx-auto px-4"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Investir à {region.name}</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90">{region.description}</p>
          </motion.div>
        </section>

        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Les Atouts de la Région</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {region.atouts.map((atout, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <atout.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{atout.text}</CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Opportunités Foncières à {region.name}</h2>
            {parcels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {parcels.map(parcel => (
                  <ParcelCard key={parcel.id} parcel={parcel} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Aucune parcelle en vedette pour cette région pour le moment.</p>
            )}
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link to={`/parcelles?zone=${region.name}`}>
                  Voir toutes les parcelles à {region.name} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à Investir à {region.name} ?</h2>
            <p className="max-w-2xl mx-auto mb-8">Notre équipe d'experts est à votre disposition pour vous accompagner dans votre projet d'investissement, de la recherche du terrain idéal à la finalisation de la transaction.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact?subject=Investissement">Contacter un conseiller</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                <Link to="/request-municipal-land">Faire une demande de terrain</Link>
              </Button>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default RegionInvestmentPage;