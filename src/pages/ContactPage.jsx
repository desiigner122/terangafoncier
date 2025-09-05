import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Building, 
  HelpCircle, 
  Loader2, 
  Linkedin,
  Users,
  MessageCircle,
  Globe,
  Calendar,
  CheckCircle,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    subject: '', 
    category: '',
    message: '',
    preferredContact: 'email'
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: formData.name, 
            email: formData.email,
            phone: formData.phone, 
            subject: formData.subject,
            category: formData.category, 
            message: formData.message,
            preferred_contact: formData.preferredContact
          }
        ]);

      if (error) {
        throw error;
      }

      window.safeGlobalToast({
        title: "Message Envoyé !",
        description: "Merci de nous avoir contactés. Votre message a été enregistré et nous reviendrons vers vous sous 24h.",
        className: "bg-green-500 text-white",
      });
      setFormData({ 
        name: '', 
        email: '', 
        phone: '',
        subject: '', 
        category: '',
        message: '',
        preferredContact: 'email'
      });

    } catch (error) {
      console.error('Error sending contact form:', error);
      window.safeGlobalToast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Appelez-nous",
      description: "Disponible 7j/7 de 8h à 22h",
      value: "+221 77 593 42 41",
      action: "tel:+221775934241",
      bg: "from-green-500 to-emerald-500"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Réponse sous 24h garantie",
      value: "contact@terangafoncier.com",
      action: "mailto:contact@terangafoncier.com",
      bg: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat en temps réel",
      value: "+221 77 593 42 41",
      action: "https://wa.me/221775934241",
      bg: "from-green-600 to-green-500"
    },
    {
      icon: MapPin,
      title: "Adresse",
      description: "Visitez nos bureaux",
      value: "Dakar, Sénégal",
      action: "https://maps.google.com/?q=Dakar,Senegal",
      bg: "from-purple-500 to-indigo-500"
    }
  ];

  const team = [
    {
      name: "Abdoulaye Diémé",
      role: "CEO & Fondateur",
      description: "Expert en foncier avec 15+ ans d'expérience",
      email: "palaye122@gmail.com",
      phone: "+221 77 593 42 41",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Équipe Support",
      role: "Service Client",
      description: "Accompagnement personnalisé 7j/7",
      email: "support@terangafoncier.com",
      phone: "+221 77 593 42 41",
      avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const socialLinks = [
    { icon: Linkedin, url: "https://linkedin.com/company/terangafoncier", name: "LinkedIn" },
    { icon: Facebook, url: "https://facebook.com/terangafoncier", name: "Facebook" },
    { icon: Twitter, url: "https://twitter.com/terangafoncier", name: "Twitter" },
    { icon: Instagram, url: "https://instagram.com/terangafoncier", name: "Instagram" },
    { icon: Youtube, url: "https://youtube.com/@terangafoncier", name: "YouTube" }
  ];

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Helmet>
        <title>Contact - Teranga Foncier</title>
        <meta name="description" content="Contactez l'équipe Teranga Foncier. Support 7j/7, experts en foncier sénégalais. Abdoulaye Diémé CEO disponible directement." />
        <meta name="keywords" content="contact Teranga Foncier, support client, aide achat terrain Sénégal" />
      </Helmet>

      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="min-h-screen bg-gray-50 pt-20"
      >
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-blue-50 to-emerald-50 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              variants={itemVariants}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge variant="outline" className="mb-4">
                <MessageCircle className="h-4 w-4 mr-2" />
                Support Premium
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Parlons de Votre{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Projet
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Notre équipe d'experts est là pour vous accompagner dans votre investissement foncier au Sénégal. 
                Contact direct avec le CEO garantie.
              </p>
              
              {/* Stats Contact */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24h</div>
                  <div className="text-sm text-gray-600">Réponse garantie</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">7j/7</div>
                  <div className="text-sm text-gray-600">Disponibilité</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2,500+</div>
                  <div className="text-sm text-gray-600">Clients accompagnés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Formulaire de Contact */}
            <div className="lg:col-span-2">
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Envoyez-nous un Message</CardTitle>
                    <CardDescription>
                      Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nom complet *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Votre nom complet"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="votre@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+221 XX XXX XX XX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Catégorie</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleSelectChange('category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisissez une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="terrain">Achat de terrain</SelectItem>
                              <SelectItem value="construction">Construction à distance</SelectItem>
                              <SelectItem value="communal">Demande communale</SelectItem>
                              <SelectItem value="support">Support technique</SelectItem>
                              <SelectItem value="partenariat">Partenariat professionnel</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Sujet *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Le sujet de votre message"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Décrivez votre projet ou votre question en détail..."
                          rows={5}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="preferredContact">Moyen de contact préféré</Label>
                        <Select
                          value={formData.preferredContact}
                          onValueChange={(value) => handleSelectChange('preferredContact', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Téléphone</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer le Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Méthodes de Contact */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-bold mb-6">Contactez-nous Directement</h3>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${method.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <method.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{method.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                            <a 
                              href={method.action}
                              className="text-primary hover:text-primary/80 font-medium text-sm"
                              target={method.action.startsWith('http') ? '_blank' : undefined}
                              rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {method.value}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Équipe */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-bold mb-6">Notre Équipe</h3>
                <div className="space-y-4">
                  {team.map((member, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{member.name}</h4>
                            <p className="text-primary text-sm font-medium">{member.role}</p>
                            <p className="text-sm text-gray-600 mt-1">{member.description}</p>
                            
                            <div className="flex gap-3 mt-3">
                              <a
                                href={`mailto:${member.email}`}
                                className="text-xs text-gray-500 hover:text-primary"
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                              <a
                                href={`tel:${member.phone}`}
                                className="text-xs text-gray-500 hover:text-primary"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Réseaux Sociaux */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Suivez-nous</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <social.icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Horaires */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Horaires de Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Lundi - Vendredi</span>
                        <span className="font-medium">8h - 22h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samedi - Dimanche</span>
                        <span className="font-medium">9h - 20h</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Support 7j/7
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ContactPage;
