import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sampleParcels } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Building, 
  Leaf, 
  Ship, 
  Sun, 
  ArrowRight, 
  Landmark, 
  Users, 
  Info, 
  Briefcase, 
  TrendingUp, 
  FileSignature, 
  Lightbulb
} from 'lucide-react';
import ParcelCard from '@/components/parcels/ParcelCard';
import { Helmet } from 'react-helmet-async';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const mairieDataSim = {
  "saint-louis": {
    name: "Mairie de Saint-Louis",
    slug: "saint-louis",
    description: "Ancienne capitale de l'AOF, Saint-Louis est une ville UNESCO au charme colonial. Sa position stratégique et son dynamisme culturel en font une destination d'investissement de premier choix.",
    images: ["St Louis bridge", "Fishing boats in St Louis", "Colonial building in St Louis"],
    maire: { name: "Mansour Faye", avatar: `https://avatar.vercel.sh/mansour-faye.png`, mot: "Saint-Louis est une terre d'avenir, riche de son passé. Nous invitons les investisseurs à participer à notre développement économique et touristique." },
    atouts: [
      { icon: Sun, text: "Potentiel touristique exceptionnel." },
      { icon: Leaf, text: "Terres agricoles fertiles." },
      { icon: Ship, text: "Proximité du port de Ndayane." },
      { icon: Building, text: "Nouvelles zones résidentielles." },
    ],
    keyFigures: [
        { icon: Users, value: "1.2M", label: "Habitants (Région)" },
        { icon: TrendingUp, value: "+5%", label: "Croissance annuelle" },
        { icon: Briefcase, value: "250+", label: "Projets en cours" },
    ],
    projects: [
        { name: "Réhabilitation du Pont Faidherbe", image: "https://images.unsplash.com/photo-1608354930396-8575a73a2190?q=80&w=1932&auto=format&fit=crop" },
        { name: "Développement de la Langue de Barbarie", image: "https://images.unsplash.com/photo-1618508933612-38d1a49f5c4a?q=80&w=2070&auto=format&fit=crop" },
    ]
  },
  "dakar-plateau": {
    name: "Mairie de Dakar-Plateau",
    slug: "dakar-plateau",
    description: "Cœur administratif et économique du Sénégal, Dakar-Plateau est le centre névralgique des affaires. Investir ici, c'est parier sur le dynamisme d'une métropole en pleine effervescence.",
    images: ["Dakar skyline", "Independence Square Dakar", "Dakar city street"],
    maire: { name: "Alioune Ndoye", avatar: `https://avatar.vercel.sh/alioune-ndoye.png`, mot: "Le Plateau est le moteur de l'économie sénégalaise. Nous facilitons les investissements immobiliers qui contribuent à moderniser notre capitale." },
    atouts: [
      { icon: Building, text: "Quartier des affaires et ministères." },
      { icon: Users, text: "Forte demande en bureaux et résidences." },
      { icon: Sun, text: "Corniche Ouest et sites prisés." },
      { icon: Info, text: "Projets de rénovation urbaine." },
    ],
    keyFigures: [
        { icon: Users, value: "3M+", label: "Habitants (Agglo.)" },
        { icon: TrendingUp, value: "+7%", label: "Croissance annuelle" },
        { icon: Briefcase, value: "500+", label: "Projets en cours" },
    ],
    projects: [
        { name: "Projet de la Gare de Dakar", image: "https://images.unsplash.com/photo-1605594522362-38891238965f?q=80&w=2070&auto=format&fit=crop" },
        { name: "Rénovation de la Place de l'Indépendance", image: "https://images.unsplash.com/photo-1541443425949-e5a1b553cda4?q=80&w=2070&auto=format&fit=crop" },
    ]
  },
  "saly-portudal": {
    name: "Mairie de Saly-Portudal",
    slug: "saly-portudal",
    description: "Première station balnéaire d'Afrique de l'Ouest, Saly est une destination touristique par excellence. Un pôle d'investissement incontournable pour le tourisme et la résidence secondaire.",
    images: ["Saly beach with palm trees", "Saly resort pool", "Saly golf course"],
    maire: { name: "Ousmane Guèye", avatar: `https://avatar.vercel.sh/ousmane-gueye.png`, mot: "Saly continue de croître. Nous soutenons activement les projets qui renforcent notre position de leader du tourisme balnéaire." },
    atouts: [
      { icon: Sun, text: "Tourisme international et local." },
      { icon: Building, text: "Forte demande en villas et commerces." },
      { icon: Leaf, text: "Cadre de vie exceptionnel." },
      { icon: Info, text: "Proximité de l'aéroport AIBD." },
    ],
    keyFigures: [
        { icon: Users, value: "150k+", label: "Résidents & Visiteurs" },
        { icon: TrendingUp, value: "+12%", label: "Croissance touristique" },
        { icon: Briefcase, value: "100+", label: "Projets hôteliers" },
    ],
    projects: [
        { name: "Extension du Golf de Saly", image: "https://images.unsplash.com/photo-1588622146436-e0a845a764e5?q=80&w=2070&auto=format&fit=crop" },
        { name: "Nouveau centre commercial", image: "https://images.unsplash.com/photo-1614917618217-21a1795029e2?q=80&w=2070&auto=format&fit=crop" },
    ]
  }
};

