/**
 * Étape: Cabinet notarial (Notaire)
 */

import React, { useState } from 'react';
import { 
  Scale, 
  Building, 
  FileText, 
  ChevronRight
} from 'lucide-react';

const NotaryOfficeStep = ({ data, errors, onNext, isLoading, role }) => {
  const [formData, setFormData] = useState({
    office_name: data.office_name || '',
    notary_number: data.notary_number || '',
    bar_association: data.bar_association || '',
    office_address: data.office_address || '',
    appointment_date: data.appointment_date || '',
    specializations: data.specializations || [],
    ...data
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (spec) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const notaryErrors = errors.notary || {};

  const availableSpecializations = [
    'Droit immobilier',
    'Droit de la famille',
    'Droit des sociétés',
    'Successions',
    'Contrats',
    'Droit foncier',
    'Authentification d\'actes',
    'Conseil juridique'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Scale className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">
          Cabinet notarial
        </h2>
        <p className="text-gray-600 mt-2">
          Informations sur votre étude notariale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4 inline mr-2" />
            Nom de l'étude *
          </label>
          <input
            type="text"
            value={formData.office_name}
            onChange={(e) => handleInputChange('office_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              notaryErrors.office_name ? 'border-red-500' : 'border-gray-300'
            }`}
            YOUR_API_KEY="Nom de votre étude notariale"
            required
          />
          {notaryErrors.office_name && (
            <p className="text-red-500 text-sm mt-1">{notaryErrors.office_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Numéro notarial *
          </label>
          <input
            type="text"
            value={formData.notary_number}
            onChange={(e) => handleInputChange('notary_number', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              notaryErrors.notary_number ? 'border-red-500' : 'border-gray-300'
            }`}
            YOUR_API_KEY="Votre numéro d'inscription"
            required
          />
          {notaryErrors.notary_number && (
            <p className="text-red-500 text-sm mt-1">{notaryErrors.notary_number}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chambre notariale *
          </label>
          <input
            type="text"
            value={formData.bar_association}
            onChange={(e) => handleInputChange('bar_association', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              notaryErrors.bar_association ? 'border-red-500' : 'border-gray-300'
            }`}
            YOUR_API_KEY="Chambre des notaires de rattachement"
            required
          />
          {notaryErrors.bar_association && (
            <p className="text-red-500 text-sm mt-1">{notaryErrors.bar_association}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de nomination
          </label>
          <input
            type="date"
            value={formData.appointment_date}
            onChange={(e) => handleInputChange('appointment_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse de l'étude *
          </label>
          <textarea
            value={formData.office_address}
            onChange={(e) => handleInputChange('office_address', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              notaryErrors.office_address ? 'border-red-500' : 'border-gray-300'
            }`}
            YOUR_API_KEY="Adresse complète de votre étude"
            required
          />
          {notaryErrors.office_address && (
            <p className="text-red-500 text-sm mt-1">{notaryErrors.office_address}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Spécialisations
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableSpecializations.map(spec => (
            <label key={spec} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.specializations.includes(spec)}
                onChange={() => handleSpecializationToggle(spec)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{spec}</span>
            </label>
          ))}
        </div>
      </div>

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
    </form>
  );
};

export default NotaryOfficeStep;
