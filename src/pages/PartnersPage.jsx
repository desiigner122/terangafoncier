import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  CreditCard, 
  Users, 
  Shield, 
  Landmark, 
  FileText, 
  Globe, 
  TrendingUp,
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  Database,
  Lock,
  Blocks,
  Heart
} from 'lucide-react';

const PartnersPage = () => {
  const partnerCategories = [
    {
      category: "Institutions Financières",
      icon: CreditCard,
      description: "Banques et institutions de financement partenaires",
      partners: [
        {
          name: "CBAO Groupe Attijariwafa Bank",
          type: "Banque Commerciale",
          services: ["Crédit immobilier", "Financement terrain", "Garanties"],
          logo: "🏦",
          certified: true
        },
        {
          name: "Bank of Africa (BOA)",
          type: "Banque Commerciale", 
          services: ["Crédit habitat", "Prêts personnels", "Assurances"],
          logo: "🏦",
          certified: true
        },
        {
          name: "Ecobank Sénégal",
          type: "Banque Régionale",
          services: ["Financement diaspora", "Transferts", "Épargne"],
          logo: "🏦",
          certified: true
        }
      ]
    },
    {
      category: "Autorités Publiques",
      icon: Landmark,
      description: "Mairies et administrations partenaires",
      partners: [
        {
          name: "Mairie de Dakar",
          type: "Administration Locale",
          services: ["Terrains communaux", "Permis construire", "Urbanisme"],
          logo: "🏛️",
          certified: true
        },
        {
          name: "Commune de Guédiawaye",
          type: "Administration Locale",
          services: ["Lotissements sociaux", "Attribution terrains", "Viabilisation"],
          logo: "🏛️",
          certified: true
        },
        {
          name: "Commune de Pikine",
          type: "Administration Locale",
          services: ["Zones d'extension", "Régularisation", "Délibérations"],
          logo: "🏛️",
          certified: true
        }
      ]
    },
    {
      category: "Professionnels du Droit",
      icon: FileText,
      description: "Notaires, avocats et experts juridiques",
      partners: [
        {
          name: "Ordre des Notaires du Sénégal",
          type: "Ordre Professionnel",
          services: ["Authentification", "Actes notariés", "Conseils juridiques"],
          logo: "⚖️",
          certified: true
        },
        {
          name: "Cabinet Notaire Diop & Associés",
          type: "Étude Notariale",
          services: ["Transactions immobilières", "Hypothèques", "Successions"],
          logo: "⚖️",
          certified: true
        },
        {
          name: "SCP Fall, Seck & Partners",
          type: "Étude Notariale",
          services: ["Droit foncier", "Urbanisme", "Contentieux"],
          logo: "⚖️",
          certified: true
        }
      ]
    },
    {
      category: "Technologie Blockchain",
      icon: Blocks,
      description: "Partenaires technologiques et blockchain",
      partners: [
        {
          name: "Ethereum Foundation",
          type: "Fondation Blockchain",
          services: ["Infrastructure", "Smart contracts", "Sécurité"],
          logo: "⟐",
          certified: true
        },
        {
          name: "Polygon Technology",
          type: "Réseau Layer 2",
          services: ["Transactions rapides", "Coûts réduits", "Évolutivité"],
          logo: "◈",
          certified: true
        },
        {
          name: "Chainlink",
          type: "Oracle Blockchain",
          services: ["Données externes", "Prix immobilier", "Vérifications"],
          logo: "🔗",
          certified: true
        }
      ]
    }
  ];

  const stats = [
    { number: "150+", label: "Partenaires Certifiés", icon: Heart },
    { number: "45+", label: "Mairies Connectées", icon: Landmark },
    { number: "12", label: "Banques Partenaires", icon: CreditCard },
    { number: "98%", label: "Taux de Satisfaction", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <SEO
        title="Nos Partenaires - Écosystème Fiable de l'Immobilier Sénégalais"
        description="Découvrez nos partenaires certifiés : banques, notaires, mairies, géomètres et experts blockchain. Un réseau complet pour sécuriser vos transactions immobilières au Sénégal."
        keywords="partenaires immobilier sénégal, banques sénégal, notaires partenaires, mairies sénégal, écosystème foncier"
        canonicalUrl="https://www.terangafoncier.sn/partners"
      />

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-4">
              🤝 Écosystème de Confiance
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Nos Partenaires
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Blockchain Certifiés
              </span>
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              Un réseau de partenaires institutionnels et technologiques de premier plan 
              pour révolutionner l'immobilier au Sénégal avec la blockchain.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-indigo-200 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Partner Categories */}
      <div className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {partnerCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + categoryIndex * 0.2 }}
              >
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center mb-4">
                    <category.icon className="w-8 h-8 text-yellow-400 mr-3" />
                    <h2 className="text-3xl font-bold text-white">{category.category}</h2>
                  </div>
                  <p className="text-indigo-200 max-w-2xl mx-auto">{category.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.partners.map((partner, partnerIndex) => (
                    <Card key={partnerIndex} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-3xl">{partner.logo}</div>
                          {partner.certified && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Certifié
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-white mb-2">{partner.name}</h3>
                        <p className="text-yellow-400 text-sm mb-3">{partner.type}</p>
                        <div className="space-y-1">
                          {partner.services.map((service, serviceIndex) => (
                            <div key={serviceIndex} className="flex items-center text-indigo-200 text-xs">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                              {service}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Rejoignez Notre Écosystème
            </h2>
            <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
              Vous êtes une institution financière, une administration ou un professionnel ? 
              Devenez partenaire et participez à la révolution blockchain de l'immobilier.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8">
                Devenir Partenaire
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                Contacter Notre Équipe
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;