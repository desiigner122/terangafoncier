import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Settings, 
  UserCheck,
  FileX,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Phone
} from 'lucide-react';

const DataProtectionPage = () => {
  const lastUpdated = "1er décembre 2024";

  const rights = [
    {
      title: "Droit d'Accès",
      description: "Accédez à toutes vos données personnelles que nous conservons",
      icon: Eye,
      action: "Demander mes données"
    },
    {
      title: "Droit de Rectification",
      description: "Corrigez ou mettez à jour vos informations personnelles",
      icon: Settings,
      action: "Modifier mes données"
    },
    {
      title: "Droit à l'Effacement",
      description: "Demandez la suppression de vos données personnelles",
      icon: FileX,
      action: "Supprimer mes données"
    },
    {
      title: "Droit à la Portabilité",
      description: "Récupérez vos données dans un format structuré",
      icon: Download,
      action: "Exporter mes données"
    }
  ];

  const dataTypes = [
    {
      category: "Données d'Identification",
      items: ["Nom et prénom", "Adresse email", "Numéro de téléphone", "Adresse postale"],
      purpose: "Identification et communication",
      retention: "Durée du compte + 3 ans",
      icon: UserCheck
    },
    {
      category: "Données de Navigation",
      items: ["Adresse IP", "Cookies", "Pages visitées", "Temps de connexion"],
      purpose: "Amélioration de l'expérience utilisateur",
      retention: "13 mois maximum",
      icon: Eye
    },
    {
      category: "Données Transactionnelles",
      items: ["Historique des achats", "Préférences", "Favoris", "Recherches sauvegardées"],
      purpose: "Personnalisation des services",
      retention: "Durée du compte + 5 ans",
      icon: Database
    },
    {
      category: "Données Techniques",
      items: ["Type d'appareil", "Navigateur", "Système d'exploitation", "Résolution d'écran"],
      purpose: "Optimisation technique",
      retention: "12 mois",
      icon: Settings
    }
  ];

  const securityMeasures = [
    {
      title: "Chiffrement des Données",
      description: "Toutes les données sensibles sont chiffrées avec des algorithmes de niveau bancaire",
      icon: Lock,
      level: "Très Élevé"
    },
    {
      title: "Accès Restreint",
      description: "Seul le personnel autorisé peut accéder aux données selon le principe du moindre privilège",
      icon: Shield,
      level: "Élevé"
    },
    {
      title: "Surveillance Continue",
      description: "Monitoring 24/7 pour détecter toute tentative d'accès non autorisé",
      icon: Eye,
      level: "Très Élevé"
    },
    {
      title: "Sauvegarde Sécurisée",
      description: "Sauvegardes régulières et chiffrées sur des serveurs sécurisés",
      icon: Database,
      level: "Élevé"
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Très Élevé': return 'bg-green-500';
      case 'Élevé': return 'bg-blue-500';
      case 'Moyen': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <Helmet>
        <title>Protection des Données | Teranga Foncier</title>
        <meta name="description" content="Politique de protection des données personnelles de Teranga Foncier. Vos droits, nos engagements et mesures de sécurité." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20">
        
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Sécurité & Confidentialité</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Protection des Données
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Votre vie privée est notre priorité. Découvrez comment nous protégeons vos données.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Lock className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Chiffrement Total</div>
                  <div className="text-sm opacity-80">Données sécurisées</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <UserCheck className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Contrôle Complet</div>
                  <div className="text-sm opacity-80">Vos droits respectés</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Conformité RGPD</div>
                  <div className="text-sm opacity-80">Standards européens</div>
                </div>
              </div>

              <Badge variant="outline" className="border-white/20 text-white bg-white/10 backdrop-blur-sm">
                <Clock className="h-4 w-4 mr-2" />
                Dernière mise à jour : {lastUpdated}
              </Badge>
            </motion.div>
          </div>
        </section>

        {/* Vos Droits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Vos Droits sur vos Données
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Vous gardez le contrôle total sur vos données personnelles
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {rights.map((right, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                        <right.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{right.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{right.description}</p>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        {right.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Types de Données */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quelles Données Collectons-nous ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Transparence totale sur la collecte et l'utilisation de vos informations
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {dataTypes.map((dataType, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <dataType.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{dataType.category}</h3>
                          <ul className="space-y-1 mb-4">
                            {dataType.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">FINALITÉ</div>
                          <div className="text-sm text-gray-900">{dataType.purpose}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">CONSERVATION</div>
                          <div className="text-sm text-gray-900">{dataType.retention}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mesures de Sécurité */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nos Mesures de Sécurité
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Protection maximale de vos données avec les technologies les plus avancées
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {securityMeasures.map((measure, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <measure.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{measure.title}</h3>
                            <Badge className={`${getLevelColor(measure.level)} text-white text-xs`}>
                              {measure.level}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{measure.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact DPO */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <AlertCircle className="h-12 w-12 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">
                Questions sur vos Données ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Notre Délégué à la Protection des Données (DPO) est à votre disposition
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <Mail className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email DPO</h3>
                  <p>dpo@terangafoncier.com</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <Phone className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Téléphone</h3>
                  <p>+221 77 593 42 41</p>
                </div>
              </div>

              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <Mail className="h-5 w-5 mr-2" />
                Contacter notre DPO
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DataProtectionPage;
