/**
 * Étape: Informations professionnelles génériques
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  Building, 
  Award, 
  ChevronRight
} from 'lucide-react';

const ProfessionalInfoStep = ({ data, errors, onNext, isLoading, role }) => {
  const [formData, setFormData] = useState({
    company_name: data.company_name || '',
    job_title: data.job_title || '',
    experience_years: data.experience_years || '',
    professional_description: data.professional_description || '',
    business_registration: data.business_registration || '',
    ...data
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const professionalErrors = errors.professional || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">
          Informations professionnelles
        </h2>
        <p className="text-gray-600 mt-2">
          Renseignez vos informations professionnelles pour votre compte {role}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom de l'entreprise */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4 inline mr-2" />
            Nom de l'entreprise *
          </label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => handleInputChange('company_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              professionalErrors.company_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nom de votre entreprise"
            required
          />
          {professionalErrors.company_name && (
            <p className="text-red-500 text-sm mt-1">{professionalErrors.company_name}</p>
          )}
        </div>

        {/* Titre du poste */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Award className="w-4 h-4 inline mr-2" />
            Titre du poste *
          </label>
          <input
            type="text"
            value={formData.job_title}
            onChange={(e) => handleInputChange('job_title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              professionalErrors.job_title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Votre titre ou fonction"
            required
          />
          {professionalErrors.job_title && (
            <p className="text-red-500 text-sm mt-1">{professionalErrors.job_title}</p>
          )}
        </div>

        {/* Années d'expérience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Années d'expérience *
          </label>
          <select
            value={formData.experience_years}
            onChange={(e) => handleInputChange('experience_years', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              professionalErrors.experience_years ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Sélectionnez votre expérience</option>
            <option value="0">Débutant (0 an)</option>
            <option value="1">1 an</option>
            <option value="2">2 ans</option>
            <option value="3">3 ans</option>
            <option value="4">4 ans</option>
            <option value="5">5 ans</option>
            <option value="6-10">6-10 ans</option>
            <option value="11-15">11-15 ans</option>
            <option value="16-20">16-20 ans</option>
            <option value="20+">Plus de 20 ans</option>
          </select>
          {professionalErrors.experience_years && (
            <p className="text-red-500 text-sm mt-1">{professionalErrors.experience_years}</p>
          )}
        </div>

        {/* Numéro d'enregistrement d'entreprise (pour Vendeur Pro) */}
        {role === 'Vendeur Pro' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro d'enregistrement *
            </label>
            <input
              type="text"
              value={formData.business_registration}
              onChange={(e) => handleInputChange('business_registration', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                professionalErrors.business_registration ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Numéro RCCM ou équivalent"
              required
            />
            {professionalErrors.business_registration && (
              <p className="text-red-500 text-sm mt-1">{professionalErrors.business_registration}</p>
            )}
          </div>
        )}

        {/* Description professionnelle */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description professionnelle
          </label>
          <textarea
            value={formData.professional_description}
            onChange={(e) => handleInputChange('professional_description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Décrivez votre activité professionnelle, vos compétences, votre domaine d'expertise..."
          />
          <p className="text-gray-500 text-xs mt-1">
            Cette description apparaîtra sur votre profil public
          </p>
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

      {/* Informations spécifiques au rôle */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">
          Informations pour {role}
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          {role === 'Vendeur Pro' && (
            <>
              <li>• Votre numéro d'enregistrement sera vérifié</li>
              <li>• Vous aurez accès aux outils de vente professionnels</li>
              <li>• Des frais de commission s'appliquent aux transactions</li>
            </>
          )}
          {role === 'Agent Foncier' && (
            <>
              <li>• Votre licence professionnelle sera vérifiée</li>
              <li>• Vous pourrez gérer les dossiers de vos clients</li>
              <li>• Accès aux outils d'évaluation immobilière</li>
            </>
          )}
          {role === 'Particulier' && (
            <>
              <li>• Ces informations sont optionnelles pour les particuliers</li>
              <li>• Elles peuvent aider à établir votre crédibilité</li>
              <li>• Vous pouvez les modifier ultérieurement</li>
            </>
          )}
        </ul>
      </div>
    </form>
  );
};

export default ProfessionalInfoStep;

