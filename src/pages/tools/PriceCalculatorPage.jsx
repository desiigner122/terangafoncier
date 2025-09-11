import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, MapPin, Home, DollarSign, Info, Zap, Shield, Target } from 'lucide-react';

const PriceCalculatorPage = () => {
  const [formData, setFormData] = useState({
    surface: '',
    location: 'dakar',
    propertyType: 'terrain',
    zone: 'urbaine',
    amenities: []
  });

  const [result, setResult] = useState(null);

  const locations = [
    { value: 'dakar', label: 'Dakar', multiplier: 2.5 },
    { value: 'thies', label: 'ThiÃ¨s', multiplier: 1.8 },
    { value: 'saint-louis', label: 'Saint-Louis', multiplier: 1.5 },
    { value: 'kaolack', label: 'Kaolack', multiplier: 1.3 },
    { value: 'ziguinchor', label: 'Ziguinchor', multiplier: 1.4 },
    { value: 'tambacounda', label: 'Tambacounda', multiplier: 1.0 }
  ];

  const propertyTypes = [
    { value: 'terrain', label: 'Terrain nu', basePrice: 150000 },
    { value: 'villa', label: 'Villa', basePrice: 45000000 },
    { value: 'appartement', label: 'Appartement', basePrice: 25000000 },
    { value: 'commercial', label: 'Commercial', basePrice: 80000000 }
  ];

  const amenities = [
    { value: 'electricity', label: 'Ã‰lectricitÃ©', bonus: 0.15 },
    { value: 'water', label: 'Eau courante', bonus: 0.12 },
    { value: 'road', label: 'Route bitumÃ©e', bonus: 0.10 },
    { value: 'school', label: 'Ã‰cole Ã  proximitÃ©', bonus: 0.08 },
    { value: 'hospital', label: 'HÃ´pital Ã  proximitÃ©', bonus: 0.07 },
    { value: 'market', label: 'MarchÃ© Ã  proximitÃ©', bonus: 0.05 }
  ];

  const calculatePrice = () => {
    const location = locations.find(l => l.value === formData.location);
    const propertyType = propertyTypes.find(p => p.value === formData.propertyType);
    
    let basePrice = propertyType.basePrice;
    let surfacePrice = formData.propertyType === 'terrain' ? 
      parseFloat(formData.surface) * 150000 : 
      basePrice * (parseFloat(formData.surface) / 100);

    // Multiplicateur de localisation
    let finalPrice = surfacePrice * location.multiplier;

    // Zone urbaine vs rurale
    if (formData.zone === 'rurale') {
      finalPrice *= 0.7;
    }

    // Bonus commoditÃ©s
    let amenityBonus = 0;
    formData.amenities.forEach(amenity => {
      const amenityData = amenities.find(a => a.value === amenity);
      if (amenityData) amenityBonus += amenityData.bonus;
    });

    finalPrice *= (1 + amenityBonus);

    // ROI estimÃ©
    const monthlyRent = finalPrice * 0.008; // 0.8% par mois
    const yearlyRent = monthlyRent * 12;
    const roi = (yearlyRent / finalPrice) * 100;

    setResult({
      estimatedPrice: Math.round(finalPrice),
      monthlyRent: Math.round(monthlyRent),
      yearlyRent: Math.round(yearlyRent),
      roi: Math.round(roi * 10) / 10,
      location: location.label,
      surface: formData.surface,
      propertyType: propertyType.label
    });
  };

  const handleAmenityChange = (amenityValue) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityValue)
        ? prev.amenities.filter(a => a !== amenityValue)
        : [...prev.amenities, amenityValue]
    }));
  };

  const features = [
    {
      icon: Shield,
      title: "DonnÃ©es CertifiÃ©es",
      description: "Prix basÃ©s sur les transactions notariÃ©es rÃ©elles au SÃ©nÃ©gal"
    },
    {
      icon: Zap,
      title: "IA PrÃ©dictive",
      description: "Algorithme d'intelligence artificielle pour des estimations prÃ©cises"
    },
    {
      icon: Target,
      title: "Analyse ROI",
      description: "Calcul automatique du retour sur investissement locatif"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Calculateur de Prix Immobilier - Teranga Foncier</title>
        <meta name="description" content="Estimez le prix de votre propriÃ©tÃ© au SÃ©nÃ©gal avec notre IA. Calcul ROI, analyse de marchÃ© et donnÃ©es certifiÃ©es pour Ã©viter la fraude fonciÃ¨re." />
        <meta name="keywords" content="prix immobilier sÃ©nÃ©gal, estimation terrain, calculateur ROI, investissement foncier" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <Calculator className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Calculateur de Prix Immobilier
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Estimez prÃ©cisÃ©ment la valeur de votre propriÃ©tÃ© au SÃ©nÃ©gal avec notre IA.
                <br />
                <span className="text-blue-600 font-semibold">DonnÃ©es certifiÃ©es â€¢ Calcul ROI â€¢ Protection anti-fraude</span>
              </p>
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
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4">
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

        {/* Calculator Form */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Estimation ImmobiliÃ¨re</h2>
                  <p className="text-blue-100">Remplissez les informations pour obtenir une estimation prÃ©cise</p>
                </div>

                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Formulaire */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Home className="inline h-4 w-4 mr-2" />
                          Type de propriÃ©tÃ©
                        </label>
                        <select
                          value={formData.propertyType}
                          onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {propertyTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <TrendingUp className="inline h-4 w-4 mr-2" />
                          Surface (mÂ²)
                        </label>
                        <input
                          type="number"
                          YOUR_API_KEY="Ex: 500"
                          value={formData.surface}
                          onChange={(e) => setFormData({...formData, surface: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <MapPin className="inline h-4 w-4 mr-2" />
                          Localisation
                        </label>
                        <select
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {locations.map(location => (
                            <option key={location.value} value={location.value}>{location.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Zone</label>
                        <div className="flex gap-4">
                          {['urbaine', 'rurale'].map(zone => (
                            <label key={zone} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="zone"
                                value={zone}
                                checked={formData.zone === zone}
                                onChange={(e) => setFormData({...formData, zone: e.target.value})}
                                className="mr-2"
                              />
                              <span className="capitalize">{zone}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">CommoditÃ©s disponibles</label>
                        <div className="grid grid-cols-2 gap-3">
                          {amenities.map(amenity => (
                            <label key={amenity.value} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.amenities.includes(amenity.value)}
                                onChange={() => handleAmenityChange(amenity.value)}
                                className="mr-2 rounded"
                              />
                              <span className="text-sm">{amenity.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={calculatePrice}
                        disabled={!formData.surface}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Calculator className="inline h-5 w-5 mr-2" />
                        Calculer l'estimation
                      </button>
                    </div>

                    {/* RÃ©sultats */}
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200"
                      >
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                          <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                          Estimation
                        </h3>

                        <div className="space-y-4">
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="text-sm text-gray-600">Prix estimÃ©</div>
                            <div className="text-3xl font-bold text-green-600">
                              {result.estimatedPrice.toLocaleString()} CFA
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <div className="text-sm text-gray-600">Loyer mensuel</div>
                              <div className="text-xl font-bold text-blue-600">
                                {result.monthlyRent.toLocaleString()} CFA
                              </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <div className="text-sm text-gray-600">ROI annuel</div>
                              <div className="text-xl font-bold text-purple-600">
                                {result.roi}%
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center mb-2">
                              <Info className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm font-semibold text-blue-800">DÃ©tails</span>
                            </div>
                            <div className="text-sm text-blue-700">
                              <div>{result.propertyType} de {result.surface}mÂ²</div>
                              <div>SituÃ© Ã  {result.location}</div>
                              <div>Revenu locatif annuel: {result.yearlyRent.toLocaleString()} CFA</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                PrÃªt Ã  investir en toute sÃ©curitÃ© ?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Utilisez nos outils pour sÃ©curiser vos investissements fonciers au SÃ©nÃ©gal
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  VÃ©rifier un titre foncier
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Contacter un notaire
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PriceCalculatorPage;
