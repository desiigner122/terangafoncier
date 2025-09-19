import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  CreditCard, 
  FileText, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  DollarSign,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const PurchaseProcessPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Sénégal'
    },
    paymentMethod: '',
    paymentSchedule: 'full',
    legalDocuments: {
      identityProof: null,
      incomeProof: null,
      bankStatement: null
    },
    agreement: false
  });

  const [property] = useState({
    id: propertyId || '123',
    title: 'Terrain de 500mÂ² Ï  Almadies',
    location: 'Almadies, Dakar',
    price: 75000000,
    area: 500,
    type: 'Terrain',
    description: 'Magnifique terrain viabilisé dans un quartier résidentiel calme',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Viabilisé', 'Titre foncier', 'Proche des commodités'],
    seller: {
      name: 'Amadou Ndiaye',
      phone: '+221 77 123 45 67',
      verified: true
    }
  });

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Mode de paiement', icon: CreditCard },
    { id: 3, title: 'Documents légaux', icon: FileText },
    { id: 4, title: 'Confirmation', icon: Check }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (section, field, value) => {
    setPurchaseData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (field, file) => {
    setPurchaseData(prev => ({
      ...prev,
      legalDocuments: {
        ...prev.legalDocuments,
        [field]: file
      }
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulation d'API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Redirection vers page de succès
      navigate(`/purchase-success/${property.id}`, {
        state: { purchaseData, property }
      });
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={purchaseData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez votre prénom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={purchaseData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez votre nom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={purchaseData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={purchaseData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+221 77 123 45 67"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={purchaseData.personalInfo.address}
                  onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre adresse complète"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  value={purchaseData.personalInfo.city}
                  onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dakar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <select
                  value={purchaseData.personalInfo.country}
                  onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Sénégal">Sénégal</option>
                  <option value="France">France</option>
                  <option value="États-Unis">États-Unis</option>
                  <option value="Canada">Canada</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Mode de paiement</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Prix total</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {property.price.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Choisissez votre mode de paiement</h4>
                
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={purchaseData.paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPurchaseData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Virement bancaire</p>
                    <p className="text-sm text-gray-600">Paiement sécurisé par virement</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile_money"
                    checked={purchaseData.paymentMethod === 'mobile_money'}
                    onChange={(e) => setPurchaseData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Mobile Money</p>
                    <p className="text-sm text-gray-600">Orange Money, Free Money, Wave</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="installments"
                    checked={purchaseData.paymentMethod === 'installments'}
                    onChange={(e) => setPurchaseData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Paiement échelonné</p>
                    <p className="text-sm text-gray-600">Payez en plusieurs fois</p>
                  </div>
                </label>
              </div>

              {purchaseData.paymentMethod === 'installments' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3">Options de paiement échelonné</h5>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentSchedule"
                        value="3_months"
                        checked={purchaseData.paymentSchedule === '3_months'}
                        onChange={(e) => setPurchaseData(prev => ({ ...prev, paymentSchedule: e.target.value }))}
                        className="mr-2"
                      />
                      <span className="text-sm">3 mensualités de {Math.round(property.price / 3).toLocaleString()} FCFA</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentSchedule"
                        value="6_months"
                        checked={purchaseData.paymentSchedule === '6_months'}
                        onChange={(e) => setPurchaseData(prev => ({ ...prev, paymentSchedule: e.target.value }))}
                        className="mr-2"
                      />
                      <span className="text-sm">6 mensualités de {Math.round(property.price / 6).toLocaleString()} FCFA</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentSchedule"
                        value="12_months"
                        checked={purchaseData.paymentSchedule === '12_months'}
                        onChange={(e) => setPurchaseData(prev => ({ ...prev, paymentSchedule: e.target.value }))}
                        className="mr-2"
                      />
                      <span className="text-sm">12 mensualités de {Math.round(property.price / 12).toLocaleString()} FCFA</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Documents légaux</h3>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Documents requis</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Ces documents sont nécessaires pour finaliser votre achat en toute sécurité
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Pièce d'identité</h4>
                    {purchaseData.legalDocuments.identityProof && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Carte d'identité, passeport ou permis de conduire</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('identityProof', e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Justificatif de revenus</h4>
                    {purchaseData.legalDocuments.incomeProof && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Bulletin de salaire, attestation d'employeur ou avis d'imposition</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('incomeProof', e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Relevé bancaire</h4>
                    {purchaseData.legalDocuments.bankStatement && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Relevé bancaire des 3 derniers mois</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('bankStatement', e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={purchaseData.agreement}
                    onChange={(e) => setPurchaseData(prev => ({ ...prev, agreement: e.target.checked }))}
                    className="mt-1"
                  />
                  <div className="text-sm text-gray-700">
                    <p>J'accepte les <a href="#" className="text-blue-600 hover:underline">conditions générales de vente</a> et je certifie que toutes les informations fournies sont exactes.</p>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Confirmation de votre achat</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800 text-lg">Félicitations !</h4>
                  <p className="text-green-700 mt-1">
                    Vous êtes sur le point de finaliser l'achat de votre propriété. 
                    Veuillez vérifier toutes les informations ci-dessous.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Informations du bien</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h5 className="font-medium text-gray-900">{property.title}</h5>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    {property.price.toLocaleString()} FCFA
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Récapitulatif</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Acheteur:</span>
                    <span className="font-medium">{purchaseData.personalInfo.firstName} {purchaseData.personalInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{purchaseData.personalInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléphone:</span>
                    <span className="font-medium">{purchaseData.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode de paiement:</span>
                    <span className="font-medium">
                      {purchaseData.paymentMethod === 'bank_transfer' && 'Virement bancaire'}
                      {purchaseData.paymentMethod === 'mobile_money' && 'Mobile Money'}
                      {purchaseData.paymentMethod === 'installments' && 'Paiement échelonné'}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">{property.price.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Transaction sécurisée</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Votre transaction est protégée par notre système de paiement sécurisé. 
                    Les fonds seront bloqués en séquestre jusqu'Ï  la finalisation de tous les documents légaux.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return Object.values(purchaseData.personalInfo).every(value => value.trim() !== '');
      case 2:
        return purchaseData.paymentMethod !== '';
      case 3:
        return purchaseData.legalDocuments.identityProof && 
               purchaseData.legalDocuments.incomeProof && 
               purchaseData.legalDocuments.bankStatement && 
               purchaseData.agreement;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">Processus d'achat</h1>
          
          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-20 h-0.5 ml-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Finalisation...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Finaliser l'achat
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseProcessPage;

