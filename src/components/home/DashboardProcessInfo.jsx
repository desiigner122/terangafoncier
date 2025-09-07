import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  MessageSquare,
  FileCheck,
  CreditCard,
  Lock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DashboardProcessInfo = () => {
  const processSteps = [
    {
      icon: Users,
      title: "Inscription Sécurisée",
      description: "Créez votre compte avec vérification d'identité",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Shield,
      title: "Dashboard Personnalisé", 
      description: "Accédez à votre espace sécurisé de transactions",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MessageSquare,
      title: "Communication Contrôlée",
      description: "Échangez avec vendeurs via messagerie sécurisée",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: FileCheck,
      title: "Documents Vérifiés",
      description: "Tous les documents validés par nos experts",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-indigo-100 text-indigo-700 mb-4">
              <Lock className="h-4 w-4 mr-2" />
              Processus Sécurisé
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Toutes les Transactions via Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pour votre sécurité, toutes les communications et transactions se font 
              exclusivement via vos dashboards personnalisés. Aucun contact direct.
            </p>
          </motion.div>
        </div>

        {/* Processus */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Avantages sécurité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-sm"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            🔒 Pourquoi tout via Dashboard ?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sécurité Maximale</h4>
              <p className="text-sm text-gray-600">
                Protection contre fraudes et arnaques
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Traçabilité Complète</h4>
              <p className="text-sm text-gray-600">
                Historique de toutes les interactions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Paiements Sécurisés</h4>
              <p className="text-sm text-gray-600">
                Transactions protégées et vérifiées
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardProcessInfo;
