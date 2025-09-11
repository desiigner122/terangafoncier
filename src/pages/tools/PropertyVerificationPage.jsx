import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield, Search, CheckCircle, AlertTriangle, XCircle, FileText, Eye, Lock, Zap, Users, Award } from 'lucide-react';

const PropertyVerificationPage = () => {
  const [verificationData, setVerificationData] = useState({
    titleNumber: '',
    location: '',
    ownerName: ''
  });

  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyProperty = async () => {
    setIsVerifying(true);
    
    // Simulation de vÃ©rification
    setTimeout(() => {
      const mockResult = {
        status: 'verified',
        titleNumber: verificationData.titleNumber,
        isAuthentic: true,
        owner: 'Amadou DIOP',
        location: 'Almadies, Dakar',
        surface: '500 mÂ²',
        registrationDate: '15 Mars 2020',
        lastUpdate: '28 AoÃ»t 2024',
        notary: 'MaÃ®tre Fatou SALL',
        encumbrances: [],
        riskScore: 5,
        blockchain: {
          hash: '0x1a2b3c4d5e6f7g8h9i0j',
          verified: true,
          timestamp: '2024-08-28T10:30:00Z'
        },
        documents: [
          { name: 'Titre Foncier Original', status: 'verified' },
          { name: 'Acte de Vente', status: 'verified' },
          { name: 'Certificat de Non-Gage', status: 'verified' },
          { name: 'Plan de Bornage', status: 'verified' }
        ]
      };
      
      setVerificationResult(mockResult);
      setIsVerifying(false);
    }, 3000);
  };

  const features = [
    {
      icon: Shield,
      title: "VÃ©rification Blockchain",
      description: "Chaque titre foncier est enregistrÃ© sur la blockchain pour une traÃ§abilitÃ© complÃ¨te"
    },
    {
      icon: Users,
      title: "Notaires CertifiÃ©s",
      description: "VÃ©rification par des notaires partenaires agrÃ©Ã©s par l'Ã‰tat du SÃ©nÃ©gal"
    },
    {
      icon: Zap,
      title: "RÃ©sultats InstantanÃ©s",
      description: "Obtenez le statut de vÃ©rification en quelques secondes"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Shield className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'warning':
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'error':
        return 'from-red-50 to-pink-50 border-red-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  return (
    <>
      <Helmet>
        <title>VÃ©rificateur de PropriÃ©tÃ© - Teranga Foncier</title>
        <meta name="description" content="VÃ©rifiez l'authenticitÃ© de votre titre foncier au SÃ©nÃ©gal. Blockchain, notaires certifiÃ©s, protection anti-fraude pour sÃ©curiser vos transactions." />
        <meta name="keywords" content="vÃ©rification titre foncier sÃ©nÃ©gal, authentification propriÃ©tÃ©, anti-fraude immobilier, blockchain foncier" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10"></div>
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                VÃ©rificateur de PropriÃ©tÃ©
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                VÃ©rifiez l'authenticitÃ© de votre titre foncier en quelques secondes.
                <br />
                <span className="text-emerald-600 font-semibold">Protection blockchain â€¢ Notaires certifiÃ©s â€¢ SÃ©curitÃ© garantie</span>
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-emerald-600 mr-2" />
                  <span className="text-emerald-800 font-semibold">98% de fraudes dÃ©tectÃ©es</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Plus de 50,000 titres fonciers vÃ©rifiÃ©s avec succÃ¨s au SÃ©nÃ©gal
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mr-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Verification Form */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">VÃ©rification de Titre Foncier</h2>
                  <p className="text-emerald-100">Saisissez les informations de votre propriÃ©tÃ© pour vÃ©rification</p>
                </div>

                <div className="p-8">
                  {!verificationResult ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FileText className="inline h-4 w-4 mr-2" />
                          NumÃ©ro du Titre Foncier
                        </label>
                        <input
                          type="text"
                          YOUR_API_KEY="Ex: TF 12345/DK"
                          value={verificationData.titleNumber}
                          onChange={(e) => setVerificationData({...verificationData, titleNumber: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Search className="inline h-4 w-4 mr-2" />
                          Localisation
                        </label>
                        <input
                          type="text"
                          YOUR_API_KEY="Ex: Almadies, Dakar"
                          value={verificationData.location}
                          onChange={(e) => setVerificationData({...verificationData, location: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Users className="inline h-4 w-4 mr-2" />
                          Nom du PropriÃ©taire (optionnel)
                        </label>
                        <input
                          type="text"
                          YOUR_API_KEY="Ex: Amadou DIOP"
                          value={verificationData.ownerName}
                          onChange={(e) => setVerificationData({...verificationData, ownerName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>

                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center mb-2">
                          <Lock className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-semibold text-blue-800">ConfidentialitÃ© Garantie</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Toutes les informations sont chiffrÃ©es et protÃ©gÃ©es. Nous ne stockons aucune donnÃ©e personnelle.
                        </p>
                      </div>

                      <button
                        onClick={verifyProperty}
                        disabled={!verificationData.titleNumber || isVerifying}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isVerifying ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            VÃ©rification en cours...
                          </>
                        ) : (
                          <>
                            <Shield className="inline h-5 w-5 mr-2" />
                            VÃ©rifier la propriÃ©tÃ©
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Status Header */}
                      <div className={`bg-gradient-to-r ${getStatusColor(verificationResult.status)} rounded-2xl p-6 border`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            {getStatusIcon(verificationResult.status)}
                            <h3 className="text-2xl font-bold text-gray-800 ml-3">
                              PropriÃ©tÃ© VÃ©rifiÃ©e âœ“
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Score de SÃ©curitÃ©</div>
                            <div className="text-2xl font-bold text-green-600">
                              {verificationResult.riskScore}/5
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Le titre foncier <strong>{verificationResult.titleNumber}</strong> est authentique et vÃ©rifiÃ©.
                        </p>
                      </div>

                      {/* Property Details */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Informations de la PropriÃ©tÃ©</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-gray-600">PropriÃ©taire:</span>
                              <div className="font-semibold">{verificationResult.owner}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Localisation:</span>
                              <div className="font-semibold">{verificationResult.location}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Surface:</span>
                              <div className="font-semibold">{verificationResult.surface}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Date d'enregistrement:</span>
                              <div className="font-semibold">{verificationResult.registrationDate}</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Validation LÃ©gale</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-gray-600">Notaire responsable:</span>
                              <div className="font-semibold">{verificationResult.notary}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">DerniÃ¨re mise Ã  jour:</span>
                              <div className="font-semibold">{verificationResult.lastUpdate}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Charges/HypothÃ¨ques:</span>
                              <div className="font-semibold text-green-600">Aucune</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Blockchain Verification */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Shield className="h-5 w-5 text-blue-600 mr-2" />
                          VÃ©rification Blockchain
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Hash Blockchain:</span>
                            <div className="font-mono text-sm bg-white p-2 rounded border">
                              {verificationResult.blockchain.hash}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Horodatage:</span>
                            <div className="font-semibold">
                              {new Date(verificationResult.blockchain.timestamp).toLocaleString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Documents VÃ©rifiÃ©s</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {verificationResult.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-gray-600 mr-2" />
                                <span className="text-sm font-medium">{doc.name}</span>
                              </div>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={() => setVerificationResult(null)}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
                        >
                          Nouvelle vÃ©rification
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Rapport dÃ©taillÃ©
                        </button>
                        <button className="border border-emerald-300 text-emerald-700 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors">
                          Contacter le notaire
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Info */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Comment Ã§a fonctionne ?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Saisie des donnÃ©es</h3>
                  <p className="text-gray-600">Entrez le numÃ©ro de titre foncier et les informations de base</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">VÃ©rification croisÃ©e</h3>
                  <p className="text-gray-600">Consultation des bases notariales et blockchain</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Rapport complet</h3>
                  <p className="text-gray-600">RÃ©sultat dÃ©taillÃ© avec score de sÃ©curitÃ©</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                ProtÃ©gez-vous contre la fraude fonciÃ¨re
              </h2>
              <p className="text-xl text-emerald-100 mb-8">
                Utilisez notre systÃ¨me de vÃ©rification avant tout achat immobilier au SÃ©nÃ©gal
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  VÃ©rifier maintenant
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-emerald-600 transition-colors">
                  En savoir plus
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PropertyVerificationPage;
