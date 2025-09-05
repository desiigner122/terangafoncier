import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Star, 
  Quote
} from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Fatou B.",
    location: "Diaspora (France)",
    quote: "Grâce à Teranga Foncier, j'ai pu acheter mon terrain à Diamniadio en toute confiance depuis Paris. Le processus de vérification m'a vraiment rassurée. Service impeccable !",
    rating: 5,
    avatarDesc: "Avatar Fatou B.",
    avatarTextDesc: "Portrait d'une femme sénégalaise professionnelle"
  },
  {
    name: "Moussa D.",
    location: "Dakar",
    quote: "J'étais sceptique au début, mais leur équipe a été très professionnelle. Ils ont vérifié tous les FileTexts et m'ont accompagné chez le notaire. Je recommande vivement.",
    rating: 5,
    avatarDesc: "Avatar Moussa D.",
    avatarTextDesc: "Portrait d'un homme sénégalais souriant"
  },
  {
    name: "Aïcha S.",
    location: "Diaspora (Canada)",
    quote: "Enfin une plateforme sérieuse pour investir au pays ! La carte interactive et les détails sur chaque parcelle sont très utiles. J'ai trouvé le terrain parfait pour ma future maison.",
    rating: 4,
    avatarDesc: "Avatar Aïcha S.",
    avatarTextDesc: "Portrait d'une femme canadienne heureuse"
  },
   {
    name: "Ibrahim K.",
    location: "Thiès",
    quote: "Leur engagement contre la fraude est réel. Ils ont détecté une anomalie sur un terrain qui m'intéressait et m'ont évité de gros problèmes. Merci Teranga Foncier !",
    rating: 5,
    avatarDesc: "Avatar Ibrahim K.",
    avatarTextDesc: "Portrait d'un homme africain, type entrepreneur"
  },
];

const TestimonialsSection = () => {
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
                            <img  className="w-full h-full object-cover rounded-full" alt={testimonial.avatarDesc} src="https://images.unsplash.com/photo-1613231634498-74aa35fc5820" />
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