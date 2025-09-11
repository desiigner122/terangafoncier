/**
 * Étape 2: Informations territoriales
 */

import React from 'react';
import { 
  Map, 
  Building
} from 'lucide-react';
import TerritorialSelector from '../TerritorialSelector';

const TerritorialInfoStep = ({ 
  formData, 
  updateFormData, 
  errors, 
  onNext, 
  onPrevious, 
  isValid 
}) => {
  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleTerritorialChange = (territorialData) => {
    updateFormData(territorialData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
          <Map className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informations Territoriales
        </h2>
        <p className="text-gray-600">
          Renseignez votre zone de compétence territoriale
        </p>
      </div>

      {/* Sélecteur territorial */}
      <TerritorialSelector
        formData={formData}
        updateFormData={handleTerritorialChange}
        errors={errors}
        label="Zone de compétence territoriale"
      />

      {/* Informations spécifiques selon le rôle */}
      {formData.role === 'Mairie' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la mairie
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.municipality_name || ''}
              onChange={(e) => handleInputChange('municipality_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              YOUR_API_KEY="Ex: Mairie de Passy"
            />
            {errors.municipality_name && (
              <p className="text-sm text-red-600 mt-1">{errors.municipality_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du maire
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.mayor_name || ''}
              onChange={(e) => handleInputChange('mayor_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              YOUR_API_KEY="Ex: M. Amadou Diallo"
            />
            {errors.mayor_name && (
              <p className="text-sm text-red-600 mt-1">{errors.mayor_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Population approximative
            </label>
            <input
              type="number"
              value={formData.population || ''}
              onChange={(e) => handleInputChange('population', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              YOUR_API_KEY="Ex: 15000"
              min="0"
            />
          </div>
        </div>
      )}

      {formData.role === 'Banque' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zones de couverture bancaire
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={formData.coverage_areas || ''}
              onChange={(e) => handleInputChange('coverage_areas', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              YOUR_API_KEY="Décrivez les zones géographiques couvertes par votre banque..."
            />
            {errors.coverage_areas && (
              <p className="text-sm text-red-600 mt-1">{errors.coverage_areas}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'agences dans la région
            </label>
            <input
              type="number"
              value={formData.agency_count || ''}
              onChange={(e) => handleInputChange('agency_count', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              YOUR_API_KEY="Ex: 5"
              min="0"
            />
          </div>
        </div>
      )}

      {(formData.role === 'Notaire' || formData.role === 'Geometre') && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone d'intervention professionnelle
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={formData.service_area || ''}
              onChange={(e) => handleInputChange('service_area', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              YOUR_API_KEY="Décrivez votre zone d'intervention professionnelle..."
            />
            {errors.service_area && (
              <p className="text-sm text-red-600 mt-1">{errors.service_area}</p>
            )}
          </div>
        </div>
      )}

      {/* Informations complémentaires */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Building className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Importance de la localisation
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Cette information détermine votre zone de compétence sur la plateforme et permet 
              aux utilisateurs de vous identifier facilement selon leur localisation.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Précédent
        </button>
        
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default TerritorialInfoStep;
