import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Shield, 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  Info,
  User,
  Lock,
  Phone,
  Mail
} from 'lucide-react';

const TermsPage = () => {
  const lastUpdated = "1er décembre 2024";

  const sections = [
    {
      title: "1. Objet et Champ d'Application",
      icon: FileCheck,
      content: [
        "Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de la plateforme Teranga Foncier.",
        "Elles s'appliquent à tous les utilisateurs de la plateforme, qu'ils soient particuliers ou professionnels.",
        "L'utilisation de nos services implique l'acceptation pleine et entière des présentes CGU."
      ]
    },
    {
      title: "2. Définitions",
      icon: Info,
      content: [
        "Plateforme : Le site web et l'application mobile Teranga Foncier.",
        "Utilisateur : Toute personne physique ou morale utilisant la plateforme.",
        "Services : L'ensemble des fonctionnalités proposées par Teranga Foncier.",
        "Contenu : Toute information, donnée, texte, image publiée sur la plateforme."
      ]
    },
    {
      title: "3. Accès aux Services",
      icon: User,
      content: [
        "L'accès à certains services nécessite la création d'un compte utilisateur.",
        "L'utilisateur s'engage à fournir des informations exactes et à jour.",
        "Chaque utilisateur est responsable de la confidentialité de ses identifiants.",
        "Teranga Foncier se réserve le droit de suspendre ou supprimer un compte en cas de non-respect des CGU."
      ]
    },
    {
      title: "4. Utilisation de la Plateforme",
      icon: Shield,
      content: [
        "L'utilisateur s'engage à utiliser la plateforme de manière licite et conforme aux CGU.",
        "Il est interdit de porter atteinte au fonctionnement de la plateforme.",
        "L'utilisateur ne doit pas diffuser de contenu illégal, diffamatoire ou trompeur.",
        "Teranga Foncier se réserve le droit de modérer et supprimer tout contenu inapproprié."
      ]
    },
    {
      title: "5. Propriété Intellectuelle",
      icon: Lock,
      content: [
        "Tous les éléments de la plateforme sont protégés par les droits de propriété intellectuelle.",
        "L'utilisateur dispose d'un droit d'usage personnel et non commercial.",
        "Toute reproduction ou utilisation commerciale est interdite sans autorisation.",
        "Les marques et logos sont la propriété exclusive de Teranga Foncier."
      ]
    },
    {
      title: "6. Responsabilité",
      icon: AlertTriangle,
      content: [
        "Teranga Foncier s'efforce de maintenir la disponibilité et la sécurité de la plateforme.",
        "La responsabilité de Teranga Foncier ne peut être engagée en cas de force majeure.",
        "L'utilisateur utilise la plateforme sous sa propre responsabilité.",
        "Teranga Foncier ne garantit pas l'exactitude des informations tierces publiées."
      ]
    },
    {
      title: "7. Protection des Données",
      icon: Shield,
      content: [
        "Le traitement des données personnelles est régi par notre Politique de Confidentialité.",
        "L'utilisateur dispose des droits d'accès, de rectification et de suppression de ses données.",
        "Les données sont traitées conformément au RGPD et à la législation sénégalaise.",
        "Teranga Foncier s'engage à protéger la confidentialité des données utilisateurs."
      ]
    },
    {
      title: "8. Modification des CGU",
      icon: Clock,
      content: [
        "Teranga Foncier se réserve le droit de modifier les présentes CGU à tout moment.",
        "Les modifications entrent en vigueur dès leur publication sur la plateforme.",
        "L'utilisateur sera informé des modifications importantes par email.",
        "La poursuite de l'utilisation vaut acceptation des nouvelles CGU."
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Conditions d'Utilisation | Teranga Foncier</title>
        <meta name="description" content="Conditions générales d'utilisation de la plateforme Teranga Foncier. Droits, obligations et responsabilités des utilisateurs." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">
        
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                <Scale className="h-5 w-5" />
                <span className="font-medium">Document Légal</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Conditions d'Utilisation
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Termes et conditions régissant l'utilisation de la plateforme Teranga Foncier
              </p>
              
              <Badge variant="outline" className="border-white/20 text-white bg-white/10 backdrop-blur-sm">
                <Clock className="h-4 w-4 mr-2" />
                Dernière mise à jour : {lastUpdated}
              </Badge>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="mb-8 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Info className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Information Importante
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        En utilisant la plateforme Teranga Foncier, vous acceptez les présentes conditions d'utilisation 
                        dans leur intégralité. Nous vous recommandons de lire attentivement ce document et de le conserver 
                        pour référence future. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Sections des CGU */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <section.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                          {section.title}
                        </h2>
                      </div>
                      
                      <div className="space-y-3 ml-14">
                        {section.content.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-gray-600 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact et Questions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Questions sur nos Conditions ?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Notre équipe juridique est disponible pour répondre à vos questions
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Email Juridique</h3>
                    <p className="text-gray-600">legal@terangafoncier.com</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Assistance Juridique</h3>
                    <p className="text-gray-600">+221 33 XXX XX XX</p>
                  </CardContent>
                </Card>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                <Mail className="h-5 w-5 mr-2" />
                Nous Contacter
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TermsPage;