const MairiePage = () => {
  const { mairieSlug } = useParams();
  const [mairie, setMairie] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  useEffect(() => {
    setLoading(true);
    const mairieInfo = mairieDataSim[mairieSlug];
    if (mairieInfo) {
      setMairie(mairieInfo);
      const zoneName = mairieInfo.name.split("Mairie de ")[1];
      const mairieParcels = sampleParcels.filter(p => 
        p.zone.toLowerCase() === zoneName.toLowerCase() && (p.status === 'Disponible' || p.status === 'Attribution sur demande')
      ).slice(0, 6);
      setParcels(mairieParcels);
    }
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [mairieSlug]);

  if (loading) return <div className="container mx-auto py-20 text-center"><LoadingSpinner size="large"/></div>;
  if (!mairie) return <div className="container mx-auto py-20 text-center">Mairie non trouvée.</div>;

  return (
    <>
      <Helmet>
        <title>{mairie.name} - Opportunités Foncières | Teranga Foncier</title>
        <meta name="description" content={`Découvrez pourquoi investir à ${mairie.name}. Atouts, projets et terrains disponibles pour votre investissement au Sénégal.`} />
      </Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <section className="relative h-[70vh] text-white flex items-end pb-12 justify-center text-center">
            <Carousel plugins={[plugin.current]} className="absolute inset-0 z-0" onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
              <CarouselContent>{mairie.images.map((img, index) => (<CarouselItem key={index}><img  alt={`Paysage de ${mairie.name} ${index+1}`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1595872018818-97555653a011" /></CarouselItem>))}</CarouselContent>
            </Carousel>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative z-20 container mx-auto px-4">
            <Landmark className="h-16 w-16 mx-auto mb-4 text-white/80"/>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-shadow-lg">{mairie.name}</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90 text-shadow-md">{mairie.description}</p>
          </motion.div>
        </section>

        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }}>
                    <Card className="shadow-xl"><CardContent className="p-6 text-center">
                        <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary shadow-lg"><AvatarImage src={mairie.maire.avatar} /><AvatarFallback>{mairie.maire.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                        <h3 className="text-xl font-bold text-primary">M. le Maire {mairie.maire.name}</h3>
                        <blockquote className="mt-2 text-muted-foreground italic border-l-4 border-primary/20 pl-4 text-left">"{mairie.maire.mot}"</blockquote>
                    </CardContent></Card>
                </motion.div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {mairie.atouts.map((atout, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.1 }}>
                      <Card className="h-full shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300 border-l-4 border-primary">
                        <CardHeader className="flex-row items-center gap-4"><atout.icon className="h-8 w-8 text-primary flex-shrink-0" /><CardTitle className="text-base font-semibold">{atout.text}</CardTitle></CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20"><div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">La Commune en Chiffres</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {mairie.keyFigures.map(fig => (
                    <motion.div key={fig.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
                        <Card className="text-center p-6 shadow-lg"><fig.icon className="h-10 w-10 text-primary mx-auto mb-3" /><p className="text-4xl font-bold">{fig.value}</p><p className="text-muted-foreground">{fig.label}</p></Card>
                    </motion.div>
                ))}
            </div>
        </div></section>

        <section className="py-16 md:py-20 bg-muted/30"><div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Projets d'Avenir</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mairie.projects.map(proj => (
                    <motion.div key={proj.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}>
                        <Card className="overflow-hidden group"><div className="relative aspect-video"><img  src={proj.image} alt={proj.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /><div className="absolute inset-0 bg-black/40"></div><h3 className="absolute bottom-4 left-4 text-white text-xl font-bold z-10">{proj.name}</h3></div></Card>
                    </motion.div>
                ))}
            </div>
        </div></section>

        <section className="py-16 md:py-20"><div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Opportunités Foncières à {mairie.name.split("Mairie de ")[1]}</h2>
            {parcels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{parcels.map(parcel => (<ParcelCard key={parcel.id} parcel={parcel} />))}</div>
            ) : (<p className="text-center text-muted-foreground">Aucune parcelle en vedette pour cette commune pour le moment.</p>)}
            <div className="text-center mt-12"><Button asChild size="lg"><Link to={`/parcelles?zone=${mairie.name.split("Mairie de ")[1]}`}>Voir toutes les parcelles <ArrowRight className="ml-2 h-5 w-5" /></Link></Button></div>
        </div></section>

        <section className="py-20 md:py-24 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}>
                <Lightbulb className="h-16 w-16 mx-auto mb-4 text-amber-300"/>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Vous avez un projet ? La Mairie vous écoute !</h2>
                <p className="max-w-3xl mx-auto mb-8 text-lg text-primary-foreground/90">Que votre projet soit résidentiel, commercial, agricole ou industriel, la commune de {mairie.name.split("Mairie de ")[1]} est prête à vous accompagner. Soumettez votre demande d'attribution de terrain et contribuez au développement local.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" variant="secondary" className="text-lg py-6 px-8"><Link to={`/request-municipal-land?zone=${mairie.name.split("Mairie de ")[1]}`}><FileSignature className="mr-2 h-5 w-5"/>Démarrer ma demande</Link></Button>
                    <Button asChild size="lg" variant="outline" className="text-lg py-6 px-8 bg-transparent border-white text-white hover:bg-white hover:text-primary"><Link to="/contact?subject=Mairie">Contacter nos services</Link></Button>
                </div>
            </motion.div>
        </div></section>
      </motion.div>
    </>
  );
};

export default MairiePage;