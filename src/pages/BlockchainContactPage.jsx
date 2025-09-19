import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  ArrowRight,
  CheckCircle,
  Blocks,
  Shield,
  Users,
  Globe,
  Star,
  Building,
  Headphones,
  Calendar,
  Zap,
  Database,
  Brain,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Helmet } from 'react-helmet-async';

const BlockchainContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    urgency: 'normal'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const contactCategories = [
    { value: 'blockchain', label: 'Questions Blockchain/NFT', icon: Blocks },
    { value: 'investment', label: 'Opportunités Investissement', icon: TrendingUp },
    { value: 'diaspora', label: 'Services Diaspora', icon: Globe },
    { value: 'construction', label: 'Suivi Construction', icon: Building },
    { value: 'technical', label: 'Support Technique', icon: Headphones },
    { value: 'partnership', label: 'Partenariats', icon: Users },
    { value: 'other', label: 'Autre', icon: MessageSquare }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Basse - Réponse sous 48h', color: 'text-green-400' },
    { value: 'normal', label: 'Normale - Réponse sous 24h', color: 'text-blue-400' },
    { value: 'high', label: 'Élevée - Réponse sous 4h', color: 'text-orange-400' },
    { value: 'urgent', label: 'Urgente - Réponse immédiate', color: 'text-red-400' }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Téléphone',
      primary: '+221 33 XXX XX XX',
      secondary: '+221 77 XXX XX XX',
      description: 'Support direct 9h-18h',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Mail,
      title: 'Email',
      primary: 'contact@terangafoncier.com',
      secondary: 'support@terangafoncier.com',
      description: 'Réponse sous 2h en moyenne',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageSquare,
      title: 'Chat IA',
      primary: 'Assistant TERRA-IA',
      secondary: 'Disponible 24/7',
      description: 'Réponses instantanées',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Rendez-vous',
      primary: 'Consultation personnalisée',
      secondary: 'Visio ou présentiel',
      description: 'Expertise dédiée',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const officeLocations = [
    {
      city: 'Dakar',
      address: 'Plateau, Avenue Léopold Sédar Senghor',
      description: 'Siège Social & Hub Innovation',
      hours: 'Lun-Ven: 8h-18h, Sam: 9h-13h',
      color: 'from-blue-500 to-purple-500'
    },
    {
      city: 'Thiès',
      address: 'Centre-ville, près de la Gare',
      description: 'Antenne Régionale',
      hours: 'Lun-Ven: 9h-17h',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      city: 'Saint-Louis',
      address: 'Île de Saint-Louis, Rue Blaise Diagne',
      description: 'Bureau Régional Nord',
      hours: 'Lun-Ven: 9h-17h',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const supportStats = [
    { label: 'Temps Réponse Moyen', value: '2h', icon: Clock },
    { label: 'Satisfaction Client', value: '98.5%', icon: Star },
    { label: 'Demandes Traitées/Jour', value: '150+', icon: MessageSquare },
    { label: 'Langues Supportées', value: '4', icon: Globe }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'envoi
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
        urgency: 'normal'
      });
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Contact - Teranga Foncier | Support Blockchain 24/7</title>
        <meta name="description" content="Contactez notre équipe d'experts blockchain immobilier. Support multicanal, réponse rapide et assistance personnalisée." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-6 py-2">
                <Headphones className="w-4 h-4 mr-2" />
                Support Expert 24/7
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Contactez Nos Experts
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Blockchain Immobilier
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                Une question sur nos solutions blockchain ? Notre équipe d'experts est lÏ  pour vous accompagner 
                dans votre projet immobilier au Sénégal
              </p>

              {/* Support Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {supportStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                      <CardContent className="p-4 text-center">
                        <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/70">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Plusieurs Moyens de Nous Contacter
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choisissez le canal qui vous convient le mieux pour obtenir une assistance rapide et personnalisée
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center`}>
                        <method.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                      <p className="text-gray-600 mb-2">{method.primary}</p>
                      <p className="text-sm text-gray-500 mb-3">{method.secondary}</p>
                      <Badge className="bg-gray-100 text-gray-700 border-0">
                        {method.description}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      Envoyez-nous un Message
                    </CardTitle>
                    <p className="text-gray-600">
                      Décrivez votre projet ou votre question, nous vous répondrons rapidement
                    </p>
                  </CardHeader>
                  <CardContent>
                    {showSuccess && (
                      <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom Complet</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            YOUR_API_KEY="Votre nom complet"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            YOUR_API_KEY="votre@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            YOUR_API_KEY="+221 XX XXX XX XX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Catégorie</Label>
                          <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                            <SelectTrigger>
                              <SelectValue YOUR_API_KEY="Choisir une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {contactCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          YOUR_API_KEY="Résumé de votre demande"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Niveau d'Urgence</Label>
                        <Select value={formData.urgency} onValueChange={(value) => handleSelectChange('urgency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <span className={level.color}>{level.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          YOUR_API_KEY="Décrivez votre projet, votre question ou votre besoin en détail..."
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer le Message
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Office Locations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Nos Bureaux au Sénégal
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Retrouvez-nous dans nos différentes antennes pour un accompagnement de proximité
                  </p>
                </div>

                {officeLocations.map((office, index) => (
                  <motion.div
                    key={office.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${office.color} flex items-center justify-center flex-shrink-0`}>
                            <MapPin className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-1">{office.city}</h4>
                            <p className="text-gray-600 mb-2">{office.address}</p>
                            <p className="text-sm text-gray-500 mb-2">{office.description}</p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{office.hours}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Quick Contact Card */}
                <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold mb-3">Besoin d'une Réponse Immédiate ?</h4>
                    <p className="text-white/90 mb-4">
                      Notre assistant IA TERRA est disponible 24/7 pour répondre Ï  vos questions sur la blockchain immobilière
                    </p>
                    <Button className="bg-white text-blue-600 hover:bg-white/90">
                      <Brain className="mr-2 h-4 w-4" />
                      Chattez avec TERRA-IA
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlockchainContactPage;
