import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Home, 
  Plane, 
  Video, 
  DollarSign, 
  Shield, 
  Clock, 
  Users, 
  Camera, 
  FileText, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  ArrowRight, 
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DiasporaGuidePage = () => {
  const features = [
    {
      icon: Home,
      title: "Construction à Distance",
      description: "Pilotez votre projet de construction depuis l'étranger avec un suivi en temps réel.",
      benefits: ["Suivi photo/vidéo quotidien", "Rapports de progression", "Gestion des fournisseurs"],
      href: "/solutions/construction-distance"
    },
    {
      icon: Globe,
      title: "Investissement Diaspora",
      description: "Investissez dans l'immobilier sénégalais avec des garanties renforcées.",
      benefits: ["Vérification légale complète", "Assurance anti-fraude", "ROI transparent"],
      href: "/solutions/diaspora-investment"
    },
    {
      icon: Plane,
      title: "Suivi Projet Live",
      description: "Surveillez vos travaux en temps réel avec des rapports détaillés.",
      benefits: ["Caméras de surveillance", "Rapports hebdomadaires", "Validation d'étapes"],
      href: "/solutions/project-monitoring"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Consultation Initiale",
      description: "Échange avec nos experts pour définir votre projet et vos besoins spécifiques.",
      duration: "1-2 jours"
    },
    {
      step: "02", 
      title: "Sélection & Vérification",
      description: "Identification du terrain/bien idéal avec vérification légale complète.",
      duration: "1-2 semaines"
    },
    {
      step: "03",
      title: "Sécurisation Juridique",
      description: "Finalisation des actes authentiques et mise en place des garanties.",
      duration: "2-3 semaines"
    },
    {
      step: "04",
      title: "Suivi de Projet",
      description: "Pilotage à distance avec rapports réguliers et validation d'étapes.",
      duration: "Selon projet"
    }
  ];

  const testimonials = [
    {
      name: "Amadou Diallo",
      location: "Paris, France",
      text: "J'ai pu construire ma maison à Dakar depuis la France grâce au suivi en temps réel. Excellente expérience !",
      rating: 5
    },
    {
      name: "Fatou Sow",
      location: "New York, USA", 
      text: "Investissement sécurisé et transparent. Les rapports réguliers m'ont donné confiance.",
      rating: 5
    },
    {
      name: "Moussa Ba",
      location: "Montréal, Canada",
      text: "Service exceptionnel pour la diaspora. Je recommande vivement !",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🌍 Spécialement conçu pour la Diaspora Sénégalaise
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Investissez au Sénégal
              <span className="block text-primary">Depuis l'Étranger</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Construisez, investissez et gérez vos biens immobiliers au Sénégal 
              en toute sécurité depuis n'importe où dans le monde.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Commencer Mon Projet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Phone className="mr-2 h-5 w-5" />
                Consultation Gratuite
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Solutions Diaspora
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des services pensés spécifiquement pour répondre aux besoins 
              de la diaspora sénégalaise dans le monde.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full" variant="outline">
                      <Link to={feature.href}>
                        En Savoir Plus
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment Ça Marche ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un processus simple et sécurisé en 4 étapes pour concrétiser 
              votre projet immobilier au Sénégal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-2">{step.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {step.duration}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Témoignages de la Diaspora
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les expériences de nos clients diaspora qui ont 
              concrétisé leurs projets avec Teranga Foncier.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Commencer Votre Projet ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des centaines de membres de la diaspora qui nous font confiance 
              pour leurs investissements immobiliers au Sénégal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Consultation Gratuite
                <Phone className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                Voir Nos Projets
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DiasporaGuidePage;
