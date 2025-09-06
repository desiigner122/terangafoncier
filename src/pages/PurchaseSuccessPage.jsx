import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Download, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  Share2,
  Home,
  ArrowRight,
  Clock,
  Shield,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const PurchaseSuccessPage = () => {
  const { propertyId } = useParams();
  const location = useLocation();
  const [isAnimated, setIsAnimated] = useState(false);
  
  const { purchaseData, property } = location.state || {};
  
  const [confirmationNumber] = useState(`TF${Date.now().toString().slice(-6)}`);
  const [estimatedCompletionDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
  );

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const nextSteps = [
    {
      title: 'Vérification des documents',
      description: 'Nos experts vérifient tous vos documents',
      status: 'pending',
      duration: '2-3 jours ouvrables'
    },
    {
      title: 'Validation juridique',
      description: 'Contrôle juridique par nos notaires partenaires',
      status: 'upcoming',
      duration: '5-7 jours ouvrables'
    },
    {
      title: 'Finalisation du transfert',
      description: 'Signature finale et transfert de propriété',
      status: 'upcoming',
      duration: '3-5 jours ouvrables'
    }
  ];

  const documents = [
    {
      name: 'Confirmation d\'achat',
      description: 'Récapitulatif complet de votre transaction',
      downloadUrl: '#'
    },
    {
      name: 'Contrat de réservation',
      description: 'Document légal de réservation de votre bien',
      downloadUrl: '#'
    },
    {
      name: 'Guide de l\'acheteur',
      description: 'Informations sur les prochaines étapes',
      downloadUrl: '#'
    }
  ];

  if (!property || !purchaseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Données de transaction non trouvées</h1>
          <Link to="/parcelles" className="text-blue-600 hover:text-blue-700">
            Retour aux propriétés
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Félicitations !
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Votre achat a été confirmé avec succès
          </p>
          <p className="text-lg text-gray-500">
            Numéro de confirmation: <span className="font-mono font-semibold text-blue-600">{confirmationNumber}</span>
          </p>
        </motion.div>

        {/* Property Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails de votre achat</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-4">{property.location}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{property.area}m²</span>
                <span>•</span>
                <span>{property.type}</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4">Informations de l'acheteur</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Nom:</span> <span className="font-medium">{purchaseData.personalInfo.firstName} {purchaseData.personalInfo.lastName}</span></p>
                  <p><span className="text-gray-600">Email:</span> <span className="font-medium">{purchaseData.personalInfo.email}</span></p>
                  <p><span className="text-gray-600">Téléphone:</span> <span className="font-medium">{purchaseData.personalInfo.phone}</span></p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-4">Détails financiers</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Prix total:</span> <span className="font-bold text-green-600 text-lg">{property.price.toLocaleString()} FCFA</span></p>
                  <p><span className="text-gray-600">Mode de paiement:</span> 
                    <span className="font-medium ml-1">
                      {purchaseData.paymentMethod === 'bank_transfer' && 'Virement bancaire'}
                      {purchaseData.paymentMethod === 'mobile_money' && 'Mobile Money'}
                      {purchaseData.paymentMethod === 'installments' && 'Paiement échelonné'}
                    </span>
                  </p>
                  <p><span className="text-gray-600">Statut:</span> <span className="font-medium text-green-600">Confirmé</span></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Prochaines étapes</h2>
          <div className="space-y-6">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                  step.status === 'completed' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Durée estimée: {step.duration}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">Date de finalisation estimée</h4>
                <p className="text-blue-700">{estimatedCompletionDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents disponibles</h2>
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Support & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Support */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Besoin d'aide ?</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                <Phone className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Support téléphonique</p>
                  <p className="text-sm text-gray-600">+221 33 123 45 67</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email support</p>
                  <p className="text-sm text-gray-600">support@terangafoncier.sn</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Chat en direct</p>
                  <p className="text-sm text-gray-600">Disponible 24h/24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h3>
            <div className="space-y-4">
              <Link
                to="/dashboard"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Aller au Dashboard
              </Link>
              
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Partager cette transaction
              </button>
              
              <Link
                to="/parcelles"
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Voir d'autres propriétés
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Transaction sécurisée</span>
              </div>
              <p className="text-sm text-green-700">
                Votre paiement est protégé par notre système de séquestre jusqu'à la finalisation complète.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
