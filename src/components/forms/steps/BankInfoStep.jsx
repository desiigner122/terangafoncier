/**
 * Étape: Informations bancaires (Banque)
 */

import React, { useState } from 'react';
import { Building2, CreditCard, MapPin, FileText, ChevronRight } from 'lucide-react';

const BankInfoStep = ({ data, errors, onNext, isLoading, role }) => {
  const [formData, setFormData] = useState({
    bank_name: data.bank_name || '',
    bank_code: data.bank_code || '',
    headquarters_address: data.headquarters_address || '',
    license_number: data.license_number || '',
    swift_code: data.swift_code || '',
    bank_type: data.bank_type || '',
    services_offered: data.services_offered || [],
    ...data
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services_offered: prev.services_offered.includes(service)
        ? prev.services_offered.filter(s => s !== service)
        : [...prev.services_offered, service]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const bankErrors = errors.bank || {};

  const availableServices = [
    'Crédit immobilier',
    'Crédit foncier',
    'Financement de projets',
    'Épargne',
    'Assurance',
    'Conseil en investissement',
    'Change et transfert',
    'Banque digitale'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">
          Informations bancaires
        </h2>
        <p className="text-gray-600 mt-2">
          Renseignez les informations de votre établissement bancaire
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom de la banque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-2" />
            Nom de la banque *
          </label>
          <input
            type="text"
            value={formData.bank_name}
            onChange={(e) => handleInputChange('bank_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              bankErrors.bank_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nom officiel de la banque"
            required
          />
          {bankErrors.bank_name && (
            <p className="text-red-500 text-sm mt-1">{bankErrors.bank_name}</p>
          )}
        </div>

        {/* Code banque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="w-4 h-4 inline mr-2" />
            Code banque *
          </label>
          <input
            type="text"
            value={formData.bank_code}
            onChange={(e) => handleInputChange('bank_code', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              bankErrors.bank_code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Code d'identification de la banque"
            required
          />
          {bankErrors.bank_code && (
            <p className="text-red-500 text-sm mt-1">{bankErrors.bank_code}</p>
          )}
        </div>

        {/* Type de banque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'établissement *
          </label>
          <select
            value={formData.bank_type}
            onChange={(e) => handleInputChange('bank_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionnez le type</option>
            <option value="commercial">Banque commerciale</option>
            <option value="investment">Banque d'investissement</option>
            <option value="cooperative">Banque coopérative</option>
            <option value="islamic">Banque islamique</option>
            <option value="microfinance">Institution de microfinance</option>
            <option value="credit_union">Union de crédit</option>
          </select>
        </div>

        {/* Code SWIFT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code SWIFT/BIC
          </label>
          <input
            type="text"
            value={formData.swift_code}
            onChange={(e) => handleInputChange('swift_code', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Code SWIFT pour les transferts internationaux"
          />
        </div>

        {/* Numéro de licence */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Numéro de licence bancaire *
          </label>
          <input
            type="text"
            value={formData.license_number}
            onChange={(e) => handleInputChange('license_number', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              bankErrors.license_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Numéro de licence délivrée par la banque centrale"
            required
          />
          {bankErrors.license_number && (
            <p className="text-red-500 text-sm mt-1">{bankErrors.license_number}</p>
          )}
        </div>

        {/* Adresse du siège social */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Adresse du siège social *
          </label>
          <textarea
            value={formData.headquarters_address}
            onChange={(e) => handleInputChange('headquarters_address', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              bankErrors.headquarters_address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Adresse complète du siège social de la banque"
            required
          />
          {bankErrors.headquarters_address && (
            <p className="text-red-500 text-sm mt-1">{bankErrors.headquarters_address}</p>
          )}
        </div>
      </div>

      {/* Services offerts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Services offerts
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableServices.map(service => (
            <label key={service} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.services_offered.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{service}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bouton suivant */}
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Validation...
            </>
          ) : (
            <>
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>

      {/* Informations bancaires */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">
          Informations importantes
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Votre licence bancaire sera vérifiée auprès de la banque centrale</li>
          <li>• Les services offerts détermineront vos fonctionnalités sur la plateforme</li>
          <li>• Vous pourrez proposer des financements aux utilisateurs</li>
          <li>• Des frais de transaction peuvent s'appliquer</li>
        </ul>
      </div>
    </form>
  );
};

export default BankInfoStep;
